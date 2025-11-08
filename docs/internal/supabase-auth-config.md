# Supabase Auth Configuration Guide

This document outlines the required Supabase dashboard settings for authentication and redirect URLs.

## Required Supabase Dashboard Settings

### 1. Authentication Settings

Navigate to: **Supabase Dashboard > Authentication > URL Configuration**

#### Site URL

Set your production domain:

```
https://klutr.app
```

For local development, also add:

```
http://localhost:3000
```

#### Redirect URLs (Allowed Redirect URLs)

Add all URLs that Supabase Auth may redirect to after authentication:

**Production:**

```
https://klutr.app
https://klutr.app/app
https://klutr.app/login
https://klutr.app/app/*
```

**Development:**

```
http://localhost:3000
http://localhost:3000/app
http://localhost:3000/login
http://localhost:3000/app/*
```

**Vercel Preview Deployments:**

```
https://*.vercel.app
https://*.vercel.app/app
https://*.vercel.app/login
https://*.vercel.app/app/*
```

**Note:** The wildcard pattern `https://klutr.app/app/*` allows redirects to any `/app/*` route after login.

### 2. Email Auth Provider

Navigate to: **Supabase Dashboard > Authentication > Providers > Email**

**Settings:**

- Enable Email provider
- Enable "Confirm email" (recommended for production)
- Enable "Secure email change" (recommended)

**Email Service Provider (Resend):**

1. **Set up Resend:**

   - Go to https://resend.com and create an account
   - Create an API key in Resend dashboard (Settings > API Keys)
   - Add the API key to Doppler as `RESEND_API_KEY`

2. **Configure Resend in Supabase:**

   - Navigate to **Supabase Dashboard > Project Settings > Auth > SMTP Settings**
   - Select **"Custom SMTP"** or **"Resend"** (if available as direct integration)
   - If using Custom SMTP, use these Resend SMTP settings:
     - **Host:** `smtp.resend.com`
     - **Port:** `465` (SSL) or `587` (TLS)
     - **Username:** `resend`
     - **Password:** Your Resend API key (`RESEND_API_KEY`)
     - **Sender email:** Use a verified domain in Resend (e.g., `noreply@klutr.app`)
     - **Sender name:** `Klutr` (optional)

3. **Verify Domain in Resend:**

   - Add your domain (`klutr.app`) in Resend dashboard
   - Add the required DNS records (SPF, DKIM, DMARC)
   - Wait for domain verification (usually a few minutes)

4. **Test Email Sending:**
   - Use Supabase's "Send test email" feature
   - Or trigger a password reset to test the flow

**Email Templates:**

Klutr uses custom branded HTML templates for all auth emails. To upload templates:

1. Navigate to **Supabase Dashboard > Authentication > Email Templates**
2. For each email type, copy HTML from `/emails/templates/`:
   - Confirm signup → `confirm-signup.html`
   - Invite user → `invite-user.html`
   - Magic Link → `magic-link.html`
   - Change Email Address → `change-email.html`
   - Reset Password → `reset-password.html`
   - Reauthentication → `reauthentication.html`
3. Paste HTML into Supabase template editor
4. Click **"Save"**

**Template Variables:**

- Use Supabase Go template syntax: `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .SiteURL }}`
- Supabase automatically replaces variables when sending

**Full Guide:**
See `/docs/internal/email-templates.md` for complete setup instructions, testing procedures, and customization guide.

### 3. OAuth Providers (Optional)

If you plan to add OAuth providers later (Google, GitHub, etc.):

Navigate to: **Supabase Dashboard > Authentication > Providers**

For each provider:

1. Enable the provider
2. Add Client ID and Client Secret
3. Add redirect URL: `https://klutr.app/auth/callback` (or your callback route)

### 4. Row Level Security (RLS)

Navigate to: **Supabase Dashboard > Table Editor**

Ensure RLS is enabled on all user-facing tables:

- `notes` - Users can only see their own notes
- `tags` - Users can only see their own tags
- `smart_stacks` - Users can only see their own stacks
- `weekly_insights` - Users can only see their own insights
- `vault_notes` - Users can only see their own vault notes
- `ai_sessions` - Users can only see their own AI sessions

**RLS Policy Example:**

```sql
-- Example policy for notes table
CREATE POLICY "Users can only see their own notes"
ON notes FOR SELECT
USING (auth.uid() = user_id::uuid);
```

### 5. API Settings

Navigate to: **Supabase Dashboard > Settings > API**

**Verify:**

- Project URL matches `NEXT_PUBLIC_SUPABASE_URL`
- Anon/public key matches `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Service role key matches `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 6. Database Extensions

Navigate to: **Supabase Dashboard > Database > Extensions**

Ensure these extensions are enabled:

- `uuid-ossp` - For UUID generation
- `vector` (pgvector) - For embeddings and similarity search

## Current App Redirect Flow

1. **Unauthenticated user accesses `/app/*`:**

   - Middleware redirects to `/login?redirect=/app/...`
   - User logs in via email/password
   - App redirects to `/app` or the `redirect` query param

2. **Login page (`/login`):**

   - Uses `supabase.auth.signInWithPassword()`
   - On success: redirects to `redirect` query param or `/app`
   - Uses Next.js router, not Supabase redirect

3. **No OAuth callbacks currently:**
   - App uses email/password only
   - No OAuth providers configured in code
   - If adding OAuth later, will need callback route

## Verification Checklist

- [ ] Site URL set in Supabase dashboard
- [ ] All redirect URLs added to allowed list
- [ ] Email provider enabled
- [ ] RLS policies configured for all tables
- [ ] pgvector extension enabled
- [ ] API keys match environment variables
- [ ] Test login flow: `/login` to `/app`
- [ ] Test protected route: `/app` without auth redirects to `/login`

## Troubleshooting

**"Invalid redirect URL" error:**

- Check that the redirect URL is in the allowed list
- Ensure URL matches exactly (including protocol, domain, path)
- For wildcards, ensure pattern matches Supabase's format

**Auth not working:**

- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check browser console for CORS errors
- Verify middleware is running (check Network tab)

**Session not persisting:**

- Check cookie settings in middleware
- Verify `@supabase/ssr` package is installed
- Ensure cookies are being set correctly
