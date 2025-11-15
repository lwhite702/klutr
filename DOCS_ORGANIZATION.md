# Documentation Organization

**Date:** 2025-01-27  
**Status:** ✅ Organized for Mintlify Cloud

## Directory Structure

### Customer-Facing Documentation (`/mintlify/`)
All user-facing documentation that will be published to Mintlify Cloud:

```
/mintlify/
├── overview.mdx              # Welcome page
├── getting-started.mdx        # First-time user guide
├── stream.mdx                 # Stream interface
├── notes-guide.mdx            # Notes guide
├── boards.mdx                 # Boards feature
├── stacks.mdx                 # Stacks organization
├── mindstorm.mdx              # MindStorm clustering
├── spark.mdx                  # Spark AI partner
├── muse.mdx                   # Muse insights
├── insights.mdx               # Insights patterns
├── vault.mdx                  # Vault encryption
├── memory-lane.mdx            # Memory Lane timeline
├── feature-flags.mdx          # Feature flags (technical)
└── support.mdx                # Contact support
```

**Total:** 14 customer-facing documentation pages

### Internal Documentation (`/docs/internal/`)
Developer and internal documentation - **NOT scanned by Mintlify**:

```
/docs/internal/
├── ai-architecture.md
├── basehub-content-updates.md
├── brand-redesign.md
├── email-templates.md
├── mcp-troubleshooting.md
├── monorepo.md
├── refreshing-marketing-content.md
├── resend-setup.md
├── setup-guide.md
├── stream-architecture.md
├── supabase-auth-config.md
└── testing-checklist.md
```

### External Documentation (`/docs/external/`)
Previously had customer-facing docs, now moved to `/mintlify/`:

```
/docs/external/
└── support/
    └── contacting-support.md  # MOVED to mintlify/support.mdx
```

## Mintlify Configuration

### Configuration File
- **Location:** `/workspace/docs.json`
- **Format:** Latest Mintlify schema
- **Schema:** `https://mintlify.com/schema.json`

### Navigation Structure
Configured in `docs.json` with 5 groups:
1. **Getting Started** (2 pages)
2. **Using Klutr** (5 pages)
3. **AI Tools** (3 pages)
4. **Features** (3 pages)
5. **Support** (1 page)

### Ignore Patterns
`.mintlifyignore` excludes:
- All `.md` files except those in `/mintlify/`
- `/docs/internal/` directory
- `/docs/external/` directory
- Root-level documentation files
- Architecture and technical docs
- Implementation and migration docs
- Reports directory

## Verification

### ✅ All Customer-Facing Docs in `/mintlify/`
- [x] 14 MDX files in `/mintlify/` directory
- [x] All pages referenced in `docs.json` navigation
- [x] Support page moved from `/docs/external/` to `/mintlify/`
- [x] All pages have proper frontmatter with SEO metadata

### ✅ Internal Docs Excluded
- [x] `/docs/internal/` in `.mintlifyignore`
- [x] `/docs/external/` in `.mintlifyignore`
- [x] All technical docs excluded
- [x] No MDX files outside `/mintlify/` directory

### ✅ Configuration Ready
- [x] `docs.json` uses latest schema
- [x] Navigation structure matches files
- [x] Branding configured (logo, colors, favicon)
- [x] Topbar and footer links configured

## Next Steps for Mintlify Cloud Setup

1. **Connect Repository:**
   - Go to https://mintlify.com
   - Connect your GitHub repository
   - Select the branch to deploy from

2. **Configure Settings:**
   - Set docs directory to `/mintlify`
   - Configure custom domain (if desired)
   - Set up API keys for publishing

3. **Verify Deployment:**
   - Check that all 14 pages appear in navigation
   - Verify links work correctly
   - Test search functionality

4. **Monitor:**
   - Check for broken links
   - Review analytics
   - Gather user feedback

## File Counts

- **Customer-facing (Mintlify):** 14 MDX files
- **Internal docs:** 12 MD files in `/docs/internal/`
- **External docs:** 0 (moved to Mintlify)
- **Total docs:** 26 files

---

**Status:** ✅ Ready for Mintlify Cloud deployment. All customer-facing documentation is properly organized in `/mintlify/` and internal documentation is excluded from scanning.
