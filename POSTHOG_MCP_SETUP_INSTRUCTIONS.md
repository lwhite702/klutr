# PostHog MCP Setup Instructions

## Quick Setup (Easiest)

Run this command in your terminal:

```bash
npx @posthog/wizard mcp add
```

This will automatically configure PostHog MCP in Cursor.

## Manual Setup

### 1. Get Your PostHog Personal API Key

1. Go to https://us.posthog.com → Settings → Personal API Keys
2. Create a new Personal API Key
3. Copy the key

### 2. Configure Cursor

1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Go to Features → MCP Servers
3. Add this configuration:

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

**Replace `YOUR_PERSONAL_API_KEY_HERE` with your actual key.**

### 3. Restart Cursor

Quit and reopen Cursor completely.

### 4. Test

Ask the AI: "List all my PostHog feature flags"

If it works, you'll see your flags!

## Create Feature Flags

Once MCP is working, ask:

> "Create all the default PostHog feature flags defined in FEATURE_FLAGS"

This will create:
- chat-interface
- file-drops  
- voice-capture
- smart-threads
- embeddings (active)
- classification (active)

See apps/app/docs/posthog-mcp-cursor-setup.md for detailed instructions.
