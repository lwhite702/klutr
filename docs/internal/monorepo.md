# Monorepo Structure

This document explains the monorepo structure and how to work with it.

## Overview

The Klutr codebase is organized as a pnpm monorepo with the following structure:

```
/
├── apps/
│   ├── app/          # Next.js application
│   └── docs/         # Mintlify documentation
├── packages/
│   ├── brand/        # @klutr/brand package
│   └── utils/        # @klutr/utils package
└── pnpm-workspace.yaml
```

## Workspaces

### Apps

**`apps/app/`** - Main Next.js application
- Contains the Stream interface, Boards, Muse, Vault, and marketing pages
- Uses `@klutr/brand` and `@klutr/utils` packages
- Deployed to Vercel

**`apps/docs/`** - Mintlify documentation site
- User-facing documentation
- Deployed via Mintlify

### Packages

**`packages/brand/`** - Brand configuration
- Exports: `brandColors`, `typography`, `logoPaths`, `animations`
- Used by both app and docs (potentially)

**`packages/utils/`** - Common utilities
- Exports: `cn()`, `withTimeout()`, `retry()`
- Used throughout the app

## Working with Workspaces

### Running Commands

```bash
# Run command in specific workspace
pnpm --filter @klutr/app dev
pnpm --filter @klutr/docs dev

# Run command in all workspaces
pnpm -r build

# Run command from root (uses workspace scripts)
pnpm dev          # Runs app dev
pnpm dev:app      # Runs app dev
pnpm dev:docs     # Runs docs dev
```

### Adding Dependencies

```bash
# Add to specific workspace
pnpm --filter @klutr/app add <package>

# Add to root (for dev tools)
pnpm add -w -D <package>
```

### Using Shared Packages

Shared packages are automatically linked via pnpm workspaces:

```typescript
// In apps/app/
import { brandColors } from "@klutr/brand"
import { cn } from "@klutr/utils"
```

## Development Workflow

1. **Install dependencies:** `pnpm install` (from root)
2. **Start dev server:** `pnpm dev` (runs app)
3. **Make changes** in `apps/app/` or `packages/*/`
4. **Changes to packages** are automatically reflected (no rebuild needed in dev)

## Building

```bash
# Build all workspaces
pnpm build

# Build specific workspace
pnpm --filter @klutr/app build
```

## Adding New Packages

1. Create directory: `packages/<name>/`
2. Create `package.json` with name `@klutr/<name>`
3. Add to `pnpm-workspace.yaml` (already includes `packages/*`)
4. Install dependencies: `pnpm install`
5. Use in apps: `import ... from "@klutr/<name>"`

## Import Paths

### In `apps/app/`

- `@/components` → `apps/app/components`
- `@/lib` → `apps/app/lib`
- `@klutr/brand` → `packages/brand/src`
- `@klutr/utils` → `packages/utils/src`

### In `apps/docs/`

- Standard Mintlify structure

## Troubleshooting

**Issue:** Package not found
- Run `pnpm install` from root
- Check package name matches `@klutr/<name>`

**Issue:** Changes to package not reflected
- Restart dev server
- Check package exports in `package.json`

**Issue:** TypeScript errors in packages
- Run `pnpm --filter @klutr/<package> type-check`
- Check `tsconfig.json` in package

