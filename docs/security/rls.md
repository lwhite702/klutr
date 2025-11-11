# Row Level Security (RLS) Policies

**Last Updated:** 2025-01-27

## Overview

Row Level Security (RLS) policies ensure that users can only access their own data in Supabase. All tables that store user data must have RLS enabled and appropriate policies.

## RLS Policy Requirements

### Users Table
- **RLS Enabled:** Yes
- **Policies:**
  - Users can read their own record
  - Users can update their own record
  - Service role can read/update all (for admin operations)

### Notes Table
- **RLS Enabled:** Yes
- **Policies:**
  - Users can read their own notes (`user_id = auth.uid()`)
  - Users can create notes with their own `user_id`
  - Users can update/delete their own notes
  - Service role can read/update all (for admin operations)

### Messages Table
- **RLS Enabled:** Yes
- **Policies:**
  - Users can read their own messages (`user_id = auth.uid()`)
  - Users can create messages with their own `user_id`
  - Users can update/delete their own messages
  - Service role can read/update all (for admin operations)

### ConversationThreads Table
- **RLS Enabled:** Yes
- **Policies:**
  - Users can read their own threads (`user_id = auth.uid()`)
  - Users can create threads with their own `user_id`
  - Users can update/delete their own threads
  - Service role can read/update all (for admin operations)

### Tags Table
- **RLS Enabled:** Yes
- **Policies:**
  - Users can read their own tags (`user_id = auth.uid()`)
  - Users can create tags with their own `user_id`
  - Users can update/delete their own tags
  - Service role can read/update all (for admin operations)

### SmartStacks Table
- **RLS Enabled:** Yes
- **Policies:**
  - Users can read their own stacks (`user_id = auth.uid()`)
  - Users can create stacks with their own `user_id`
  - Users can update/delete their own stacks
  - Service role can read/update all (for admin operations)

### WeeklyInsights Table
- **RLS Enabled:** Yes
- **Policies:**
  - Users can read their own insights (`user_id = auth.uid()`)
  - Users can create insights with their own `user_id`
  - Service role can read/update all (for admin operations)

### VaultNotes Table
- **RLS Enabled:** Yes
- **Policies:**
  - Users can read their own vault notes (`user_id = auth.uid()`)
  - Users can create vault notes with their own `user_id`
  - Users can update/delete their own vault notes
  - Service role can read/update all (for admin operations)

### Boards Table
- **RLS Enabled:** Yes
- **Policies:**
  - Users can read their own boards (`user_id = auth.uid()`)
  - Users can create boards with their own `user_id`
  - Users can update/delete their own boards
  - Service role can read/update all (for admin operations)

## Implementation

RLS policies should be created via SQL migrations in Supabase. Example:

```sql
-- Enable RLS on notes table
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own notes
CREATE POLICY "Users can read own notes"
  ON notes FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Users can create notes with their own user_id
CREATE POLICY "Users can create own notes"
  ON notes FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: Users can update their own notes
CREATE POLICY "Users can update own notes"
  ON notes FOR UPDATE
  USING (user_id = auth.uid());

-- Policy: Users can delete their own notes
CREATE POLICY "Users can delete own notes"
  ON notes FOR DELETE
  USING (user_id = auth.uid());
```

## Service Role Key Usage

The service role key (`SUPABASE_SERVICE_ROLE_KEY`) bypasses RLS and should only be used:
- In server-side API routes
- For admin operations
- For background jobs (cron)
- Never expose service role key to client-side code

## Testing RLS Policies

1. Create test user accounts
2. Verify users can only access their own data
3. Verify users cannot access other users' data
4. Test with service role key (should bypass RLS)
5. Test with anonymous key (should respect RLS)

## Security Notes

- RLS is the primary security mechanism for data isolation
- Always verify `user_id` matches `auth.uid()` in policies
- Service role operations should still validate user_id in application code
- Regularly audit RLS policies for correctness
