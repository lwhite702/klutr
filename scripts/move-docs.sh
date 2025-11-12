#!/usr/bin/env bash
# Non-destructive move (copy) of docs into docs/external and docs/internal based on manifest
# Usage: bash scripts/move-docs.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT/docs/manifest.json"
TS=$(date +%Y%m%d%H%M%S)
BRANCH="docs/reorg/$TS"

# Check if jq is available
if ! command -v jq &> /dev/null; then
  echo "Error: jq is required but not installed. Install with: brew install jq"
  exit 1
fi

git checkout -b "$BRANCH"

if [ ! -f "$MANIFEST" ]; then
  echo "Manifest not found. Run scripts/generate-docs-manifest.py first."
  exit 1
fi

# Create reports directory if it doesn't exist
mkdir -p "$ROOT/reports"
MOVE_LOG="$ROOT/reports/docs-move-log.txt"
echo "Documentation move log - $(date)" > "$MOVE_LOG"
echo "=================================" >> "$MOVE_LOG"
echo "" >> "$MOVE_LOG"

jq -c '.files[]' "$MANIFEST" | while read -r entry; do
  path=$(echo "$entry" | jq -r '.path')
  target=$(echo "$entry" | jq -r '.target')
  category=$(echo "$entry" | jq -r '.category')
  
  src="$ROOT/$path"
  dest="$ROOT/$target"
  
  if [ -f "$src" ]; then
    mkdir -p "$(dirname "$dest")"
    cp -v "$src" "$dest" >> "$MOVE_LOG" 2>&1
    echo "$path -> $target [$category]" >> "$MOVE_LOG"
  else
    echo "MISSING: $src" >> "$MOVE_LOG"
  fi
done

git add docs/
git commit -m "Docs reorg: copy manifest files into docs/external and docs/internal" || echo "No changes to commit"

echo "" >> "$MOVE_LOG"
echo "Move operation completed at $(date)" >> "$MOVE_LOG"
echo "Created branch $BRANCH. Review changes and open PR."
echo "Move log saved to $MOVE_LOG"

