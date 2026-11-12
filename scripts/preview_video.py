#!/usr/bin/env python3
"""Screenshot a deterministic HTML timeline and report broken assets.

The HTML must expose window.setTime(seconds). Each requested time is applied,
then a PNG is written to --out. This is the pre-render gate: inspect the PNGs
before exporting video.
"""
from __future__ import annotations

import argparse
import asyncio
import json
from pathlib import Path

from playwright.async_api import async_playwright


def parse_times(raw: str) -> list[float]:
    values = [part.strip() for part in raw.split(",") if part.strip()]
    if not values:
        raise SystemExit("--times is empty")
    return [float(value) for value in values]


async def run(args: argparse.Namespace) -> int:
    html = Path(args.html).resolve()
    if not html.is_file():
        raise SystemExit(f"HTML not found: {html}")

    out_dir = Path(args.out).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    times = parse_times(args.times)
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

        broken_images = await page.evaluate(
            """
            () => Array.from(document.images)
              .filter((image) => !image.naturalWidth)
              .map((image) => ({src: image.getAttribute('src'), alt: image.alt}))
            """
        )

        shots = []
        for seconds in times:
            await page.evaluate("(value) => window.setTime(value)", seconds)
            await page.wait_for_timeout(args.wait)
            name = f"t_{round(seconds * 100):05d}.png"
            path = out_dir / name
            await page.screenshot(path=str(path))
            shots.append({"time": seconds, "file": str(path)})

        await browser.close()

    report = {
        "html": str(html),
        "shots": shots,
        "brokenImages": broken_images,
        "consoleErrors": console_errors,
        "pageErrors": page_errors,
    }
    report_path = out_dir / "report.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(json.dumps(report, indent=2))
    if broken_images or console_errors or page_errors:
        return 1
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html", help="HTML file exposing window.setTime(t)")
    parser.add_argument("--times", required=True, help="Comma-separated seconds")
    parser.add_argument("--out", required=True, help="Directory for PNGs + report.json")
    parser.add_argument("--width", type=int, default=1920)
    parser.add_argument("--height", type=int, default=1080)
    parser.add_argument("--wait", type=int, default=150, help="Milliseconds after setTime")
    return asyncio.run(run(parser.parse_args()))


if __name__ == "__main__":
    raise SystemExit(main())
