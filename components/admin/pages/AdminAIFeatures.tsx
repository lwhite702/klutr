"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FeatureFlag {
  id: string;
  feature_name: string;
  enabled: boolean;
  description: string | null;
  updated_at: string;
}

/**
 * AdminAIFeatures - Feature flags management
 */
export function AdminAIFeatures() {
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatures() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/ai/features");
        if (!res.ok) {
          throw new Error("Failed to fetch feature flags");
        }

        const data = await res.json();
        setFeatures(data.features || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load features");
      } finally {
        setLoading(false);
      }
    }

    fetchFeatures();
  }, []);

  const handleToggle = async (featureName: string, enabled: boolean) => {
    try {
      const res = await fetch("/api/admin/ai/toggle/feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature_name: featureName, is_enabled: enabled }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle feature");
      }

      toast.success(`Feature ${enabled ? "enabled" : "disabled"}`);
      
      // Refresh features
      const refreshRes = await fetch("/api/admin/ai/features");
      const refreshData = await refreshRes.json();
      setFeatures(refreshData.features || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to toggle");
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
        <h1 className="text-3xl font-bold">AI Features</h1>
        <p className="text-muted-foreground mt-2">
          Enable or disable AI features
        </p>
      </div>

      {/* Feature Flags Table */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>
            Control which AI features are available to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{feature.feature_name}</div>
                  {feature.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {feature.description}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    Last updated: {new Date(feature.updated_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Enabled</span>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={(checked) =>
                        handleToggle(feature.feature_name, checked)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

