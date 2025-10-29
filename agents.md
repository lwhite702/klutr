# Wrelik Agent Operating Rules
Version: 1.0
Status: Required for all contributors (human or AI)
Last updated: 2025-10-29 (America/New_York)

This document defines how automated agents (Cursor, MCP agents, AI assistants, etc.) must work in this repository and in all future Wrelik applications.
If an agent cannot follow these rules, the agent should stop and request human guidance rather than guessing.

⸻

## 0. Core Principles

1. **Consistency beats improvisation.**
   All code, file structure, naming, and docs must match the conventions in this file before inventing something new.

2. **Context is sacred.**
   Agents must use all available context (including project guidelines, codebase state, prior architectural decisions, and our product identity) before generating code or docs. Do not "start from scratch" in isolation.

3. **We bias toward open source solutions.**
   If an established, well-maintained open source approach exists, we prefer that over reimplementing non-differentiating features.

4. **Humans should be able to read what happened.**
   Every significant change must carry a clear diff summary: what changed, why, and when.

⸻

## 1. Branch, Commit, and Changelog Rules

### 1.1 Branching conventions
- Feature work should happen in feature branches named like:
  - `feature/<short-description>`
  - Example: `feature/mindstorm-recluster-endpoint`
- Integration or merge work should happen in:
  - `merge/<source>-into-<target>`
  - Example: `merge/opus-into-main`

**Agents must never push directly to main unless explicitly directed in writing.**

### 1.2 Commit discipline

Every commit created by an agent must:
- Be focused: a commit should represent one logical unit of change.
- Include a commit message with:
  - A short summary line (max ~70 chars)
  - A body that explains:
    - What changed
    - Why it changed
    - Any new files or deleted files
    - Any known follow-ups / TODOs

### 1.3 Changelog discipline

In addition to normal git commits, agents MUST update (or create if missing) a repo-level changelog file:

**CHANGELOG.md**

When an agent makes a non-trivial change (new feature, refactor, structural change, schema change, route added, cron behavior changed, etc.), the agent must append a new entry in CHANGELOG.md under a heading for the current date and time.

Rules for CHANGELOG.md:
- Use the real current timestamp in America/New_York.
- Format:

```
## 2025-10-29 14:52 ET

- [feature] Added /api/mindstorm/recluster endpoint (no auth yet, returns { ok: true })
- [ui] Added <QuickCaptureBar /> to /app with working submit handler
- [infra] Added CRON_SECRET check in /api/cron/test
- [docs] Updated agents.md rules for changelog discipline
- [risk] Vault layout currently still using default AppShell; will diverge later
```

- Do not rewrite older timestamps or reorder history.
- Do not group unrelated changes into one bullet. Clarity > aesthetics.

**Agents must never skip the changelog. The changelog is our historical record of intent.**

⸻

## 2. Required Use of Context

Agents MUST treat the repository itself as the primary source of truth.

When generating or modifying code:
1. Read existing code in this repo for patterns before generating new abstractions.
2. Reuse existing components, utils, helpers, or styles if they already solve the need.
3. Follow the naming patterns and file locations already in the repo.

When generating new files:
- Place them in folders consistent with our current file organization (e.g. components/, lib/, app/<route>/page.tsx, app/<route>/layout.tsx, types/, etc.).
- Do NOT invent new top-level folders without strong justification.

When defining new function names, types, or prop interfaces:
- Reuse existing naming conventions (camelCase for functions, PascalCase for components, UpperCamelCase for types/interfaces).
- Carry forward existing props patterns (for example: activeRoute, showDemoBadge, etc.) instead of inventing parallel-but-different props.

