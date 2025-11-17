"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ModelMapping {
  tier: string;
  defaultModel: string;
  currentModel: string;
  hasOverride: boolean;
}

/**
 * AdminAIModels - Model tier mappings with override controls
 */
export function AdminAIModels() {
  const [mappings, setMappings] = useState<ModelMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/ai/models");
        if (!res.ok) {
          throw new Error("Failed to fetch model mappings");
        }

        const data = await res.json();
        setMappings(data.mappings || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load models");
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  const handleModelChange = async (tier: string, model: string) => {
    try {
      const res = await fetch("/api/admin/ai/override/model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, model }),
      });

      if (!res.ok) {
        throw new Error("Failed to update model override");
      }

      toast.success("Model override updated");
      
      // Refresh mappings
      const refreshRes = await fetch("/api/admin/ai/models");
      const refreshData = await refreshRes.json();
      setMappings(refreshData.mappings || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleReset = async (tier: string) => {
    try {
      const res = await fetch("/api/admin/ai/override/model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, model: null }),
      });

      if (!res.ok) {
        throw new Error("Failed to reset override");
      }

      toast.success("Override reset to default");
      
      // Refresh mappings
      const refreshRes = await fetch("/api/admin/ai/models");
      const refreshData = await refreshRes.json();
      setMappings(refreshData.mappings || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset");
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

  // Available models for selection
  const availableModels = [
    "gpt-4o-mini",
    "gpt-4o",
    "gpt-4-turbo",
    "gpt-5",
    "gpt-5.1-code",
    "claude-3-haiku-20240307",
    "claude-3-5-sonnet-20241022",
    "claude-3-opus-20240229",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">AI Models</h1>
        <p className="text-muted-foreground mt-2">
          Configure model tier mappings and overrides
        </p>
      </div>

      {/* Model Mappings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Mappings</CardTitle>
          <CardDescription>
            Current effective models for each tier (after overrides)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mappings.map((mapping) => (
              <div
                key={mapping.tier}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{mapping.tier}</div>
                  <div className="text-sm text-muted-foreground">
                    Default: {mapping.defaultModel}
                  </div>
                  {mapping.hasOverride && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      Override active
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={mapping.currentModel}
                    onValueChange={(value) => handleModelChange(mapping.tier, value)}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {mapping.hasOverride && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReset(mapping.tier)}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

