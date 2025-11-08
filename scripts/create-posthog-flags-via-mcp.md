# Create PostHog Feature Flags via MCP

Since the PostHog MCP server is configured in your Cursor settings, you can create the feature flags directly by asking the AI assistant.

## Quick Method: Ask the AI

Simply ask:

> "Create the following PostHog feature flags: spark-beta (Spark Beta), muse-ai (Muse AI), orbit-experimental (Orbit Experimental), vault-enhanced (Vault Enhanced), and klutr-global-disable (Klutr Global Disable). Set them all to inactive/disabled by default."

The AI will use the PostHog MCP tools to create each flag.

## Flags to Create

Based on `lib/featureFlags.ts`, create these 5 flags:

1. **spark-beta**
   - Name: "Spark Beta"
   - Description: "Beta access to Spark feature"
   - Active: false

2. **muse-ai**
   - Name: "Muse AI"
   - Description: "Muse AI feature access"
   - Active: false

3. **orbit-experimental**
   - Name: "Orbit Experimental"
   - Description: "Experimental Orbit view feature"
   - Active: false

4. **vault-enhanced**
   - Name: "Vault Enhanced"
   - Description: "Enhanced vault features"
   - Active: false

5. **klutr-global-disable**
   - Name: "Klutr Global Disable"
   - Description: "Global kill switch - disables all experimental features when enabled"
   - Active: false

## Alternative: REST API

If MCP tools aren't working, you can use the REST API:

1. Add to Doppler:
   - `POSTHOG_PERSONAL_API_KEY` (from PostHog → Settings → Personal API Keys)
   - `POSTHOG_PROJECT_ID` (from PostHog → Project Settings)

2. Call the API route:
   ```bash
   curl -X POST http://localhost:3000/api/posthog/setup-flags
   ```

