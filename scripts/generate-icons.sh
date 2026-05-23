#!/usr/bin/env bash
# Generate PNG icons from SVG source for PWA.
set -euo pipefail

SRC="public/icons/icon.svg"
TMP=$(mktemp -d)
OUTDIR="public/icons"
SIZES=(48 72 96 128 192 256 384 512)

mkdir -p "$OUTDIR"

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
