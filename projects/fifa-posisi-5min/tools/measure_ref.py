#!/usr/bin/env python3
"""Measure the type block in reference frames (private study aid).

Reports the bounding box of pixels that differ from the background, ignoring
the bottom 14 percent where the ad keeps its small caption.
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

BASE = Path(__file__).resolve().parents[1] / "reference-frames"


def measure(path: Path) -> None:
    im = Image.open(path).convert("RGB")
    w, h = im.size
    px = im.load()
    bg = px[4, 4]
    limit = int(h * 0.86)
    x0, y0, x1, y1 = w, h, -1, -1
    for y in range(limit):
        for x in range(w):
            r, g, b = px[x, y]
            if abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2]) > 90:
                if x < x0:
                    x0 = x
                if x > x1:
                    x1 = x
                if y < y0:
                    y0 = y
                if y > y1:
                    y1 = y
    if x1 < 0:
        print(f"{path.name}: empty")
        return
    bw = x1 - x0 + 1
    bh = y1 - y0 + 1
    print(
        f"{path.name}: box {bw}x{bh} at ({x0},{y0})  "
        f"width {bw / w * 100:.1f}%  height {bh / h * 100:.1f}%  "
        f"left {x0 / w * 100:.1f}%  top {y0 / h * 100:.1f}%  "
        f"right {(w - x1) / w * 100:.1f}%  bottom {(h - y1) / h * 100:.1f}%"
    )


if __name__ == "__main__":
    names = sys.argv[1:] or [
        "f_002.png",
        "f_022.png",
        "f_023.png",
        "f_026.png",
        "f_027.png",
        "f_028.png",
    ]
    for name in names:
        measure(BASE / name)
