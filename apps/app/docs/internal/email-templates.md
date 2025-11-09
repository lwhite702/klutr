# Email Templates Setup Guide

This guide explains how to upload and customize Klutr-branded email templates in Supabase for authentication emails.

## Overview

Klutr uses custom HTML email templates for all Supabase Auth emails, sent via Resend SMTP. Templates are uploaded directly in the Supabase Dashboard and use Supabase's built-in template variable system.

## Available Templates

All templates are located in `/emails/templates/`:

- **confirm-signup.html** - Email confirmation (Coral #FF6B6B)
- **invite-user.html** - User invitation (Mint #3EE0C5)
- **magic-link.html** - Magic link authentication (Coral #FF6B6B)
- **change-email.html** - Email change confirmation (Mint #3EE0C5)
- **reset-password.html** - Password reset (Coral #FF6B6B)
- **reauthentication.html** - Reauthentication (Mint #3EE0C5)

## Uploading Templates to Supabase

### Step 1: Access Email Templates

1. Go to **Supabase Dashboard**
2. Navigate to **Authentication > Email Templates**
3. You'll see a list of available email types

### Step 2: Upload Each Template

For each email type, follow these steps:

1. **Select the email type** (e.g., "Confirm signup")
2. **Click "Edit"** or the template editor
3. **Copy the HTML** from the corresponding template file in `/emails/templates/`
4. **Paste into the Supabase editor**
5. **Click "Save"**

### Template Mapping

Map each Supabase email type to our template file:

| Supabase Email Type | Template File |
|---------------------|---------------|
| Confirm signup | `confirm-signup.html` |
| Invite user | `invite-user.html` |
| Magic Link | `magic-link.html` |
| Change Email Address | `change-email.html` |
| Reset Password | `reset-password.html` |
| Reauthentication | `reauthentication.html` |

## Template Variables

Supabase uses Go template syntax. Available variables:

### Common Variables

- `{{ .ConfirmationURL }}` - Confirmation/action link (most common)
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL (from Supabase settings)
- `{{ .Token }}` - Token value (if needed)
- `{{ .TokenHash }}` - Token hash (if needed)

### Variable Notes

- **Capitalization matters:** Use `{{ .ConfirmationURL }}` not `{{ .confirmation_url }}`
- **Supabase automatically replaces** these variables when sending emails
- **No manual replacement needed** - Supabase handles it

## Brand Colors

Templates use Klutr brand colors:

- **Coral:** `#FF6B6B` - Used for confirm-signup, magic-link, reset-password, reauthentication
- **Mint:** `#3EE0C5` - Used for invite-user, change-email
- **Background:** `#F7F7F9` (cloud)
- **Text:** `#111827` (charcoal)
- **Muted Text:** `#6B7280` (slate)

## Typography

- **Font Family:** Inter with system fallback stack
- **Headings:** 24px, font-weight 600
- **Body:** 16px, line-height 1.6
- **Small Text:** 13px for disclaimers

## Testing Templates

### Option 1: Supabase Test Email

1. In **Supabase Dashboard > Authentication > Email Templates**
2. Click **"Send test email"** button
3. Enter your email address
4. Check your inbox for the test email
5. Verify:
   - Brand colors display correctly
   - Button links work
   - Variables are replaced (e.g., confirmation URL)
   - Responsive layout on mobile

### Option 2: Trigger Actual Flow

**Test Confirm Signup:**
1. Create a new user account via signup
2. Check inbox for confirmation email
3. Click confirmation link

**Test Password Reset:**
1. Go to login page
2. Click "Forgot password" (if implemented)
3. Enter your email
4. Check inbox for reset email
5. Click reset link

**Test Magic Link:**
1. Use magic link authentication (if enabled)
2. Check inbox for magic link email
3. Click link to sign in

## Customization

### Editing Templates

1. **Edit locally:** Modify HTML files in `/emails/templates/`
2. **Copy to Supabase:** Paste updated HTML into Supabase Dashboard
3. **Test:** Send test email to verify changes
4. **Commit:** Commit template changes to git

### Common Customizations

**Change Button Text:**
```html
<a href="{{ .ConfirmationURL }}">Your Custom Text</a>
```

**Add Logo:**
```html
<img src="https://klutr.app/logo.png" alt="Klutr" style="max-width: 120px; height: auto;" />
```

**Modify Colors:**
Update the color values in the template (e.g., `#FF6B6B` for coral, `#3EE0C5` for mint)

**Add Footer:**
```html
<p style="margin-top: 32px; font-size: 13px; color: #6B7280; text-align: center;">
  <a href="{{ .SiteURL }}" style="color: #6B7280;">Visit Klutr</a> | 
  <a href="{{ .SiteURL }}/privacy" style="color: #6B7280;">Privacy</a>
</p>
```

## Troubleshooting

### Variables Not Replacing

- **Check syntax:** Ensure variables use capital letters: `{{ .ConfirmationURL }}` not `{{ .confirmation_url }}`
- **Verify in Supabase:** Check that template is saved correctly in dashboard
- **Test email:** Use Supabase's test email feature to verify

### Emails Not Sending

- **Check SMTP settings:** Verify Resend is configured in Supabase Dashboard > Project Settings > Auth > SMTP Settings
- **Check Resend API key:** Ensure `RESEND_API_KEY` is set in Doppler
- **Check domain:** Verify domain is verified in Resend dashboard
- **Check logs:** View Supabase logs for SMTP errors

### Styling Issues

- **Email clients:** Some clients strip CSS - use inline styles (already done in templates)
- **Table layout:** Templates use table-based layout for maximum compatibility
- **Test clients:** Test in Gmail, Outlook, Apple Mail to verify rendering

### Links Not Working

- **Check URL:** Verify `{{ .ConfirmationURL }}` is being replaced
- **Check redirects:** Ensure redirect URLs are configured in Supabase Dashboard > Authentication > URL Configuration
- **Test link:** Click link in test email to verify it works

## Best Practices

1. **Version Control:** Keep templates in git for version tracking
2. **Test Before Deploy:** Always test templates before deploying to production
3. **Monitor Delivery:** Check Resend dashboard for delivery rates and bounces
4. **Keep It Simple:** Avoid complex CSS or JavaScript (email clients don't support it well)
5. **Accessibility:** Use semantic HTML and proper alt text for images
6. **Mobile First:** Templates are responsive, but test on mobile devices

## Maintenance

### Updating Templates

1. Edit template file locally
2. Test changes in Supabase test email
3. Upload to Supabase Dashboard
4. Commit changes to git
5. Update CHANGELOG.md if significant changes

### Template Versioning

Templates are versioned in git. When making changes:
- Update the template file
- Document changes in CHANGELOG.md
- Note any breaking changes (e.g., variable name changes)

## Next Steps

After uploading templates:
- [ ] Test all 6 email types
- [ ] Verify brand colors display correctly
- [ ] Check links work in all email clients
- [ ] Monitor delivery rates in Resend dashboard
- [ ] Document any customizations made

