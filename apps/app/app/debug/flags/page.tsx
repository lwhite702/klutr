import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import {
  getFeatureFlag,
  getFeatureFlagValue,
  getFeatureFlagPayload,
} from "@/lib/posthog/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Debug route for viewing active feature flags
 * Protected route - requires authentication
 */
export default async function DebugFlagsPage() {
  // Require authentication
  const session = await getServerSession();
  if (!session) {
    redirect("/login?redirect=/debug/flags");
  }

  const userId = session.id;
  const userEmail = session.email;

  // Check all feature flags
  const flags = Object.values(FEATURE_FLAGS);
  const flagResults = await Promise.all(
    flags.map(async (flag) => {
      const enabled = await getFeatureFlag(flag, userId);
      const value = await getFeatureFlagValue(flag, userId);
      const payload = await getFeatureFlagPayload(flag, userId);

      return {
        flag,
        enabled,
        value,
        payload,
      };
    })
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Feature Flags Debug</h1>
        <p className="text-muted-foreground">
          View active feature flags for the current user
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Current authenticated user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">User ID:</span>{" "}
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {userId}
              </code>
            </div>
            <div>
              <span className="font-medium">Email:</span>{" "}
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {userEmail}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Feature Flags</h2>
        {flagResults.map((result) => (
          <Card key={result.flag}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono">{result.flag}</CardTitle>
                <Badge variant={result.enabled ? "default" : "secondary"}>
                  {result.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-sm">Status:</span>{" "}
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {result.enabled ? "true" : "false"}
                  </code>
                </div>
                {result.value !== null && result.value !== result.enabled && (
                  <div>
                    <span className="font-medium text-sm">Value:</span>{" "}
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {String(result.value)}
                    </code>
                  </div>
                )}
                {result.payload && (
                  <div>
                    <span className="font-medium text-sm">Payload:</span>
                    <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
                      {JSON.stringify(result.payload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {process.env.NODE_ENV === "development" && (
        <Card className="mt-6 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-yellow-600">Development Mode</CardTitle>
            <CardDescription>
              This debug route is only available in development
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}

