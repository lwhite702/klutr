/**
 * AI Cost Estimator
 * 
 * Estimates monthly API costs for given usage assumptions.
 * Uses current OpenAI pricing (as of 2025-01-27).
 */

export interface UsageAssumptions {
  embeddingsPerMonth: number;
  classificationsPerMonth: number;
  taggingsPerMonth: number;
  summarizationsPerMonth: number;
  insightsPerMonth: number;
  chatMessagesPerMonth: number;
  averageEmbeddingTokens: number;
  averageTextTokens: number;
}

export interface CostEstimate {
  embedding: {
    requests: number;
    costPerRequest: number;
    totalCost: number;
  };
  classification: {
    requests: number;
    costPerRequest: number;
    totalCost: number;
  };
  tagging: {
    requests: number;
    costPerRequest: number;
    totalCost: number;
  };
  summarization: {
    requests: number;
    costPerRequest: number;
    totalCost: number;
  };
  insights: {
    requests: number;
    costPerRequest: number;
    totalCost: number;
  };
  chat: {
    requests: number;
    costPerRequest: number;
    totalCost: number;
  };
  total: {
    monthly: number;
    yearly: number;
  };
}

// OpenAI pricing (as of 2025-01-27, per 1M tokens)
const PRICING = {
  'text-embedding-3-small': {
    input: 0.02, // $0.02 per 1M tokens
  },
  'gpt-4o-mini': {
    input: 0.15, // $0.15 per 1M tokens
    output: 0.60, // $0.60 per 1M tokens
  },
};

function estimateEmbeddingCost(requests: number, avgTokens: number): number {
  const tokens = requests * avgTokens;
  const costPerMillion = PRICING['text-embedding-3-small'].input;
  return (tokens / 1_000_000) * costPerMillion;
}

function estimateTextGenerationCost(
  requests: number,
  avgInputTokens: number,
  avgOutputTokens: number
): number {
  const inputTokens = requests * avgInputTokens;
  const outputTokens = requests * avgOutputTokens;
  const inputCost = (inputTokens / 1_000_000) * PRICING['gpt-4o-mini'].input;
  const outputCost = (outputTokens / 1_000_000) * PRICING['gpt-4o-mini'].output;
  return inputCost + outputCost;
}

export function estimateCosts(usage: UsageAssumptions): CostEstimate {
  const embeddingCost = estimateEmbeddingCost(
    usage.embeddingsPerMonth,
    usage.averageEmbeddingTokens
  );

  const classificationCost = estimateTextGenerationCost(
    usage.classificationsPerMonth,
    100, // Average input tokens for classification prompt
    50 // Average output tokens for classification
  );

  const taggingCost = estimateTextGenerationCost(
    usage.taggingsPerMonth,
    100,
    30
  );

  const summarizationCost = estimateTextGenerationCost(
    usage.summarizationsPerMonth,
    usage.averageTextTokens,
    200
  );

  const insightsCost = estimateTextGenerationCost(
    usage.insightsPerMonth,
    usage.averageTextTokens * 10, // Insights process multiple notes
    500
  );

  const chatCost = estimateTextGenerationCost(
    usage.chatMessagesPerMonth,
    usage.averageTextTokens,
    200
  );

  const totalMonthly = 
    embeddingCost +
    classificationCost +
    taggingCost +
    summarizationCost +
    insightsCost +
    chatCost;

  return {
    embedding: {
      requests: usage.embeddingsPerMonth,
      costPerRequest: embeddingCost / usage.embeddingsPerMonth,
      totalCost: embeddingCost,
    },
    classification: {
      requests: usage.classificationsPerMonth,
      costPerRequest: classificationCost / usage.classificationsPerMonth,
      totalCost: classificationCost,
    },
    tagging: {
      requests: usage.taggingsPerMonth,
      costPerRequest: taggingCost / usage.taggingsPerMonth,
      totalCost: taggingCost,
    },
    summarization: {
      requests: usage.summarizationsPerMonth,
      costPerRequest: summarizationCost / usage.summarizationsPerMonth,
      totalCost: summarizationCost,
    },
    insights: {
      requests: usage.insightsPerMonth,
      costPerRequest: insightsCost / usage.insightsPerMonth,
      totalCost: insightsCost,
    },
    chat: {
      requests: usage.chatMessagesPerMonth,
      costPerRequest: chatCost / usage.chatMessagesPerMonth,
      totalCost: chatCost,
    },
    total: {
      monthly: totalMonthly,
      yearly: totalMonthly * 12,
    },
  };
}

/**
 * Generate cost estimate report for multiple usage tiers
 */
export function generateCostReport(): {
  tier: string;
  usage: UsageAssumptions;
  estimate: CostEstimate;
}[] {
  const tiers = [
    {
      tier: 'Small (100 users, 10 notes/user/month)',
      usage: {
        embeddingsPerMonth: 1000,
        classificationsPerMonth: 1000,
        taggingsPerMonth: 1000,
        summarizationsPerMonth: 100,
        insightsPerMonth: 100,
        chatMessagesPerMonth: 500,
        averageEmbeddingTokens: 100,
        averageTextTokens: 200,
      },
    },
    {
      tier: 'Medium (1000 users, 50 notes/user/month)',
      usage: {
        embeddingsPerMonth: 50000,
        classificationsPerMonth: 50000,
        taggingsPerMonth: 50000,
        summarizationsPerMonth: 5000,
        insightsPerMonth: 1000,
        chatMessagesPerMonth: 10000,
        averageEmbeddingTokens: 100,
        averageTextTokens: 200,
      },
    },
    {
      tier: 'Large (10000 users, 100 notes/user/month)',
      usage: {
        embeddingsPerMonth: 1000000,
        classificationsPerMonth: 1000000,
        taggingsPerMonth: 1000000,
        summarizationsPerMonth: 100000,
        insightsPerMonth: 10000,
        chatMessagesPerMonth: 200000,
        averageEmbeddingTokens: 100,
        averageTextTokens: 200,
      },
    },
  ];

  return tiers.map(({ tier, usage }) => ({
    tier,
    usage,
    estimate: estimateCosts(usage),
  }));
}
