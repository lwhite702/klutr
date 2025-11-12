/**
 * AI Provider Abstraction Layer
 * 
 * Uses Vercel AI SDK as the runtime adapter to support multiple AI providers
 * with built-in retry logic, timeouts, and cost controls.
 */

import { generateText, generateObject, streamText, embed } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

// ========================================
// Provider Configuration
// ========================================

export type AIProvider = 'openai' | 'anthropic'

export interface AIConfig {
  provider: AIProvider
  maxRetries: number
  timeout: number // milliseconds
  enableCostLogging: boolean
}

const defaultConfig: AIConfig = {
  provider: 'openai',
  maxRetries: 3,
  timeout: 12000, // 12 seconds
  enableCostLogging: true,
}

// ========================================
// Model Configuration
// ========================================

export const MODELS = {
  // Cheap models for classification, tagging, basic tasks
  CHEAP: {
    openai: 'gpt-4o-mini',
    anthropic: 'claude-3-haiku-20240307',
  },
  // Mid-tier models for summaries, insights
  MEDIUM: {
    openai: 'gpt-4o',
    anthropic: 'claude-3-5-sonnet-20241022',
  },
  // Expensive models for complex reasoning (use sparingly)
  EXPENSIVE: {
    openai: 'gpt-4-turbo',
    anthropic: 'claude-3-opus-20240229',
  },
  // Embeddings
  EMBEDDING: {
    openai: 'text-embedding-3-small',
  },
} as const

// ========================================
// Provider Clients
// ========================================

let openaiClient: ReturnType<typeof createOpenAI> | null = null
let anthropicClient: ReturnType<typeof createAnthropic> | null = null

function getOpenAIClient() {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured')
    }
    openaiClient = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })
  }
  return openaiClient
}

function getAnthropicClient() {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }
    anthropicClient = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }
  return anthropicClient
}

function getModel(tier: 'cheap' | 'medium' | 'expensive', provider: AIProvider = 'openai') {
  const modelMap = {
    cheap: MODELS.CHEAP,
    medium: MODELS.MEDIUM,
    expensive: MODELS.EXPENSIVE,
  }

  const modelId = modelMap[tier][provider]
  
  if (provider === 'openai') {
    return getOpenAIClient()(modelId)
  } else if (provider === 'anthropic') {
    return getAnthropicClient()(modelId)
  }
  
  throw new Error(`Unsupported provider: ${provider}`)
}

// ========================================
// Cost Estimation
// ========================================

interface CostEstimate {
  inputTokens: number
  outputTokens: number
  estimatedCost: number
  model: string
  provider: AIProvider
}

// Approximate token costs per 1M tokens (as of 2024)
const COSTS = {
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4-turbo': { input: 10.00, output: 30.00 },
  'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
  'claude-3-5-sonnet-20241022': { input: 3.00, output: 15.00 },
  'claude-3-opus-20240229': { input: 15.00, output: 75.00 },
  'text-embedding-3-small': { input: 0.02, output: 0 },
}

function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = COSTS[model as keyof typeof COSTS]
  if (!costs) return 0

  const inputCost = (inputTokens / 1_000_000) * costs.input
  const outputCost = (outputTokens / 1_000_000) * costs.output
  return inputCost + outputCost
}

function logCost(estimate: CostEstimate) {
  if (!defaultConfig.enableCostLogging) return

  // Update cost tracker
  costTracker.totalRequests++
  costTracker.totalCost += estimate.estimatedCost
  costTracker.costByModel[estimate.model] = 
    (costTracker.costByModel[estimate.model] || 0) + estimate.estimatedCost
  costTracker.costByProvider[estimate.provider] = 
    (costTracker.costByProvider[estimate.provider] || 0) + estimate.estimatedCost

  console.log('[AI Cost]', {
    model: estimate.model,
    provider: estimate.provider,
    inputTokens: estimate.inputTokens,
    outputTokens: estimate.outputTokens,
    cost: `$${estimate.estimatedCost.toFixed(4)}`,
  })
}

// ========================================
// Retry and Timeout Wrapper
// ========================================

