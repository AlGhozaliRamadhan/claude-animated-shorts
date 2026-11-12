#!/usr/bin/env python3
"""Extract reference typography frames for study (private, do not publish).

Writes:
  reference-frames/*.png       2 fps overview of the whole clip
  reference-frames/beat/*.png  20 fps over the three key beats
  reference-frames/sheet.png   contact sheet, 6 columns
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "templates" / "Typography lyrics music video" / "good typography.mp4"
OUT = Path(__file__).resolve().parents[1] / "reference-frames"


def run(args: list[str]) -> None:
    print(" ".join(args))
    subprocess.run(args, check=True)


def main() -> int:
    if not SRC.is_file():
        print(f"missing: {SRC}", file=sys.stderr)
        return 1

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    (OUT / "beat").mkdir(parents=True, exist_ok=True)

    run([ffmpeg, "-y", "-i", str(SRC), "-vf", "fps=2", str(OUT / "f_%03d.png")])

    # The three beats that carry the type grammar.
    for name, start, end in (
        ("open", 0.0, 1.6),
        ("never", 10.4, 12.6),
        ("swap", 12.4, 16.2),
    ):
        run([
            ffmpeg, "-y", "-ss", str(start), "-to", str(end), "-i", str(SRC),
            "-vf", "fps=20", str(OUT / "beat" / f"{name}_%03d.png"),
        ])

    run([
        ffmpeg, "-y", "-i", str(SRC),
        "-vf", "fps=2,scale=320:-1,tile=6x7:padding=6:margin=6:color=0x111111",
        "-frames:v", "1", str(OUT / "sheet.png"),
    ])
    print("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
