# PostHog MCP Server Quick Start

## Using MCP to Create Feature Flags

Once the PostHog MCP server is configured in Cursor, you can create feature flags directly by asking the AI.

### Step 1: Configure MCP Server

Add PostHog MCP server to your Cursor MCP configuration:

```json
{
  "mcpServers": {
    "posthog": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-posthog"],
      "env": {
        "POSTHOG_API_KEY": "your_personal_api_key",
        "POSTHOG_PROJECT_ID": "your_project_id",
        "POSTHOG_HOST": "https://us.posthog.com"
      }
    }
  }
}
```

### Step 2: Create Flags via AI

Simply ask the AI assistant:

> "Create all the default PostHog feature flags: spark-beta, muse-ai, orbit-experimental, vault-enhanced, and klutr-global-disable"

Or:

> "Create the PostHog feature flags defined in FEATURE_FLAGS"

The AI will use MCP tools to create each flag with these settings:
- **Key**: As defined in `FEATURE_FLAGS` constants
- **Name**: Descriptive name for each flag
- **Description**: What the flag controls
- **Active**: `false` (disabled by default - you can enable in PostHog dashboard)

### Step 3: Verify

Check your PostHog dashboard or ask the AI:
> "List all PostHog feature flags"

## Default Flags

The following flags will be created:

1. **spark-beta** - Spark Beta
   - Description: "Beta access to Spark feature"
   
2. **muse-ai** - Muse AI
   - Description: "Muse AI feature access"
   
3. **orbit-experimental** - Orbit Experimental
   - Description: "Experimental Orbit view feature"
   
4. **vault-enhanced** - Vault Enhanced
   - Description: "Enhanced vault features"
   
5. **klutr-global-disable** - Klutr Global Disable
   - Description: "Global kill switch - disables all experimental features when enabled"

## Alternative: REST API

If MCP is not available, use the API route:

```bash
curl -X POST http://localhost:3000/api/posthog/setup-flags
```

See [README_POSTHOG_FLAGS.md](../README_POSTHOG_FLAGS.md) for more details.

