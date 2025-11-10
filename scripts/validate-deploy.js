#!/usr/bin/env node

/**
 * Deployment Validation Script for Klutr
 * 
 * Validates OpenAI and Supabase connectivity before and after deployment
 * Usage:
 *   node validate-deploy.js --predeploy
 *   node validate-deploy.js --postdeploy --url https://klutr.app
 *   node validate-deploy.js --predeploy --verbose
 * 
 * Exit codes:
 *   0 - All checks passed
 *   1 - One or more checks failed
 *   2 - Invalid usage / missing required env vars
 */

const fs = require('fs');
const path = require('path');

// Parse CLI arguments
const args = process.argv.slice(2);
const isPreDeploy = args.includes('--predeploy');
const isPostDeploy = args.includes('--postdeploy');
const verbose = args.includes('--verbose');
const urlIndex = args.indexOf('--url');
const deployedUrl = urlIndex !== -1 ? args[urlIndex + 1] : null;

// Validation configuration
const TIMEOUT_MS = 10000;
const RETRY_COUNT = 3;
const RETRY_BASE_DELAY_MS = 400;

// Results tracking
const checkResults = [];
let allPassed = true;

// Utility: Mask sensitive tokens in logs
function maskToken(token) {
  if (!token || typeof token !== 'string') return '***';
  return token.length > 8 ? `${token.slice(0, 4)}****${token.slice(-4)}` : '****';
}

// Utility: Log with timestamp
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  if (level === 'error') {
    console.error(`${prefix} ${message}`);
  } else if (level === 'debug' && verbose) {
    console.log(`${prefix} ${message}`);
  } else if (level === 'info') {
    console.log(`${prefix} ${message}`);
  }
}

// Utility: Retry wrapper with exponential backoff
async function withRetry(fn, checkName) {
  for (let attempt = 1; attempt <= RETRY_COUNT; attempt++) {
    try {
      log(`Running ${checkName} (attempt ${attempt}/${RETRY_COUNT})`, 'debug');
      const result = await fn();
      return result;
    } catch (error) {
      if (attempt === RETRY_COUNT) {
        throw error;
      }
      const delayMs = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
      log(`${checkName} failed on attempt ${attempt}, retrying in ${delayMs}ms...`, 'debug');
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

// Utility: Timeout wrapper
async function withTimeout(promise, timeoutMs, checkName) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

// Record check result
function recordCheck(name, ok, durationMs, details = null, remediation = null) {
  checkResults.push({ name, ok, durationMs, details, remediation });
  if (!ok) {
    allPassed = false;
    log(`✗ ${name} FAILED: ${details}`, 'error');
    if (remediation) {
      log(`  Remediation: ${remediation}`, 'error');
    }
  } else {
    log(`✓ ${name} passed (${durationMs}ms)`, 'info');
  }
}

// Check 1: Environment variables sanity check
async function checkEnvVars() {
  const startTime = Date.now();
  const requiredVars = [
    'OPENAI_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'CRON_SECRET',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    recordCheck(
      'env-vars',
      false,
      Date.now() - startTime,
      `Missing env vars: ${missing.join(', ')}`,
      'Set missing environment variables in Doppler or local .env file'
    );
    return false;
  }
  
  // Validate URL format
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl.startsWith('https://')) {
    recordCheck(
      'env-vars',
      false,
      Date.now() - startTime,
      'SUPABASE_URL must start with https://',
      'Check SUPABASE_URL format'
    );
    return false;
  }
  
  recordCheck('env-vars', true, Date.now() - startTime);
  return true;
}

// Check 2: OpenAI embedding API
async function checkOpenAIEmbedding() {
  const startTime = Date.now();
  
  try {
    const response = await withTimeout(
      withRetry(async () => {
        const res = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            input: 'klutr validation test',
            model: 'text-embedding-3-small',
          }),
        });
        
        if (!res.ok) {
          const errorBody = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorBody}`);
        }
        
        return res.json();
      }, 'OpenAI Embedding'),
      TIMEOUT_MS,
      'OpenAI Embedding'
    );
    
    if (!response.data || !response.data[0] || !response.data[0].embedding || response.data[0].embedding.length === 0) {
      recordCheck(
        'openai-embed',
        false,
        Date.now() - startTime,
        'Invalid embedding response format',
        'Verify OpenAI API key and model availability'
      );
      return false;
    }
    
    recordCheck('openai-embed', true, Date.now() - startTime);
    return true;
  } catch (error) {
    recordCheck(
      'openai-embed',
      false,
      Date.now() - startTime,
      error.message,
      'Verify OPENAI_API_KEY is valid and has quota. Try: curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models'
    );
    return false;
  }
}

// Check 3: OpenAI chat completion (classification)
async function checkOpenAIClassification() {
  const startTime = Date.now();
  
  try {
    const response = await withTimeout(
      withRetry(async () => {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'Classify this as a test. Respond with JSON: {"type":"test"}' }],
            max_tokens: 50,
          }),
        });
        
        if (!res.ok) {
          const errorBody = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorBody}`);
        }
        
        return res.json();
      }, 'OpenAI Classification'),
      TIMEOUT_MS,
      'OpenAI Classification'
    );
    
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      recordCheck(
        'openai-classify',
        false,
        Date.now() - startTime,
        'Invalid chat completion response format',
        'Verify OpenAI API key and model availability'
      );
      return false;
    }
    
    recordCheck('openai-classify', true, Date.now() - startTime);
    return true;
  } catch (error) {
    recordCheck(
      'openai-classify',
      false,
      Date.now() - startTime,
      error.message,
      'Verify OPENAI_API_KEY is valid and has quota for gpt-4o-mini model'
    );
    return false;
  }
}

