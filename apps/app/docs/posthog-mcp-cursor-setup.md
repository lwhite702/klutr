# PostHog MCP Server Setup for Cursor

This guide will help you configure the PostHog MCP server in Cursor so you can manage feature flags directly through the AI assistant.

## Quick Setup (Recommended)

The easiest way to set up PostHog MCP is using the PostHog Wizard:

```bash
npx @posthog/wizard mcp add
```

This will automatically configure the MCP server in Cursor and other supported clients.

## Manual Setup

If you prefer to configure manually, follow these steps:

### Step 1: Get Your PostHog Personal API Key

1. Go to [PostHog](https://us.posthog.com) and sign in
2. Navigate to **Settings** → **Personal API Keys**
3. Click **Create Personal API Key**
4. Give it a name (e.g., "Cursor MCP")
5. Copy the API key (you'll need it in Step 3)

**Important:** Use a **Personal API Key**, not a Project API Key.

### Step 2: Get Your Project ID

1. In PostHog, go to **Project Settings**
2. Find your **Project ID** (it's a number)
3. Copy it (you'll need it for reference, though the MCP server may auto-detect it)

### Step 3: Configure Cursor MCP Settings

1. Open **Cursor Settings** (Cmd/Ctrl + ,)
2. Navigate to **Features** → **MCP Servers** (or search for "MCP")
3. Click **Add MCP Server** or edit the existing configuration
4. Add this configuration:

```json
{
  "mcpServers": {
    "posthog": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@latest",
        "https://mcp.posthog.com/mcp",
        "--header",
        "Authorization:${POSTHOG_AUTH_HEADER}"
      ],
      "env": {
        "POSTHOG_AUTH_HEADER": "Bearer YOUR_PERSONAL_API_KEY_HERE"
      }
    }
  }
}
```

**Replace `YOUR_PERSONAL_API_KEY_HERE`** with the Personal API Key you copied in Step 1.

### Step 4: Restart Cursor

After saving the configuration:
1. **Restart Cursor completely** (quit and reopen)
2. This ensures the MCP server loads properly

### Step 5: Verify MCP is Working

Once Cursor restarts, ask the AI assistant:

> "List all my PostHog feature flags"

If the MCP server is working, the AI should be able to retrieve your feature flags from PostHog.

## Creating Feature Flags via MCP

Once configured, you can ask the AI to create flags:

> "Create all the default PostHog feature flags defined in FEATURE_FLAGS"

The AI will create these flags:
- `chat-interface` - Chat Interface (inactive)
- `file-drops` - File Drops (inactive)
- `voice-capture` - Voice Capture (inactive)
- `smart-threads` - Smart Threads (inactive)
- `embeddings` - Embeddings (active)
- `classification` - Classification (active)

## Troubleshooting

### MCP Server Not Found

- **Check Cursor version**: Make sure you're using a recent version of Cursor that supports MCP
- **Verify configuration**: Check that the JSON is valid and the API key is correct
- **Check Cursor logs**: Look for MCP-related errors in Cursor's developer console

### Authentication Errors

- **Verify API Key**: Make sure you're using a Personal API Key (not Project API Key)
- **Check format**: The auth header should be `Bearer YOUR_KEY` (with "Bearer " prefix)
- **Test API key**: Try using the key with the REST API to verify it works

### Flags Not Creating

- **Check permissions**: Ensure your Personal API Key has permission to create feature flags
- **Verify project**: Make sure you're working with the correct PostHog project
- **Check PostHog dashboard**: Some flags might already exist

## Alternative: REST API

If MCP doesn't work, you can use the REST API approach:

```bash
cd apps/app
doppler run -- npx tsx scripts/setup-posthog-flags.ts
```

This requires:
- `POSTHOG_PERSONAL_API_KEY` in Doppler
- `POSTHOG_PROJECT_ID` in Doppler

## Next Steps

After MCP is configured:

1. **Test it**: Ask the AI to list your feature flags
2. **Create flags**: Ask the AI to create the default flags
3. **Manage flags**: Use natural language to enable/disable flags, set rollouts, etc.

## Resources

- [PostHog MCP Documentation](https://posthog.com/docs/model-context-protocol)
- [PostHog MCP GitHub](https://github.com/PostHog/mcp)
- [MCP Protocol Specification](https://modelcontextprotocol.io)

