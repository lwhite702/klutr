# Row Level Security (RLS) Policies

This document describes the Row Level Security policies implemented in Klutr to protect user data.

## Overview

RLS ensures that users can only access their own data. Policies are enforced at the database level, providing defense-in-depth security.

## Policy Strategy

- **Users can only read their own data**
- **Users can only insert data for themselves**
- **Users can only update their own data**
- **Users can only delete their own data**
- **Service role can bypass RLS for admin operations**

## Supabase RLS Policies

### Enable RLS on All Tables

```sql
-- Enable RLS on all user data tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

### Users Table

```sql
-- Users can read their own user record
CREATE POLICY "Users can read own data"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own user record
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- New users can insert their own record
CREATE POLICY "Users can insert own data"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
```

### Notes Table

```sql
-- Users can read their own notes
CREATE POLICY "Users can read own notes"
ON notes FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Users can create notes
CREATE POLICY "Users can create own notes"
ON notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

-- Users can update their own notes
CREATE POLICY "Users can update own notes"
ON notes FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

-- Users can delete their own notes
CREATE POLICY "Users can delete own notes"
ON notes FOR DELETE
TO authenticated
USING (auth.uid() = "userId");
```

### Tags Table

```sql
-- Users can read their own tags
CREATE POLICY "Users can read own tags"
ON tags FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Users can create tags
CREATE POLICY "Users can create own tags"
ON tags FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

-- Users can update their own tags
CREATE POLICY "Users can update own tags"
ON tags FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

-- Users can delete their own tags
CREATE POLICY "Users can delete own tags"
ON tags FOR DELETE
TO authenticated
USING (auth.uid() = "userId");
```

### Note Tags (Join Table)

```sql
-- Users can read note_tags for their own notes
CREATE POLICY "Users can read own note tags"
ON note_tags FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = note_tags."noteId"
    AND notes."userId" = auth.uid()
  )
);

-- Users can create note_tags for their own notes
CREATE POLICY "Users can create own note tags"
ON note_tags FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = note_tags."noteId"
    AND notes."userId" = auth.uid()
  )
);

-- Users can delete note_tags for their own notes
CREATE POLICY "Users can delete own note tags"
ON note_tags FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = note_tags."noteId"
    AND notes."userId" = auth.uid()
  )
);
```

### Smart Stacks Table

```sql
-- Users can read their own smart stacks
CREATE POLICY "Users can read own stacks"
ON smart_stacks FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Users can create smart stacks (typically via cron job with service role)
CREATE POLICY "Users can create own stacks"
ON smart_stacks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

-- Users can update their own smart stacks
CREATE POLICY "Users can update own stacks"
ON smart_stacks FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

-- Users can delete their own smart stacks
CREATE POLICY "Users can delete own stacks"
ON smart_stacks FOR DELETE
TO authenticated
USING (auth.uid() = "userId");
```

### Weekly Insights Table

```sql
-- Users can read their own insights
CREATE POLICY "Users can read own insights"
ON weekly_insights FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Users can create insights (typically via cron job with service role)
CREATE POLICY "Users can create own insights"
ON weekly_insights FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

-- Users can delete their own insights
CREATE POLICY "Users can delete own insights"
ON weekly_insights FOR DELETE
TO authenticated
USING (auth.uid() = "userId");
```

### Vault Notes Table

```sql
-- Users can read their own vault notes
CREATE POLICY "Users can read own vault notes"
ON vault_notes FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Users can create vault notes
CREATE POLICY "Users can create own vault notes"
ON vault_notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

-- Users can delete their own vault notes
CREATE POLICY "Users can delete own vault notes"
ON vault_notes FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- Note: No UPDATE policy - vault notes are immutable
```

### Boards Table

```sql
-- Users can read their own boards
CREATE POLICY "Users can read own boards"
ON boards FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Users can create boards
CREATE POLICY "Users can create own boards"
ON boards FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

-- Users can update their own boards
CREATE POLICY "Users can update own boards"
ON boards FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

-- Users can delete their own boards
CREATE POLICY "Users can delete own boards"
ON boards FOR DELETE
TO authenticated
USING (auth.uid() = "userId");
```

### Board Notes (Join Table)

```sql
-- Users can read board_notes for their own boards
CREATE POLICY "Users can read own board notes"
ON board_notes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM boards
    WHERE boards.id = board_notes."boardId"
    AND boards."userId" = auth.uid()
  )
);

-- Users can create board_notes for their own boards
CREATE POLICY "Users can create own board notes"
ON board_notes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM boards
    WHERE boards.id = board_notes."boardId"
    AND boards."userId" = auth.uid()
  )
);

