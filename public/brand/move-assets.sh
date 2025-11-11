#!/bin/bash
# Script to move logo assets to brand directory
# Run this from the project root when files 1.png, 2.png, 3.png, 4.png, 5.png are in public/

cd "$(dirname "$0")/.."

if [ -f "public/1.png" ]; then
  mv public/1.png public/brand/klutr-logo-light.png
  echo "✓ Moved 1.png → klutr-logo-light.png"
else
  echo "✗ 1.png not found"
fi

if [ -f "public/2.png" ]; then
  mv public/2.png public/brand/klutr-logo-dark.png
  echo "✓ Moved 2.png → klutr-logo-dark.png"
else
  echo "✗ 2.png not found"
fi

if [ -f "public/3.png" ]; then
  mv public/3.png public/brand/klutr-favicon.png
  echo "✓ Moved 3.png → klutr-favicon.png"
else
  echo "✗ 3.png not found"
fi

# For 4.png and 5.png, evaluate which sizes they are and rename accordingly
# You may need to check dimensions: identify -format "%wx%h" public/4.png
if [ -f "public/4.png" ]; then
  # Check dimensions and move accordingly
  DIM=$(identify -format "%wx%h" public/4.png 2>/dev/null || echo "unknown")
  case "$DIM" in
    "32x32") mv public/4.png public/brand/favicon-32x32.png && echo "✓ Moved 4.png → favicon-32x32.png" ;;
    "192x192") mv public/4.png public/brand/favicon-192x192.png && echo "✓ Moved 4.png → favicon-192x192.png" ;;
    "180x180") mv public/4.png public/brand/apple-touch-icon.png && echo "✓ Moved 4.png → apple-touch-icon.png" ;;
    *) mv public/4.png public/brand/favicon-extra-4.png && echo "? Moved 4.png → favicon-extra-4.png (check dimensions)" ;;
  esac
else
  echo "✗ 4.png not found"
fi

if [ -f "public/5.png" ]; then
  DIM=$(identify -format "%wx%h" public/5.png 2>/dev/null || echo "unknown")
  case "$DIM" in
    "32x32") mv public/5.png public/brand/favicon-32x32.png && echo "✓ Moved 5.png → favicon-32x32.png" ;;
    "192x192") mv public/5.png public/brand/favicon-192x192.png && echo "✓ Moved 5.png → favicon-192x192.png" ;;
    "180x180") mv public/5.png public/brand/apple-touch-icon.png && echo "✓ Moved 5.png → apple-touch-icon.png" ;;
    *) mv public/5.png public/brand/favicon-extra-5.png && echo "? Moved 5.png → favicon-extra-5.png (check dimensions)" ;;
  esac
else
  echo "✗ 5.png not found"
fi

echo ""
echo "Done! Check public/brand/ for moved files."
