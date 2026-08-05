#!/usr/bin/env bash
#
# prep-textures.sh — derive the runtime quilt textures from the raw asset.
#
# The runtime only needs two small files, both cropped from the asset's real
# 4K PBR maps (the clean cherry-blossom quilt block in their UV layout):
#
#     model/quilt_normal.webp   (768²)  the floral emboss, tiled on the roll
#     model/quilt_base.webp     (512²)  faint paper tone (near-white)
#
# Everything else on the roll (geometry, core, end faces, loose sheet) is
# generated procedurally in toiletRollScene.ts, so no other model files ship.
#
# Requires: python3 + Pillow (`pip install Pillow`) and cwebp (`brew install webp`).
# Point RAW at the unzipped "01_Paper_AllTextures/PBR" folder from ToiletPaperV2.

set -euo pipefail
RAW="${1:-$HOME/Downloads/ToiletPaperV2/01_Paper_AllTextures/PBR}"
OUT="$(cd "$(dirname "$0")/../model" && pwd)"
TMP="$(mktemp -d)"

python3 - "$RAW" "$TMP" <<'PY'
import sys
from PIL import Image
raw, tmp = sys.argv[1], sys.argv[2]
# The top-left block of the UV layout is a clean, regular floral quilt.
def crop(name, size):
    im = Image.open(f"{raw}/{name}").convert("RGB")
    W, H = im.size
    box = (int(0.05*W), int(0.17*H), int(0.34*W), int(0.40*H))
    return im.crop(box).resize((size, size), Image.LANCZOS)
crop("T_ToiletPaper_Normal.png", 768).save(f"{tmp}/quilt_normal.png")
crop("T_ToiletPaper_BaseColor.png", 512).save(f"{tmp}/quilt_base.png")
print("cropped quilt tiles")
PY

cwebp -q 92 -sharp_yuv -m 6 "$TMP/quilt_normal.png" -o "$OUT/quilt_normal.webp"
cwebp -q 84 -m 6            "$TMP/quilt_base.png"   -o "$OUT/quilt_base.webp"
rm -rf "$TMP"
echo "wrote $OUT/quilt_normal.webp and $OUT/quilt_base.webp"
