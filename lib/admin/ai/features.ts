/**
 * AI Feature Admin Adapters
 * 
 * Provides admin-level control over AI feature flags and kill switch
 */

import { supabaseAdmin } from "@/lib/supabase";
import { setAdminOverrides } from "@/lib/ai/provider";

export interface AIFeatureFlag {
  id: string;
  featureName: string;
  enabled: boolean;
  description: string | null;
  tierOverride: string | null;
  modelOverride: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all AI feature flags
 */
export async function getAIFeatures() {
  const { data, error } = await supabaseAdmin
    .from("ai_feature_flags")
    .select("*")
    .order("feature_name", { ascending: true });

  if (error) throw error;

  return data || [];
}

/**
 * Get specific AI feature flag
 */
export async function getAIFeature(featureName: string) {
  const { data, error } = await supabaseAdmin
    .from("ai_feature_flags")
    .select("*")
    .eq("feature_name", featureName)
    .single();

  if (error) throw error;

  return data;
}

/**
 * Toggle AI feature on/off
 */
export async function toggleAIFeature(params: {
  featureName: string;
  enabled: boolean;
  adminUserId: string;
}) {
  const { featureName, enabled, adminUserId } = params;

  const { data, error } = await supabaseAdmin
    .from("ai_feature_flags")
    .update({
      enabled,
      updated_at: new Date().toISOString(),
    })
    .eq("feature_name", featureName)
    .select()
    .single();

  if (error) throw error;

  // Update in-memory feature flags
  await loadFeatureFlagsIntoMemory();

  return data;
}

/**
 * Disable specific AI feature
 */
export async function disableAIFeature(params: {
  featureName: string;
  adminUserId: string;
}) {
  return toggleAIFeature({
    featureName: params.featureName,
    enabled: false,
    adminUserId: params.adminUserId,
  });
}

/**
 * Enable specific AI feature
 */
export async function enableAIFeature(params: {
  featureName: string;
  adminUserId: string;
}) {
  return toggleAIFeature({
    featureName: params.featureName,
    enabled: true,
    adminUserId: params.adminUserId,
  });
}

/**
 * Get AI kill switch status
 */
export async function getKillSwitchStatus() {
  const { data, error } = await supabaseAdmin
    .from("ai_kill_switch")
    .select("*")
    .eq("id", "global")
    .single();

  if (error) throw error;

  return data;
}

/**
 * Activate AI kill switch (disable all AI features)
 */
export async function activateKillSwitch(params: {
  reason: string;
  adminUserId: string;
}) {
  const { reason, adminUserId } = params;

  const { data, error } = await supabaseAdmin
    .from("ai_kill_switch")
    .update({
      enabled: true,
      reason,
      activated_by: adminUserId,
      activated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", "global")
    .select()
    .single();

  if (error) throw error;

  // Update in-memory kill switch
  setAdminOverrides({ killSwitch: true });

  console.warn("[AI Kill Switch] ACTIVATED", { reason, by: adminUserId });

  return data;
}

/**
 * Deactivate AI kill switch (re-enable AI features)
 */
export async function deactivateKillSwitch(adminUserId: string) {
  const { data, error } = await supabaseAdmin
    .from("ai_kill_switch")
    .update({
      enabled: false,
      reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "global")
    .select()
    .single();

  if (error) throw error;

  // Update in-memory kill switch
  setAdminOverrides({ killSwitch: false });

  console.log("[AI Kill Switch] Deactivated by", adminUserId);

  return data;
}

/**
 * Load feature flags from database into in-memory cache
 */
export async function loadFeatureFlagsIntoMemory() {
  try {
    const features = await getAIFeatures();
    const disabledFeatures = new Set(
      features.filter((f: any) => !f.enabled).map((f: any) => f.feature_name)
    );

    setAdminOverrides({ disabledFeatures });

    // Also load kill switch
    const killSwitch = await getKillSwitchStatus();
    setAdminOverrides({ killSwitch: killSwitch.enabled });

    console.log("[AI Admin] Loaded feature flags from database", {
      disabled: Array.from(disabledFeatures),
      killSwitch: killSwitch.enabled,
    });
  } catch (error) {
    console.error("[AI Admin] Failed to load feature flags:", error);
  }
}

