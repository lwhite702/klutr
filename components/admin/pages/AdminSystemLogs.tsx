"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

/**
 * AdminSystemLogs - Application-level error logs
 * 
 * Note: This is a placeholder. Actual implementation depends on
 * the logging backend (e.g., Rollbar, Sentry, custom logging)
 */
export function AdminSystemLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/system/logs");
        if (!res.ok) {
          throw new Error("Failed to fetch system logs");
        }

        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load logs");
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
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
        <h1 className="text-3xl font-bold">System Logs</h1>
        <p className="text-muted-foreground mt-2">
          Application-level error logs and events
        </p>
      </div>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Error Logs</CardTitle>
          <CardDescription>
            Recent application errors and warnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No system logs available
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 border rounded-lg text-sm font-mono"
                >
                  <pre className="whitespace-pre-wrap">{JSON.stringify(log, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

