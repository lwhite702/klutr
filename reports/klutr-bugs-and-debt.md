# Klutr Bugs and Technical Debt

## Bugs
| ID | Area | Severity | Steps to reproduce | Expected | Actual | Suggested fix | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| B1 | Vault | P0 | Navigate to /app/vault, enter any non-empty passphrase | Vault should verify passphrase and decrypt client-side notes only | Any text unlocks and lists notes without encryption | Hide route or gate behind feature flag until AES-GCM + PBKDF2 flow is implemented per PRD | Placeholder unlock bypasses security promises【F:app/(app)/vault/page.tsx†L49-L118】【F:PRD.md†L36-L41】 |
| B2 | Stacks | P1 | Open /app/stacks from navigation | Functional stacks overview with smart groupings | "Stacks — Coming soon" placeholder with no path forward | Hide menu item or add guidance/redirect to Stream until stacks land | Avoids dead-end navigation and aligns with PRD expectations【F:app/(app)/stacks/page.tsx†L5-L12】【F:PRD.md†L30-L35】 |
| B3 | Stream analysis feedback | P1 | Add drops in /app/stream and observe footer | Auto-summary status should reflect analysis progress | `isAnalyzing` state never changes; users see no feedback | Wire analysis trigger or remove unused state to simplify UI | Reduces confusion and lint noise【F:app/(app)/stream/page.tsx†L35-L170】 |

## Technical debt
- **Architecture (M)**: Unused handlers/imports across panels, marketing pages, and API routes create noisy lint output and obscure real regressions; needs systematic cleanup.【F:app/(app)/insights/page.tsx†L90-L110】【F:app/(app)/memory/page.tsx†L90-L125】【F:app/(app)/search/page.tsx†L1-L80】
- **Security (H)**: Vault lacks client-side encryption and real unlock flow; requires AES-GCM with PBKDF2 key derivation and server-side ciphertext storage only.【F:app/(app)/vault/page.tsx†L49-L118】【F:PRD.md†L36-L41】
- **DX (M)**: ESLint needed dependency/config updates; now runs but with 170 warnings. Establish rule baseline and prune dead code to restore signal.【F:eslint.config.js†L1-L34】【ce7d74†L1-L124】
- **Marketing (S)**: OG images and beta status messaging need verification to avoid overpromising Vault availability.【F:app/(marketing)/layout.tsx†L14-L32】
