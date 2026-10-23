#!/usr/bin/env python3
"""Render the link-preview cards in public/og/ from design/og/card.html.

Run from the repo root after changing a project title, the role or the home
intro:  python3 design/og/render.py   (needs google-chrome and Pillow)
Text comes from the site's own data files, so the cards match the site.
"""
import os, re, subprocess, tempfile, urllib.parse
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CARD = os.path.join(ROOT, "design", "og", "card.html")
OUT = os.path.join(ROOT, "public", "og")
SITE = "dozman99.github.io"


def read(path):
    return open(os.path.join(ROOT, path), encoding="utf-8").read()


def field(block, name):
    m = re.search(rf'{name}:\s*\n?\s*"((?:[^"\\]|\\.)*)"', block)
    return m.group(1) if m else ""


def render(name, params):
    url = "file://" + CARD + "?" + urllib.parse.urlencode(params)
    with tempfile.TemporaryDirectory() as tmp:
        png = os.path.join(tmp, "card.png")
        subprocess.run(
            ["google-chrome", "--headless=new", "--disable-gpu", "--hide-scrollbars",
             "--allow-file-access-from-files", "--virtual-time-budget=4000",
             "--window-size=1200,630", f"--screenshot={png}", url],
            check=True, capture_output=True,
        )
        Image.open(png).convert("RGB").save(os.path.join(OUT, f"{name}.jpg"), quality=86, optimize=True, progressive=True)
    print("wrote", f"public/og/{name}.jpg")


os.makedirs(OUT, exist_ok=True)
role = field(read("src/data/site.ts"), "role")
intro = re.search(r'intro:\s*\[\s*"((?:[^"\\]|\\.)*)"', read("src/data/home.ts")).group(1)
render("home", {"kind": "home", "role": role, "line": intro, "url": SITE})

for block in read("src/data/flagships.ts").split("  {\n")[1:]:
    slug = field(block, "slug")
    if slug:
        render(slug, {"kind": "project", "slug": slug, "title": field(block, "title"),
                      "where": field(block, "where"), "depth": field(block, "depth")})
