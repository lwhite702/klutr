"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface UserDetail {
  id: string;
  email: string;
  created_at: string;
  last_active_at: string | null;
  is_admin: boolean;
  total_notes: number;
  total_ai_requests: number;
  total_ai_cost: number;
  recent_ai_interactions: Array<{
    id: string;
    feature: string;
    model: string;
    cost: number;
    created_at: string;
  }>;
}

/**
 * AdminUserDetail - User detail view with stats and timeline
 */
export function AdminUserDetail({ userId }: { userId: string }) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/admin/users/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error || "User not found"}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{user.email}</h1>
        <p className="text-muted-foreground mt-2">User details and activity</p>
      </div>

      {/* Identity Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Role</div>
              <div>
                {user.is_admin ? (
                  <Badge variant="default">Admin</Badge>
                ) : (
                  <Badge variant="secondary">User</Badge>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Last Active</div>
              <div className="font-medium">
                {user.last_active_at
                  ? new Date(user.last_active_at).toLocaleDateString()
                  : "Never"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.total_notes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">AI Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.total_ai_requests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">AI Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${user.total_ai_cost.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent AI Interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Interactions</CardTitle>
          <CardDescription>Timeline of AI feature usage</CardDescription>
        </CardHeader>
        <CardContent>
          {user.recent_ai_interactions && user.recent_ai_interactions.length > 0 ? (
            <div className="space-y-4">
              {user.recent_ai_interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{interaction.feature}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Model: {interaction.model}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(interaction.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    ${interaction.cost.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No AI interactions yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

