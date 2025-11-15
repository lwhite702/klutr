# External Documentation

This directory contains customer-facing documentation that is published to Mintlify Cloud.

## Structure

```
docs/external/
└── mintlify/          # Mintlify documentation source files
    ├── overview.mdx
    ├── getting-started.mdx
    ├── stream.mdx
    └── ... (14 total MDX files)
```

## Mintlify Configuration

- **Config File:** `/workspace/docs.json` (at project root)
- **Docs Directory:** `docs/external/mintlify/`
- **Ignore File:** `.mintlifyignore` (at project root)

## Publishing

Documentation is automatically published to Mintlify Cloud when:
- Changes are pushed to the connected branch
- Manual publish via `pnpm docs:publish`

See `/workspace/MINTLIFY_READY.md` for setup instructions.
