# Quick Start - Klutr with Supabase

Get the Klutr app running with Supabase in under 15 minutes.

## Prerequisites

- Node.js 18+ and pnpm installed
- Supabase account (free tier works)
- OpenAI API key
- Git repository access

## Step 1: Clone and Install (2 minutes)

```bash
git clone <your-repo-url>
cd klutr
pnpm install
```

## Step 2: Create Supabase Project (5 minutes)

1. Go to https://app.supabase.com
2. Click "New Project"
3. Name it "klutr-mvp"
4. Choose a region close to you
5. Set a strong database password
6. Wait for project to be created (~2 minutes)

## Step 3: Configure Database (3 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run"
5. Repeat for files 002, 003, and 004

**Or use Supabase CLI:**
```bash
supabase login
supabase link --project-ref your-project-id
supabase db push
```

## Step 4: Set Environment Variables (2 minutes)

1. In Supabase dashboard, go to **Project Settings > API**
2. Copy these values:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

3. Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
OPENAI_API_KEY=[your-openai-key]
CRON_SECRET=some-random-secret-string
```

## Step 5: Start Development Server (1 minute)

```bash
pnpm dev
```

Visit http://localhost:3000

## Step 6: Test Basic Features (2 minutes)

1. **Create a note**:
   - Type in the quick capture bar
   - Press Enter
   - Note should appear with AI-generated tags

2. **View notes**:
   - Navigate to "MindStorm" page
   - Your note should be visible

3. **Check database**:
   - Go to Supabase dashboard > Table Editor
   - Open "notes" table
   - Your note should be there

## ✅ Success!

You're now running Klutr with Supabase!

## Next Steps

### For MVP Demo:
- Create more sample notes
- Generate smart stacks
- Try the vault feature
- Review weekly insights

### For Production:
1. Follow `DEPLOYMENT_CHECKLIST.md`
2. Deploy to Vercel
3. Enable Supabase Auth (optional)
4. Set up monitoring

## Common Issues

### "Can't connect to database"
- Check `.env.local` has correct Supabase URL and keys
- Verify Supabase project is not paused

### "OpenAI errors"
- Ensure OPENAI_API_KEY is set
- Check OpenAI account has credits

### "Notes not saving"
- Verify migrations ran successfully
- Check Supabase logs for errors
- Ensure demo user exists in users table

## Files to Review

- `SUPABASE_SETUP.md` - Detailed setup guide
- `MIGRATION_COMPLETE.md` - What changed in the migration
- `DEPLOYMENT_CHECKLIST.md` - Production deployment guide
- `.env.example` - Environment variable template

## Need Help?

1. Check `MIGRATION_COMPLETE.md` for troubleshooting
2. Review Supabase docs: https://supabase.com/docs
3. Check code comments for implementation details

---

**Total Time**: ~15 minutes

**What You Get**:
- ✅ Full-featured note-taking app
- ✅ AI-powered classification
- ✅ Vector-based clustering
- ✅ Encrypted vault
- ✅ Weekly insights
- ✅ File storage ready
- ✅ Production-ready architecture