// Check 4: Supabase DB connectivity (simple query)
async function checkSupabaseDB() {
  const startTime = Date.now();
  
  try {
    const response = await withTimeout(
      withRetry(async () => {
        // Use Supabase REST API to run a simple query
        const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/ping`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({}),
        });
        
        // If ping endpoint doesn't exist, try a simple table query
        if (res.status === 404) {
          const testRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/notes?limit=1`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
          });
          
          if (!testRes.ok) {
            const errorBody = await testRes.text();
            throw new Error(`HTTP ${testRes.status}: ${errorBody}`);
          }
          
          return { ok: true };
        }
        
        if (!res.ok) {
          const errorBody = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorBody}`);
        }
        
        return { ok: true };
      }, 'Supabase DB'),
      TIMEOUT_MS,
      'Supabase DB'
    );
    
    recordCheck('supabase-db', true, Date.now() - startTime);
    return true;
  } catch (error) {
    recordCheck(
      'supabase-db',
      false,
      Date.now() - startTime,
      error.message,
      'Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correct. Check Supabase project status.'
    );
    return false;
  }
}

// Check 5: Supabase Auth ping
async function checkSupabaseAuth() {
  const startTime = Date.now();
  
  try {
    const response = await withTimeout(
      withRetry(async () => {
        // Use Supabase Admin API to list users (with limit 1)
        const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        });
        
        if (!res.ok) {
          const errorBody = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorBody}`);
        }
        
        return res.json();
      }, 'Supabase Auth'),
      TIMEOUT_MS,
      'Supabase Auth'
    );
    
    recordCheck('supabase-auth', true, Date.now() - startTime);
    return true;
  } catch (error) {
    recordCheck(
      'supabase-auth',
      false,
      Date.now() - startTime,
      error.message,
      'Verify Supabase Auth is enabled and service role key has admin permissions'
    );
    return false;
  }
}

// Check 6: Supabase Storage upload/download roundtrip
async function checkSupabaseStorage() {
  const startTime = Date.now();
  const testFileName = `klutr-validate-${Date.now()}.txt`;
  const testContent = 'klutr deployment validation test';
  const bucketName = 'test-bucket'; // Use a test bucket or create one
  
  try {
    // Create test file
    const uploadResponse = await withTimeout(
      withRetry(async () => {
        const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/${bucketName}/${testFileName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: testContent,
        });
        
        if (!res.ok) {
          const errorBody = await res.text();
          throw new Error(`Upload failed HTTP ${res.status}: ${errorBody}`);
        }
        
        return res.json();
      }, 'Supabase Storage Upload'),
      TIMEOUT_MS,
      'Supabase Storage Upload'
    );
    
    log(`Storage upload successful: ${testFileName}`, 'debug');
    
    // Download and verify
    const downloadResponse = await withTimeout(
      withRetry(async () => {
        const res = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/${bucketName}/${testFileName}`, {
          method: 'GET',
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        });
        
        if (!res.ok) {
          const errorBody = await res.text();
          throw new Error(`Download failed HTTP ${res.status}: ${errorBody}`);
        }
        
        return res.text();
      }, 'Supabase Storage Download'),
      TIMEOUT_MS,
      'Supabase Storage Download'
    );
    
    if (downloadResponse !== testContent) {
      throw new Error('Downloaded content does not match uploaded content');
    }
    
    log(`Storage download verified`, 'debug');
    
    // Cleanup: Delete test file
    try {
      await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/${bucketName}/${testFileName}`, {
        method: 'DELETE',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      });
      log(`Storage test file cleaned up`, 'debug');
    } catch (cleanupError) {
      log(`Warning: Failed to cleanup test file: ${cleanupError.message}`, 'debug');
    }
    
    recordCheck('supabase-storage', true, Date.now() - startTime);
    return true;
  } catch (error) {
    recordCheck(
      'supabase-storage',
      false,
      Date.now() - startTime,
      error.message,
      `Verify Supabase Storage is enabled and bucket "${bucketName}" exists with proper policies. Check CORS settings if needed.`
    );
    return false;
  }
}

