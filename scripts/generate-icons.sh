#!/usr/bin/env bash
# Generate PNG icons from SVG source for PWA.
set -euo pipefail

SRC="public/icons/icon.svg"
TMP=$(mktemp -d)
OUTDIR="public/icons"
SIZES=(48 72 96 128 192 256 384 512)

mkdir -p "$OUTDIR"

if ! command -v sips >/dev/null 2>&1; then
  echo "  ! sips not found; skipping icon generation"
  missing=0
  for size in "${SIZES[@]}"; do
    out="$OUTDIR/icon-${size}x${size}.png"
    if [ ! -f "$out" ]; then
      missing=1
      break
    fi
  done
  if [ "$missing" -eq 1 ] || [ ! -f "$OUTDIR/apple-touch-icon.png" ]; then
    echo "  ! Missing required icons in $OUTDIR"
    echo "  ! Run this script on macOS to generate PNG icons and commit them"
    exit 1
  fi
  exit 0
fi

# Step 1: convert SVG to PNG at native resolution
sips -s format png "$SRC" --out "$TMP/base.png" >/dev/null 2>&1

# Step 2: resize to each required size
for size in "${SIZES[@]}"; do
  out="$OUTDIR/icon-${size}x${size}.png"
  sips -z "$size" "$size" "$TMP/base.png" --out "$out" >/dev/null 2>&1
  echo "  ✓ icon-${size}x${size}.png"
done

# apple-touch-icon (180x180 for iOS)
sips -z 180 180 "$TMP/base.png" --out "$OUTDIR/apple-touch-icon.png" >/dev/null 2>&1
echo "  ✓ apple-touch-icon.png"

rm -rf "$TMP"
