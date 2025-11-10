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
const isPreDeploy = args.includes('--predeploy');
const isPostDeploy = args.includes('--postdeploy');
const verbose = args.includes('--verbose');
const urlIndex = args.indexOf('--url');
const deployedUrl = urlIndex >= 0 && args[urlIndex + 1] ? args[urlIndex + 1] : null;

if (!isPreDeploy && !isPostDeploy) {
  console.error('Error: Must specify --predeploy or --postdeploy');
  process.exit(1);
}

if (isPostDeploy && !deployedUrl) {
  console.error('Error: --postdeploy requires --url <deployed_url>');
  process.exit(1);
}

// Results tracking
const checks = [];
let startTime = Date.now();

/**
 * Mask sensitive values in logs
 */
function maskSecret(value) {
  if (!value || typeof value !== 'string') return '***';
  if (value.length <= 8) return '***';
  return `${value.substring(0, 4)}****${value.substring(value.length - 4)}`;
}

/**
 * Sleep utility for retries
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry wrapper with exponential backoff
 */
async function withRetry(name, fn, retries = MAX_RETRIES) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries - 1) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        if (verbose) {
          console.log(`[${name}] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        }
        await sleep(delay);
      }
    }
  }
  throw lastError;
}

/**
 * Timeout wrapper
 */
function withTimeout(promise, timeoutMs, name) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${name} timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

/**
 * Run a validation check
 */
async function runCheck(name, checkFn) {
  const checkStart = Date.now();
  let ok = false;
  let details = null;
  
  try {
    if (verbose) {
      console.log(`[${name}] Starting check...`);
    }
    
    await withTimeout(
      withRetry(name, checkFn),
      DEFAULT_TIMEOUT_MS,
      name
    );
    
    ok = true;
    const duration = Date.now() - checkStart;
    if (verbose) {
      console.log(`[${name}] ✓ Passed (${duration}ms)`);
    }
    
    return { name, ok, durationMs: duration, details: null };
  } catch (error) {
    const duration = Date.now() - checkStart;
    details = error.message || String(error);
    
    if (verbose) {
      console.error(`[${name}] ✗ Failed (${duration}ms): ${details}`);
    }
    
    return { name, ok: false, durationMs: duration, details };
  }
}

/**
 * Check 1: Environment variables
 */
async function checkEnv() {
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
    console.log('[env] Required environment variables present');
    console.log(`[env] OPENAI_API_KEY: ${maskSecret(process.env.OPENAI_API_KEY)}`);
    console.log(`[env] SUPABASE_URL: ${process.env.SUPABASE_URL}`);
    console.log(`[env] CRON_SECRET: ${maskSecret(process.env.CRON_SECRET)}`);
  }
}

/**
 * Check 2: OpenAI Embedding
 */
async function checkOpenAIEmbedding() {
  const { default: OpenAI } = await import('openai');
  
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: 'klutr validation test',
  });
  
  if (!response.data || !response.data[0] || !Array.isArray(response.data[0].embedding)) {
    throw new Error('Invalid embedding response format');
  }
  
  if (response.data[0].embedding.length === 0) {
    throw new Error('Empty embedding array');
  }
  
  if (verbose) {
    console.log(`[openai-embed] Generated embedding with ${response.data[0].embedding.length} dimensions`);
  }
}

/**
 * Check 3: OpenAI Classification
 */
async function checkOpenAIClassification() {
  const { default: OpenAI } = await import('openai');
  
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a classification assistant. Respond with JSON only: {"category": "test", "confidence": 1.0}',
      },
      {
        role: 'user',
        content: 'This is a validation test message.',
      },
    ],
    temperature: 0,
    max_tokens: 50,
  });
  
  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response content from OpenAI');
  }
  
  // Try to parse as JSON
  try {
    JSON.parse(content);
  } catch {
    // If not JSON, that's okay - just check it's not empty
    if (content.trim().length === 0) {
      throw new Error('Empty response from OpenAI');
    }
  }
  
  if (verbose) {
    console.log(`[openai-classify] Received response: ${content.substring(0, 100)}...`);
  }
}

/**
 * Check 4: Supabase Database
 */
async function checkSupabaseDB() {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  
  // Try a simple query using RPC or direct query
  const { data, error } = await supabase.rpc('exec_sql', { 
    sql: 'SELECT 1 as test' 
  }).catch(async () => {
    // Fallback: try direct query via REST
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`,
      {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql: 'SELECT 1 as test' }),
      }
    );
    
    if (!response.ok) {
      // Try even simpler: just query a table
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (userError) throw userError;
      return { data: users, error: null };
    }
    
    return { data: await response.json(), error: null };
  });
  
  if (error) {
    // Last resort: try Prisma if available
    try {
      // Dynamic import to avoid bundling issues
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.$queryRaw`SELECT 1`;
      await prisma.$disconnect();
      if (verbose) {
        console.log('[supabase-db] Connected via Prisma fallback');
      }
      return;
    } catch (prismaError) {
      throw new Error(`DB query failed: ${error.message || error}`);
    }
  }
  
  if (verbose) {
    console.log('[supabase-db] Database query successful');
  }
}

