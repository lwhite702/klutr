"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Search } from "lucide-react";
import Link from "next/link";

interface AILog {
  id: string;
  user_id: string | null;
  feature: string;
  model: string;
  provider: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost: number;
  created_at: string;
}

/**
 * AdminAILogs - Paginated AI usage logs
 */
export function AdminAILogs() {
  const [logs, setLogs] = useState<AILog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [featureFilter, setFeatureFilter] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append("limit", "100");
        if (featureFilter) params.append("feature", featureFilter);
        if (searchQuery) params.append("search", searchQuery);

        const res = await fetch(`/api/admin/ai/usage?${params.toString()}`);
        if (!res.ok) {
          throw new Error("Failed to fetch logs");
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
  }, [featureFilter, searchQuery]);

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
        <h1 className="text-3xl font-bold">AI Logs</h1>
        <p className="text-muted-foreground mt-2">
          Detailed AI usage and error logs
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by feature, model, or user ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Input
              placeholder="Filter by feature..."
              value={featureFilter}
              onChange={(e) => setFeatureFilter(e.target.value)}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Logs</CardTitle>
          <CardDescription>
            {logs.length} log{logs.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {log.user_id ? (
                        <Link
                          href={`/admin/users/${log.user_id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {log.user_id.slice(0, 8)}...
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">System</span>
                      )}
                    </TableCell>
                    <TableCell>{log.feature}</TableCell>
                    <TableCell className="font-mono text-xs">{log.model}</TableCell>
                    <TableCell>{log.provider}</TableCell>
                    <TableCell className="text-sm">
                      {log.input_tokens + log.output_tokens}
                    </TableCell>
                    <TableCell className="text-sm">
                      ${log.estimated_cost.toFixed(4)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

