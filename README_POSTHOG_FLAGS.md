# PostHog Feature Flags Setup

This guide explains how to programmatically create feature flags in PostHog.

## Quick Start: Using MCP Server (Recommended)

If you have the PostHog MCP server configured in Cursor, you can simply ask the AI:

> "Create all the default PostHog feature flags defined in FEATURE_FLAGS"

The AI will use MCP tools to create the flags automatically. See [docs/posthog-mcp-setup.md](../docs/posthog-mcp-setup.md) for MCP server configuration.

**Default flags that will be created:**
- `spark-beta` - Spark Beta
- `muse-ai` - Muse AI  
- `orbit-experimental` - Orbit Experimental
- `vault-enhanced` - Vault Enhanced
- `klutr-global-disable` - Klutr Global Disable (kill switch)

## Prerequisites

1. **Personal API Key**: Get from PostHog → Settings → Personal API Keys
   - This is different from the project API key
   - Required for management operations (creating/updating flags)

2. **Project ID**: Get from PostHog → Project Settings
   - Usually a numeric ID or UUID

3. **Environment Variables**: Add to Doppler:
   ```bash
   POSTHOG_PERSONAL_API_KEY=your_personal_api_key
   POSTHOG_PROJECT_ID=your_project_id
   ```

## Method 1: API Route (Recommended)

The easiest way to create feature flags is via the API endpoint:

```bash
# Make a POST request to the setup endpoint
curl -X POST http://localhost:3000/api/posthog/setup-flags
```

Or visit in your browser after starting the dev server:
```
http://localhost:3000/api/posthog/setup-flags
```

This will create all default feature flags defined in `lib/featureFlags.ts`:
- `spark-beta`
- `muse-ai`
- `orbit-experimental`
- `vault-enhanced`
- `klutr-global-disable`

**Note**: The endpoint will skip flags that already exist, so it's safe to run multiple times.

## Method 2: Script

If you prefer a command-line script:

```bash
# Install tsx if not already installed
pnpm add -D tsx

# Run the setup script
pnpm posthog:setup-flags
```

Or manually:
```bash
doppler run -- npx tsx scripts/setup-posthog-flags.ts
```

## Method 3: Programmatic Usage

You can also use the API functions directly in your code:

```typescript
import { createFeatureFlag, createDefaultFeatureFlags } from "@/lib/posthog/api";

// Create a single flag
await createFeatureFlag({
  key: "my-new-flag",
  name: "My New Feature",
  description: "Description of the feature",
  active: false,
  ensure_unique: true, // Skip if already exists
});

// Create all default flags
await createDefaultFeatureFlags();
```

## Available Functions

The `lib/posthog/api.ts` module provides:

- `createFeatureFlag(options)` - Create a single feature flag
- `getFeatureFlag(key)` - Get a feature flag by key
- `updateFeatureFlag(key, updates)` - Update an existing flag
- `deleteFeatureFlag(key)` - Delete a feature flag
- `createDefaultFeatureFlags()` - Create all default flags

## Feature Flag Structure

Default flags are created with:
- **Active**: `false` (disabled by default)
- **Rollout**: 0% (no users enabled)
- **Description**: Brief description of what the flag controls

You can then enable and configure flags in the PostHog dashboard.

## Troubleshooting

**Error: POSTHOG_PERSONAL_API_KEY is required**
- Make sure you've added the Personal API Key to Doppler
- Get it from PostHog → Settings → Personal API Keys (not Project API Keys)

**Error: POSTHOG_PROJECT_ID is required**
- Add your project ID to Doppler
- Find it in PostHog → Project Settings

**Flags already exist**
- The `ensure_unique` option prevents errors if flags already exist
- You can safely run the setup multiple times

