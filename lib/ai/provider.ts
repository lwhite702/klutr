/**
 * AI Provider Abstraction Layer
 *
 * Uses Vercel AI SDK with AI Gateway for unified model access, automatic failover,
 * built-in retry logic, timeouts, and cost controls.
 *
 * AI Gateway Features:
 * - Single API for all providers (OpenAI, Anthropic, Google, xAI, etc.)
 * - Automatic failover and load balancing
 * - Cost tracking and analytics
 * - Request logging and monitoring
 * - No vendor lock-in
 */

import { generateText, generateObject, streamText, embed } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

// ========================================
// Provider Configuration
// ========================================

export type AIProvider = "openai" | "anthropic" | "gateway";

export interface AIConfig {
  provider: AIProvider;
  maxRetries: number;
  timeout: number; // milliseconds
  enableCostLogging: boolean;
  useGateway: boolean; // Toggle AI Gateway usage
}

const defaultConfig: AIConfig = {
  provider: "gateway", // Default to AI Gateway for unified access
  maxRetries: 3,
  timeout: 12000, // 12 seconds
  enableCostLogging: true,
  useGateway: true,
};

// ========================================
// Model Configuration
// ========================================

// Model tier type for admin overrides
export type ModelTier =
  | "CHEAP"
  | "MEDIUM"
  | "EXPENSIVE"
  | "CHAT"
  | "CODE"
  | "EMBEDDING"
  | "LEGACY";

export const MODELS = {
  // Cheap models for classification, tagging, basic tasks
  CHEAP: {
    openai: "gpt-4o-mini",
    anthropic: "claude-3-haiku-20240307",
    gateway: "openai/gpt-4o-mini",
  },
  // Mid-tier models for summaries, insights
  MEDIUM: {
    openai: "gpt-4o",
    anthropic: "claude-3-5-sonnet-20241022",
    gateway: "openai/gpt-4o",
  },
  // Expensive models for complex reasoning (use sparingly)
  EXPENSIVE: {
    openai: "gpt-4-turbo",
    anthropic: "claude-3-opus-20240229",
    gateway: "anthropic/claude-3-opus-20240229",
  },
  // Chat-optimized models (GPT-5 series)
  CHAT: {
    openai: "gpt-5",
    anthropic: "claude-3-5-sonnet-20241022",
    gateway: "openai/gpt-5",
  },
  // Code-specific models
  CODE: {
    openai: "gpt-5.1-code",
    anthropic: "claude-3-opus-20240229",
    gateway: "openai/gpt-5.1-code",
  },
  // Embeddings
  EMBEDDING: {
    openai: "text-embedding-3-small",
    gateway: "openai/text-embedding-3-small",
  },
  // Legacy models (fallback)
  LEGACY: {
    openai: "gpt-3.5-turbo",
    anthropic: "claude-3-haiku-20240307",
    gateway: "openai/gpt-3.5-turbo",
  },
} as const;

// ========================================
// Provider Clients
// ========================================

let openaiClient: ReturnType<typeof createOpenAI> | null = null;
let anthropicClient: ReturnType<typeof createAnthropic> | null = null;
let gatewayClient: ReturnType<typeof createGateway> | null = null;

function getOpenAIClient() {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }
    openaiClient = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
  }
  return openaiClient;
}

function getAnthropicClient() {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }
    anthropicClient = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

function getGatewayClient() {
  if (!gatewayClient) {
    // AI Gateway API key is optional - if not provided, it will use VERCEL_OIDC_TOKEN
    // which is automatically available in Vercel deployments
    const apiKey =
      process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;

    if (!apiKey && process.env.NODE_ENV === "production") {
      console.warn(
        "[AI Gateway] No API key found. AI Gateway requires AI_GATEWAY_API_KEY or VERCEL_OIDC_TOKEN."
      );
      // Fall back to direct provider access
      return null;
    }

    gatewayClient = createGateway({
      apiKey: apiKey || "",
      baseURL: "https://ai-gateway.vercel.sh/v1/ai",
    });
  }
  return gatewayClient;
}

