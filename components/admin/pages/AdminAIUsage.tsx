"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AIUsageStats {
  perFeature: Array<{ feature: string; requests: number; cost: number }>;
  perModel: Array<{ model: string; requests: number; cost: number }>;
  totalRequests: number;
  totalCost: number;
}

/**
 * AdminAIUsage - AI usage analytics with charts and stats
 */
export function AdminAIUsage() {
  const [stats, setStats] = useState<AIUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/ai/usage?summary=true");
        if (!res.ok) {
          throw new Error("Failed to fetch AI usage stats");
        }

        const data = await res.json();
        setStats(data.summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">AI Usage</h1>
        <p className="text-muted-foreground mt-2">
          AI feature usage and cost analytics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRequests || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.totalCost || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per Feature Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Usage by Feature</CardTitle>
          <CardDescription>Requests and cost breakdown by feature</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.perFeature && stats.perFeature.length > 0 ? (
            <div className="space-y-4">
              {stats.perFeature.map((item) => (
                <div
                  key={item.feature}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.feature}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.requests} requests
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    ${item.cost.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No usage data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per Model Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Usage by Model</CardTitle>
          <CardDescription>Requests and cost breakdown by model</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.perModel && stats.perModel.length > 0 ? (
            <div className="space-y-4">
              {stats.perModel.map((item) => (
                <div
                  key={item.model}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.model}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.requests} requests
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    ${item.cost.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No model usage data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

