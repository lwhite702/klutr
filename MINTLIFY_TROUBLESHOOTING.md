# Mintlify Cloud Troubleshooting

**Error:** "Unable to find docs.json or mint.json"

## Quick Fix Checklist

### ✅ Step 1: Verify File Location
```bash
# docs.json MUST be at repository root
ls -la docs.json
```

**Expected:** File should exist at `/workspace/docs.json` (repository root)

### ✅ Step 2: Verify File is Committed
```bash
git status docs.json
git ls-files docs.json
```

**If not committed:**
```bash
git add docs.json
git commit -m "Add Mintlify configuration"
git push
```

### ✅ Step 3: Check Branch
- Ensure you selected the correct branch in Mintlify Cloud
- The branch should have `docs.json` committed
- Try the default branch (usually `main` or `master`)

### ✅ Step 4: Verify Configuration
```bash
# Check JSON is valid
cat docs.json | jq .

# Check required fields
cat docs.json | jq '.["$schema"]'
cat docs.json | jq '.navigation'
```

## Current Setup

### File Locations
- **Config:** `/workspace/docs.json` ✅ (repository root)
- **Docs:** `/workspace/docs/external/*.mdx` ✅ (14 files)

### Mintlify Cloud Settings
When connecting, use:
- **Docs Directory:** `docs/external`
- **Config File:** `docs.json` (auto-detected at root)
- **Branch:** Your default branch (usually `main`)

## Common Issues

### Issue 1: File Not Committed
**Symptom:** Mintlify Cloud can't find `docs.json`

**Solution:**
```bash
git add docs.json
git commit -m "Add Mintlify configuration"
git push
```

### Issue 2: Wrong Branch
**Symptom:** File exists but Mintlify can't find it

**Solution:**
- Check which branch Mintlify Cloud is connected to
- Ensure `docs.json` is on that branch
- Try switching to `main` or `master` branch

### Issue 3: File in Wrong Location
**Symptom:** File exists but not at root

**Solution:**
- `docs.json` MUST be at repository root
- Not in a subdirectory
- Not named differently

### Issue 4: Invalid JSON
**Symptom:** File found but can't be parsed

**Solution:**
```bash
# Validate JSON
cat docs.json | jq .

# Fix any syntax errors
```

## Verification Commands

Run these to verify setup:

```bash
# 1. Check file exists at root
[ -f docs.json ] && echo "✅ docs.json at root" || echo "❌ Missing"

# 2. Check JSON is valid
cat docs.json | jq . > /dev/null && echo "✅ Valid JSON" || echo "❌ Invalid JSON"

# 3. Check required fields
cat docs.json | jq '.["$schema"]' && echo "✅ Has schema"
cat docs.json | jq '.navigation' && echo "✅ Has navigation"

# 4. Check docs directory
ls -1 docs/external/*.mdx | wc -l && echo "MDX files found"
```

## After Fixing

1. **Commit changes:**
   ```bash
   git add docs.json docs/external/
   git commit -m "Configure Mintlify documentation"
   git push
   ```

2. **Reconnect in Mintlify Cloud:**
   - Go to Mintlify dashboard
   - Try reconnecting repository
   - Or create a new site connection

3. **Verify:**
   - Check deployment logs
   - Verify all 14 pages appear
   - Test navigation

---

**Current Status:** ✅ `docs.json` exists at root, ready for commit and deployment