// Check 7: CRON secret validation
async function checkCronSecret(baseUrl) {
  const startTime = Date.now();
  
  try {
    const url = `${baseUrl}/api/cron/verify`;
    const response = await withTimeout(
      withRetry(async () => {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CRON_SECRET}`,
          },
        });
        
        if (!res.ok) {
          const errorBody = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorBody}`);
        }
        
        return res.json();
      }, 'CRON Secret'),
      TIMEOUT_MS,
      'CRON Secret'
    );
    
    if (!response.ok) {
      throw new Error('CRON verification endpoint did not return ok: true');
    }
    
    recordCheck('cron-secret', true, Date.now() - startTime);
    return true;
  } catch (error) {
    recordCheck(
      'cron-secret',
      false,
      Date.now() - startTime,
      error.message,
      'Verify CRON_SECRET matches between deployment env and local. Check /api/cron/verify endpoint is deployed.'
    );
    return false;
  }
}

// Check 8: App health check (post-deploy only)
async function checkAppHealth(deployedUrl) {
  const startTime = Date.now();
  
  try {
    const url = `${deployedUrl}/api/health/check-deploy`;
    const response = await withTimeout(
      withRetry(async () => {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          const errorBody = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorBody}`);
        }
        
        return res.json();
      }, 'App Health'),
      TIMEOUT_MS,
      'App Health'
    );
    
    // Check for expected health indicators
    if (!response.status || response.status !== 'ok') {
      throw new Error(`Health check returned status: ${response.status || 'unknown'}`);
    }
    
    recordCheck('app-health', true, Date.now() - startTime);
    return true;
  } catch (error) {
    recordCheck(
      'app-health',
      false,
      Date.now() - startTime,
      error.message,
      'Verify deployed app is running and /api/health/check-deploy endpoint is accessible'
    );
    return false;
  }
}

// Main execution
async function main() {
  log(`Starting Klutr deployment validation`, 'info');
  log(`Mode: ${isPreDeploy ? 'PRE-DEPLOY' : isPostDeploy ? 'POST-DEPLOY' : 'UNKNOWN'}`, 'info');
  
  // Validate usage
  if (!isPreDeploy && !isPostDeploy) {
    log('Error: Must specify --predeploy or --postdeploy', 'error');
    log('Usage: node validate-deploy.js [--predeploy | --postdeploy --url <url>] [--verbose]', 'error');
    process.exit(2);
  }
  
  if (isPostDeploy && !deployedUrl) {
    log('Error: --postdeploy requires --url parameter', 'error');
    log('Usage: node validate-deploy.js --postdeploy --url https://klutr.app', 'error');
    process.exit(2);
  }
  
  // Run checks
  const envVarsOk = await checkEnvVars();
  if (!envVarsOk) {
    log('Environment validation failed, stopping', 'error');
    printSummary();
    process.exit(1);
  }
  
  // Run service checks
  await checkOpenAIEmbedding();
  await checkOpenAIClassification();
  await checkSupabaseDB();
  await checkSupabaseAuth();
  await checkSupabaseStorage();
  
  if (isPostDeploy && deployedUrl) {
    // Post-deploy specific checks
    await checkCronSecret(deployedUrl);
    await checkAppHealth(deployedUrl);
  } else if (isPreDeploy) {
    // Pre-deploy checks (local)
    const localUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    log(`Running pre-deploy CRON check against: ${localUrl}`, 'debug');
    // Skip CRON check in pre-deploy if local server is not running
    // await checkCronSecret(localUrl);
  }
  
  // Print summary
  printSummary();
  
  // Exit with appropriate code
  if (allPassed) {
    log('✓ All validation checks passed!', 'info');
    process.exit(0);
  } else {
    log('✗ Some validation checks failed', 'error');
    process.exit(1);
  }
}

function printSummary() {
  const summary = {
    success: allPassed,
    checks: checkResults,
    timestamp: new Date().toISOString(),
  };
  
  console.log('\n========== VALIDATION SUMMARY ==========');
  console.log(JSON.stringify(summary, null, 2));
  console.log('========================================\n');
  
  // Save to file
  try {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    const filename = `deploy-validate-${Date.now()}.json`;
    const filepath = path.join(tmpDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(summary, null, 2));
    log(`Summary saved to: ${filepath}`, 'info');
  } catch (error) {
    log(`Warning: Failed to save summary file: ${error.message}`, 'debug');
  }
}

// Run
main().catch(error => {
  log(`Unexpected error: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});
