# Klutr Bugs and Debt – Build Branch

**Date:** 2025-11-20
**Branch:** build/klutr-expansion

## New findings
- Stacks rebuild is synchronous per request; repeated rebuilds can incur duplicate AI summary calls. Mitigation: add caching or throttle per user.
- Stack detail keywords derive from note tags only; notes without tags won’t surface meaningful keywords. Mitigation: enrich tags on ingestion or show content-derived keywords.

## Known open items (pre-existing)
- Vault encryption, key derivation, and `/vault` UX remain unimplemented (see FINAL_STATUS.md).
- Search fuzzy fallback and scoring improvements still pending.
- Background auto-summary for stream uploads is not wired; isAnalyzing state is still manual.
- Insights timeline “what changed this week” panels are not yet present.

## Suggested next actions
- Add background job or hook on note creation to refresh smart stacks automatically.
- Implement note detail surface for stack items so users can open a note from the stack view.
- Add telemetry for stack rebuild latency/errors to catch OpenAI timeouts early.
