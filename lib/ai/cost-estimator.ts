/**
 * AI Cost Estimator
 * 
 * Estimates monthly AI costs based on usage assumptions
 */

export interface UsageAssumptions {
  activeUsers: number
  messagesPerUserPerDay: number
  avgMessageLength: number // characters
  embeddingGenerationRate: number // % of messages that generate embeddings
  classificationRate: number // % of messages that get classified
  insightsPerUserPerWeek: number
  clusteringFrequency: 'daily' | 'weekly' | 'never'
}

export interface CostBreakdown {
  embeddings: {
    requestsPerMonth: number
    tokensPerMonth: number
    costPerMonth: number
  }
  classification: {
    requestsPerMonth: number
    tokensPerMonth: number
    costPerMonth: number
  }
  insights: {
    requestsPerMonth: number
    tokensPerMonth: number
    costPerMonth: number
  }
  clustering: {
    requestsPerMonth: number
    tokensPerMonth: number
    costPerMonth: number
  }
  total: {
    requestsPerMonth: number
    tokensPerMonth: number
    costPerMonth: number
  }
}

// Model costs per 1M tokens
const COSTS = {
  embedding: 0.02, // text-embedding-3-small
  cheapModel: 0.75, // gpt-4o-mini average (input + output)
  mediumModel: 6.25, // gpt-4o average
}

// Token estimates
const TOKENS = {
  messageAvg: 150, // avg tokens per message
  classificationInput: 200, // tokens for classification prompt
  classificationOutput: 50, // tokens for classification response
  insightInput: 2000, // tokens for insight generation (summarizing notes)
  insightOutput: 300, // tokens for insight response
  clusteringPerNote: 10, // tokens for clustering calculations (minimal)
}

export function estimateMonthlyCost(assumptions: UsageAssumptions): CostBreakdown {
  const {
    activeUsers,
    messagesPerUserPerDay,
    avgMessageLength,
    embeddingGenerationRate,
    classificationRate,
    insightsPerUserPerWeek,
    clusteringFrequency,
  } = assumptions

  const daysPerMonth = 30

  // ========================================
  // Embeddings
  // ========================================
  
  const messagesPerMonth = activeUsers * messagesPerUserPerDay * daysPerMonth
  const embeddingsPerMonth = messagesPerMonth * embeddingGenerationRate
  const embeddingTokensPerMonth = embeddingsPerMonth * TOKENS.messageAvg
  const embeddingCostPerMonth = (embeddingTokensPerMonth / 1_000_000) * COSTS.embedding

  // ========================================
  // Classification
  // ========================================
  
  const classificationsPerMonth = messagesPerMonth * classificationRate
  const classificationInputTokens = classificationsPerMonth * TOKENS.classificationInput
  const classificationOutputTokens = classificationsPerMonth * TOKENS.classificationOutput
  const classificationTotalTokens = classificationInputTokens + classificationOutputTokens
  const classificationCostPerMonth = (classificationTotalTokens / 1_000_000) * COSTS.cheapModel

  // ========================================
  // Insights
  // ========================================
  
  const insightsPerMonth = activeUsers * insightsPerUserPerWeek * 4
  const insightInputTokens = insightsPerMonth * TOKENS.insightInput
  const insightOutputTokens = insightsPerMonth * TOKENS.insightOutput
  const insightTotalTokens = insightInputTokens + insightOutputTokens
  const insightCostPerMonth = (insightTotalTokens / 1_000_000) * COSTS.mediumModel

  // ========================================
  // Clustering
  // ========================================
  
  let clusteringRequestsPerMonth = 0
  if (clusteringFrequency === 'daily') {
    clusteringRequestsPerMonth = activeUsers * daysPerMonth
  } else if (clusteringFrequency === 'weekly') {
    clusteringRequestsPerMonth = activeUsers * 4
  }

  const avgNotesPerUser = messagesPerUserPerDay * daysPerMonth
  const clusteringTokensPerMonth = clusteringRequestsPerMonth * avgNotesPerUser * TOKENS.clusteringPerNote
  const clusteringCostPerMonth = (clusteringTokensPerMonth / 1_000_000) * COSTS.cheapModel

  // ========================================
  // Total
  // ========================================
  
  const totalCostPerMonth =
    embeddingCostPerMonth +
    classificationCostPerMonth +
    insightCostPerMonth +
    clusteringCostPerMonth

  return {
    embeddings: {
      requestsPerMonth: embeddingsPerMonth,
      tokensPerMonth: embeddingTokensPerMonth,
      costPerMonth: embeddingCostPerMonth,
    },
    classification: {
      requestsPerMonth: classificationsPerMonth,
      tokensPerMonth: classificationTotalTokens,
      costPerMonth: classificationCostPerMonth,
    },
    insights: {
      requestsPerMonth: insightsPerMonth,
      tokensPerMonth: insightTotalTokens,
      costPerMonth: insightCostPerMonth,
    },
    clustering: {
      requestsPerMonth: clusteringRequestsPerMonth,
      tokensPerMonth: clusteringTokensPerMonth,
      costPerMonth: clusteringCostPerMonth,
    },
    total: {
      requestsPerMonth:
        embeddingsPerMonth +
        classificationsPerMonth +
        insightsPerMonth +
        clusteringRequestsPerMonth,
      tokensPerMonth:
        embeddingTokensPerMonth +
        classificationTotalTokens +
        insightTotalTokens +
        clusteringTokensPerMonth,
      costPerMonth: totalCostPerMonth,
    },
  }
}

