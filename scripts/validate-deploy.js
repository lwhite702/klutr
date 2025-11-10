#!/usr/bin/env node
/**
 * Deployment Validation Script
 * 
 * Validates OpenAI and Supabase connections before and after deployment.
 * Supports pre-deploy (local env) and post-deploy (production URL) modes.
 * 
 * Usage:
 *   node ./scripts/validate-deploy.js --predeploy [--verbose]
 *   node ./scripts/validate-deploy.js --postdeploy --url <deployed_url> [--verbose]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_TIMEOUT_MS = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 400; // Exponential backoff base

// Parse command line arguments
const args = process.argv.slice(2);
const isPredeploy = args.includes('--predeploy');
const isPostdeploy = args.includes('--postdeploy');
const verbose = args.includes('--verbose');
const urlIndex = args.indexOf('--url');
const deployedUrl = urlIndex >= 0 && args[urlIndex + 1] ? args[urlIndex + 1] : null;

if (!isPredeploy && !isPostdeploy) {
  console.error('Error: Must specify --predeploy or --postdeploy');
  process.exit(1);
}

if (isPostdeploy && !deployedUrl) {
  console.error('Error: --postdeploy requires --url <deployed_url>');
  process.exit(1);
}

// Load environment variables (from Doppler or .env fallback)
function loadEnv() {
  // In CI, env vars should be injected by Doppler or CI system
  // For local dev, we can read from .env if it exists
  const envPath = path.join(__dirname, '..', 'apps', 'app', '.env.local');
  if (fs.existsSync(envPath) && !process.env.DOPPLER_TOKEN) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim();
      }
    });
  }
}

loadEnv();

// Mask secrets in logs
function maskSecret(value) {
  if (!value || typeof value !== 'string') return '***';
  if (value.length <= 8) return '***';
  return value.substring(0, 4) + '****' + value.substring(value.length - 4);
}

// Retry wrapper with exponential backoff
async function retryWithBackoff(fn, name, maxRetries = MAX_RETRIES) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        if (verbose) {
          console.log(`  Retry ${attempt + 1}/${maxRetries} for ${name} after ${delay}ms...`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

// Timeout wrapper
function withTimeout(promise, timeoutMs, name) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${name} timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

// Fetch with timeout
async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// Validation check result
class CheckResult {
  constructor(name, ok, durationMs, details = null, error = null) {
    this.name = name;
    this.ok = ok;
    this.durationMs = durationMs;
    this.details = details;
    this.error = error ? error.message : null;
  }
}

// Run a validation check
async function runCheck(name, checkFn) {
  const startTime = Date.now();
  try {
    if (verbose) {
      console.log(`[CHECK] ${name}...`);
    }
    const result = await withTimeout(
      retryWithBackoff(checkFn, name),
      DEFAULT_TIMEOUT_MS,
      name
    );
    const durationMs = Date.now() - startTime;
    if (verbose) {
      console.log(`[OK] ${name} (${durationMs}ms)`);
    }
    return new CheckResult(name, true, durationMs, result);
  } catch (error) {
    const durationMs = Date.now() - startTime;
    if (verbose) {
      console.error(`[FAIL] ${name} (${durationMs}ms): ${error.message}`);
    }
    return new CheckResult(name, false, durationMs, null, error);
  }
}

// Validation checks

async function checkEnvVars() {
  const required = [
    'OPENAI_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'CRON_SECRET',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
  
  if (verbose) {
    console.log(`  Found all required env vars`);
    console.log(`  OPENAI_API_KEY: ${maskSecret(process.env.OPENAI_API_KEY)}`);
    console.log(`  SUPABASE_URL: ${process.env.SUPABASE_URL}`);
    console.log(`  CRON_SECRET: ${maskSecret(process.env.CRON_SECRET)}`);
  }
  
  return { found: required.length };
}

async function checkOpenAIEmbedding() {
  const response = await fetchWithTimeout(
    'https://api.openai.com/v1/embeddings',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: 'klutr validation test',
      }),
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API returned ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
    throw new Error('Invalid embedding response format');
  }
  
  const embedding = data.data[0].embedding;
  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error('Invalid embedding array');
  }
  
  return { embeddingLength: embedding.length };
}

async function checkOpenAIClassification() {
  const response = await fetchWithTimeout(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: 'Classify this note: "Meeting with team tomorrow". Respond with JSON: {"type": "task"}',
          },
        ],
        max_tokens: 50,
        temperature: 0,
      }),
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API returned ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
    throw new Error('Invalid chat completion response format');
  }
  
  return { hasResponse: true };
}

async function checkSupabaseDB() {
  // Test Supabase REST API connectivity by accessing the root endpoint
  // This verifies the service role key can authenticate and access the API
  const response = await fetchWithTimeout(
    `${process.env.SUPABASE_URL}/rest/v1/`,
    {
      method: 'GET',
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Accept': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    // 401/403 means auth issue, 404 means wrong URL, 500+ means service issue
    if (response.status === 401 || response.status === 403) {
      throw new Error(`Supabase authentication failed: Check SUPABASE_SERVICE_ROLE_KEY`);
    }
    throw new Error(`Supabase REST API returned ${response.status}: ${errorText}`);
  }
  
  // Verify we got a valid response (should be HTML or JSON)
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json') || contentType.includes('text/html')) {
    return { connected: true, apiAccessible: true };
  }
  
  return { connected: true };
}

async function checkSupabaseAuth() {
  // Use Supabase Admin API to list users (lightweight check)
  const response = await fetchWithTimeout(
    `${process.env.SUPABASE_URL}/auth/v1/admin/users?limit=1`,
    {
      method: 'GET',
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  
  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    throw new Error(`Supabase Auth returned ${response.status}: ${errorText}`);
  }
  
  return { accessible: true };
}

async function checkSupabaseStorage() {
  const timestamp = Date.now();
  const testFileName = `klutr-validate-${timestamp}.txt`;
  const testContent = `Validation test file created at ${new Date().toISOString()}`;
  const bucketName = process.env.SUPABASE_BUCKET_ATTACHMENTS || 'attachments';
  
  try {
    // Upload using Supabase Storage API with proper content-type header
    const uploadResponse = await fetchWithTimeout(
      `${process.env.SUPABASE_URL}/storage/v1/object/${bucketName}/${testFileName}`,
      {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'text/plain',
          'x-upsert': 'true', // Allow overwriting if file exists
        },
        body: testContent,
      }
    );
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      // If bucket doesn't exist, that's a configuration issue
      if (uploadResponse.status === 404) {
        throw new Error(`Storage bucket '${bucketName}' not found. Check SUPABASE_BUCKET_ATTACHMENTS env var.`);
      }
      throw new Error(`Storage upload failed: ${uploadResponse.status} - ${errorText}`);
    }
    
    // Try to download the file (may be private bucket, so use signed URL or service role)
    // First try public access
    let downloadResponse = await fetchWithTimeout(
      `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucketName}/${testFileName}`,
      {
        method: 'GET',
      }
    );
    
    // If public access fails, try with service role (for private buckets)
    if (!downloadResponse.ok) {
      downloadResponse = await fetchWithTimeout(
        `${process.env.SUPABASE_URL}/storage/v1/object/${bucketName}/${testFileName}`,
        {
          method: 'GET',
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        }
      );
    }
    
    if (!downloadResponse.ok) {
      throw new Error(`Storage download failed: ${downloadResponse.status} - ${await downloadResponse.text()}`);
    }
    
    const downloadedContent = await downloadResponse.text();
    if (downloadedContent !== testContent) {
      throw new Error('Downloaded content does not match uploaded content');
    }
    
    // Cleanup: Delete the test file
    const deleteResponse = await fetchWithTimeout(
      `${process.env.SUPABASE_URL}/storage/v1/object/${bucketName}/${testFileName}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );
    
    if (!deleteResponse.ok && deleteResponse.status !== 404) {
      const errorText = await deleteResponse.text();
      console.warn(`Warning: Failed to cleanup test file ${testFileName}: ${deleteResponse.status} - ${errorText}`);
    }
    
    return { uploaded: true, downloaded: true, cleaned: true, bucket: bucketName };
  } catch (error) {
    // Attempt cleanup on error
    try {
      await fetchWithTimeout(
        `${process.env.SUPABASE_URL}/storage/v1/object/${bucketName}/${testFileName}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        }
      );
    } catch (cleanupError) {
      // Ignore cleanup errors - log but don't fail validation
      if (verbose) {
        console.warn(`Cleanup attempt failed (non-critical): ${cleanupError.message}`);
      }
    }
    throw error;
  }
}

async function checkCronSecret() {
  if (isPredeploy) {
    // For pre-deploy, try localhost but don't fail if server isn't running
    // This allows validation to pass in CI where server isn't running
    const url = 'http://localhost:3000/api/cron/verify';
    
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CRON_SECRET}`,
            'Content-Type': 'application/json',
          },
        },
        2000 // Shorter timeout for localhost check
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`CRON_SECRET check returned ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(`CRON_SECRET validation failed: ${data.error || 'Unknown error'}`);
      }
      
      return { validated: true, mode: 'local' };
    } catch (error) {
      // If localhost isn't available, skip the check but warn
      if (error.message.includes('ECONNREFUSED') || error.message.includes('timed out')) {
        if (verbose) {
          console.warn('  Warning: Local server not running, skipping CRON_SECRET endpoint check');
        }
        return { skipped: true, reason: 'Local server not running' };
      }
      throw error;
    }
  } else {
    // Post-deploy: must validate against deployed URL
    const url = `${deployedUrl}/api/cron/verify`;
    
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CRON_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CRON_SECRET check returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(`CRON_SECRET validation failed: ${data.error || 'Unknown error'}`);
    }
    
    return { validated: true, mode: 'deployed' };
  }
}

async function checkDeployHealth() {
  if (!isPostdeploy) {
    return { skipped: true, reason: 'Pre-deploy mode' };
  }
  
  const url = `${deployedUrl}/api/health/check-deploy`;
  const response = await fetchWithTimeout(url, { method: 'GET' });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Health check returned ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  return data;
}

async function checkFeatureFlags() {
  // Check if PostHog is configured
  if (!process.env.POSTHOG_SERVER_KEY && !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return { skipped: true, reason: 'PostHog not configured' };
  }
  
  // For pre-deploy, we can't easily check feature flags without a running server
  // For post-deploy, we'd check the /api/health/check-deploy endpoint
  if (isPostdeploy) {
    const healthData = await checkDeployHealth();
    return { flagsAvailable: healthData.featureFlags !== undefined };
  }
  
  return { skipped: true, reason: 'Pre-deploy mode - flags checked via health endpoint' };
}

// Main validation function
async function main() {
  const checks = [];
  const startTime = Date.now();
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Deployment Validation: ${isPredeploy ? 'PRE-DEPLOY' : 'POST-DEPLOY'}`);
  if (isPostdeploy) {
    console.log(`Target URL: ${deployedUrl}`);
  }
  console.log(`${'='.repeat(60)}\n`);
  
  // Pre-deploy checks
  if (isPredeploy) {
    checks.push(await runCheck('env-vars', checkEnvVars));
    checks.push(await runCheck('openai-embedding', checkOpenAIEmbedding));
    checks.push(await runCheck('openai-classification', checkOpenAIClassification));
    checks.push(await runCheck('supabase-db', checkSupabaseDB));
    checks.push(await runCheck('supabase-auth', checkSupabaseAuth));
    checks.push(await runCheck('supabase-storage', checkSupabaseStorage));
    checks.push(await runCheck('cron-secret', checkCronSecret));
    checks.push(await runCheck('feature-flags', checkFeatureFlags));
  }
  
  // Post-deploy checks
  if (isPostdeploy) {
    checks.push(await runCheck('env-vars', checkEnvVars));
    checks.push(await runCheck('cron-secret', checkCronSecret));
    checks.push(await runCheck('deploy-health', checkDeployHealth));
    checks.push(await runCheck('feature-flags', checkFeatureFlags));
    // Post-deploy can also check OpenAI/Supabase via the deployed app's endpoints
    // but we'll focus on the health endpoint for now
  }
  
  // Generate summary
  const totalDuration = Date.now() - startTime;
  const passed = checks.filter(c => c.ok).length;
  const failed = checks.filter(c => !c.ok).length;
  const skipped = checks.filter(c => c.details && c.details.skipped).length;
  
  const summary = {
    success: failed === 0,
    mode: isPredeploy ? 'predeploy' : 'postdeploy',
    timestamp: new Date().toISOString(),
    totalDurationMs: totalDuration,
    checks: checks.map(c => ({
      name: c.name,
      ok: c.ok,
      durationMs: c.durationMs,
      details: c.details,
      error: c.error,
    })),
    summary: {
      passed,
      failed,
      skipped,
      total: checks.length,
    },
  };
  
  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('Validation Summary');
  console.log(`${'='.repeat(60)}`);
  console.log(`Mode: ${summary.mode}`);
  console.log(`Duration: ${totalDuration}ms`);
  console.log(`Passed: ${passed} | Failed: ${failed} | Skipped: ${skipped}`);
  console.log(`\n${'='.repeat(60)}\n`);
  
  // Print JSON summary
  console.log(JSON.stringify(summary, null, 2));
  
  // Save summary to file
  const tmpDir = path.join(__dirname, '..', 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  const summaryFile = path.join(tmpDir, `deploy-validate-${Date.now()}.json`);
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  if (verbose) {
    console.log(`\nSummary saved to: ${summaryFile}`);
  }
  
  // Print remediation hints for failures
  if (failed > 0) {
    console.log(`\n${'='.repeat(60)}`);
    console.log('Remediation Hints');
    console.log(`${'='.repeat(60)}\n`);
    
    checks.filter(c => !c.ok).forEach(check => {
      console.log(`[${check.name}]`);
      if (check.name === 'env-vars') {
        console.log('  → Verify all required environment variables are set in Doppler/Vercel');
        console.log('  → Check .env.local for local development');
      } else if (check.name === 'openai-embedding' || check.name === 'openai-classification') {
        console.log('  → Verify OPENAI_API_KEY is valid and has quota');
        console.log('  → Test with: curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"');
      } else if (check.name === 'supabase-db') {
        console.log('  → Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correct');
        console.log('  → Check Supabase dashboard for project status');
      } else if (check.name === 'supabase-auth') {
        console.log('  → Verify SUPABASE_SERVICE_ROLE_KEY has admin permissions');
      } else if (check.name === 'supabase-storage') {
        console.log('  → Verify storage bucket exists and service role key has write permissions');
        console.log('  → Check CORS and bucket policies in Supabase dashboard');
      } else if (check.name === 'cron-secret') {
        console.log('  → Verify CRON_SECRET matches between environment and deployed app');
        console.log('  → Check Authorization header format: Bearer <CRON_SECRET>');
      } else if (check.name === 'deploy-health') {
        console.log('  → Verify deployed app is accessible and health endpoint is working');
        console.log('  → Check Vercel deployment logs for errors');
      }
      if (check.error) {
        console.log(`  Error: ${check.error}`);
      }
      console.log('');
    });
    
    console.log(`\nTo rollback deployment:`);
    console.log(`  → In Vercel dashboard, select previous deployment and promote it to production`);
    console.log(`  → Or use: vercel --prod --rollback (if available)\n`);
  }
  
  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
