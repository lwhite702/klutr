# Klutr Production Audit

## Executive summary
Klutr ships a credible hybrid stream-first experience with working stream capture, clustering, search, insights, memory, and panel navigation, but production readiness is uneven. Core flows render and route correctly, yet Stacks and Vault remain placeholder experiences, and the lint/tooling pipeline required fixes to run. Infrastructure and security fundamentals (Supabase auth, cron secret checks, RLS-aware database access) are present, but the Vault still bypasses client-side encryption and unlocks on any non-empty passphrase. Overall recommendation: safe for limited beta with Vault hidden and Stacks flagged as "coming soon," alongside a cleanup pass on unused code paths and marketing copy alignment before wide release.

## Feature-by-feature status
| Feature | Status | Confidence | Key gaps | Recommended action |
| --- | --- | --- | --- | --- |
| Notes | Production ready with caveats | High | Reliant on Supabase auth; unused state in stream page hints at unpolished analysis flow | Keep as-is, add test coverage for file/voice uploads |
| MindStorm | Production ready | Medium | Unused handler parameters; panel shortcut wiring intact but dead code warns of drift | Remove unused vars, verify cluster refresh telemetry |
| Stacks | Partially implemented | High | /app/stacks shows "coming soon"; detail page reads cluster param but depends on cluster column presence | Hide entry or gate with beta flag until data path confirmed |
| Vault | Missing/blocked | High | Unlocks without verification; no encryption or key derivation implemented | Hide in nav, prioritize client-side AES-GCM per PRD before launch |
| Insights | Production ready | Medium | Unused click handlers in page component | Remove unused code, keep panel parity |
| Memory | Production ready | Medium | Unused callbacks; verify timeline data freshness | Clean up unused handlers and add tests |
| Nope | Production ready | Medium | Unused state values; confirm restore UX on mobile | Minor refactor to trim dead code |
| Boards | Production ready | Medium | API wrappers unused in detail route imports | Audit boards detail for unused utilities |
| Stream/panels | Production ready with caveats | High | Panel shortcuts and capture flow work; `isAnalyzing` state unused | Trim unused state, ensure auto-summary hook is wired |
| Search | Production ready | Medium | Unused imports/handlers in page component | Remove unused values, confirm semantic fallback |
| Auth/user model | Production ready with caveats | Medium | Supabase server auth used; brand colors import unused in Vault | Verify RLS policies in database and middleware coverage |
| Marketing | Production ready with caveats | Medium | Metadata present but copy promises vault; OG image references need verification | Align claims with actual feature availability, confirm OG assets exist |

## Implementation alignment notes
- **Notes & Stream**: Stream page implements keyboard shortcuts to open MindStorm, Insights, Memory, and Search panels while keeping capture central, matching the hybrid plan.【F:app/(app)/stream/page.tsx†L3-L170】 File and voice uploads route through Supabase storage helpers, but analysis state is unused, signaling unfinished auto-summary wiring.【F:app/(app)/stream/page.tsx†L35-L200】
- **MindStorm & panels**: Panel state management and container components follow the documented overlay pattern, ensuring one panel at a time with mobile sheet fallback.【F:lib/hooks/usePanelState.ts†L1-L38】【F:components/panels/PanelContainer.tsx†L1-L104】 MindStorm page still holds unused handler args, suggesting light refactor needed.
- **Stacks**: Top-level Stacks page is an explicit "coming soon" placeholder; detail view queries `/api/notes/list?cluster=...` but assumes cluster column integrity without guarding empty results.【F:app/(app)/stacks/page.tsx†L1-L12】【F:app/(app)/stacks/[stack]/page.tsx†L1-L80】 This diverges from PRD expectations for smart grouping and pinning.
- **Vault**: Current page allows unlock on any non-empty passphrase and lists server notes without client-side encryption or key derivation, conflicting with PRD zero-knowledge requirements.【F:app/(app)/vault/page.tsx†L21-L120】【F:PRD.md†L36-L41】
- **Insights & Memory**: Pages render data but keep unused click/favorite handlers, implying partial UI affordances not yet wired to actions.【F:app/(app)/insights/page.tsx†L90-L110】【F:app/(app)/memory/page.tsx†L90-L125】
- **Search**: Page includes unused hooks and error handlers; backend supports semantic and full-text search as per FINAL_STATUS but frontend polish is pending.【F:app/(app)/search/page.tsx†L1-L80】
- **Auth/Security**: API routes rely on Supabase auth helpers and enforce CRON_SECRET on cron endpoints, aligning with DOPPLER guidance.【F:lib/auth.ts†L1-L74】【F:app/api/cron/nightly-cluster/route.ts†L1-L22】 Vault security is the main outlier.
- **Marketing**: Layout defines metadata, OG tags, and icons, but copy defaults to "Free Beta" while app still exposes non-functional Vault page, risking promise/reality mismatch.【F:app/(marketing)/layout.tsx†L6-L32】

## UX and UI findings
- **P0**
  - Vault unlocks with any text input and surfaces unencrypted notes, undermining user trust (hide entry or gate behind feature flag until encryption lands).【F:app/(app)/vault/page.tsx†L49-L90】
