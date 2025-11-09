# PostHog MCP Server Setup

This guide explains how to set up and use the PostHog MCP (Model Context Protocol) server for managing feature flags.

## What is MCP?

MCP (Model Context Protocol) allows AI assistants to interact with external services through standardized tools. The PostHog MCP server provides tools to manage PostHog resources directly from your AI assistant.

## Setup Instructions

### 1. Install PostHog MCP Server

The PostHog MCP server needs to be configured in your Cursor/Claude Desktop settings. 

**For Cursor:**
1. Open Cursor Settings
2. Navigate to Features → MCP Servers
3. Add a new MCP server configuration

**Example configuration:**
```json
{
  "mcpServers": {
    "posthog": {
      "command": "npx",
      "args": [
        "-y",
        "@posthog/mcp-server"
      ],
      "env": {
        "POSTHOG_API_KEY": "your_personal_api_key",
        "POSTHOG_PROJECT_ID": "your_project_id",
        "POSTHOG_HOST": "https://us.posthog.com"
      }
    }
  }
}
```

### 2. Environment Variables

Add these to your Doppler configuration:

```bash
POSTHOG_PERSONAL_API_KEY=your_personal_api_key
POSTHOG_PROJECT_ID=your_project_id
POSTHOG_HOST=https://us.posthog.com  # Optional, defaults to us.posthog.com
```

**Where to get these:**
- **Personal API Key**: PostHog → Settings → Personal API Keys
- **Project ID**: PostHog → Project Settings → Project ID

### 3. Verify MCP Server is Working

Once configured, you can ask your AI assistant:
- "Create the default PostHog feature flags"
- "List all PostHog feature flags"
- "Enable the spark-beta feature flag for user X"

The AI will use the MCP tools to interact with PostHog directly.

## Available MCP Tools

When the PostHog MCP server is configured, these tools become available:

- **Create Feature Flag** - Create a new feature flag
- **Update Feature Flag** - Update an existing flag
- **Get Feature Flag** - Retrieve flag details
- **List Feature Flags** - List all flags in the project
- **Delete Feature Flag** - Remove a flag
- **Enable/Disable Flag** - Toggle flag status

## Creating Default Flags via MCP

Once the MCP server is set up, you can simply ask:

> "Create all the default PostHog feature flags defined in FEATURE_FLAGS"

The AI assistant will:
1. Read the `FEATURE_FLAGS` constants from `lib/featureFlags.ts`
2. Use MCP tools to create each flag in PostHog
3. Report back on success/failure

## Alternative: API Route

If MCP server is not available, you can still use the API route:

```bash
curl -X POST http://localhost:3000/api/posthog/setup-flags
```

This uses the REST API directly (see `lib/posthog/api.ts`).

## Troubleshooting

**MCP server not found:**
- Make sure you've installed the PostHog MCP server package
- Check your Cursor MCP server configuration
- Verify environment variables are set correctly

**Authentication errors:**
- Ensure `POSTHOG_PERSONAL_API_KEY` is a Personal API Key (not Project API Key)
- Verify the key has the correct permissions
- Check that `POSTHOG_PROJECT_ID` matches your project

**Flags already exist:**
- The MCP tools should handle this gracefully
- You can update existing flags instead of creating new ones

## Next Steps

1. Configure the MCP server in Cursor
2. Test by asking the AI to list your PostHog feature flags
3. Create the default flags by asking the AI to set them up
4. Manage flags through natural language commands

For more information, see the [PostHog MCP Server documentation](https://github.com/posthog/mcp-server).

