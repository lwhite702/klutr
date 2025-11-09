# Refreshing Marketing Site Content

After updating content in BaseHub, you may need to refresh the marketing site to see the changes. Here are the methods:

## Development Mode

### Method 1: Restart Dev Server (Simplest)

1. Stop your current dev server (Ctrl+C)
2. Restart it:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

This clears Next.js cache and fetches fresh content from BaseHub.

### Method 2: Use Revalidation API

If your dev server is running, you can trigger a revalidation:

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"path": "/"}'
```

Or for a specific page:
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"path": "/features/stream"}'
```

### Method 3: Hard Refresh Browser

1. Open your browser's developer tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

This forces the browser to fetch fresh content, but won't clear Next.js server cache.

## Preview Mode (For Unpublished Content)

If you want to preview unpublished/draft content from BaseHub:

1. Visit: `/api/preview?secret=YOUR_PREVIEW_SECRET`
   - Replace `YOUR_PREVIEW_SECRET` with your actual `BASEHUB_PREVIEW_SECRET` value
   - This enables Next.js draft mode, which automatically enables BaseHub draft mode

2. The BaseHub Toolbar will appear (if mounted), allowing live editing

3. To exit preview mode, visit: `/api/preview/disable`

## Production Mode

### Method 1: Rebuild and Redeploy

The most reliable way in production:

1. Trigger a new deployment (push to main, or manually trigger in Vercel)
2. This rebuilds the site with fresh BaseHub content

### Method 2: Use Revalidation API (If Configured)

If you have the revalidation endpoint configured with proper authentication:

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SECRET" \
  -d '{"path": "/"}'
```

**Note:** The revalidation endpoint currently doesn't have authentication. You may want to add it for production use.

### Method 3: ISR Revalidation (If Configured)

If your pages use `revalidate` in their `generateStaticParams` or route config, they will automatically revalidate after the specified time period.

## Troubleshooting

### Content Still Not Updating?

1. **Check BaseHub Commit Status**
   - Ensure your changes were committed in BaseHub
   - Check BaseHub dashboard to verify content is published (not just in draft)

2. **Verify Environment Variables**
   - Ensure `BASEHUB_TOKEN` is set correctly
   - Check that token has read permissions

3. **Check Draft Mode**
   - If content is in draft, you need to enable preview mode
   - Or ensure content is committed/published in BaseHub

4. **Clear Next.js Cache**
   - Delete `.next` folder: `rm -rf .next`
   - Restart dev server

5. **Check Network Tab**
   - Open browser DevTools → Network tab
   - Look for BaseHub API calls
   - Verify they're returning the updated content

### BaseHub Query Errors

If you see errors fetching from BaseHub:

1. Check `BASEHUB_TOKEN` is set in your environment
2. Verify token is valid in BaseHub dashboard
3. Check BaseHub API status
4. Review error logs in console

## Quick Reference

| Scenario | Solution |
|----------|----------|
| Development, content updated | Restart dev server |
| Preview unpublished content | Visit `/api/preview?secret=...` |
| Production, content updated | Rebuild/redeploy |
| Content not updating | Check BaseHub commit status, clear cache |

## Related Files

- `/lib/basehub.ts` - BaseHub client configuration
- `/lib/queries/home.ts` - Home page query
- `/lib/queries/features.ts` - Features query
- `/app/api/revalidate/route.ts` - Revalidation endpoint
- `/app/api/preview/route.ts` - Preview mode endpoint

