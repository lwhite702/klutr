/**
 * PostHog REST API Client
 * 
 * Provides functions to manage PostHog resources via REST API.
 * Requires Personal API Key (not project API key) for management operations.
 */

interface CreateFeatureFlagOptions {
  key: string;
  name: string;
  description?: string;
  active?: boolean;
  filters?: {
    groups?: Array<{
      properties?: Array<{
        key: string;
        value: string | number | boolean;
        operator?: string;
      }>;
      rollout_percentage?: number;
    }>;
  };
  ensure_unique?: boolean; // If true, will not create if flag already exists
}

interface FeatureFlagResponse {
  id: number;
  key: string;
  name: string;
  active: boolean;
  created_at: string;
  created_by?: {
    id: number;
    email: string;
  };
}

/**
 * Get PostHog API configuration
 */
function getApiConfig() {
  const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com";
  const projectId = process.env.POSTHOG_PROJECT_ID;

  if (!personalApiKey) {
    throw new Error(
      "POSTHOG_PERSONAL_API_KEY is required for API operations. " +
      "Get it from PostHog → Settings → Personal API Keys"
    );
  }

  if (!projectId) {
    throw new Error(
      "POSTHOG_PROJECT_ID is required. " +
      "Get it from PostHog → Project Settings"
    );
  }

  return { personalApiKey, host, projectId };
}

/**
 * Create a feature flag in PostHog
 * @param options - Feature flag configuration
 * @returns Promise that resolves to the created feature flag
 */
export async function createFeatureFlag(
  options: CreateFeatureFlagOptions
): Promise<FeatureFlagResponse> {
  const { personalApiKey, host, projectId } = getApiConfig();

  const url = `${host}/api/projects/${projectId}/feature_flags/`;
  
  const payload: any = {
    key: options.key,
    name: options.name,
    active: options.active ?? false,
  };

  if (options.description) {
    payload.description = options.description;
  }

  if (options.filters) {
    payload.filters = options.filters;
  }

  // If ensure_unique is true, check if flag exists first
  if (options.ensure_unique) {
    try {
      const existing = await getFeatureFlag(options.key);
      if (existing) {
        console.log(`[PostHog API] Feature flag "${options.key}" already exists, skipping creation`);
        return existing;
      }
    } catch (error) {
      // Flag doesn't exist, continue with creation
    }
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${personalApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `PostHog API error (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    console.log(`[PostHog API] Created feature flag: ${options.key}`);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create feature flag: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get a feature flag by key
 * @param key - Feature flag key
 * @returns Promise that resolves to the feature flag or null if not found
 */
export async function getFeatureFlag(
  key: string
): Promise<FeatureFlagResponse | null> {
  const { personalApiKey, host, projectId } = getApiConfig();

  const url = `${host}/api/projects/${projectId}/feature_flags/${key}/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${personalApiKey}`,
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `PostHog API error (${response.status}): ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return null;
    }
    throw error;
  }
}

/**
 * Update a feature flag
 * @param key - Feature flag key
 * @param updates - Partial feature flag updates
 * @returns Promise that resolves to the updated feature flag
 */
export async function updateFeatureFlag(
  key: string,
  updates: Partial<CreateFeatureFlagOptions>
): Promise<FeatureFlagResponse> {
  const { personalApiKey, host, projectId } = getApiConfig();

  const url = `${host}/api/projects/${projectId}/feature_flags/${key}/`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${personalApiKey}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `PostHog API error (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    console.log(`[PostHog API] Updated feature flag: ${key}`);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update feature flag: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Delete a feature flag
 * @param key - Feature flag key
 */
export async function deleteFeatureFlag(key: string): Promise<void> {
  const { personalApiKey, host, projectId } = getApiConfig();

  const url = `${host}/api/projects/${projectId}/feature_flags/${key}/`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${personalApiKey}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      throw new Error(
        `PostHog API error (${response.status}): ${errorText}`
      );
    }

    console.log(`[PostHog API] Deleted feature flag: ${key}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete feature flag: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Create all default feature flags for the app
 * This creates the flags defined in FEATURE_FLAGS if they don't exist
 */
export async function createDefaultFeatureFlags(): Promise<void> {
  const { FEATURE_FLAGS } = await import("@/lib/featureFlags");

  const defaultFlags = [
    {
      key: FEATURE_FLAGS.SPARK_BETA,
      name: "Spark Beta",
      description: "Beta access to Spark feature",
      active: false,
    },
    {
      key: FEATURE_FLAGS.MUSE_AI,
      name: "Muse AI",
      description: "Muse AI feature access",
      active: false,
    },
    {
      key: FEATURE_FLAGS.ORBIT_EXPERIMENTAL,
      name: "Orbit Experimental",
      description: "Experimental Orbit view feature",
      active: false,
    },
    {
      key: FEATURE_FLAGS.VAULT_ENHANCED,
      name: "Vault Enhanced",
      description: "Enhanced vault features",
      active: false,
    },
    {
      key: FEATURE_FLAGS.KLUTR_GLOBAL_DISABLE,
      name: "Klutr Global Disable",
      description: "Global kill switch - disables all experimental features when enabled",
      active: false,
    },
  ];

  console.log("[PostHog API] Creating default feature flags...");

  for (const flag of defaultFlags) {
    try {
      await createFeatureFlag({
        ...flag,
        ensure_unique: true, // Skip if already exists
      });
    } catch (error) {
      console.error(`[PostHog API] Failed to create flag "${flag.key}":`, error);
    }
  }

  console.log("[PostHog API] Finished creating default feature flags");
}

