/**
 * AI Usage Admin Adapters
 * 
 * Provides admin-level access to AI usage logs and analytics
 */

import { supabaseAdmin } from "@/lib/supabase";

export interface AIUsageQueryParams {
  feature?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  model?: string;
  provider?: string;
  limit?: number;
}

export interface AIUsageSummary {
  totalRequests: number;
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  successRate: number;
  averageDuration: number;
  costByFeature: Record<string, number>;
  costByModel: Record<string, number>;
  costByProvider: Record<string, number>;
  requestsByFeature: Record<string, number>;
}

/**
 * Get AI usage logs with filtering
 */
export async function getAIUsage(params: AIUsageQueryParams = {}) {
  let query = supabaseAdmin
    .from("ai_usage_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (params.feature) {
    query = query.eq("feature", params.feature);
  }

  if (params.userId) {
    query = query.eq("user_id", params.userId);
  }

  if (params.model) {
    query = query.eq("model", params.model);
  }

  if (params.provider) {
    query = query.eq("provider", params.provider);
  }

  if (params.startDate) {
    query = query.gte("created_at", params.startDate.toISOString());
  }

  if (params.endDate) {
    query = query.lte("created_at", params.endDate.toISOString());
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

/**
 * Get AI usage summary statistics
 */
export async function getAIUsageSummary(
  params: Omit<AIUsageQueryParams, "limit"> = {}
): Promise<AIUsageSummary> {
  const logs = await getAIUsage({ ...params, limit: 10000 });

  const summary: AIUsageSummary = {
    totalRequests: logs.length,
    totalCost: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    successRate: 0,
    averageDuration: 0,
    costByFeature: {},
    costByModel: {},
    costByProvider: {},
    requestsByFeature: {},
  };

  let successCount = 0;
  let totalDuration = 0;

  logs.forEach((log: any) => {
    summary.totalCost += parseFloat(log.estimated_cost) || 0;
    summary.totalInputTokens += log.input_tokens || 0;
    summary.totalOutputTokens += log.output_tokens || 0;

    if (log.success) successCount++;
    totalDuration += log.duration_ms || 0;

    // Cost by feature
    summary.costByFeature[log.feature] =
      (summary.costByFeature[log.feature] || 0) + parseFloat(log.estimated_cost || 0);

    // Cost by model
    summary.costByModel[log.model] =
      (summary.costByModel[log.model] || 0) + parseFloat(log.estimated_cost || 0);

    // Cost by provider
    summary.costByProvider[log.provider] =
      (summary.costByProvider[log.provider] || 0) +
      parseFloat(log.estimated_cost || 0);

    // Requests by feature
    summary.requestsByFeature[log.feature] =
      (summary.requestsByFeature[log.feature] || 0) + 1;
  });

  summary.successRate = logs.length > 0 ? successCount / logs.length : 0;
  summary.averageDuration = logs.length > 0 ? totalDuration / logs.length : 0;

  return summary;
}

/**
 * Get AI cost breakdown by time period
 */
export async function getAICostByPeriod(
  periodType: "hourly" | "daily" | "weekly" | "monthly" = "daily",
  startDate: Date,
  endDate: Date
) {
  const { data, error } = await supabaseAdmin
    .from("ai_cost_history")
    .select("*")
    .eq("period_type", periodType)
    .gte("period_start", startDate.toISOString())
    .lte("period_end", endDate.toISOString())
    .order("period_start", { ascending: true });

  if (error) throw error;

  return data || [];
}

/**
 * Get AI error logs
 */
export async function getAIErrors(params: AIUsageQueryParams = {}) {
  let query = supabaseAdmin
    .from("ai_error_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (params.feature) {
    query = query.eq("feature", params.feature);
  }

  if (params.userId) {
    query = query.eq("user_id", params.userId);
  }

  if (params.model) {
    query = query.eq("model", params.model);
  }

  if (params.startDate) {
    query = query.gte("created_at", params.startDate.toISOString());
  }

  if (params.endDate) {
    query = query.lte("created_at", params.endDate.toISOString());
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data || [];
}

