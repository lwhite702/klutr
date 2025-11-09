# Klutr Monorepo

This is a pnpm monorepo containing the Klutr application, documentation site, and shared packages.

## Structure

```
/
├── apps/
│   ├── app/          # Next.js application (main app + marketing)
│   └── docs/         # Mintlify documentation site
├── packages/
│   ├── brand/        # @klutr/brand - Brand configuration
│   └── utils/        # @klutr/utils - Common utilities
├── pnpm-workspace.yaml
└── package.json      # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js LTS
- pnpm (via corepack: `corepack enable && corepack prepare pnpm@latest --activate`)
- Doppler CLI (for environment variables)

### Installation

```bash
# Install all workspace dependencies
pnpm install
```

### Development

```bash
# Run the app
pnpm dev

# Or run specific workspaces
pnpm dev:app    # Run app only
pnpm dev:docs   # Run docs only
```

### Building

```bash
# Build all workspaces
pnpm build

# Or build specific workspaces
pnpm build:app
pnpm build:docs
```

## Workspaces

### `@klutr/app`

The main Next.js application including:
- Stream interface
- Boards
- Muse insights
- Vault (encrypted notes)
- Marketing pages

**Location:** `apps/app/`

**Commands:**
- `pnpm --filter @klutr/app dev` - Start dev server
- `pnpm --filter @klutr/app build` - Build for production
- `pnpm --filter @klutr/app db:push` - Push database schema

### `@klutr/docs`

Mintlify documentation site.

**Location:** `apps/docs/`

**Commands:**
- `pnpm --filter @klutr/docs dev` - Start Mintlify dev server
- `pnpm --filter @klutr/docs build` - Build docs

### `@klutr/brand`

Shared brand configuration (colors, typography, logos, animations).

**Location:** `packages/brand/`

**Usage:**
```typescript
import { brandColors, typography, logoPaths } from "@klutr/brand"
```

### `@klutr/utils`

Shared utility functions (cn, withTimeout, retry).

**Location:** `packages/utils/`

**Usage:**
```typescript
import { cn, withTimeout, retry } from "@klutr/utils"
```

## Environment Variables

This project uses [Doppler](https://doppler.com) for environment variable management. See `apps/app/DOPPLER.md` for setup instructions.

## Documentation

- **Monorepo Guide:** See `apps/app/docs/internal/monorepo.md`
- **Development Setup:** See `apps/app/docs/dev-setup.md`
- **User Documentation:** See `apps/docs/` (Mintlify site)

## Deployment

### App

The app is deployed to Vercel. Configure in Vercel dashboard:
- **Root Directory:** `apps/app`
- **Build Command:** `pnpm --filter @klutr/app build`
- **Install Command:** `pnpm install`

### Docs

The docs site is deployed via Mintlify. Changes are automatically deployed when pushed to the default branch.

## License

Private - All rights reserved

