# Klutr Bug List and Technical Debt

**Date:** 2025-11-19
**Status:** Draft

## Bug List

| ID | Area | Severity | Description | Expected Behavior | Actual Behavior | Suggested Fix |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| BUG-001 | Vault | Critical | Vault unlocks with any password | Vault should only unlock with correct passphrase and decrypt real data | Accepts any non-empty string and shows mock/empty state | Connect `VaultLockScreen` to `lib/encryption/secure.ts` or hide feature |
| BUG-002 | MindStorm | Major | Clicking a cluster reloads the page | Should navigate client-side | Triggers full browser refresh (`window.location.href`) | Use `useRouter().push()` |
| BUG-003 | Stream | Minor | 'n' shortcut might fail | Should focus input reliably | Uses `document.querySelector` which depends on DOM structure | Use `useRef` for the input element |
| BUG-004 | MindStorm | Minor | Inconsistent error handling | Should use global error/toast patterns | Uses raw `fetch` and local error handling | Refactor to use `clientApi` |

## Technical Debt

| Category | Item | Impact | Effort | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Architecture** | Vault Integration | High | L | The crypto utility exists but is completely disconnected from UI/API. |
| **DX** | API Consistency | Medium | S | `MindStormPanel` bypasses `clientApi` wrapper. |
| **Performance** | Background Tasks | Medium | M | `create/route.ts` uses unawaited promises for AI. Needs a queue system (e.g., BullMQ) for robustness in future. |
| **Testing** | E2E Coverage | High | L | Playwright tests are scaffolded but incomplete. |
| **Type Safety** | API Responses | Medium | S | Some API routes might not be strictly typed against DTOs. |