async function withRetryAndTimeout<T>(
  fn: () => Promise<T>,
  config: AIConfig = defaultConfig
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < config.maxRetries; attempt++) {
    try {
      // Implement timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('AI request timeout')), config.timeout)
      })

      const result = await Promise.race([fn(), timeoutPromise])
      return result
    } catch (error) {
      lastError = error as Error
      
      // Exponential backoff: 1s, 2s, 4s
      if (attempt < config.maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('AI request failed after retries')
}

// ========================================
// Public API: Text Generation
// ========================================

export async function generateAIText(params: {
  prompt: string
  systemPrompt?: string
  tier?: 'cheap' | 'medium' | 'expensive'
  provider?: AIProvider
  maxTokens?: number
  temperature?: number
}): Promise<{ text: string; usage: CostEstimate }> {
  const {
    prompt,
    systemPrompt,
    tier = 'cheap',
    provider = 'openai',
    maxTokens = 500,
    temperature = 0.7,
  } = params

  const model = getModel(tier, provider)
  const modelId = tier === 'cheap' ? MODELS.CHEAP[provider] : 
                  tier === 'medium' ? MODELS.MEDIUM[provider] :
                  MODELS.EXPENSIVE[provider]

  const result = await withRetryAndTimeout(async () => {
    return await generateText({
      model,
      prompt,
      system: systemPrompt,
      maxTokens,
      temperature,
    })
  })

  const costEstimate: CostEstimate = {
    inputTokens: result.usage?.promptTokens || 0,
    outputTokens: result.usage?.completionTokens || 0,
    estimatedCost: estimateCost(
      modelId,
      result.usage?.promptTokens || 0,
      result.usage?.completionTokens || 0
    ),
    model: modelId,
    provider,
  }

  logCost(costEstimate)

  return {
    text: result.text,
    usage: costEstimate,
  }
}

// ========================================
// Public API: Structured Output
// ========================================

export async function generateAIObject<T>(params: {
  prompt: string
  systemPrompt?: string
  schema: z.ZodSchema<T>
  tier?: 'cheap' | 'medium' | 'expensive'
  provider?: AIProvider
  maxTokens?: number
}): Promise<{ object: T; usage: CostEstimate }> {
  const {
    prompt,
    systemPrompt,
    schema,
    tier = 'cheap',
    provider = 'openai',
    maxTokens = 500,
  } = params

  const model = getModel(tier, provider)
  const modelId = tier === 'cheap' ? MODELS.CHEAP[provider] : 
                  tier === 'medium' ? MODELS.MEDIUM[provider] :
                  MODELS.EXPENSIVE[provider]

  const result = await withRetryAndTimeout(async () => {
    return await generateObject({
      model,
      prompt,
      system: systemPrompt,
      schema,
      maxTokens,
    })
  })

  const costEstimate: CostEstimate = {
    inputTokens: result.usage?.promptTokens || 0,
    outputTokens: result.usage?.completionTokens || 0,
    estimatedCost: estimateCost(
      modelId,
      result.usage?.promptTokens || 0,
      result.usage?.completionTokens || 0
    ),
    model: modelId,
    provider,
  }

  logCost(costEstimate)

  return {
    object: result.object,
    usage: costEstimate,
  }
}

// ========================================
// Public API: Streaming
// ========================================

export async function streamAIText(params: {
  prompt: string
  systemPrompt?: string
  tier?: 'cheap' | 'medium' | 'expensive'
  provider?: AIProvider
  maxTokens?: number
  temperature?: number
}) {
  const {
    prompt,
    systemPrompt,
    tier = 'medium',
    provider = 'openai',
    maxTokens = 1000,
    temperature = 0.7,
  } = params

  const model = getModel(tier, provider)

  return streamText({
    model,
    prompt,
    system: systemPrompt,
    maxTokens,
    temperature,
  })
}

// ========================================
// Public API: Embeddings
// ========================================

export async function generateAIEmbedding(params: {
  text: string
  provider?: AIProvider
}): Promise<{ embedding: number[]; usage: CostEstimate }> {
  const { text, provider = 'openai' } = params

  if (provider !== 'openai') {
    throw new Error('Only OpenAI embeddings are supported currently')
  }

  const openai = getOpenAIClient()
  const model = openai.embedding(MODELS.EMBEDDING.openai)

  const result = await withRetryAndTimeout(async () => {
    return await embed({
      model,
      value: text,
    })
  })

  // Estimate tokens (rough: 1 token ≈ 4 characters)
  const estimatedTokens = Math.ceil(text.length / 4)

  const costEstimate: CostEstimate = {
    inputTokens: estimatedTokens,
    outputTokens: 0,
    estimatedCost: estimateCost(MODELS.EMBEDDING.openai, estimatedTokens, 0),
    model: MODELS.EMBEDDING.openai,
    provider: 'openai',
  }

  logCost(costEstimate)

  return {
    embedding: result.embedding,
    usage: costEstimate,
  }
}

// ========================================
// Batch Operations (for cost efficiency)
// ========================================

export async function generateAIEmbeddingsBatch(params: {
  texts: string[]
  provider?: AIProvider
  batchSize?: number
}): Promise<{ embeddings: number[][]; totalCost: number }> {
  const { texts, provider = 'openai', batchSize = 100 } = params

  const embeddings: number[][] = []
  let totalCost = 0

  // Process in batches to avoid rate limits
  for (let i = 0; i < texts.length; i += batchSize) {
    const batchStartTime = Date.now()
    const batch = texts.slice(i, i + batchSize)
    
    const results = await Promise.all(
      batch.map(text => generateAIEmbedding({ text, provider }))
    )

    embeddings.push(...results.map(r => r.embedding))
    totalCost += results.reduce((sum, r) => sum + r.usage.estimatedCost, 0)

    // Rate limiting: ensure at least 1s between batch starts
    if (i + batchSize < texts.length) {
      const elapsed = Date.now() - batchStartTime
      const delay = Math.max(0, 1000 - elapsed)
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  return { embeddings, totalCost }
}

// ========================================
// Cost Monitoring
// ========================================

export interface CostSummary {
  totalRequests: number
  totalCost: number
  costByModel: Record<string, number>
  costByProvider: Record<string, number>
}

// In-memory cost tracking (for current session)
let costTracker: CostSummary = {
  totalRequests: 0,
  totalCost: 0,
  costByModel: {},
  costByProvider: {},
}

export function resetCostTracker() {
  costTracker = {
    totalRequests: 0,
    totalCost: 0,
    costByModel: {},
    costByProvider: {},
  }
}

export function getCostSummary(): CostSummary {
  return { ...costTracker }
}
