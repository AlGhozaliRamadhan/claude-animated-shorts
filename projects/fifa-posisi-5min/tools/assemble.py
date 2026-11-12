#!/usr/bin/env python3
"""Join the three FIFA videos into one file and lay the sound design under it.

The three renders come out of the same Remotion project with the same encoder
settings, so the join is a stream copy: no second generation, no re-timed
frames. Audio is the synthesised bed from `build_sound.py`.

    Video 1  render/video-1.mp4   0:03:06
    Video 2  render/video-2.mp4   0:03:05
    Video 3  render/video-3.mp4   0:01:26
    master   render/final.mp4     0:07:37

Usage:
    python projects/fifa-posisi-5min/tools/assemble.py --sound
    python projects/fifa-posisi-5min/tools/assemble.py --sound --audio render/audio/soundbed.wav
"""

from __future__ import annotations

import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
ROOT = Path(__file__).resolve().parents[1]
RENDER = ROOT / "render"

PARTS = ["video-1.mp4", "video-2.mp4", "video-3.mp4"]


def probe(path: Path) -> str:
    r = subprocess.run([FFMPEG, "-i", str(path)], capture_output=True, text=True)
    lines = [
        line.strip()
        for line in r.stderr.splitlines()
        if "Duration:" in line or "Stream #0:0" in line
    ]
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sound", action="store_true", help="mux the sound design")
    ap.add_argument("--audio", default=str(RENDER / "audio" / "soundbed.wav"))
    ap.add_argument("--out", default=str(RENDER / "final.mp4"))
    args = ap.parse_args()

    missing = [p for p in PARTS if not (RENDER / p).exists()]
    if missing:
        print("missing render(s): " + ", ".join(missing))
        return 1

    print("--- parts ---")
    for p in PARTS:
        print(p)
        print(probe(RENDER / p))

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    silent = RENDER / "master-silent.mp4"

    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as handle:
        for p in PARTS:
            handle.write("file '" + (RENDER / p).as_posix() + "'\n")
        list_path = handle.name

    cmd = [
        FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", list_path,
        "-c", "copy", str(silent),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2500:])
        return 1

    if args.sound:
        audio = Path(args.audio)
        if not audio.exists():
            print(f"no audio at {audio}; run build_sound.py first")
            return 1
        cmd = [
            FFMPEG, "-y", "-i", str(silent), "-i", str(audio),
            "-map", "0:v:0", "-map", "1:a:0",
            "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-shortest", "-movflags", "+faststart", str(out),
        ]
    else:
        cmd = [FFMPEG, "-y", "-i", str(silent), "-c", "copy", str(out)]

    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2500:])
        return 1

    print("--- final ---")
    print(out)
    print(probe(out))
    size = out.stat().st_size / (1024 * 1024)
    print(f"{size:.1f} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
