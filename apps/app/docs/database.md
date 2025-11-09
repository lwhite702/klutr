---
title: "Database Schema and Migration Guide"
author: cursor-agent
updated: 2025-10-29
---

# Database Schema and Migration Guide

## Overview

This document describes the database schema, migration strategies, and data management for the Noteornope (MindStorm) application. The schema supports the core features: notes, clustering, stacks, vault, insights, and user management.

## Current Schema (Phase 1)

### Core Models

#### User Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  notes     Note[]
  clusters  Cluster[]
  stacks    Stack[]
  insights  Insight[]
  vaultNotes VaultNote[]
}
```

#### Note Model

```prisma
model Note {
  id          String   @id @default(cuid())
  content     String
  tags        String[]
  embedding   Unsupported("vector(1536)")?  // pgvector column
  userId      String
  clusterId   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  cluster     Cluster? @relation(fields: [clusterId], references: [id])

  // Indexes
  @@index([userId])
  @@index([clusterId])
  @@index([createdAt])
}
```

#### Cluster Model

```prisma
model Cluster {
  id        String   @id @default(cuid())
  name      String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  notes     Note[]

  // Indexes
  @@index([userId])
  @@index([createdAt])
}
```

#### Stack Model

```prisma
model Stack {
  id        String   @id @default(cuid())
  name      String
  pinned    Boolean  @default(false)
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([userId])
  @@index([pinned])
  @@index([createdAt])
}
```

#### Insight Model

```prisma
model Insight {
  id        String   @id @default(cuid())
  title     String
  content   String
  weekStart DateTime
  weekEnd   DateTime
  userId    String
  createdAt DateTime @default(now())

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([userId])
  @@index([weekStart])
  @@index([createdAt])
}
```

#### VaultNote Model

```prisma
model VaultNote {
  id        String   @id @default(cuid())
  ciphertext String
  iv        String
  salt      String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([userId])
  @@index([createdAt])
}
```

## pgvector Integration

### Extension Setup

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create vector column for note embeddings
ALTER TABLE notes ADD COLUMN embedding vector(1536);

-- Create index for similarity search
CREATE INDEX ON notes USING ivfflat (embedding vector_cosine_ops);
```

### Embedding Operations

```sql
-- Insert embedding
INSERT INTO notes (content, embedding, user_id)
VALUES ('Note content', '[0.1, 0.2, ...]', 'user_id');

-- Find similar notes
SELECT id, content, 1 - (embedding <=> '[0.1, 0.2, ...]') as similarity
FROM notes
WHERE user_id = 'user_id'
ORDER BY embedding <=> '[0.1, 0.2, ...]'
LIMIT 10;

-- Update embedding
UPDATE notes
SET embedding = '[0.1, 0.2, ...]'
WHERE id = 'note_id';
```

## Migration History

### Initial Schema (v1.0)

- Created core models: User, Note, Cluster, Stack, Insight, VaultNote
- Added pgvector support for note embeddings
- Implemented basic indexes for performance

### Planned Migrations

#### v1.1 - Supabase Migration

- Migrate from Neon to Supabase Postgres
- Add Row-Level Security (RLS) policies
- Update connection strings and environment variables

#### v1.2 - Enhanced Indexing

- Add composite indexes for common queries
- Optimize pgvector indexes for better performance
- Add full-text search indexes

#### v1.3 - Audit Trail

- Add audit tables for data changes
- Implement soft deletes for important records
- Add data retention policies

## RLS Policies (Phase 3)

### User Isolation

```sql
-- Enable RLS on all tables
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_notes ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "Users can view own notes"
ON notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
ON notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
ON notes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
ON notes FOR DELETE
USING (auth.uid() = user_id);

-- Clusters policies
CREATE POLICY "Users can view own clusters"
ON clusters FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clusters"
ON clusters FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clusters"
ON clusters FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clusters"
ON clusters FOR DELETE
USING (auth.uid() = user_id);

-- Stacks policies
CREATE POLICY "Users can view own stacks"
ON stacks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stacks"
ON stacks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stacks"
ON stacks FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stacks"
ON stacks FOR DELETE
USING (auth.uid() = user_id);

-- Insights policies
CREATE POLICY "Users can view own insights"
ON insights FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights"
ON insights FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights"
ON insights FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights"
ON insights FOR DELETE
USING (auth.uid() = user_id);

-- Vault notes policies
CREATE POLICY "Users can view own vault notes"
ON vault_notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vault notes"
ON vault_notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vault notes"
ON vault_notes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vault notes"
ON vault_notes FOR DELETE
USING (auth.uid() = user_id);
```

### Service Role Access

```sql
-- Allow service role to bypass RLS for system operations
CREATE POLICY "Service role can access all data"
ON notes FOR ALL
TO service_role
USING (true);

CREATE POLICY "Service role can access all clusters"
ON clusters FOR ALL
TO service_role
USING (true);

CREATE POLICY "Service role can access all stacks"
ON stacks FOR ALL
TO service_role
USING (true);

CREATE POLICY "Service role can access all insights"
ON insights FOR ALL
TO service_role
USING (true);

CREATE POLICY "Service role can access all vault notes"
ON vault_notes FOR ALL
TO service_role
USING (true);
```

## Indexing Strategy

### Primary Indexes

