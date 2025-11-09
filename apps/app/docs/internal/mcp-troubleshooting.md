# MCP Server Troubleshooting

## Issue: BaseHub MCP Not Accessible

**Symptoms:**
- `list_mcp_resources` returns empty
- BaseHub MCP endpoint returns "Method not allowed" or "Not Acceptable" errors
- MCP tools not available in Cursor

## Diagnosis

### Test Results
- BaseHub MCP endpoint: `https://basehub.com/api/mcp`
- Token: Configured in `/Users/lee/.cursor/mcp.json`
- Error: "Not Acceptable: Client must accept application/json"

### Possible Causes

1. **MCP Server Not Running**
   - Cursor may need restart to initialize MCP servers
   - Check Cursor MCP server logs/console

2. **Header Requirements**
   - BaseHub MCP may require specific Accept headers
   - May need `Accept: application/json` header

3. **Token Issues**
   - Token may be expired or invalid
   - Verify token in BaseHub dashboard

4. **Connection Method**
   - MCP servers may use SSE (Server-Sent Events) instead of HTTP POST
   - Check if BaseHub uses different connection protocol

## Troubleshooting Steps

### 1. Restart Cursor
- Close and reopen Cursor
- MCP servers initialize on startup

### 2. Check MCP Configuration
- Verify `/Users/lee/.cursor/mcp.json` is correct
- Ensure token is valid and not expired
- Check BaseHub dashboard for token status

### 3. Verify Token
```bash
# Test token with BaseHub API directly
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.basehub.com/...
```

### 4. Check Cursor Logs
- Open Cursor Developer Tools
- Check Console for MCP connection errors
- Look for BaseHub MCP initialization messages

### 5. Alternative: Use BaseHub SDK
- If MCP unavailable, use BaseHub SDK mutation API
- See `/scripts/update-basehub-content.ts` for example
- Or update content manually in BaseHub Studio

## Workaround

Since MCP is not accessible, use one of these methods:

1. **BaseHub SDK Mutation API** - Programmatic updates via SDK
2. **BaseHub Studio** - Manual updates via web UI
3. **BaseHub REST API** - Direct API calls (if available)

## Next Steps

- Document BaseHub content updates needed
- Create update script using SDK if needed
- Or provide manual update instructions for BaseHub Studio

