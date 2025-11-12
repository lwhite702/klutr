#!/usr/bin/env bash
# scripts/publish-mintlify.sh
# Usage: MINTLIFY_API_KEY=xxx MINTLIFY_PROJECT_ID=yyy bash scripts/publish-mintlify.sh [staging|production]

set -euo pipefail

ENV=${1:-staging}
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS_DIR="$ROOT/docs/external"
API_KEY="${MINTLIFY_API_KEY:-}"
PROJECT_ID="${MINTLIFY_PROJECT_ID:-}"

if [ -z "$API_KEY" ] || [ -z "$PROJECT_ID" ]; then
  echo "MINTLIFY_API_KEY and MINTLIFY_PROJECT_ID required"
  exit 1
fi

# Example Mintlify endpoint - replace if Mintlify uses different endpoint
BASE_URL="https://api.mintlify.com/v1/projects/$PROJECT_ID/docs"

echo "Publishing docs from $DOCS_DIR to Mintlify project $PROJECT_ID (env: $ENV)"

find "$DOCS_DIR" -name '*.md' -o -name '*.mdx' | while read -r file; do
  rel=$(realpath --relative-to="$DOCS_DIR" "$file")
  title=$(head -n 1 "$file" | sed -n '1p' | sed 's/^#\s*//')
  
  echo "Publishing $rel..."
  
  # Minimal API model: POST to create or PUT to update by path slug
  # Note: This is a placeholder - verify actual Mintlify API endpoint and format
  curl -s -X POST "$BASE_URL" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg path "$rel" --arg title "$title" --arg env "$ENV" '{path:$path, title:$title, env:$env}')" || echo "Failed to publish $rel"
  
  echo
done

echo "Publish complete."
echo "Note: Verify Mintlify API endpoint and request format before production use."