// ========================================
// Pre-defined Usage Tiers
// ========================================

export const USAGE_TIERS = {
  small: {
    name: 'Small (100 users)',
    assumptions: {
      activeUsers: 100,
      messagesPerUserPerDay: 10,
      avgMessageLength: 500,
      embeddingGenerationRate: 0.8,
      classificationRate: 0.5,
      insightsPerUserPerWeek: 1,
      clusteringFrequency: 'daily' as const,
    },
  },
  medium: {
    name: 'Medium (500 users)',
    assumptions: {
      activeUsers: 500,
      messagesPerUserPerDay: 15,
      avgMessageLength: 500,
      embeddingGenerationRate: 0.8,
      classificationRate: 0.5,
      insightsPerUserPerWeek: 1,
      clusteringFrequency: 'daily' as const,
    },
  },
  large: {
    name: 'Large (2000 users)',
    assumptions: {
      activeUsers: 2000,
      messagesPerUserPerDay: 20,
      avgMessageLength: 500,
      embeddingGenerationRate: 0.8,
      classificationRate: 0.5,
      insightsPerUserPerWeek: 1,
      clusteringFrequency: 'weekly' as const,
    },
  },
}

// ========================================
// Format Cost Report
// ========================================

export function formatCostReport(breakdown: CostBreakdown): string {
  const format = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`
    return num.toFixed(0)
  }

  const formatCost = (cost: number) => `$${cost.toFixed(2)}`

  return `
AI Cost Breakdown (Monthly)
============================

Embeddings:
  Requests: ${format(breakdown.embeddings.requestsPerMonth)}
  Tokens:   ${format(breakdown.embeddings.tokensPerMonth)}
  Cost:     ${formatCost(breakdown.embeddings.costPerMonth)}

Classification:
  Requests: ${format(breakdown.classification.requestsPerMonth)}
  Tokens:   ${format(breakdown.classification.tokensPerMonth)}
  Cost:     ${formatCost(breakdown.classification.costPerMonth)}

Insights:
  Requests: ${format(breakdown.insights.requestsPerMonth)}
  Tokens:   ${format(breakdown.insights.tokensPerMonth)}
  Cost:     ${formatCost(breakdown.insights.costPerMonth)}

Clustering:
  Requests: ${format(breakdown.clustering.requestsPerMonth)}
  Tokens:   ${format(breakdown.clustering.tokensPerMonth)}
  Cost:     ${formatCost(breakdown.clustering.costPerMonth)}

-----------------------------
TOTAL:
  Requests: ${format(breakdown.total.requestsPerMonth)}
  Tokens:   ${format(breakdown.total.tokensPerMonth)}
  Cost:     ${formatCost(breakdown.total.costPerMonth)}
`
}