function getModel(tier: ModelTier, provider: AIProvider = "gateway") {
  // Map old tier names to new ones for backward compatibility
  const normalizedTier = tier.toUpperCase() as keyof typeof MODELS;

  const modelId =
    (MODELS[normalizedTier] as any)?.[provider] || MODELS.CHEAP[provider];

  // Prefer AI Gateway for unified access and automatic failover
  if (provider === "gateway" || defaultConfig.useGateway) {
    const gateway = getGatewayClient();
    if (gateway) {
      const gatewayModel =
        (MODELS[normalizedTier] as any)?.gateway || MODELS.CHEAP.gateway;
      return gateway(gatewayModel);
    }
    // Fall back to OpenAI if gateway is not available
    console.warn(
      "[AI] Gateway not available, falling back to direct OpenAI access"
    );
    return getOpenAIClient()(MODELS.CHEAP.openai);
  }

  if (provider === "openai") {
    return getOpenAIClient()(modelId);
  } else if (provider === "anthropic") {
    return getAnthropicClient()(modelId);
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

// ========================================
// Admin Overrides & Monitoring
// ========================================

// Admin override storage (in-memory for now, will be DB-backed)
let adminOverrides: {
  models: Record<string, string>; // tier -> model override
  tierOverrides: Record<string, ModelTier>; // feature -> tier override
  routing: string[]; // Provider order override
  disabledFeatures: Set<string>; // Disabled AI features
  killSwitch: boolean; // Global AI kill switch
} = {
  models: {},
  tierOverrides: {},
  routing: [],
  disabledFeatures: new Set(),
  killSwitch: false,
};

/**
 * Apply admin overrides to AI requests
 * This is called before every AI operation
 */
export function applyOverrides(
  tier: ModelTier,
  feature?: string
): { tier: ModelTier; provider: AIProvider; model?: string } {
  // Check kill switch
  if (adminOverrides.killSwitch) {
    throw new Error("[AI Engine] AI features temporarily disabled by admin");
  }

  // Check if feature is disabled
  if (feature && adminOverrides.disabledFeatures.has(feature)) {
    throw new Error(`[AI Engine] Feature "${feature}" is disabled by admin`);
  }

  // Apply tier override for specific feature
  let effectiveTier = tier;
  if (feature && adminOverrides.tierOverrides[feature]) {
    effectiveTier = adminOverrides.tierOverrides[feature];
    console.log(
      `[AI Override] Feature "${feature}" tier ${tier} → ${effectiveTier}`
    );
  }

  // Apply model override for tier
  const modelOverride = adminOverrides.models[effectiveTier];
  if (modelOverride) {
    console.log(
      `[AI Override] Tier ${effectiveTier} model override: ${modelOverride}`
    );
  }

  // Determine provider from routing override or default
  let provider: AIProvider = "gateway";
  if (adminOverrides.routing.length > 0) {
    provider = adminOverrides.routing[0] as AIProvider;
  }

  return {
    tier: effectiveTier,
    provider,
    model: modelOverride,
  };
}

/**
 * Set admin overrides (called from admin API)
 */
export function setAdminOverrides(overrides: Partial<typeof adminOverrides>) {
  if (overrides.models) adminOverrides.models = overrides.models;
  if (overrides.tierOverrides)
    adminOverrides.tierOverrides = overrides.tierOverrides;
  if (overrides.routing) adminOverrides.routing = overrides.routing;
  if (overrides.disabledFeatures)
    adminOverrides.disabledFeatures = overrides.disabledFeatures;
  if (overrides.killSwitch !== undefined)
    adminOverrides.killSwitch = overrides.killSwitch;
}

/**
 * Get current admin overrides
 */
export function getAdminOverrides() {
  return {
    ...adminOverrides,
    disabledFeatures: Array.from(adminOverrides.disabledFeatures),
  };
}

/**
 * Record AI usage for monitoring
 */
export async function recordAIUsage(data: {
  feature: string;
  tier: ModelTier;
  model: string;
  provider: AIProvider;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  userId?: string;
  success: boolean;
  duration: number;
}) {
  console.log("[AI Usage]", data);

  // Async DB write - don't block the request
  try {
    const { supabaseAdmin } = await import("@/lib/supabase");
    await supabaseAdmin.from("ai_usage_logs").insert({
      user_id: data.userId || null,
      feature: data.feature,
      tier: data.tier,
      model: data.model,
      provider: data.provider,
      input_tokens: data.inputTokens,
      output_tokens: data.outputTokens,
      estimated_cost: data.cost,
      success: data.success,
      duration_ms: data.duration,
    });
  } catch (error) {
    // Don't throw - logging failure shouldn't break AI requests
    console.error("[AI Usage Log] Failed to record:", error);
  }
}

/**
 * Record AI errors for monitoring
 */
export async function recordAIError(data: {
  feature: string;
  tier: ModelTier;
  model: string;
  provider: AIProvider;
  error: string;
  userId?: string;
}) {
  console.error("[AI Error]", data);

  // Async DB write - don't block the request
  try {
    const { supabaseAdmin } = await import("@/lib/supabase");
    await supabaseAdmin.from("ai_error_logs").insert({
      user_id: data.userId || null,
      feature: data.feature,
      tier: data.tier,
      model: data.model,
      provider: data.provider,
      error_message: data.error,
    });
  } catch (error) {
    // Don't throw - logging failure shouldn't break AI requests
    console.error("[AI Error Log] Failed to record:", error);
  }
}

/**
 * Check feature flags (placeholder for PostHog integration)
 */
export async function applyFeatureFlags(feature: string): Promise<boolean> {
  // TODO: Integrate with PostHog feature flags
  // For now, check admin disabled features
  return !adminOverrides.disabledFeatures.has(feature);
}

// ========================================
// Cost Estimation
// ========================================

interface CostEstimate {
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  model: string;
  provider: AIProvider;
}

// Approximate token costs per 1M tokens (as of 2024)
const COSTS = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o": { input: 2.5, output: 10.0 },
  "gpt-4-turbo": { input: 10.0, output: 30.0 },
  "claude-3-haiku-20240307": { input: 0.25, output: 1.25 },
  "claude-3-5-sonnet-20241022": { input: 3.0, output: 15.0 },
  "claude-3-opus-20240229": { input: 15.0, output: 75.0 },
  "text-embedding-3-small": { input: 0.02, output: 0 },
};

function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = COSTS[model as keyof typeof COSTS];
  if (!costs) return 0;

  const inputCost = (inputTokens / 1_000_000) * costs.input;
  const outputCost = (outputTokens / 1_000_000) * costs.output;
  return inputCost + outputCost;
}

