#!/usr/bin/env python3
"""Extract single frames from a clip with the bundled ffmpeg.

Usage:
    python projects/fifa-posisi-5min/tools/extract_frames.py <clip.mp4> <tag> 32,36,40 [outdir]
Frames are given relative to the start of the clip. Without outdir the frames
land next to the clip.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg


def main() -> int:
    if len(sys.argv) not in (4, 5):
        print(__doc__)
        return 1
    clip = Path(sys.argv[1])
    tag = sys.argv[2]
    rels = [int(value) for value in sys.argv[3].split(",")]
    outdir = Path(sys.argv[4]) if len(sys.argv) == 5 else clip.parent
    outdir.mkdir(parents=True, exist_ok=True)
    exe = imageio_ffmpeg.get_ffmpeg_exe()
    for rel in rels:
        out = outdir / f"{tag}{rel:04d}.png"
        subprocess.run(
            [
                exe, "-y", "-ss", f"{rel / 30:.5f}", "-i", str(clip),
                "-frames:v", "1", "-fps_mode", "passthrough", str(out),
            ],
            check=True,
            capture_output=True,
        )
        print(out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
