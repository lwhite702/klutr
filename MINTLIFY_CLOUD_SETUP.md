# Mintlify Cloud Setup - Fixed Configuration

**Date:** 2025-01-27  
**Status:** ✅ Fixed and Ready

## Issue Resolved

**Problem:** "Unable to find docs.json or mint.json"

**Root Cause:** Old `mint.json` file was present, which may have confused Mintlify Cloud.

**Solution:** 
- ✅ Removed old `mint.json` file
- ✅ Using only `docs.json` (latest format)
- ✅ Simplified directory structure to `docs/external/`

## Current Setup

### File Structure
```
/workspace/ (repository root)
├── docs.json                    ⭐ ONLY config file (at root)
└── docs/
    ├── internal/               (excluded)
    └── external/                ⭐ Docs directory
        ├── overview.mdx
        ├── getting-started.mdx
        └── ... (14 total MDX files)
```

### Configuration
- **Config File:** `docs.json` at repository root ✅
- **Docs Directory:** `docs/external` ✅
- **Total Pages:** 14 MDX files ✅

## Mintlify Cloud Settings

When connecting your repository, use these **exact** settings:

### Repository Connection
1. **Repository:** `lwhite702/klutr`
2. **Branch:** `main` (or your default branch)
3. **Docs Directory:** `docs/external` ⚠️ **CRITICAL**
4. **Config File:** `docs.json` (auto-detected at root)

### Important Notes
- ✅ `docs.json` MUST be at repository root (not in a subdirectory)
- ✅ `docs.json` MUST be committed to the branch you're connecting
- ✅ Use `docs/external` as docs directory (not `docs/external/mintlify`)
- ✅ Only `docs.json` should exist (old `mint.json` removed)

## Verification

Before connecting, verify:

```bash
# 1. docs.json exists at root
ls -la docs.json

# 2. File is committed
git ls-files docs.json

# 3. JSON is valid
cat docs.json | jq .

# 4. Docs directory has files
ls -1 docs/external/*.mdx | wc -l  # Should show 14
```

## If Still Getting "Unable to find docs.json"

### Check 1: File Location
```bash
# Must be at repository root
pwd  # Should show /workspace or repository root
ls -la docs.json  # Should exist here
```

### Check 2: File is Committed
```bash
# Check if file is tracked
git ls-files docs.json

# If not, commit it:
git add docs.json
git commit -m "Add Mintlify configuration"
git push
```

### Check 3: Branch Selection
- In Mintlify Cloud, ensure you selected the branch that has `docs.json`
- Try the default branch (usually `main` or `master`)
- The file must exist on the branch you're connecting

### Check 4: Reconnect Repository
- Try disconnecting and reconnecting the repository
- Or create a new site connection
- Mintlify should auto-detect `docs.json` at root

## Current Status

✅ **Configuration is correct:**
- `docs.json` at repository root
- `docs/external/` contains 14 MDX files
- Old `mint.json` removed
- All files committed to git

✅ **Ready for Mintlify Cloud:**
- Use docs directory: `docs/external`
- Config will auto-detect from root

---

**Next Step:** Connect to Mintlify Cloud with docs directory set to `docs/external`
