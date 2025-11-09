# Resend Email Setup Guide

This guide walks through setting up Resend for Supabase email functionality.

## Overview

Resend is used as the email service provider for Supabase Auth emails, including:
- Email confirmation (signup)
- Password reset
- Email change confirmation
- Magic link authentication (if enabled)

## Step 1: Create Resend Account

1. Go to https://resend.com
2. Sign up for an account (free tier available)
3. Verify your email address

## Step 2: Generate API Key

1. Navigate to **API Keys** in Resend dashboard
2. Click **"Create API Key"**
3. Name it: `Klutr Production` (or similar)
4. Copy the API key (starts with `re_`)
5. **Important:** Save this key securely - you won't be able to see it again

## Step 3: Add API Key to Doppler

1. Open Doppler dashboard
2. Navigate to your project (`noteornope` or `klutr`)
3. Select the appropriate config (dev/staging/prod)
4. Add new secret:
   - **Key:** `RESEND_API_KEY`
   - **Value:** Your Resend API key (e.g., `re_abc123...`)

## Step 4: Verify Domain in Resend

**For Production:**

1. In Resend dashboard, go to **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `klutr.app`
4. Add the required DNS records:
   - **SPF Record:** `v=spf1 include:resend.com ~all`
   - **DKIM Records:** (provided by Resend, typically 3 CNAME records)
   - **DMARC Record:** `v=DMARC1; p=none; rua=mailto:dmarc@klutr.app`
5. Wait for verification (usually 5-15 minutes)
6. Once verified, you can send from `noreply@klutr.app` or any subdomain

**For Development:**

- Use Resend's default domain: `onboarding.resend.dev`
- No DNS configuration needed
- Limited to 100 emails/day on free tier

## Step 5: Configure Supabase SMTP Settings

1. Go to **Supabase Dashboard → Project Settings → Auth**
2. Scroll to **SMTP Settings**
3. Enable **"Enable Custom SMTP"**
4. Fill in the following:

   **SMTP Host:**
   ```
   smtp.resend.com
   ```

   **SMTP Port:**
   ```
   465
   ```
   (or `587` for TLS)

   **SMTP User:**
   ```
   resend
   ```

   **SMTP Password:**
   ```
   [Your Resend API Key - from Doppler]
   ```

   **Sender Email:**
   ```
   noreply@klutr.app
   ```
   (or `onboarding@resend.dev` for development)

   **Sender Name:**
   ```
   Klutr
   ```

5. Click **"Save"**

## Step 6: Test Email Sending

### Option 1: Supabase Test Email

1. In Supabase Dashboard → Auth → Email Templates
2. Click **"Send test email"**
3. Enter your email address
4. Check your inbox for the test email

### Option 2: Trigger Password Reset

1. Go to your app's login page
2. Click "Forgot password" (if implemented)
3. Enter your email
4. Check inbox for password reset email

### Option 3: Sign Up Flow

1. Create a new user account
2. Check inbox for confirmation email
3. Click confirmation link

## Email Templates Customization

Klutr uses custom branded HTML email templates for all Supabase Auth emails. Templates are located in `/emails/templates/` and should be uploaded to Supabase Dashboard.

### Uploading Templates

1. Navigate to **Supabase Dashboard > Authentication > Email Templates**
2. For each email type, copy the HTML from the corresponding template file:
   - **Confirm signup** → `confirm-signup.html`
   - **Invite user** → `invite-user.html`
   - **Magic Link** → `magic-link.html`
   - **Change Email Address** → `change-email.html`
   - **Reset Password** → `reset-password.html`
   - **Reauthentication** → `reauthentication.html`
3. Paste the HTML into the Supabase template editor
4. Click **"Save"**

### Template Variables

Supabase uses Go template syntax. Available variables:
- `{{ .ConfirmationURL }}` - Confirmation link (note: capital URL)
- `{{ .Email }}` - User's email address
- `{{ .Token }}` - Token (if needed)
- `{{ .TokenHash }}` - Token hash
- `{{ .SiteURL }}` - Your site URL

### Brand Colors

Templates use Klutr brand colors:
- **Coral:** `#FF6B6B` (confirm-signup, magic-link, reset-password, reauthentication)
- **Mint:** `#3EE0C5` (invite-user, change-email)
- **Background:** `#F7F7F9` (cloud)
- **Text:** `#111827` (charcoal)

### Full Documentation

For detailed instructions, see `/docs/internal/email-templates.md` which includes:
- Step-by-step upload instructions
- Template variable reference
- Testing procedures
- Customization guide
- Troubleshooting tips

## Environment Variables Summary

**Doppler:**
- `RESEND_API_KEY` - Resend API key for SMTP authentication

**Supabase Dashboard:**
- SMTP settings configured with Resend credentials
- Sender email set to verified domain

## Troubleshooting

### Emails Not Sending

1. **Check Resend API Key:**
   - Verify key is correct in Doppler
   - Ensure key is copied correctly (no extra spaces)

2. **Check Domain Verification:**
   - Verify domain status in Resend dashboard
   - Check DNS records are correct
   - Wait for DNS propagation (can take up to 48 hours)

3. **Check Supabase SMTP Settings:**
   - Verify all fields are filled correctly
   - Test connection using "Send test email"
   - Check Supabase logs for SMTP errors

4. **Check Resend Dashboard:**
   - View **Logs** in Resend dashboard
   - Check for bounces or rejections
   - Verify sending limits (free tier: 100/day, 3,000/month)

### Emails Going to Spam

1. **Verify Domain:**
   - Ensure SPF, DKIM, and DMARC records are set
   - Use a verified domain (not `onboarding.resend.dev`)

2. **Check Email Content:**
   - Avoid spam trigger words
   - Include unsubscribe link (if applicable)
   - Use proper HTML structure

3. **Warm Up Domain:**
   - Start with low volume
   - Gradually increase sending volume
   - Monitor bounce rates

### Rate Limits

**Resend Free Tier:**
- 100 emails/day
- 3,000 emails/month
- 1 domain

**Resend Pro Tier:**
- 50,000 emails/month
- Unlimited domains
- Advanced analytics

If you hit rate limits, consider upgrading or implementing email queuing.

## Best Practices

1. **Use Verified Domain:**
   - Always use a verified domain in production
   - Set up proper DNS records
   - Monitor domain reputation

2. **Monitor Email Metrics:**
   - Check Resend dashboard for delivery rates
   - Monitor bounce rates
   - Track open rates (if using Resend Pro)

3. **Customize Templates:**
   - Match your brand identity
   - Include clear call-to-action
   - Test on multiple email clients

4. **Security:**
   - Never commit API keys to git
   - Use Doppler for secret management
   - Rotate API keys periodically

## Next Steps

After setup:
- [ ] Test email confirmation flow
- [ ] Test password reset flow
- [ ] Customize email templates
- [ ] Monitor email delivery rates
- [ ] Set up email analytics (if using Resend Pro)