- **P1**
  - Stacks main route presents a dead-end "coming soon" screen; add gating or richer guidance to prevent navigation cul-de-sac.【F:app/(app)/stacks/page.tsx†L5-L12】
  - Stream auto-summary indicator (`isAnalyzing`) never updates, so users may not see progress feedback for analysis tasks.【F:app/(app)/stream/page.tsx†L35-L170】
  - Numerous unused handlers produce lint noise and hint at unimplemented affordances (Insight click, Memory favorite, search error states).【F:app/(app)/insights/page.tsx†L90-L110】【F:app/(app)/memory/page.tsx†L90-L125】【F:app/(app)/search/page.tsx†L1-L80】
- **P2**
  - Marketing metadata uses generic OG image path; confirm asset presence and align copy with feature availability to reduce confusion.【F:app/(marketing)/layout.tsx†L6-L32】
  - Panel backdrop is hidden on desktop, so side panels feel less modal; consider consistent dimming for focus.

## Marketing and SEO findings
- Metadata and OG tags are defined in the marketing layout with fallback titles/descriptions, matching SEO polish notes, but promises of "Free Beta" plus Vault visibility overstate current readiness.【F:app/(marketing)/layout.tsx†L6-L32】【F:app/(app)/vault/page.tsx†L49-L90】
- Icons for favicon and Apple touch are declared; need to verify referenced assets exist in `/public/brand` before launch.【F:app/(marketing)/layout.tsx†L23-L30】
- Copy should clarify Vault is "in-progress" and Stacks is "beta" to align marketing claims with actual UX.

## Security and infra summary
- Supabase auth helpers are used in API routes, and cron endpoints enforce `CRON_SECRET` checks, aligning with operational guidance.【F:lib/auth.ts†L1-L74】【F:app/api/cron/nightly-cluster/route.ts†L1-L22】
- Linting pipeline initially failed due to missing Next config; updated ESLint setup now runs but surfaces extensive unused-code warnings that mask real issues.【F:eslint.config.js†L1-L34】【ce7d74†L1-L124】
- Vault bypasses documented encryption requirements and should remain hidden until client-side AES-GCM and PBKDF2 key derivation are implemented.【F:app/(app)/vault/page.tsx†L49-L118】【F:PRD.md†L36-L41】

## Prioritized recommendations
1. **P0**: Hide Vault entry and disable access until client-side encryption and real unlock validation are shipped to meet PRD security promises.【F:app/(app)/vault/page.tsx†L49-L90】【F:PRD.md†L36-L41】
2. **P0**: Gate Stacks navigation behind a beta badge or redirect to Stream until smart stacks and pinning are functional to avoid dead-end routes.【F:app/(app)/stacks/page.tsx†L5-L12】
3. **P1**: Wire Stream analysis state or remove unused `isAnalyzing` flag to give users feedback on summaries and reduce lint noise.【F:app/(app)/stream/page.tsx†L35-L170】
4. **P1**: Sweep unused handlers/imports across panels and marketing pages to improve bundle size and signal actual affordances (Insights, Memory, Search).【F:app/(app)/insights/page.tsx†L90-L110】【F:app/(app)/memory/page.tsx†L90-L125】【F:app/(app)/search/page.tsx†L1-L80】
5. **P2**: Verify OG image assets and align marketing copy with current feature availability (Vault/Stakes in beta) to set accurate expectations.【F:app/(marketing)/layout.tsx†L14-L32】

## Design Note: Vault Implementation
*Current Behavior:* Mock UI, accepts any password.
*Proposed Change:* Connect `VaultLockScreen` to `lib/encryption/secure.ts`.
*Rationale:* Fulfills the core privacy promise of the product.
*Risk:* High complexity. Requires careful state management of the decrypted key in memory (never in storage).
*Recommendation:* Postpone for v1.1 unless critical. Hide for now.

# Klutr Production Audit – Build Branch

**Date:** 2025-11-20
**Branch:** build/klutr-expansion

## Scope of this pass
- Rebuilt the Stacks hub to surface real smart-stack data (list and detail views).
- Added stack-level metadata, search/filtering, and refreshed empty/loader states.

## What changed
- `/app/stacks` now fetches `/api/stacks/list`, shows pinned vs. unpinned stacks, and exposes a rebuild trigger so users can refresh groupings without leaving the page.
- `/app/stacks/[stack]` now uses `/api/stacks/detail` + `/api/stacks/list` to render summaries, note counts, top keywords, and filtered note listings.

## Current readiness
- Stacks experiences are now data-driven and navigable end-to-end, aligning with the hybrid panel/page architecture.
- Rebuild action relies on the existing smart stack generator; no schema or API surface changes were introduced.

## Risks / follow-ups
- Stack summaries are still generated on-demand; consider caching results to reduce repeated OpenAI calls when users rebuild frequently.
- Vault encryption and auto-summary pipeline remain open items from FINAL_STATUS.md and should be prioritized next.
- Search ranking and fuzzy fallbacks are unchanged in this pass.

## Recommendations
- Add lightweight telemetry around stack rebuilds to watch latency and failure rates.
- Consider background refresh of stacks on note ingestion to keep clusters warm without manual rebuilds.
