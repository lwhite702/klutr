/**
 * Feature flag constants
 * Use these constants instead of string literals to avoid typos
 */
export const FEATURE_FLAGS = {
  SPARK_BETA: "spark-beta",
  MUSE_AI: "muse-ai",
  ORBIT_EXPERIMENTAL: "orbit-experimental",
  VAULT_ENHANCED: "vault-enhanced",
  KLUTR_GLOBAL_DISABLE: "klutr-global-disable", // Kill switch
  CHAT_INTERFACE: "chat-interface",
  FILE_DROPS: "file-drops",
  VOICE_CAPTURE: "voice-capture",
  SMART_THREADS: "smart-threads",
  EMBEDDINGS: "embeddings",
  CLASSIFICATION: "classification",
} as const;

export type FeatureFlag = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];