function logCost(estimate: CostEstimate) {
  if (!defaultConfig.enableCostLogging) return;

  // Update cost tracker
  costTracker.totalRequests++;
  costTracker.totalCost += estimate.estimatedCost;
  costTracker.costByModel[estimate.model] =
    (costTracker.costByModel[estimate.model] || 0) + estimate.estimatedCost;
  costTracker.costByProvider[estimate.provider] =
    (costTracker.costByProvider[estimate.provider] || 0) +
    estimate.estimatedCost;

  console.log("[AI Cost]", {
    model: estimate.model,
    provider: estimate.provider,
    inputTokens: estimate.inputTokens,
    outputTokens: estimate.outputTokens,
    cost: `$${estimate.estimatedCost.toFixed(4)}`,
  });
}

// ========================================
// Retry and Timeout Wrapper
// ========================================

async function withRetryAndTimeout<T>(
  fn: () => Promise<T>,
  config: AIConfig = defaultConfig
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      // Implement timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("AI request timeout")),
          config.timeout
        );
      });

      const result = await Promise.race([fn(), timeoutPromise]);
      return result;
    } catch (error) {
      lastError = error as Error;

      // Exponential backoff: 1s, 2s, 4s
      if (attempt < config.maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("AI request failed after retries");
}

// ========================================
// AI Gateway Advanced Features
// ========================================

export interface GatewayOptions {
  order?: string[]; // Provider preference order (e.g., ['openai', 'anthropic'])
  only?: string[]; // Restrict to specific providers
  models?: string[]; // Fallback model list
  user?: string; // Track usage per end-user
  tags?: string[]; // Categorize requests for analytics
}

/**
 * Build provider options for AI Gateway advanced features
 * Enables failover, load balancing, and usage tracking
 */
function buildProviderOptions(gatewayOptions?: GatewayOptions): any {
  if (!gatewayOptions) return undefined;

  return {
    gateway: gatewayOptions,
  };
}

// ========================================
// Public API: Text Generation
// ========================================

export async function generateAIText(params: {
  prompt: string;
  systemPrompt?: string;
  tier?: ModelTier;
  provider?: AIProvider;
  maxTokens?: number;
  temperature?: number;
  gatewayOptions?: GatewayOptions;
  feature?: string; // Feature name for admin overrides
  userId?: string; // User ID for tracking
}): Promise<{ text: string; usage: CostEstimate }> {
  const {
    prompt,
    systemPrompt,
    tier = "CHEAP",
    provider = "gateway",
    maxTokens = 500,
    temperature = 0.7,
    gatewayOptions,
    feature = "unknown",
    userId,
  } = params;

  const startTime = Date.now();

  try {
    // Apply admin overrides
    const overrides = applyOverrides(tier, feature);
    const effectiveTier = overrides.tier;
    const effectiveProvider = overrides.provider || provider;

    // Get model (with possible override)
    const model = overrides.model
      ? getGatewayClient()?.(overrides.model) ||
        getOpenAIClient()(overrides.model)
      : getModel(effectiveTier, effectiveProvider);

    const modelId =
      overrides.model ||
      (MODELS[effectiveTier] as any)[effectiveProvider] ||
      MODELS.CHEAP[effectiveProvider];

    const result = await withRetryAndTimeout(async () => {
      return await generateText({
        model,
        prompt,
        system: systemPrompt,
        temperature,
        providerOptions: buildProviderOptions(gatewayOptions),
      });
    });

    const costEstimate: CostEstimate = {
      inputTokens: (result.usage as any)?.promptTokens || 0,
      outputTokens: (result.usage as any)?.completionTokens || 0,
      estimatedCost: estimateCost(
        modelId,
        (result.usage as any)?.promptTokens || 0,
        (result.usage as any)?.completionTokens || 0
      ),
      model: modelId,
      provider: effectiveProvider,
    };

    logCost(costEstimate);

    // Record usage for admin monitoring
    await recordAIUsage({
      feature,
      tier: effectiveTier,
      model: modelId,
      provider: effectiveProvider,
      inputTokens: costEstimate.inputTokens,
      outputTokens: costEstimate.outputTokens,
      cost: costEstimate.estimatedCost,
      userId,
      success: true,
      duration: Date.now() - startTime,
    });

    return {
      text: result.text,
      usage: costEstimate,
    };
  } catch (error) {
    // Record error for admin monitoring
    await recordAIError({
      feature,
      tier,
      model: "unknown",
      provider,
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    throw error;
  }
}

// ========================================
// Public API: Structured Output
// ========================================

export async function generateAIObject<T>(params: {
  prompt: string;
  systemPrompt?: string;
  schema: z.ZodSchema<T>;
  tier?: ModelTier;
  provider?: AIProvider;
  maxTokens?: number;
  gatewayOptions?: GatewayOptions;
  feature?: string;
  userId?: string;
}): Promise<{ object: T; usage: CostEstimate }> {
  const {
    prompt,
    systemPrompt,
    schema,
    tier = "CHEAP",
    provider = "gateway",
    maxTokens = 500,
    gatewayOptions,
    feature = "unknown",
    userId,
  } = params;

  const startTime = Date.now();

  try {
    // Apply admin overrides
    const overrides = applyOverrides(tier, feature);
    const effectiveTier = overrides.tier;
    const effectiveProvider = overrides.provider || provider;

    // Get model (with possible override)
    const model = overrides.model
      ? getGatewayClient()?.(overrides.model) ||
        getOpenAIClient()(overrides.model)
      : getModel(effectiveTier, effectiveProvider);

    const modelId =
      overrides.model ||
      (MODELS[effectiveTier] as any)[effectiveProvider] ||
      MODELS.CHEAP[effectiveProvider];

    const result = await withRetryAndTimeout(async () => {
      return await generateObject({
        model,
        prompt,
        system: systemPrompt,
        schema,
        providerOptions: buildProviderOptions(gatewayOptions),
      });
    });

    const costEstimate: CostEstimate = {
      inputTokens: (result.usage as any)?.promptTokens || 0,
      outputTokens: (result.usage as any)?.completionTokens || 0,
      estimatedCost: estimateCost(
        modelId,
        (result.usage as any)?.promptTokens || 0,
        (result.usage as any)?.completionTokens || 0
      ),
      model: modelId,
      provider: effectiveProvider,
    };

    logCost(costEstimate);

    // Record usage
    await recordAIUsage({
      feature,
      tier: effectiveTier,
      model: modelId,
      provider: effectiveProvider,
      inputTokens: costEstimate.inputTokens,
      outputTokens: costEstimate.outputTokens,
      cost: costEstimate.estimatedCost,
      userId,
      success: true,
      duration: Date.now() - startTime,
    });

    return {
      object: result.object,
      usage: costEstimate,
    };
  } catch (error) {
    await recordAIError({
      feature,
      tier,
      model: "unknown",
      provider,
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    throw error;
  }
}

// ========================================
// Public API: Streaming
// ========================================

export async function streamAIText(params: {
  prompt: string;
  systemPrompt?: string;
  tier?: ModelTier;
  provider?: AIProvider;
  maxTokens?: number;
  temperature?: number;
  gatewayOptions?: GatewayOptions;
  feature?: string;
  userId?: string;
}) {
  const {
    prompt,
    systemPrompt,
    tier = "MEDIUM",
    provider = "gateway",
    maxTokens = 1000,
    temperature = 0.7,
    gatewayOptions,
    feature = "unknown",
    userId,
  } = params;

  try {
    // Apply admin overrides
    const overrides = applyOverrides(tier, feature);
    const effectiveTier = overrides.tier;
    const effectiveProvider = overrides.provider || provider;

    // Get model (with possible override)
    const model = overrides.model
      ? getGatewayClient()?.(overrides.model) ||
        getOpenAIClient()(overrides.model)
      : getModel(effectiveTier, effectiveProvider);

    return streamText({
      model,
      prompt,
      system: systemPrompt,
      temperature,
      providerOptions: buildProviderOptions(gatewayOptions),
    });
  } catch (error) {
    await recordAIError({
      feature,
      tier,
      model: "unknown",
      provider,
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    throw error;
  }
}

// ========================================
// Public API: Embeddings
// ========================================

export async function generateAIEmbedding(params: {
  text: string;
  provider?: AIProvider;
  userId?: string;
}): Promise<{ embedding: number[]; usage: CostEstimate }> {
  const { text, provider = "gateway", userId } = params;

  let model: any;
  let modelId: string;
  let actualProvider: AIProvider;

  // Use AI Gateway for embeddings if enabled
  if (provider === "gateway" && defaultConfig.useGateway) {
    const gateway = getGatewayClient();
    if (gateway) {
      model = gateway.textEmbeddingModel(MODELS.EMBEDDING.gateway);
      modelId = MODELS.EMBEDDING.gateway;
      actualProvider = "gateway";
    } else {
      // Fall back to direct OpenAI
      const openai = getOpenAIClient();
      model = openai.embedding(MODELS.EMBEDDING.openai);
      modelId = MODELS.EMBEDDING.openai;
      actualProvider = "openai";
    }
  } else if (provider === "openai") {
    const openai = getOpenAIClient();
    model = openai.embedding(MODELS.EMBEDDING.openai);
    modelId = MODELS.EMBEDDING.openai;
    actualProvider = "openai";
  } else {
    throw new Error("Only OpenAI embeddings are supported currently");
  }

  const result = await withRetryAndTimeout(async () => {
    return await embed({
      model,
      value: text,
    });
  });

  // Estimate tokens (rough: 1 token ≈ 4 characters)
  const estimatedTokens = Math.ceil(text.length / 4);

  const costEstimate: CostEstimate = {
    inputTokens: estimatedTokens,
    outputTokens: 0,
    estimatedCost: estimateCost(MODELS.EMBEDDING.openai, estimatedTokens, 0),
    model: modelId,
    provider: actualProvider,
  };

  logCost(costEstimate);

  return {
    embedding: result.embedding,
    usage: costEstimate,
  };
}

// ========================================
// Batch Operations (for cost efficiency)
// ========================================

export async function generateAIEmbeddingsBatch(params: {
  texts: string[];
  provider?: AIProvider;
  batchSize?: number;
  userId?: string;
}): Promise<{ embeddings: number[][]; totalCost: number }> {
  const { texts, provider = "gateway", batchSize = 100, userId } = params;

  // Check admin overrides for embedding feature
  try {
    applyOverrides("EMBEDDING", "embeddings");
  } catch (error) {
    // If embeddings are disabled, throw error
    throw error;
  }

  const embeddings: number[][] = [];
  let totalCost = 0;

  // Process in batches to avoid rate limits
  for (let i = 0; i < texts.length; i += batchSize) {
    const batchStartTime = Date.now();
    const batch = texts.slice(i, i + batchSize);

    const results = await Promise.all(
      batch.map((text) => generateAIEmbedding({ text, provider, userId }))
    );

    embeddings.push(...results.map((r) => r.embedding));
    totalCost += results.reduce((sum, r) => sum + r.usage.estimatedCost, 0);

    // Rate limiting: ensure at least 1s between batch starts
    if (i + batchSize < texts.length) {
      const elapsed = Date.now() - batchStartTime;
      const delay = Math.max(0, 1000 - elapsed);
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  console.log(
    `[AI Embeddings] Batch complete: ${
      texts.length
    } texts, $${totalCost.toFixed(4)}`
  );

  return { embeddings, totalCost };
}

// ========================================
// Cost Monitoring
// ========================================

export interface CostSummary {
  totalRequests: number;
  totalCost: number;
  costByModel: Record<string, number>;
  costByProvider: Record<string, number>;
}

// In-memory cost tracking (for current session)
let costTracker: CostSummary = {
  totalRequests: 0,
  totalCost: 0,
  costByModel: {},
  costByProvider: {},
};

export function resetCostTracker() {
  costTracker = {
    totalRequests: 0,
    totalCost: 0,
    costByModel: {},
    costByProvider: {},
  };
}

export function getCostSummary(): CostSummary {
  return { ...costTracker };
}
