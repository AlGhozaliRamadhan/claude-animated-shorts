#!/usr/bin/env python3
"""Fetch the IBM Plex Mono 600 latin subset used by the cold open."""
import re
import urllib.request
from pathlib import Path

CSS = "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap"
DEST = Path(r"D:\claude-animated-shorts\engine\public\fifa\fonts\ibm-plex-mono-600-normal.woff2")
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120 Safari/537.36"
)

req = urllib.request.Request(CSS, headers={"User-Agent": UA})
css = urllib.request.urlopen(req).read().decode()
for block in re.findall(r"@font-face\s*\{(.*?)\}", css, re.S):
    weight = re.search(r"font-weight:\s*([^;]+);", block).group(1).strip()
    rng = re.search(r"unicode-range:\s*([^;]+);", block)
    rng = rng.group(1) if rng else ""
    if weight != "600" or "U+0000-00FF" not in rng:
        continue
    url = re.search(r"url\((https://[^)]+)\)", block).group(1)
    data = urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    ).read()
    DEST.write_bytes(data)
    print("saved", DEST, len(data))
