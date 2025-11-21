# Klutr Bugs and Technical Debt

## Bugs
| ID | Area | Severity | Steps to reproduce | Expected | Actual | Suggested fix | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B1 | Vault | P0 | Navigate to /app/vault, enter any non-empty passphrase | Vault should verify passphrase and decrypt client-side notes only | Any text unlocks and lists notes without encryption | Hide route or gate behind feature flag until AES-GCM + PBKDF2 flow is implemented per PRD | Placeholder unlock bypasses security promises【F:app/(app)/vault/page.tsx†L49-L118】【F:PRD.md†L36-L41】 |
| B2 | Stream analysis feedback | P1 | Add drops in /app/stream and observe footer | Auto-summary status should reflect analysis progress | `isAnalyzing` state never changes; users see no feedback | Wire analysis trigger or remove unused state to simplify UI | Fixed in audit/klutr-production-review |
| B3 | MindStorm | Major | Click a cluster in MindStorm panel | Should navigate client-side without reload | Triggers full browser refresh (`window.location.href`) | Use `useRouter().push()` | Fixed in audit/klutr-production-review |
| B4 | Stream | Minor | Press 'n' shortcut | Should focus input reliably | Uses `document.querySelector` which depends on DOM structure | Use `useRef` for the input element | Fixed in audit/klutr-production-review |
| B5 | MindStorm | Minor | Trigger API error | Should use global error/toast patterns | Uses raw `fetch` and local error handling | Refactor to use `clientApi` | Fixed in audit/klutr-production-review |

## Technical debt
- **Architecture (M)**: Unused handlers/imports across panels, marketing pages, and API routes create noisy lint output and obscure real regressions; needs systematic cleanup. Fixed in audit/klutr-production-review.
- **Security (H)**: Vault lacks client-side encryption and real unlock flow; requires AES-GCM with PBKDF2 key derivation and server-side ciphertext storage only.【F:app/(app)/vault/page.tsx†L49-L118】【F:PRD.md†L36-L41】
- **DX (M)**: ESLint needed dependency/config updates; now runs but with 170 warnings. Establish rule baseline and prune dead code to restore signal.【F:eslint.config.js†L1-L34】【ce7d74†L1-L124】
- **Marketing (S)**: OG images and beta status messaging need verification to avoid overpromising Vault availability. Vault promise removed from pricing in audit/klutr-production-review.
- **DX (S)**: API Consistency - `MindStormPanel` bypasses `clientApi` wrapper. Fixed in audit/klutr-production-review.
- **Performance (M)**: Background Tasks - `create/route.ts` uses unawaited promises for AI. Needs a queue system (e.g., BullMQ) for robustness in future.
- **Performance (M)**: Stacks Rebuild - Synchronous per request; repeated rebuilds can incur duplicate AI summary calls. Mitigation: add caching or throttle per user.
- **Product (S)**: Stacks Keywords - Derive from note tags only; notes without tags won’t surface meaningful keywords. Mitigation: enrich tags on ingestion or show content-derived keywords.
- **Testing (H)**: E2E Coverage - Playwright tests are scaffolded but incomplete.
- **Type Safety (S)**: API Responses - Some API routes might not be strictly typed against DTOs.
