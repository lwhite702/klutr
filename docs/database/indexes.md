# Database Indexes

This document describes the database indexes used in Klutr for optimal query performance.

## Existing Indexes (from Prisma Schema)

### Notes Table

```sql
-- User and time-based queries
CREATE INDEX "notes_userId_createdAt_idx" ON notes ("userId", "createdAt");

-- Type-based filtering
CREATE INDEX "notes_userId_type_idx" ON notes ("userId", "type");

-- Cluster-based queries
CREATE INDEX "notes_userId_cluster_idx" ON notes ("userId", "cluster");

-- Drop type filtering
CREATE INDEX "notes_userId_dropType_idx" ON notes ("userId", "dropType");
```

**Purpose:**
- Fast user-specific note retrieval
- Efficient filtering by type and cluster
- Time-series queries (recent notes)
- Stream view filtering

### Tags Table

```sql
-- Unique constraint serves as index
CREATE UNIQUE INDEX "tags_userId_name_key" ON tags ("userId", name);
```

**Purpose:**
- Prevent duplicate tag names per user
- Fast tag lookup by name

### Note Tags (Join Table)

```sql
-- Primary key serves as index
CREATE INDEX "note_tags_pkey" ON note_tags ("noteId", "tagId");

-- Individual column indexes (from Prisma)
CREATE INDEX "note_tags_noteId_idx" ON note_tags ("noteId");
CREATE INDEX "note_tags_tagId_idx" ON note_tags ("tagId");
```

**Purpose:**
- Fast tag-based note lookup
- Efficient note-tag relationship queries
- Quick tag deletion cascade

### Smart Stacks Table

```sql
CREATE INDEX "smart_stacks_userId_idx" ON smart_stacks ("userId");
```

**Purpose:**
- Fast user-specific stack retrieval

### Weekly Insights Table

```sql
-- Unique constraint serves as index
CREATE UNIQUE INDEX "weekly_insights_userId_weekStart_key" 
  ON weekly_insights ("userId", "weekStart");

-- Additional index for queries
CREATE INDEX "weekly_insights_userId_weekStart_idx" 
  ON weekly_insights ("userId", "weekStart");
```

**Purpose:**
- Prevent duplicate insights per week
- Fast insight retrieval by date range

### Boards Table

```sql
CREATE INDEX "boards_userId_idx" ON boards ("userId");

-- Composite index for sorted/filtered queries
CREATE INDEX "boards_userId_pinned_updatedAt_idx" 
  ON boards ("userId", pinned, "updatedAt");
```

**Purpose:**
- Fast board listing
- Efficient pinned board queries
- Sorted board retrieval

### Board Notes (Join Table)

```sql
CREATE INDEX "board_notes_boardId_idx" ON board_notes ("boardId");
CREATE INDEX "board_notes_noteId_idx" ON board_notes ("noteId");
```

**Purpose:**
- Fast board-note relationship queries
- Efficient cascade operations

### Conversation Threads Table

```sql
CREATE INDEX "conversation_threads_userId_createdAt_idx" 
  ON conversation_threads ("userId", "createdAt");
```

**Purpose:**
- Fast thread listing with time ordering

### Messages Table

```sql
-- Thread-based queries
CREATE INDEX "messages_threadId_createdAt_idx" 
  ON messages ("threadId", "createdAt");

-- User-based queries
CREATE INDEX "messages_userId_createdAt_idx" 
  ON messages ("userId", "createdAt");
```

**Purpose:**
- Fast message retrieval within threads
- User-specific message queries
- Time-series analysis

---

## Vector Indexes (pgvector)

### Notes Table - Vector Similarity Search

```sql
-- IVFFlat index for approximate nearest neighbor search
CREATE INDEX notes_embedding_idx ON notes 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

**Purpose:**
- Fast semantic similarity search
- Clustering operations
- Related note discovery

**Parameters:**
- `lists = 100`: Number of clusters (tune based on dataset size)
  - Rule of thumb: `sqrt(total_rows)`
  - For 10K notes: 100 lists
  - For 100K notes: 300 lists
  - For 1M notes: 1000 lists

**Usage:**
```sql
-- Find similar notes
SELECT id, content, 1 - (embedding <=> $1) as similarity
FROM notes
WHERE "userId" = $2
ORDER BY embedding <=> $1
LIMIT 10;
```

### Messages Table - Vector Similarity Search

```sql
-- IVFFlat index for message embeddings
CREATE INDEX messages_embedding_idx ON messages 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

