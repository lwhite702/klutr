# PR Summary - Vercel Production Prep & Tawk Integration

Generated: 2025-11-12

## Branches Created

### 1. `marketing/tawk-widget`
**Files Changed:**
- `app/(marketing)/components/TawkWidget.client.tsx` (new)
- `app/(marketing)/components/OpenSupportButton.client.tsx` (new)
- `app/(marketing)/layout.tsx` (updated - added Tawk widget)

**Verification Steps:**
- Set `NEXT_PUBLIC_TAWK_PROPERTY_ID` in Vercel environment variables
- Deploy to preview
- Visit marketing pages (/, /about, /pricing, etc.)
- Verify Tawk widget appears in bottom-right corner
- Click widget to verify it opens
- Check browser console for errors

**Branch**: `marketing/tawk-widget`
**PR URL:** (Create PR: `marketing/tawk-widget` → `main`)

---

### 2. `app/tawk-secure-login`
**Files Changed:**
- `lib/helpers/tawkHash.ts` (new - HMAC-SHA256 helper)
- `app/api/tawk/hash/route.ts` (new - API endpoint)
- `app/(app)/components/TawkAuth.client.tsx` (new - client initialization)
- `app/(app)/layout.tsx` (updated - added TawkAuth component)

**Verification Steps:**
- Set `TAWK_SECRET` in Vercel environment variables (server-side only)
- Deploy to preview
- Log in to the app
- Check browser console for "Tawk attributes set successfully" message
- Verify `/api/tawk/hash` returns `{ id, name, email, tawkHash }` for authenticated requests
- Test with unauthenticated request - should return 401

**Branch**: `marketing/tawk-widget`
**PR URL:** (Create PR: `marketing/tawk-widget` → `main`)

---

### 3. `ci/nonblocking-verify`
**Files Changed:**
- `.github/workflows/nonblocking-verify.yml` (new)

**Verification Steps:**
- Open a PR
- Verify workflow runs on PR
- Check that build logs are uploaded as artifacts
- Verify workflow does NOT fail on missing env vars
- Check that warnings are logged instead

**Branch**: `marketing/tawk-widget`
**PR URL:** (Create PR: `marketing/tawk-widget` → `main`)

---

### 4. `docs/reorg/<timestamp>`
**Files Changed:**
- All files from manifest copied to `docs/external/` or `docs/internal/`
- `docs/external/support/contacting-support.md` (new)

**Verification Steps:**
- Review file moves in PR diff
- Verify external docs have Mintlify frontmatter
- Verify support page includes Tawk toggle script
- Check that no secrets are exposed in external docs

**Branch**: `marketing/tawk-widget`
**PR URL:** (Create PR: `marketing/tawk-widget` → `main`)

---

## Scripts Created

1. `scripts/generate-docs-manifest.py` - Scans repo and generates manifest
2. `scripts/move-docs.sh` - Reorganizes docs based on manifest
3. `scripts/publish-mintlify.sh` - Publishes docs to Mintlify (staging/production)

## Environment Variables Required

### Client-side (NEXT_PUBLIC_*)
- `NEXT_PUBLIC_TAWK_PROPERTY_ID` - Tawk property ID for marketing widget

### Server-side (Secrets)
- `TAWK_SECRET` - Tawk secure-login secret (HMAC-SHA256)
- `MINTLIFY_API_KEY` - For docs publish CI
- `MINTLIFY_PROJECT_ID` - Mintlify project identifier

## Build Status

✅ Build passes successfully
- Fixed missing checkbox component
- Fixed route conflict (removed duplicate login page)
- Added @types/jsdom for TypeScript

## Next Steps

1. Create PRs for each branch
2. Set environment variables in Vercel
3. Deploy to preview and verify
4. Merge PRs after review
5. Publish Mintlify docs using publish script

