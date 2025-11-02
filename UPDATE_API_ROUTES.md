# API Routes Migration Status

This document tracks the migration of API routes from Prisma to Supabase.

## Completed Routes ✅

- `/api/notes/create` - Migrated to Supabase
- `/api/notes/list` - Migrated to Supabase
- `/api/notes/update` - Migrated to Supabase
- `/api/notes/nope` - Migrated to Supabase
- `/api/notes/classify` - Migrated to Supabase
- `/api/stacks/list` - Migrated to Supabase (via buildSmartStacks)
- `/api/stacks/pin` - Migrated to Supabase
- `/api/stacks/detail` - Migrated to Supabase
- `/api/vault/create` - Migrated to Supabase
- `/api/vault/list` - Migrated to Supabase

## Remaining Routes (Auto-compatible)

The following routes use AI functions or simple operations that will work with the Supabase layer:

- `/api/insights/generate` - Uses AI functions
- `/api/insights/list` - Simple query
- `/api/memory/activity` - Simple query
- `/api/memory/notes-by-week` - Simple query
- `/api/mindstorm/clusters` - Uses AI functions
- `/api/mindstorm/recluster` - Uses AI functions
- `/api/cron/nightly-cluster` - Uses AI functions
- `/api/cron/nightly-stacks` - Uses AI functions
- `/api/cron/weekly-insights` - Uses AI functions

These routes will be batch-updated with import changes.

## Migration Pattern

All routes follow this pattern:

1. Replace `import { prisma } from "@/lib/db"` with `import { db } from "@/lib/supabaseDb"`
2. Replace Prisma query methods with Supabase equivalents
3. Update field names from camelCase to snake_case where needed
4. Update console.log prefixes from `[v0]` to `[klutr]`

## Notes

- The DTO layer handles both camelCase (Prisma) and snake_case (Supabase) automatically
- Auth is prepared but not enabled (returns demo user)
- All routes maintain backward compatibility with existing frontend code