/**
 * Check 5: Supabase Auth
 */
async function checkSupabaseAuth() {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  
  // Use admin API to list users (lightweight check)
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1,
  });
  
  if (error) {
    throw new Error(`Auth check failed: ${error.message}`);
  }
  
  if (verbose) {
    console.log('[supabase-auth] Auth service accessible');
  }
}

/**
 * Check 6: Supabase Storage
 */
async function checkSupabaseStorage() {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  
  const testFileName = `klutr-validate-${Date.now()}.txt`;
  const testContent = 'klutr validation test file';
  // Try common bucket names, starting with 'public'
  const testBuckets = ['public', 'files', 'uploads'];
  let testBucket = testBuckets[0];
  let lastError = null;
  
  // Try each bucket until one works
  for (const bucket of testBuckets) {
    try {
      testBucket = bucket;
      // Upload test file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(testBucket)
        .upload(testFileName, testContent, {
          contentType: 'text/plain',
          upsert: false,
        });
      
      if (uploadError) {
        lastError = uploadError;
        continue; // Try next bucket
      }
      
      // If upload succeeded, break and continue with download
      break;
    } catch (error) {
      lastError = error;
      continue;
    }
  }
  
  // If all buckets failed, throw error
  if (lastError) {
    throw new Error(`Storage upload failed for all buckets (${testBuckets.join(', ')}): ${lastError.message || lastError}`);
  }
  
  try {
    if (verbose) {
      console.log(`[supabase-storage] Uploaded test file to bucket '${testBucket}': ${testFileName}`);
    }
    
    // Download and verify
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from(testBucket)
      .download(testFileName);
    
    if (downloadError) {
      throw new Error(`Download failed: ${downloadError.message}`);
    }
    
    const downloadedText = await downloadData.text();
    if (downloadedText !== testContent) {
      throw new Error('Downloaded content does not match uploaded content');
    }
    
    if (verbose) {
      console.log('[supabase-storage] Download and verification successful');
    }
    
    // Cleanup: delete test file
    const { error: deleteError } = await supabase.storage
      .from(testBucket)
      .remove([testFileName]);
    
    if (deleteError && verbose) {
      console.warn(`[supabase-storage] Warning: Failed to cleanup test file: ${deleteError.message}`);
    } else if (verbose) {
      console.log('[supabase-storage] Test file cleaned up');
    }
  } catch (error) {
    // Attempt cleanup on error
    try {
      await supabase.storage.from(testBucket).remove([testFileName]);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

/**
 * Check 7: CRON_SECRET validation endpoint
 */
async function checkCronSecret() {
  const url = isPostDeploy 
    ? `${deployedUrl}/api/cron/verify`
    : 'http://localhost:3000/api/cron/verify';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CRON_SECRET check failed: ${response.status} ${text}`);
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(`CRON_SECRET validation returned success: false`);
  }
  
  if (verbose) {
    console.log('[cron-secret] CRON_SECRET validation successful');
  }
}

/**
 * Check 8: App health check (post-deploy only)
 */
async function checkAppHealth() {
  if (!isPostDeploy) {
    return; // Skip for pre-deploy
  }
  
  const url = `${deployedUrl}/api/health/check-deploy`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Health check failed: ${response.status} ${text}`);
  }
  
  const data = await response.json();
  if (data.status !== 'ok') {
    throw new Error(`Health check returned status: ${data.status}`);
  }
  
  if (verbose) {
    console.log('[app-health] Deployed app health check passed');
    console.log(`[app-health] DB connected: ${data.dbConnected || 'unknown'}`);
    console.log(`[app-health] Feature flags loaded: ${data.featureFlagsLoaded || 'unknown'}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`\n🔍 Starting ${isPreDeploy ? 'pre-deploy' : 'post-deploy'} validation...\n`);
  
  startTime = Date.now();
  
  // Run all checks
  checks.push(await runCheck('env', checkEnv));
  checks.push(await runCheck('openai-embed', checkOpenAIEmbedding));
  checks.push(await runCheck('openai-classify', checkOpenAIClassification));
  checks.push(await runCheck('supabase-db', checkSupabaseDB));
  checks.push(await runCheck('supabase-auth', checkSupabaseAuth));
  checks.push(await runCheck('supabase-storage', checkSupabaseStorage));
  
  if (isPostDeploy) {
    checks.push(await runCheck('cron-secret', checkCronSecret));
    checks.push(await runCheck('app-health', checkAppHealth));
  } else {
    // For pre-deploy, we can't test cron-secret endpoint without a running server
    // Skip it or start a test server (complexity not worth it for pre-deploy)
    if (verbose) {
      console.log('[cron-secret] Skipped in pre-deploy mode (requires running server)');
    }
  }
  
  // Generate summary
  const totalDuration = Date.now() - startTime;
  const success = checks.every(c => c.ok);
  const summary = {
    success,
    checks,
    timestamp: new Date().toISOString(),
    mode: isPreDeploy ? 'pre-deploy' : 'post-deploy',
    totalDurationMs: totalDuration,
  };
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('Validation Summary');
  console.log('='.repeat(60));
  console.log(JSON.stringify(summary, null, 2));
  console.log('='.repeat(60) + '\n');
  
  // Save to file
  const outputDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputFile = path.join(outputDir, `deploy-validate-${Date.now()}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));
  console.log(`Summary saved to: ${outputFile}\n`);
  
  // Print remediation hints for failures
  if (!success) {
    console.log('❌ Validation failed. Remediation hints:\n');
    
    checks.forEach(check => {
      if (!check.ok) {
        console.log(`  [${check.name}]`);
        switch (check.name) {
          case 'env':
            console.log('    → Verify all required environment variables are set in Doppler or .env');
            break;
          case 'openai-embed':
          case 'openai-classify':
            console.log('    → Verify OPENAI_API_KEY is valid and has quota');
            console.log('    → Test with: curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"');
            break;
          case 'supabase-db':
            console.log('    → Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correct');
            console.log('    → Check Supabase dashboard for database status');
            break;
          case 'supabase-auth':
            console.log('    → Verify SUPABASE_SERVICE_ROLE_KEY has admin permissions');
            console.log('    → Check Supabase Auth settings');
            break;
          case 'supabase-storage':
            console.log('    → Verify storage bucket exists and CORS is configured');
            console.log('    → Check storage policies allow service role key access');
            break;
          case 'cron-secret':
            console.log('    → Verify CRON_SECRET matches deployed app configuration');
            console.log('    → Check /api/cron/verify endpoint is accessible');
            break;
          case 'app-health':
            console.log('    → Verify deployed app is running and accessible');
            console.log('    → Check /api/health/check-deploy endpoint');
            break;
        }
        if (check.details) {
          console.log(`    → Error: ${check.details}`);
        }
        console.log('');
      }
    });
    
    console.log('To rollback deployment:');
    console.log('  - In Vercel dashboard, select previous deployment and promote it to production');
    console.log('  - Or use: vercel --prod --rollback\n');
  } else {
    console.log('✅ All validation checks passed!\n');
  }
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Run main
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
