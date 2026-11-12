#!/usr/bin/env python3
"""Render a Remotion composition with the bundle temp on a big drive.

Remotion copies public/ into a temp folder for every bundle. On this machine the
system drive is small, so this wrapper always points TEMP/TMP at REMOTION_TMP
(default D:\\remotion-tmp) before calling the CLI.

Usage:
    python scripts/render_remotion.py BridgeShort projects/my-short/render/final.mp4
    python scripts/render_remotion.py BridgeShort projects/my-short/render/final.mp4 --scale 1.3333
    python scripts/render_remotion.py --still BridgeShort projects/my-short/render/qa/f060.png --frame 60 --scale 0.5
    python scripts/render_remotion.py BridgeShort projects/my-short/render/seg.mp4 --frames 1380-1710

Relative output paths are resolved against the directory you run the command from.
`--frames A-B` renders only that range, which is the fast way to judge a camera
move or a transition before committing to a full render.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENGINE = ROOT / "engine"


def temp_dir() -> Path:
    configured = os.environ.get("REMOTION_TMP")
    if configured:
        path = Path(configured)
    elif Path("D:/").exists():
        path = Path("D:/remotion-tmp")
    else:
        path = Path(tempfile.gettempdir()) / "remotion-tmp"
    path.mkdir(parents=True, exist_ok=True)
    return path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("composition", help="composition id, e.g. BridgeShort")
    parser.add_argument("output", help="output file, relative to the current directory unless absolute")
    parser.add_argument("--still", action="store_true", help="render one frame")
    parser.add_argument("--frame", type=int, default=0, help="frame for --still")
    parser.add_argument("--scale", type=float, default=None,
                        help="1.3333 for 2K from 1080x1920; 0.5 for quick checks")
    parser.add_argument("--crf", type=int, default=16)
    parser.add_argument("--concurrency", type=int, default=None)
    parser.add_argument("--props", default=None, help="JSON input props")
    parser.add_argument("--frames", default=None,
                        help="render a range only, e.g. 1380-1710")
    args = parser.parse_args()

    if not (ENGINE / "node_modules" / "remotion").is_dir():
        print("engine dependencies are missing. Run: cd engine && npm install", file=sys.stderr)
        return 1

    node = shutil.which("node")
    cli = ENGINE / "node_modules" / "@remotion" / "cli" / "remotion-cli.js"
    if not node:
        print("node not found on PATH", file=sys.stderr)
        return 1
    if not cli.is_file():
        print(f"Remotion CLI missing: {cli}", file=sys.stderr)
        return 1

    bundle_tmp = temp_dir()
    environment = os.environ.copy()
    environment["TEMP"] = str(bundle_tmp)
    environment["TMP"] = str(bundle_tmp)
    environment["REMOTION_TMP"] = str(bundle_tmp)

    output = Path(args.output)
    if not output.is_absolute():
        output = Path.cwd() / output
    output.parent.mkdir(parents=True, exist_ok=True)

    if args.still:
        command = [
            node, str(cli), "still",
            "src/index.ts", args.composition, str(output),
            f"--frame={args.frame}",
        ]
    else:
        command = [
            node, str(cli), "render",
            "src/index.ts", args.composition, str(output),
            "--codec=h264", f"--crf={args.crf}",
        ]

    if args.scale is not None:
        command.append(f"--scale={args.scale}")
    if args.concurrency is not None:
        command.append(f"--concurrency={args.concurrency}")
    if args.props is not None:
        command.append(f"--props={args.props}")
    if args.frames is not None:
        if args.still:
            print("--frames only applies to video renders, not --still", file=sys.stderr)
            return 1
        command.append(f"--frames={args.frames}")

    print(f"temp: {bundle_tmp}")
    print(" ".join(command))
    return subprocess.run(command, cwd=ENGINE, env=environment).returncode


if __name__ == "__main__":
    raise SystemExit(main())
