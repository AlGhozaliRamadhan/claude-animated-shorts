#!/usr/bin/env python3
"""Render a deterministic HTML timeline to H.264.

The HTML must expose window.setTime(seconds). Frames are screenshotted at exact
1/fps steps and piped to ffmpeg as JPEGs, so a long render never writes thousands
of PNGs to disk.

Usage:
    python scripts/render_html.py projects/<slug>/aset/timeline.html --out projects/<slug>/render/video.mp4
    python scripts/render_html.py ... --frames 90 --out test.mp4
    python scripts/render_html.py ... --start 120 --duration 300
"""

from __future__ import annotations

import argparse
import asyncio
import subprocess
import time
from pathlib import Path

import imageio_ffmpeg
from playwright.async_api import async_playwright


async def render(args: argparse.Namespace) -> int:
    html = Path(args.html).resolve()
    if not html.is_file():
        raise SystemExit(f"HTML not found: {html}")

    out_path = Path(args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    fps = args.fps

    cmd = [
        ffmpeg,
        "-y",
        "-f", "image2pipe",
        "-vcodec", "mjpeg",
        "-framerate", str(fps),
        "-i", "-",
        "-vf", "scale=in_range=full:out_range=tv,format=yuv420p",
        "-color_range", "tv",
        "-colorspace", "bt709",
        "-color_primaries", "bt709",
        "-color_trc", "bt709",
        "-c:v", "libx264",
        "-preset", args.preset,
        "-crf", str(args.crf),
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-an",
        str(out_path),
    ]
    proc = subprocess.Popen(
        cmd,
        stdin=subprocess.PIPE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )
    assert proc.stdin is not None

    console_errors: list[str] = []
    page_errors: list[str] = []

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        page = await browser.new_page(
            viewport={"width": args.width, "height": args.height},
            device_scale_factor=1,
        )
        page.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        page.on("pageerror", lambda error: page_errors.append(str(error)))

        await page.goto(html.as_uri(), wait_until="load")
        await page.wait_for_function("typeof window.setTime === 'function'")
        await page.wait_for_function(
            "Array.from(document.images).every((image) => image.complete)"
        )

        broken = await page.evaluate(
            "() => Array.from(document.images).filter(i => !i.naturalWidth).map(i => i.getAttribute('src'))"
        )
        if broken:
            raise SystemExit(f"broken images: {broken}")

        duration = args.duration
        if duration is None:
            duration = float(await page.evaluate("window.__duration ?? NaN"))
            if not duration or duration != duration:
                raise SystemExit(
                    "HTML has no window.__duration. Pass --duration <seconds>."
                )

        frames = args.frames if args.frames else int(round(duration * fps))
        start_frame = int(round(args.start * fps))

        print(f"{html.name}: {duration:.3f}s, {frames} frames at {fps} fps")

        started = time.time()
        for offset in range(frames):
            index = start_frame + offset
            await page.evaluate("(value) => window.setTime(value)", index / fps)
            jpeg = await page.screenshot(type="jpeg", quality=args.quality)
            proc.stdin.write(jpeg)

            done = offset + 1
            if done % 300 == 0:
                elapsed = time.time() - started
                rate = done / elapsed if elapsed else 0
                eta = (frames - done) / rate if rate else 0
                print(
                    f"{done}/{frames} frames  {rate:.2f} fps  eta {eta/60:.1f} min",
                    flush=True,
                )

        await browser.close()

    proc.stdin.close()
    stderr = proc.stderr.read().decode("utf-8", "replace") if proc.stderr else ""
    code = proc.wait()
    if code != 0:
        print(stderr[-4000:])
        raise SystemExit(f"ffmpeg exited {code}")

    if console_errors or page_errors:
        print("console errors:", console_errors[:5])
        print("page errors:", page_errors[:5])
        raise SystemExit(1)

    print(f"wrote {out_path}  ({frames} frames at {fps} fps)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html", help="HTML file exposing window.setTime(t)")
    parser.add_argument("--out", required=True, help="output mp4")
    parser.add_argument("--fps", type=int, default=30)
    parser.add_argument("--width", type=int, default=1920)
    parser.add_argument("--height", type=int, default=1080)
    parser.add_argument("--duration", type=float, default=None,
                        help="seconds; defaults to window.__duration")
    parser.add_argument("--start", type=float, default=0.0, help="start time in seconds")
    parser.add_argument("--frames", type=int, default=0, help="number of frames (0 = full)")
    parser.add_argument("--quality", type=int, default=95, help="JPEG quality")
    parser.add_argument("--crf", type=int, default=18, help="x264 CRF")
    parser.add_argument("--preset", default="medium", help="x264 preset")
    return asyncio.run(render(parser.parse_args()))


if __name__ == "__main__":
    raise SystemExit(main())