-- Users can delete board_notes for their own boards
CREATE POLICY "Users can delete own board notes"
ON board_notes FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM boards
    WHERE boards.id = board_notes."boardId"
    AND boards."userId" = auth.uid()
  )
);
```

### Conversation Threads Table

```sql
-- Users can read their own threads
CREATE POLICY "Users can read own threads"
ON conversation_threads FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Users can create threads
CREATE POLICY "Users can create own threads"
ON conversation_threads FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

-- Users can update their own threads
CREATE POLICY "Users can update own threads"
ON conversation_threads FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

-- Users can delete their own threads
CREATE POLICY "Users can delete own threads"
ON conversation_threads FOR DELETE
TO authenticated
USING (auth.uid() = "userId");
```

### Messages Table

```sql
-- Users can read their own messages
CREATE POLICY "Users can read own messages"
ON messages FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Users can create messages
CREATE POLICY "Users can create own messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

-- Users can update their own messages (for embeddings, transcriptions)
CREATE POLICY "Users can update own messages"
ON messages FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
ON messages FOR DELETE
TO authenticated
USING (auth.uid() = "userId");
```

## Testing RLS Policies

### Test Policy for Notes Table

```sql
-- Set user context (replace with actual user ID)
SET request.jwt.claims.sub = 'user-id-here';

-- Try to read another user's notes (should return empty)
SELECT * FROM notes WHERE "userId" != 'user-id-here';

-- Try to read own notes (should return results)
SELECT * FROM notes WHERE "userId" = 'user-id-here';

-- Try to insert note for another user (should fail)
INSERT INTO notes (id, "userId", content) 
VALUES ('test-id', 'other-user-id', 'test');

-- Try to insert note for self (should succeed)
INSERT INTO notes (id, "userId", content) 
VALUES ('test-id', 'user-id-here', 'test');
```

### Automated Testing

Create test script in `scripts/test-rls.ts`:

```typescript
import { supabaseAdmin, supabase } from '@/lib/supabase'

async function testRLS() {
  // Create test users
  const user1 = await supabaseAdmin.auth.admin.createUser({
    email: 'test1@example.com',
    password: 'password123',
  })

  const user2 = await supabaseAdmin.auth.admin.createUser({
    email: 'test2@example.com',
    password: 'password123',
  })

  // Sign in as user1
  const client1 = supabase.auth.signInWithPassword({
    email: 'test1@example.com',
    password: 'password123',
  })

  // Create note as user1
  const { data: note1 } = await client1.from('notes').insert({
    userId: user1.data.user.id,
    content: 'User 1 note',
  })

  // Sign in as user2
  const client2 = supabase.auth.signInWithPassword({
    email: 'test2@example.com',
    password: 'password123',
  })

  // Try to read user1's note as user2 (should fail)
  const { data: notes, error } = await client2
    .from('notes')
    .select('*')
    .eq('id', note1.id)

  if (notes.length === 0) {
    console.log('✅ RLS working: User 2 cannot read User 1 notes')
  } else {
    console.log('❌ RLS FAILED: User 2 can read User 1 notes')
  }

  // Cleanup
  await supabaseAdmin.auth.admin.deleteUser(user1.data.user.id)
  await supabaseAdmin.auth.admin.deleteUser(user2.data.user.id)
}
```

## Service Role Operations

When using the service role key (e.g., in cron jobs), RLS is bypassed. Use with caution:

```typescript
import { supabaseAdmin } from '@/lib/supabase'

// Service role can access all data
const { data: allNotes } = await supabaseAdmin
  .from('notes')
  .select('*')

// Always filter by userId when using service role
const { data: userNotes } = await supabaseAdmin
  .from('notes')
  .select('*')
  .eq('userId', specificUserId)
```

## Migration Script

To apply all RLS policies at once:

```bash
cd scripts
doppler run -- npx tsx apply-rls-policies.ts
```

## Monitoring

Monitor RLS policy violations:

```sql
-- Check for auth.uid() = NULL (unauthenticated requests)
SELECT * FROM pg_stat_statements
WHERE query LIKE '%auth.uid()%'
AND calls > 0;
```

## Troubleshooting

### Error: "new row violates row-level security policy"

This means a user tried to insert/update data they don't own. Check:
1. Is `auth.uid()` matching the `userId` in the data?
2. Is the user authenticated?
3. Is the JWT token valid?

### Error: "permission denied for table X"

This means RLS is not enabled on the table. Run:

```sql
ALTER TABLE X ENABLE ROW LEVEL SECURITY;
```

### Debugging RLS

```sql
-- Show all policies on a table
SELECT * FROM pg_policies WHERE tablename = 'notes';

-- Show RLS status for all tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

---

## Security Notes

1. **Never bypass RLS in client code** - Always use service role on server
2. **Test policies thoroughly** - Use automated tests
3. **Audit policy changes** - Review all policy modifications
4. **Monitor policy violations** - Set up alerts for RLS failures
5. **Use least privilege** - Grant minimum necessary permissions

---

*Last updated: 2025-11-11*
