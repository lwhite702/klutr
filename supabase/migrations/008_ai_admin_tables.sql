-- AI Engine Admin Tables Migration
-- Created: 2025-11-17
-- Purpose: Enable admin monitoring and control of AI features

-- ========================================
-- AI Usage Logs Table
-- ========================================

CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL, -- Nullable for system operations
  feature TEXT NOT NULL, -- Feature name (spark, muse, classify-note, etc.)
  tier TEXT NOT NULL, -- CHEAP, MEDIUM, EXPENSIVE, CHAT, CODE, EMBEDDING, LEGACY
  model TEXT NOT NULL, -- Actual model used (gpt-4o-mini, claude-3-5-sonnet, etc.)
  provider TEXT NOT NULL, -- gateway, openai, anthropic
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost DECIMAL(10, 6) NOT NULL DEFAULT 0, -- Cost in USD
  success BOOLEAN NOT NULL DEFAULT TRUE,
  duration_ms INTEGER NOT NULL DEFAULT 0, -- Request duration in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for admin analytics
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_feature ON ai_usage_logs(feature);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON ai_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_tier ON ai_usage_logs(tier);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_model ON ai_usage_logs(model);

-- ========================================
-- AI Error Logs Table
-- ========================================

CREATE TABLE IF NOT EXISTS ai_error_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  feature TEXT NOT NULL,
  tier TEXT NOT NULL,
  model TEXT NOT NULL,
  provider TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT, -- Optional stack trace for debugging
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for error monitoring
CREATE INDEX IF NOT EXISTS idx_ai_error_logs_feature ON ai_error_logs(feature);
CREATE INDEX IF NOT EXISTS idx_ai_error_logs_created_at ON ai_error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_error_logs_user_id ON ai_error_logs(user_id);

-- ========================================
-- AI Overrides Table
-- ========================================

CREATE TABLE IF NOT EXISTS ai_overrides (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  override_type TEXT NOT NULL, -- 'model', 'tier', 'routing'
  override_key TEXT NOT NULL, -- Feature name or tier name
  override_value TEXT NOT NULL, -- Model ID, tier name, or provider order JSON
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL, -- Admin who created override
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(override_type, override_key)
);

-- Indexes for override lookups
CREATE INDEX IF NOT EXISTS idx_ai_overrides_type ON ai_overrides(override_type);
CREATE INDEX IF NOT EXISTS idx_ai_overrides_enabled ON ai_overrides(enabled);

-- ========================================
-- AI Feature Flags Table
-- ========================================

CREATE TABLE IF NOT EXISTS ai_feature_flags (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  feature_name TEXT NOT NULL UNIQUE, -- Feature identifier (spark, muse, classify-note, etc.)
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT, -- Human-readable description
  tier_override TEXT, -- Optional default tier override for this feature
  model_override TEXT, -- Optional model override for this feature
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for feature flag lookups
CREATE INDEX IF NOT EXISTS idx_ai_feature_flags_enabled ON ai_feature_flags(enabled);
CREATE INDEX IF NOT EXISTS idx_ai_feature_flags_name ON ai_feature_flags(feature_name);

-- ========================================
-- AI Cost History Table (Aggregated)
-- ========================================

CREATE TABLE IF NOT EXISTS ai_cost_history (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  period_type TEXT NOT NULL, -- 'hourly', 'daily', 'weekly', 'monthly'
  feature TEXT NOT NULL,
  model TEXT NOT NULL,
  provider TEXT NOT NULL,
  total_requests INTEGER NOT NULL DEFAULT 0,
  total_input_tokens BIGINT NOT NULL DEFAULT 0,
  total_output_tokens BIGINT NOT NULL DEFAULT 0,
  total_cost DECIMAL(10, 6) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(period_start, period_type, feature, model, provider)
);

-- Indexes for cost analytics
CREATE INDEX IF NOT EXISTS idx_ai_cost_history_period ON ai_cost_history(period_start DESC, period_type);
CREATE INDEX IF NOT EXISTS idx_ai_cost_history_feature ON ai_cost_history(feature);
CREATE INDEX IF NOT EXISTS idx_ai_cost_history_model ON ai_cost_history(model);

-- ========================================
-- AI Kill Switch Table (Global Control)
-- ========================================

CREATE TABLE IF NOT EXISTS ai_kill_switch (
  id TEXT PRIMARY KEY DEFAULT 'global', -- Single row table
  enabled BOOLEAN NOT NULL DEFAULT FALSE, -- When true, all AI features are disabled
  reason TEXT, -- Why the kill switch was activated
  activated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  activated_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default kill switch row
INSERT INTO ai_kill_switch (id, enabled) VALUES ('global', FALSE) ON CONFLICT (id) DO NOTHING;

-- ========================================
-- RLS Policies for AI Admin Tables
-- ========================================

-- AI tables are admin-only, no user access
-- Service role bypasses RLS for admin API routes

ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cost_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_kill_switch ENABLE ROW LEVEL SECURITY;

-- No user policies - admin-only tables accessed via service role
-- This ensures only authenticated admin API routes can read/write these tables

-- ========================================
-- Default AI Feature Flags
-- ========================================

INSERT INTO ai_feature_flags (feature_name, enabled, description) VALUES
  ('classify-note', TRUE, 'AI-powered note classification and tagging'),
  ('spark', TRUE, 'Contextual AI assistant for note analysis'),
  ('muse', TRUE, 'Creative idea remixing engine'),
  ('mindstorm', TRUE, 'Automatic note clustering'),
  ('weekly-insights', TRUE, 'AI-generated weekly summaries'),
  ('stacks', TRUE, 'Smart stack generation'),
  ('embeddings', TRUE, 'Note embedding generation for similarity search')
ON CONFLICT (feature_name) DO NOTHING;

-- ========================================
-- Comments for Documentation
-- ========================================

COMMENT ON TABLE ai_usage_logs IS 'Tracks all AI API calls for monitoring and cost analysis';
COMMENT ON TABLE ai_error_logs IS 'Records AI errors for debugging and reliability monitoring';
COMMENT ON TABLE ai_overrides IS 'Admin-configured model and tier overrides for specific features';
COMMENT ON TABLE ai_feature_flags IS 'Admin toggles for enabling/disabling AI features';
COMMENT ON TABLE ai_cost_history IS 'Aggregated cost data for reporting and budgeting';
COMMENT ON TABLE ai_kill_switch IS 'Emergency kill switch to disable all AI features';

