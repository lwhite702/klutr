/**
 * AI Provider Abstraction Layer
 * 
 * Uses Vercel AI SDK as the runtime adapter with provider plugins.
 * Supports OpenAI (default) and Anthropic (optional).
 * Includes cost-aware model selection, timeout/retry, and rate limiting.
 */

import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText, embed, type LanguageModel } from 'ai';
import { log } from '@/lib/logger';

// Provider types
export type AIProvider = 'openai' | 'anthropic';

// Model types for cost-aware selection
export type ModelPurpose = 
  | 'embedding' 
  | 'classification' 
  | 'tagging'
  | 'summarization' 
  | 'insights'
  | 'chat';

// Model configuration
interface ModelConfig {
  model: string;
  provider: AIProvider;
  maxTokens?: number;
  temperature?: number;
}

// Cost-aware model mapper
const MODEL_MAP: Record<ModelPurpose, ModelConfig> = {
  embedding: {
    model: 'text-embedding-3-small',
    provider: 'openai',
  },
  classification: {
    model: 'gpt-4o-mini',
    provider: 'openai',
    maxTokens: 500,
    temperature: 0.4,
  },
  tagging: {
    model: 'gpt-4o-mini',
    provider: 'openai',
    maxTokens: 300,
    temperature: 0.3,
  },
  summarization: {
    model: 'gpt-4o-mini',
    provider: 'openai',
    maxTokens: 1000,
    temperature: 0.5,
  },
  insights: {
    model: 'gpt-4o-mini',
    provider: 'openai',
    maxTokens: 2000,
    temperature: 0.6,
  },
  chat: {
    model: 'gpt-4o-mini',
    provider: 'openai',
    maxTokens: 2000,
    temperature: 0.7,
  },
};

// Get provider client
function getProvider(provider: AIProvider = 'openai'): LanguageModel {
  switch (provider) {
    case 'openai':
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
      }
      return openai('gpt-4o-mini');
    case 'anthropic':
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY environment variable is not set');
      }
      return anthropic('claude-3-haiku-20240307');
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// Timeout wrapper
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 12000,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

// Retry with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on certain errors
      if (lastError.message.includes('timeout') || lastError.message.includes('rate limit')) {
        if (attempt < maxRetries) {
          const delayMs = baseDelayMs * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
      }
      
      // For other errors, only retry once
      if (attempt === 0 && maxRetries > 0) {
        await new Promise(resolve => setTimeout(resolve, baseDelayMs));
        continue;
      }
      
      throw lastError;
    }
  }
  
  throw lastError || new Error('Retry failed');
}

// Rate limit queue (simple in-memory queue)
class RateLimitQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastCall = 0;
  private readonly minIntervalMs: number;

  constructor(minIntervalMs: number = 100) {
    this.minIntervalMs = minIntervalMs;
  }

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastCall = now - this.lastCall;
      
      if (timeSinceLastCall < this.minIntervalMs) {
        await new Promise(resolve => 
          setTimeout(resolve, this.minIntervalMs - timeSinceLastCall)
        );
      }

      const fn = this.queue.shift();
      if (fn) {
        this.lastCall = Date.now();
        await fn();
      }
    }

    this.processing = false;
  }
}

// Global rate limit queue
const rateLimitQueue = new RateLimitQueue(100); // 10 requests per second max

/**
 * Generate embedding using cost-aware model selection
 */
export async function generateEmbedding(
  content: string,
  provider: AIProvider = 'openai'
): Promise<number[]> {
  if (!content || content.trim().length === 0) {
    return [];
  }

  const config = MODEL_MAP.embedding;

  try {
    const result = await rateLimitQueue.enqueue(() =>
      withTimeout(
        withRetry(async () => {
          const { embedding } = await embed({
            model: openai.embedding(config.model),
            value: content,
          });
          return embedding;
        }),
        12000,
        'Embedding generation timed out'
      )
    );

    log.info('Generated embedding', { 
      length: result.length,
      provider,
      model: config.model 
    });

    return result;
  } catch (error) {
    log.error('Embedding generation failed', { 
      error: error instanceof Error ? error.message : String(error),
      provider,
      model: config.model 
    });
    throw new Error(
      `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Classify content and extract topics, summary, and sentiment
 */
export async function classifyMessage(
  content: string,
  provider: AIProvider = 'openai'
): Promise<{
  topics: string[];
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}> {
  if (!content || content.trim().length === 0) {
    return {
      topics: [],
      summary: '',
      sentiment: 'neutral',
    };
  }

  const config = MODEL_MAP.classification;
  const model = getProvider(config.provider);

  try {
    const result = await rateLimitQueue.enqueue(() =>
      withTimeout(
        withRetry(async () => {
          const { text } = await generateText({
            model,
            prompt: `You are a message classifier. Extract relevant topics, a concise summary, and sentiment (positive, neutral, or negative). Respond in JSON format: {"topics": ["topic1", "topic2"], "summary": "brief summary", "sentiment": "positive"|"neutral"|"negative"}.`,
            maxTokens: config.maxTokens || 500,
            temperature: config.temperature || 0.4,
          });
          return text;
        }),
        12000,
        'Classification timed out'
      )
    );

    try {
      const parsed = JSON.parse(result);
      return {
        topics: Array.isArray(parsed.topics) ? parsed.topics.slice(0, 10) : [],
        summary: typeof parsed.summary === 'string' ? parsed.summary.slice(0, 500) : '',
        sentiment:
          parsed.sentiment === 'positive' || parsed.sentiment === 'negative'
            ? parsed.sentiment
            : 'neutral',
      };
    } catch (parseError) {
      log.error('Failed to parse classification response', { parseError });
      return {
        topics: [],
        summary: '',
        sentiment: 'neutral',
      };
    }
  } catch (error) {
    log.error('Classification failed', { 
      error: error instanceof Error ? error.message : String(error),
      provider 
    });
    return {
      topics: [],
      summary: '',
      sentiment: 'neutral',
    };
  }
}

/**
 * Generate text using AI with cost-aware model selection
 */
export async function generateTextWithAI(
  prompt: string,
  purpose: ModelPurpose = 'chat',
  provider: AIProvider = 'openai',
  options?: {
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  if (!prompt || prompt.trim().length === 0) {
    return '';
  }

  const config = MODEL_MAP[purpose];
  const model = getProvider(config.provider);

  try {
    const result = await rateLimitQueue.enqueue(() =>
      withTimeout(
        withRetry(async () => {
          const { text } = await generateText({
            model,
            prompt,
            maxTokens: options?.maxTokens || config.maxTokens || 2000,
            temperature: options?.temperature ?? config.temperature ?? 0.7,
          });
          return text;
        }),
        12000,
        'Text generation timed out'
      )
    );

    log.info('Generated text', { 
      purpose,
      provider,
      model: config.model,
      length: result.length 
    });

    return result;
  } catch (error) {
    log.error('Text generation failed', { 
      error: error instanceof Error ? error.message : String(error),
      purpose,
      provider 
    });
    throw new Error(
      `Failed to generate text: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get model configuration for a purpose
 */
export function getModelConfig(purpose: ModelPurpose): ModelConfig {
  return MODEL_MAP[purpose];
}