```sql
-- User-based indexes for RLS performance
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_clusters_user_id ON clusters(user_id);
CREATE INDEX idx_stacks_user_id ON stacks(user_id);
CREATE INDEX idx_insights_user_id ON insights(user_id);
CREATE INDEX idx_vault_notes_user_id ON vault_notes(user_id);

-- Temporal indexes for time-based queries
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_clusters_created_at ON clusters(created_at);
CREATE INDEX idx_stacks_created_at ON stacks(created_at);
CREATE INDEX idx_insights_created_at ON insights(created_at);
CREATE INDEX idx_vault_notes_created_at ON vault_notes(created_at);

-- Vector similarity indexes
CREATE INDEX idx_notes_embedding ON notes USING ivfflat (embedding vector_cosine_ops);
```

### Composite Indexes

```sql
-- User + time composite indexes
CREATE INDEX idx_notes_user_created ON notes(user_id, created_at);
CREATE INDEX idx_clusters_user_created ON clusters(user_id, created_at);
CREATE INDEX idx_stacks_user_created ON stacks(user_id, created_at);
CREATE INDEX idx_insights_user_created ON insights(user_id, created_at);
CREATE INDEX idx_vault_notes_user_created ON vault_notes(user_id, created_at);

-- User + cluster composite indexes
CREATE INDEX idx_notes_user_cluster ON notes(user_id, cluster_id);
CREATE INDEX idx_clusters_user_name ON clusters(user_id, name);

-- User + pinned composite indexes
CREATE INDEX idx_stacks_user_pinned ON stacks(user_id, pinned);
```

### Full-Text Search Indexes

```sql
-- Full-text search on note content
CREATE INDEX idx_notes_content_fts ON notes USING gin(to_tsvector('english', content));

-- Full-text search on cluster names
CREATE INDEX idx_clusters_name_fts ON clusters USING gin(to_tsvector('english', name));

-- Full-text search on stack names
CREATE INDEX idx_stacks_name_fts ON stacks USING gin(to_tsvector('english', name));
```

## Backup Strategy

### Automated Backups

- **Daily Backups:** Full database backup every 24 hours
- **Incremental Backups:** Hourly incremental backups
- **Retention Policy:** 30 days for daily, 7 days for hourly
- **Cross-Region:** Backup replication to secondary region

### Manual Backups

```bash
# Full database backup
pg_dump -h your-db-host -U your-user -d your-database > backup_$(date +%Y%m%d_%H%M%S).sql

# Schema-only backup
pg_dump -h your-db-host -U your-user -d your-database --schema-only > schema_$(date +%Y%m%d_%H%M%S).sql

# Data-only backup
pg_dump -h your-db-host -U your-user -d your-database --data-only > data_$(date +%Y%m%d_%H%M%S).sql
```

### Recovery Procedures

1. **Point-in-Time Recovery:** Restore to specific timestamp
2. **Table-Level Recovery:** Restore individual tables
3. **User Data Recovery:** Restore specific user's data
4. **Testing:** Regular recovery testing in staging environment

## Performance Optimization

### Query Optimization

```sql
-- Optimize note similarity search
EXPLAIN ANALYZE
SELECT id, content, 1 - (embedding <=> $1) as similarity
FROM notes
WHERE user_id = $2
ORDER BY embedding <=> $1
LIMIT 10;

-- Optimize user note queries
EXPLAIN ANALYZE
SELECT * FROM notes
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 20;

-- Optimize cluster queries
EXPLAIN ANALYZE
SELECT c.*, COUNT(n.id) as note_count
FROM clusters c
LEFT JOIN notes n ON c.id = n.cluster_id
WHERE c.user_id = $1
GROUP BY c.id
ORDER BY c.created_at DESC;
```

### Connection Pooling

- **Pool Size:** 20 connections per instance
- **Idle Timeout:** 30 seconds
- **Max Lifetime:** 1 hour
- **Health Checks:** Every 5 minutes

### Caching Strategy

- **Query Result Caching:** Cache frequent queries for 5 minutes
- **Embedding Caching:** Cache embeddings to avoid regeneration
- **User Session Caching:** Cache user data for session duration

## Data Retention

### Retention Policies

- **Notes:** Retained indefinitely (user-controlled deletion)
- **Clusters:** Retained indefinitely (user-controlled deletion)
- **Stacks:** Retained indefinitely (user-controlled deletion)
- **Insights:** Retained for 1 year (automatic cleanup)
- **Vault Notes:** Retained indefinitely (user-controlled deletion)
- **Audit Logs:** Retained for 7 years (compliance requirement)

### Cleanup Procedures

```sql
-- Clean up old insights
DELETE FROM insights
WHERE created_at < NOW() - INTERVAL '1 year';

-- Clean up orphaned clusters
DELETE FROM clusters
WHERE id NOT IN (SELECT DISTINCT cluster_id FROM notes WHERE cluster_id IS NOT NULL);

-- Clean up orphaned notes
DELETE FROM notes
WHERE user_id NOT IN (SELECT id FROM users);
```

## Monitoring

### Database Metrics

- **Connection Count:** Monitor active connections
- **Query Performance:** Track slow queries
- **Index Usage:** Monitor index effectiveness
- **Storage Usage:** Track database size growth

### Alerting

- **High Connection Count:** Alert when connections > 80% of limit
- **Slow Queries:** Alert when queries > 5 seconds
- **Storage Full:** Alert when storage > 90% capacity
- **Backup Failures:** Alert on backup job failures

## References

- **Prisma Schema:** `/prisma/schema.prisma`
- **Migration Files:** `/prisma/migrations/`
- **Architecture:** `/docs/architecture.md`
- **Vault Security:** `/docs/vault.md`
- **Cron Jobs:** `/docs/cron.md`
