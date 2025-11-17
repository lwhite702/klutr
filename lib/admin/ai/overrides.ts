/**
 * AI Override Admin Adapters
 * 
 * Provides admin-level control over AI model selection and routing
 */

import { supabaseAdmin } from "@/lib/supabase";
import { setAdminOverrides } from "@/lib/ai/provider";
import type { ModelTier, AIProvider } from "@/lib/ai/provider";

export interface ModelOverride {
  id: string;
  overrideType: "model" | "tier" | "routing";
  overrideKey: string; // Feature name or tier name
  overrideValue: string; // Model ID, tier name, or provider order JSON
  enabled: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all active AI overrides
 */
export async function getAIOverrides() {
  const { data, error } = await supabaseAdmin
    .from("ai_overrides")
    .select("*")
    .eq("enabled", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

/**
 * Set model override for a specific tier
 * Example: Override CHEAP tier to use gpt-5 instead of gpt-4o-mini
 */
export async function setModelOverride(params: {
  tier: ModelTier;
  modelId: string;
  adminUserId: string;
}) {
  const { tier, modelId, adminUserId } = params;

  const { data, error } = await supabaseAdmin
    .from("ai_overrides")
    .upsert(
      {
        override_type: "model",
        override_key: tier,
        override_value: modelId,
        enabled: true,
        created_by: adminUserId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "override_type,override_key" }
    )
    .select()
    .single();

  if (error) throw error;

  // Update in-memory overrides
  await loadOverridesIntoMemory();

  return data;
}

/**
 * Set tier override for a specific feature
 * Example: Force "spark" feature to use EXPENSIVE tier instead of default
 */
export async function setTierOverride(params: {
  feature: string;
  tier: ModelTier;
  adminUserId: string;
}) {
  const { feature, tier, adminUserId } = params;

  const { data, error } = await supabaseAdmin
    .from("ai_overrides")
    .upsert(
      {
        override_type: "tier",
        override_key: feature,
        override_value: tier,
        enabled: true,
        created_by: adminUserId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "override_type,override_key" }
    )
    .select()
    .single();

  if (error) throw error;

  // Update in-memory overrides
  await loadOverridesIntoMemory();

  return data;
}

/**
 * Set routing override (provider preference order)
 * Example: Set order to ["anthropic", "openai"] to prefer Claude over GPT
 */
export async function setRoutingOverride(params: {
  providerOrder: string[];
  adminUserId: string;
}) {
  const { providerOrder, adminUserId } = params;

  const { data, error } = await supabaseAdmin
    .from("ai_overrides")
    .upsert(
      {
        override_type: "routing",
        override_key: "global",
        override_value: JSON.stringify(providerOrder),
        enabled: true,
        created_by: adminUserId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "override_type,override_key" }
    )
    .select()
    .single();

  if (error) throw error;

  // Update in-memory overrides
  await loadOverridesIntoMemory();

  return data;
}

/**
 * Remove an override
 */
export async function removeOverride(overrideId: string) {
  const { error } = await supabaseAdmin
    .from("ai_overrides")
    .update({ enabled: false, updated_at: new Date().toISOString() })
    .eq("id", overrideId);

  if (error) throw error;

  // Update in-memory overrides
  await loadOverridesIntoMemory();
}

/**
 * Load overrides from database into in-memory cache
 * Called on server startup and after any override changes
 */
export async function loadOverridesIntoMemory() {
  try {
    const overrides = await getAIOverrides();

    const models: Record<string, string> = {};
    const tierOverrides: Record<string, ModelTier> = {};
    let routing: string[] = [];

    overrides.forEach((override: any) => {
      if (!override.enabled) return;

      switch (override.override_type) {
        case "model":
          models[override.override_key] = override.override_value;
          break;
        case "tier":
          tierOverrides[override.override_key] =
            override.override_value as ModelTier;
          break;
        case "routing":
          routing = JSON.parse(override.override_value);
          break;
      }
    });

    setAdminOverrides({ models, tierOverrides, routing });

    console.log("[AI Admin] Loaded overrides from database", {
      models,
      tierOverrides,
      routing,
    });
  } catch (error) {
    console.error("[AI Admin] Failed to load overrides:", error);
  }
}

