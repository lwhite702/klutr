"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface OverviewStats {
  totalUsers: number;
  activeUsersLast7Days: number;
  notesCreatedLast7Days: number;
  aiCostLast7Days: number;
  recentErrors: Array<{
    id: string;
    feature: string;
    error_message: string;
    created_at: string;
  }>;
}

/**
 * AdminOverview - Dashboard with summary stats and recent errors
 */
export function AdminOverview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        // Fetch overview stats
        const [usersRes, notesRes, aiRes, errorsRes] = await Promise.all([
          fetch("/api/admin/users?summary=true"),
          fetch("/api/admin/notes?summary=true&days=7"),
          fetch("/api/admin/ai/cost?startDate=" + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
          fetch("/api/admin/ai/logs?limit=10"),
        ]);

        if (!usersRes.ok || !notesRes.ok || !aiRes.ok || !errorsRes.ok) {
          throw new Error("Failed to fetch overview stats");
        }

        const [usersData, notesData, aiData, errorsData] = await Promise.all([
          usersRes.json(),
          notesRes.json(),
          aiRes.json(),
          errorsRes.json(),
        ]);

        // Calculate total cost from AI cost data
        const totalCost = aiData.summary?.totalCost || aiData.history?.reduce((sum: number, item: any) => sum + Number(item.total_cost || 0), 0) || 0;

        setStats({
          totalUsers: usersData.totalUsers || 0,
          activeUsersLast7Days: usersData.activeUsersLast7Days || 0,
          notesCreatedLast7Days: notesData.count || 0,
          aiCostLast7Days: totalCost,
          recentErrors: (errorsData.errors || []).map((err: any) => ({
            id: err.id,
            feature: err.feature,
            error_message: err.error_message,
            created_at: err.created_at,
          })),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load overview");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-muted-foreground mt-2">
            System-wide statistics and recent activity
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
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
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground mt-2">
          System-wide statistics and recent activity
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.activeUsersLast7Days || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Users active in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes Created (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.notesCreatedLast7Days || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Notes created in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Cost (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.aiCostLast7Days || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total AI costs in last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent AI Errors */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Errors</CardTitle>
          <CardDescription>
            Latest AI errors from the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.recentErrors && stats.recentErrors.length > 0 ? (
            <div className="space-y-4">
              {stats.recentErrors.map((error) => (
                <div
                  key={error.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{error.feature}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {error.error_message}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(error.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent errors
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

