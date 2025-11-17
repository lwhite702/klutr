/**
 * AI Model Admin Adapters
 * 
 * Provides admin-level access to model states and catalog
 */

import { MODELS, type ModelTier, type AIProvider } from "@/lib/ai/provider";

export interface ModelInfo {
  tier: ModelTier;
  provider: AIProvider;
  modelId: string;
  description: string;
  costPer1MInputTokens: number;
  costPer1MOutputTokens: number;
}

/**
 * Get all available models across all tiers and providers
 */
export function getAIModelCatalog(): ModelInfo[] {
  const catalog: ModelInfo[] = [];

  // Model descriptions and costs
  const modelMetadata: Record<string, { description: string; inputCost: number; outputCost: number }> = {
    "gpt-4o-mini": {
      description: "Fast, cost-effective model for simple tasks",
      inputCost: 0.15,
      outputCost: 0.6,
    },
    "gpt-4o": {
      description: "Balanced model for general use",
      inputCost: 2.5,
      outputCost: 10.0,
    },
    "gpt-4-turbo": {
      description: "High-performance model for complex reasoning",
      inputCost: 10.0,
      outputCost: 30.0,
    },
    "gpt-5": {
      description: "Latest GPT-5 model for chat and general use",
      inputCost: 3.0,
      outputCost: 12.0,
    },
    "gpt-5.1-code": {
      description: "GPT-5.1 optimized for code generation and analysis",
      inputCost: 3.5,
      outputCost: 14.0,
    },
    "gpt-3.5-turbo": {
      description: "Legacy model for basic tasks",
      inputCost: 0.5,
      outputCost: 1.5,
    },
    "claude-3-haiku-20240307": {
      description: "Fast Claude model for simple tasks",
      inputCost: 0.25,
      outputCost: 1.25,
    },
    "claude-3-5-sonnet-20241022": {
      description: "Balanced Claude model with strong reasoning",
      inputCost: 3.0,
      outputCost: 15.0,
    },
    "claude-3-opus-20240229": {
      description: "Premium Claude model for complex tasks",
      inputCost: 15.0,
      outputCost: 75.0,
    },
    "text-embedding-3-small": {
      description: "OpenAI embeddings model for vector search",
      inputCost: 0.02,
      outputCost: 0,
    },
  };

  // Build catalog from MODELS constant
  Object.entries(MODELS).forEach(([tier, providers]) => {
    Object.entries(providers).forEach(([provider, modelId]) => {
      if (provider === "gateway") return; // Skip gateway entries

      const metadata = modelMetadata[modelId];
      if (metadata) {
        catalog.push({
          tier: tier as ModelTier,
          provider: provider as AIProvider,
          modelId,
          description: metadata.description,
          costPer1MInputTokens: metadata.inputCost,
          costPer1MOutputTokens: metadata.outputCost,
        });
      }
    });
  });

  return catalog;
}

/**
 * Get model states (which models are available/unavailable)
 */
export async function getAIModelStates() {
  // TODO: Implement health checks for each provider
  // For now, return static availability based on env vars

  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasGateway =
    !!process.env.AI_GATEWAY_API_KEY || !!process.env.VERCEL_OIDC_TOKEN;

  return {
    gateway: { available: hasGateway, healthy: hasGateway },
    openai: { available: hasOpenAI, healthy: hasOpenAI },
    anthropic: { available: hasAnthropic, healthy: hasAnthropic },
  };
}

