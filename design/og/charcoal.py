#!/usr/bin/env python3
"""Make the link card's portrait: the blue wall swapped for charcoal. The
person is left as photographed; only blue fringe at the edges is removed.
Writes design/og/portrait-charcoal.webp, which
only design/og/card.html uses (the site keeps the blue photo).

Run from the repo root:  python3 design/og/charcoal.py   (needs Pillow)
"""
import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, "public", "portrait.webp")
OUT = os.path.join(ROOT, "design", "og", "portrait-charcoal.webp")

WALL = (82, 134, 219)  # the blue wall, measured (fallback far from any wall)
EDGE, CENTRE = (18, 18, 18), (28, 28, 28)  # charcoal, a little lighter behind the head


def clamp(v):
    return 0.0 if v < 0 else 1.0 if v > 1 else v


img = Image.open(SRC).convert("RGB")
w, h = img.size
px = list(img.getdata())

# How much each pixel looks like the wall: bright and strongly blue.
soft = []
for r, g, b in px:
    key = b - (r + g) / 2
    lum = 0.3 * r + 0.59 * g + 0.11 * b
    soft.append(clamp((key - 30) / 55) * clamp((lum - 55) / 45))

# Keep only wall that touches the top or sides, so the blue zip and the navy
# t-shirt (inside the jacket) are left alone.
hard = Image.new("L", (w, h))
hard.putdata([255 if a > 0.25 else 0 for a in soft])
seeds = [(x, 0) for x in range(0, w, 20)] + [(0, y) for y in range(0, h // 2, 20)] + [(w - 1, y) for y in range(0, h // 2, 20)]
for s in seeds:
    if hard.getpixel(s) == 255:
        ImageDraw.floodfill(hard, s, 128)
wall = hard.point(lambda v: 255 if v == 128 else 0)
# Inside the wall everything is background (the glow by the head too); only
# a thin feathered edge is mixed, plus loose hair just past it.
core = list(wall.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.5)).getdata())
reg = list(wall.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(2)).getdata())

# The wall isn't one blue: it's lighter in the glow by the head. Estimate its
# colour at every pixel from nearby wall pixels only.
R = 24
spread = list(wall.filter(ImageFilter.GaussianBlur(R)).getdata())
wall_rgb = list(Image.composite(img, Image.new("RGB", (w, h)), wall).filter(ImageFilter.GaussianBlur(R)).getdata())
local = [tuple(c * 255 / m for c in rgb) if m > 2 else WALL for rgb, m in zip(wall_rgb, spread)]

# Charcoal with a soft lift behind the head, so dark hair keeps its outline.
cx, cy, rad = w * 0.5, h * 0.28, w * 0.75

out = []
for i, (r, g, b) in enumerate(px):
    a = max(core[i] / 255, soft[i] * reg[i] / 255)
    y, x = divmod(i, w)
    t = clamp((((x - cx) ** 2 + (y - cy) ** 2) ** 0.5) / rad)
    bg = [CENTRE[c] + (EDGE[c] - CENTRE[c]) * t for c in range(3)]
    # Take the wall's share out of the pixel and put charcoal in its place.
    p = [(r, g, b)[c] + a * (bg[c] - local[i][c]) for c in range(3)]
    # Blue spill: no warm-toned pixel near the edge should lean blue.
    near = reg[i] / 255
    if near > 0:
        p[2] = min(p[2], max(p[0], p[1]) + 12 + (1 - near) * 60)
    out.append(tuple(int(max(0, min(255, round(v)))) for v in p))

res = Image.new("RGB", (w, h))
res.putdata(out)
res.save(OUT, quality=90)
print("wrote", os.path.relpath(OUT, ROOT))
