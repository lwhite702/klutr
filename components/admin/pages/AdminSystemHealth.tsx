"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface HealthCheck {
  name: string;
  status: "healthy" | "degraded" | "down";
  message: string;
}

/**
 * AdminSystemHealth - System health monitoring
 */
export function AdminSystemHealth() {
  const [health, setHealth] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/system/health");
        if (!res.ok) {
          throw new Error("Failed to fetch health status");
        }

        const data = await res.json();
        setHealth(data.checks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load health");
      } finally {
        setLoading(false);
      }
    }

    fetchHealth();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "down":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500/10 text-green-600">Healthy</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-500/10 text-yellow-600">Degraded</Badge>;
      case "down":
        return <Badge className="bg-red-500/10 text-red-600">Down</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

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
        <h1 className="text-3xl font-bold">System Health</h1>
        <p className="text-muted-foreground mt-2">
          Monitor system components and services
        </p>
      </div>

      {/* Health Checks */}
      <div className="grid gap-4 md:grid-cols-2">
        {health.map((check) => (
          <Card key={check.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{check.name}</CardTitle>
                {getStatusIcon(check.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getStatusBadge(check.status)}
                <p className="text-sm text-muted-foreground">{check.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