**Purpose:**
- Similar message search
- Thread matching
- Semantic search across conversations

---

## Recommended Additional Indexes

### For Full-Text Search

```sql
-- GIN index for full-text search on notes
CREATE INDEX notes_content_search_idx ON notes 
USING gin(to_tsvector('english', content));

-- GIN index for message content search
CREATE INDEX messages_content_search_idx ON messages 
USING gin(to_tsvector('english', content));
```

**Purpose:**
- Fast text search
- Fallback when vector search not available
- Combined with vector search for hybrid ranking

**Usage:**
```sql
-- Full-text search
SELECT id, content, ts_rank(to_tsvector('english', content), query) as rank
FROM notes, to_tsquery('english', $1) query
WHERE to_tsvector('english', content) @@ query
ORDER BY rank DESC;
```

### For Analytics Queries

```sql
-- Note creation tracking
CREATE INDEX notes_createdAt_idx ON notes ("createdAt");

-- Message analytics
CREATE INDEX messages_type_createdAt_idx ON messages (type, "createdAt");

-- User activity tracking
CREATE INDEX messages_userId_type_createdAt_idx 
  ON messages ("userId", type, "createdAt");
```

**Purpose:**
- Time-series analytics
- Usage metrics
- Activity dashboards

---

## Index Maintenance

### Update Vector Indexes

```sql
-- Reindex after significant data changes
REINDEX INDEX notes_embedding_idx;
REINDEX INDEX messages_embedding_idx;
```

### Monitor Index Usage

```sql
-- Check index usage statistics
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Check Index Size

```sql
-- View index sizes
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Unused Indexes

```sql
-- Find unused indexes (consider removing)
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
  AND indexname NOT LIKE '%_pkey';
```

---

## Performance Tuning

### Vector Index Tuning

For better vector search performance:

1. **Increase lists for larger datasets:**
   ```sql
   DROP INDEX notes_embedding_idx;
   CREATE INDEX notes_embedding_idx ON notes 
   USING ivfflat (embedding vector_cosine_ops)
   WITH (lists = 300); -- Increase for 100K+ notes
   ```

2. **Use HNSW for better accuracy (if available):**
   ```sql
   CREATE INDEX notes_embedding_hnsw_idx ON notes 
   USING hnsw (embedding vector_cosine_ops);
   ```

3. **Set probes for query time:**
   ```sql
   SET ivfflat.probes = 10; -- Increase for better recall
   ```

### Query Optimization

Use `EXPLAIN ANALYZE` to verify index usage:

```sql
EXPLAIN ANALYZE
SELECT * FROM notes
WHERE "userId" = 'user123'
ORDER BY "createdAt" DESC
LIMIT 20;
```

Expected output should show:
- `Index Scan` (not `Seq Scan`)
- Low `cost` values
- Fast `actual time`

---

## Migration Script

To apply all recommended indexes:

```sql
-- Run this after initial schema setup
-- Full-text search indexes
CREATE INDEX IF NOT EXISTS notes_content_search_idx ON notes 
USING gin(to_tsvector('english', content));

CREATE INDEX IF NOT EXISTS messages_content_search_idx ON messages 
USING gin(to_tsvector('english', content));

-- Vector indexes
CREATE INDEX IF NOT EXISTS notes_embedding_idx ON notes 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS messages_embedding_idx ON messages 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS notes_createdAt_idx ON notes ("createdAt");
CREATE INDEX IF NOT EXISTS messages_type_createdAt_idx ON messages (type, "createdAt");
CREATE INDEX IF NOT EXISTS messages_userId_type_createdAt_idx 
  ON messages ("userId", type, "createdAt");
```

---

## Monitoring and Alerts

Set up monitoring for:

1. **Index bloat:** Indexes > 2GB should be monitored
2. **Slow queries:** Queries taking > 100ms
3. **Missing indexes:** Queries with `Seq Scan` on large tables
4. **Index usage:** Indexes with 0 scans after 1 week

---

*Last updated: 2025-11-11*
