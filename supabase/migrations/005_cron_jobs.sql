-- Migration: Create Supabase Cron jobs for scheduled Edge Function invocations
-- This migration sets up pg_cron jobs that call Edge Functions on a schedule
-- Requires: pg_cron and pg_net extensions (enabled by default on Supabase)

-- Step 1: Store secrets in Supabase Vault for secure access
-- Note: anon_key should be set manually via Dashboard or updated here with actual value
-- To update anon_key: SELECT vault.update_secret('YOUR_ANON_KEY', 'anon_key');

-- Store project URL (idempotent - only creates if doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM vault.secrets WHERE name = 'project_url'
  ) THEN
    PERFORM vault.create_secret('https://noaspvjylfthpfwunixy.supabase.co', 'project_url');
  END IF;
END $$;

-- Store anon_key (publishable key) - NOTE: Update with your actual anon_key
-- This can be found in Supabase Dashboard → Settings → API → anon/public key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM vault.secrets WHERE name = 'anon_key'
  ) THEN
    -- Anon key (publishable key) for Edge Function authentication
    PERFORM vault.create_secret('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vYXNwdmp5bGZ0aHBmd3VuaXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2OTM2MjcsImV4cCI6MjA3NzI2OTYyN30.yLD9YdvECDv4dKmWCHl317FjyaKUMgmd-eCy0lMIoOU', 'anon_key');
  END IF;
END $$;

-- Step 2: Create cron jobs for Edge Functions
-- Each job uses pg_cron to schedule and pg_net to make HTTP requests

-- Job 1: nightly-cluster - Daily at 06:00 UTC (02:00 ET)
-- Embeds notes and clusters them for all users
SELECT cron.schedule(
  'nightly-cluster',
  '0 6 * * *', -- Daily at 06:00 UTC
  $$
  SELECT
    net.http_post(
      url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/nightly-cluster',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
      ),
      body := jsonb_build_object('scheduled', true, 'timestamp', now())
    ) AS request_id;
  $$
);

-- Job 2: nightly-stacks - Daily at 06:05 UTC (02:05 ET)
-- Rebuilds smart stacks for all users
SELECT cron.schedule(
  'nightly-stacks',
  '5 6 * * *', -- Daily at 06:05 UTC
  $$
  SELECT
    net.http_post(
      url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/nightly-stacks',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
      ),
      body := jsonb_build_object('scheduled', true, 'timestamp', now())
    ) AS request_id;
  $$
);

-- Job 3: weekly-insights - Mondays at 07:00 UTC (03:00 ET)
-- Generates weekly insights for all users
SELECT cron.schedule(
  'weekly-insights',
  '0 7 * * 1', -- Mondays at 07:00 UTC
  $$
  SELECT
    net.http_post(
      url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/weekly-insights',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
      ),
      body := jsonb_build_object('scheduled', true, 'timestamp', now())
    ) AS request_id;
  $$
);

-- Verify jobs were created
-- You can check cron.job table to see all scheduled jobs
-- SELECT * FROM cron.job WHERE jobname IN ('nightly-cluster', 'nightly-stacks', 'weekly-insights');