**Agents MUST assume that "context7" (the high-level product direction and architectural intent we've already discussed in this repo — Notes or Nope / MindStorm / Stacks / Vault / Insights / Memory / Nope) applies to all code going forward.**
If there is an older pattern in the repo that conflicts with context7, context7 wins.

### 2.1 Context7 MCP Requirement

**CRITICAL: Agents MUST use Context7 MCP tools before generating any code that uses external libraries or dependencies.**

Before writing code that imports or uses any external library:
1. Use `mcp_Context7_resolve-library-id` to find the correct library ID
2. Use `mcp_Context7_get-library-docs` to fetch up-to-date documentation
3. Generate code based on the official documentation, not assumptions
4. Include proper imports and usage patterns from the official docs

This ensures all code follows current best practices and API patterns.

### 2.2 Governance Binding

**Agents MUST load and reference these documents before generating any output:**
- `agents.md` (this file) - behavioral standards
- `PRD.md` - product requirements and vision
- `BRAND_VOICE.md` - communication standards

If any of these files are missing, the agent MUST create them before proceeding with other work.

⸻

## 3. Tooling and MCP Usage

Agents MUST use all available MCP (Model Context Protocol) connectors and automations they have access to when performing work.

Examples:
- If an MCP tool can fetch Figma component specs, use it to align components with design.
- If an MCP tool can call GitHub (list branches, open PRs), use it instead of guessing branch names or file states.
- If an MCP tool can run a file tree or schema inspection, use it before generating new schema changes.

**Rule:**
Never hallucinate missing context that can be pulled via an available tool.
Always attempt to gather first, then generate.

If a tool returns an error or access denied, you MUST:
- Explicitly note that in the changelog description for that work
- Continue with the best information you do have
- Do not silently invent data to "pretend the tool worked"

⸻

## 4. Testing Rules

This is critical.

All agent-driven testing for now MUST assume "browser-level functional testing."

That means:
- The agent should verify that pages render without throwing (no runtime crashes).
- The agent should confirm basic interactions fire handlers without throwing (e.g. clicking "Re-cluster now" logs successfully, submitting QuickCaptureBar doesn't explode).
- The agent should confirm responsive behavior where applicable (sidebar collapses to sheet on mobile breakpoints, etc.).

**Explicitly:**
- Agents MUST NOT generate or rely on Node.js-only headless unit tests as a substitute for checking runtime.
- Agents MUST ensure imports resolve, components compile, pages render, and there are no React runtime reference errors.

When an agent says "tested", that means:
- The app builds in Next.js
- The routes render in a browser-like environment (dev server or equivalent simulation)
- There are no console errors on initial load

If runtime is broken, the agent MUST fix it before committing.

⸻

## 5. Documentation Rules

We distinguish between two types of docs: external (user-facing) and internal (engineering-facing).

### 5.1 External / consumer-facing docs
- All public / user-facing documentation MUST be written for Mintlify.
- That means any docs meant for end users (how to use Vault, how MindStorm works, what Insights means, onboarding "Welcome to your second brain," etc.) must be authored as Mintlify-compatible content.
- Tone: clear, human, non-developer, no internal jargon.
- Agents should create/modify Mintlify content instead of random Markdown guides scattered throughout the repo.

**Rule:**
If you are documenting something a user will see or a user will depend on to use the product, assume Mintlify. Do not put that doc in /docs/internal. Do not bury it in comments.

### 5.2 Internal / technical docs
- All internal technical docs MUST live under /docs/ in the repo root.
- This includes:
  - architectural decisions,
  - API contract notes,
  - data model notes,
  - security considerations (e.g. Vault encryption key handling),
  - background job/cron behavior,
  - environment setup,
  - deployment details,
  - integration notes for pgvector/Prisma/etc.
- These docs MUST be written in Markdown.
- These docs MUST be explicit, not clever, and must document known risks.

Example of good internal doc excerpt:
```
"Vault notes are encrypted client-side using AES-GCM. The server stores only ciphertext and never sees the key. Currently keys are kept in localStorage after unlock. This is a temporary compromise; long term we will migrate to WebCrypto-backed ephemeral keys. Risk: refresh loses key."
```

Agents MUST update /docs/ in the same PR whenever they introduce or change:
- database schema / Prisma models
- API routes under /api/
- cron / background jobs and secrets
- auth/session/data ownership model
- encryption or security-related flows

Do not leave undocumented behavior.

⸻

## 6. Secrets, Cron, and Security

Agents MUST follow these security rules:

1. **CRON_SECRET:**
   - Any cron-like route under /api/cron/* MUST validate an Authorization: Bearer <CRON_SECRET> header.
   - Agents MUST ensure CRON_SECRET is documented in DOPPLER.md.
   - Agents MUST NOT hardcode actual secrets in code or commit them.

2. **Vault / encrypted notes:**
   - Client-side encryption code MUST be documented in /docs/vault.md (create this file if it does not exist).
   - Agents MUST NOT log plaintext vault contents or derived keys.

3. **API routes:**
   - Before adding a new API route, agent must:
     - Check if an equivalent or similar route already exists in the codebase.
     - Reuse patterns for error handling and response formatting.
   - Every route MUST have a comment describing:
     - Auth assumptions
     - Body shape
     - Response shape
     - Side effects (enqueue jobs, mutate db, trigger AI, etc.)

4. **Environment Variables:**
   - All environment variables are managed via Doppler across all environments.
   - No .env files should be committed to the repository.
   - Reference DOPPLER.md for variable documentation.

⸻

## 7. Open Source Rule

Wrelik default policy:
We prefer stable, well-maintained open source solutions over bespoke reinvention for any non-differentiating capability.

Concretely:
- UI primitives → shadcn/ui components, Tailwind, framer-motion
- drag-and-drop → dnd-kit (or similar mature OSS)
- graph/visual mind map → React Flow, tldraw, or similar, not custom canvas unless required
- embeddings / pgvector integration → standard Prisma + Postgres + pgvector extension patterns, not custom vector math in JS if pgvector handles it
- onboarding tours / tooltips → use established patterns/libraries if we adopt one; do not build an in-house tour framework if there's a clean OSS option

Agents MUST:
- Look for OSS before writing a novel internal utility.
- Justify any "roll our own" in /docs/ (for example: "We wrote custom encryption wrapper because off-the-shelf libs do not enforce our client-side-only guarantee.")

Agents MUST preserve licenses and attribution when pulling in OSS code as source.

⸻

## 8. Style, Naming, and Structure

Agents MUST:
- Use TypeScript everywhere. No plain .js files.
- Keep React components in PascalCase (NoteCard.tsx, VaultLockScreen.tsx).
- Keep server helpers and utilities in camelCase (reclusterNotes.ts, encryptVaultNote.ts).
- Keep types/interfaces in PascalCase with clear names (NoteDTO, StackSummary, WeeklyInsight).

Agents MUST:
- Keep shared view-layer building blocks (SidebarNav, TopBar, AppShell, cards, grids, lock screens, chips) in components/.
- Keep domain logic helpers (AI prompts, clustering helpers, embedding helpers, cron logic) in lib/ or lib/ai/ or lib/jobs/.
- Keep static / mock data generators in lib/mockData.ts.
- Keep motion constants / variants in lib/animations.ts.

Agents MUST NOT:
- Scatter random util files at the top level.
- Add new folders at the root without documenting why in /docs/architecture.md.

⸻

## 9. When in doubt

If an agent is about to:
- invent a new pattern,
- remove an existing component,
- or change data models,

the agent MUST:
1. Say what it's doing in CHANGELOG.md with timestamp.
2. Update or create the relevant doc in /docs/ explaining the change.
3. Prefer not to introduce breaking changes silently.

If the agent cannot reconcile these rules with the request it was given, it MUST stop and ask a human rather than charge ahead and corrupt the repo.

⸻

## 10. TL;DR for Agents

When you (the agent) touch this repo, you MUST:

1. Always read existing code + docs first. Follow them.
2. Always update CHANGELOG.md with a timestamped entry in ET (America/New_York).
3. Always use context7 (our product model: Notes, MindStorm, Stacks, Vault, Insights, Memory, Nope) when naming pages/components.
4. Always use MCP tools to gather context (Figma, GitHub, repo tree) before generating code.
5. Always use Context7 MCP to fetch library documentation before generating code with external dependencies.
6. Always test in a browser-like environment to confirm the app builds and routes render with no runtime errors.
7. Always put external/user-facing docs in Mintlify format, and put internal technical docs in /docs/.
8. Always prefer open source libraries for non-differentiating features before attempting to write your own.
9. Always protect secrets and cron endpoints with CRON_SECRET.
10. Always load agents.md, PRD.md, and BRAND_VOICE.md before generating any output.

Breaking these rules is considered a failed task.

⸻

End of agents.md.
