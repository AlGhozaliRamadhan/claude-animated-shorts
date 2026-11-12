#!/usr/bin/env python3
"""Render the deterministic HTML timeline straight into an H.264 MP4.

Frames are produced with Playwright at exact 1/30 s steps and piped to ffmpeg
as JPEGs, so a full 5-minute render never writes 9000 PNGs to disk.

Usage:
    python render/render_video.py                 # full 300 s
    python render/render_video.py --frames 60     # smoke test
    python render/render_video.py --start 120 --frames 90 --out test.mp4
"""
from __future__ import annotations

import argparse
import asyncio
import subprocess
import time
from pathlib import Path

import imageio_ffmpeg
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "aset" / "documentary_v3.html"
OUT = ROOT / "render" / "video.mp4"
FPS = 30
DURATION = 300.0


async def render(args: argparse.Namespace) -> int:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    out_path = Path(args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    frames = args.frames if args.frames else int(round(DURATION * FPS))
    start_frame = int(round(args.start * FPS))

    cmd = [
        ffmpeg, "-y",
        "-f", "image2pipe",
        "-vcodec", "mjpeg",
        "-framerate", str(FPS),
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
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL,
                            stderr=subprocess.PIPE)
    assert proc.stdin is not None

    console_errors: list[str] = []
    page_errors: list[str] = []

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        page = await browser.new_page(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1,
        )
        page.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        page.on("pageerror", lambda error: page_errors.append(str(error)))

        await page.goto(HTML.as_uri(), wait_until="load")
        await page.wait_for_function("typeof window.setTime === 'function'")
        await page.wait_for_function(
            "Array.from(document.images).every((image) => image.complete)"
        )
        broken = await page.evaluate(
            "() => Array.from(document.images).filter(i => !i.naturalWidth).map(i => i.getAttribute('src'))"
        )
        if broken:
            raise SystemExit(f"broken images: {broken}")

        t0 = time.time()
        for index in range(start_frame, start_frame + frames):
            seconds = index / FPS
            await page.evaluate("(value) => window.setTime(value)", seconds)
            jpeg = await page.screenshot(type="jpeg", quality=args.quality)
            proc.stdin.write(jpeg)
            if (index - start_frame + 1) % 300 == 0:
                done = index - start_frame + 1
                elapsed = time.time() - t0
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

    print(f"wrote {out_path}  ({frames} frames at {FPS} fps)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", type=float, default=0.0, help="start time in seconds")
    parser.add_argument("--frames", type=int, default=0, help="number of frames (0 = full)")
    parser.add_argument("--out", default=str(OUT), help="output mp4")
    parser.add_argument("--quality", type=int, default=95, help="JPEG quality")
    parser.add_argument("--crf", type=int, default=18, help="x264 CRF")
    parser.add_argument("--preset", default="medium", help="x264 preset")
    return asyncio.run(render(parser.parse_args()))


if __name__ == "__main__":
    raise SystemExit(main())
