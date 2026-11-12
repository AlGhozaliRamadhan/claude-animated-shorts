#!/usr/bin/env python3
"""Check the local toolchain before starting a video project.

Usage:
    python scripts/doctor.py
"""

from __future__ import annotations

import importlib.util
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENGINE = ROOT / "engine"

results: list[tuple[str, str, str]] = []


def add(status: str, name: str, detail: str) -> None:
    results.append((status, name, detail))


def run(command: list[str]) -> tuple[int, str]:
    try:
        executable = shutil.which(command[0])
        if executable:
            command = [executable, *command[1:]]
        if os.name == "nt" and executable and executable.lower().endswith((".cmd", ".bat")):
            command = ["cmd", "/c", *command]
        completed = subprocess.run(
            command, capture_output=True, text=True, timeout=30
        )
        return completed.returncode, (completed.stdout or completed.stderr).strip()
    except Exception as exc:  # noqa: BLE001 - diagnostics should not crash
        return 1, str(exc)


def check_command(name: str, command: list[str], required: bool = True) -> None:
    code, output = run(command)
    if code == 0:
        add("PASS", name, output.splitlines()[0] if output else "ok")
    else:
        add("FAIL" if required else "WARN", name, output or "not found")


def main() -> int:
    print("Claude Animated Shorts doctor\n")

    check_command("node", ["node", "--version"])
    check_command("npm", ["npm", "--version"])
    check_command("python", [sys.executable, "--version"])

    for module in ("playwright", "imageio_ffmpeg", "numpy", "scipy"):
        if importlib.util.find_spec(module):
            add("PASS", f"python:{module}", "installed")
        else:
            add("FAIL", f"python:{module}", f"missing; pip install {module}")

    try:
        import imageio_ffmpeg

        ffmpeg = Path(imageio_ffmpeg.get_ffmpeg_exe())
        if ffmpeg.is_file():
            add("PASS", "ffmpeg", str(ffmpeg))
        else:
            add("FAIL", "ffmpeg", f"path does not exist: {ffmpeg}")
    except Exception as exc:  # noqa: BLE001
        add("FAIL", "ffmpeg", str(exc))

    package_path = ENGINE / "package.json"
    if not package_path.is_file():
        add("FAIL", "engine/package.json", "missing")
    else:
        package = json.loads(package_path.read_text(encoding="utf-8"))
        declared = package.get("dependencies", {})
        add("PASS", "engine/package.json", package.get("name", "unnamed"))

        if not (ENGINE / "node_modules").is_dir():
            add("FAIL", "engine dependencies", "missing; run: cd engine && npm install")
        else:
            add("PASS", "engine dependencies", "node_modules present")

            versions = {}
            for name in ("remotion", "@remotion/three", "@remotion/cli"):
                module_path = ENGINE / "node_modules" / name / "package.json"
                if module_path.is_file():
                    versions[name] = json.loads(module_path.read_text(encoding="utf-8"))["version"]
            if len(set(versions.values())) <= 1 and versions:
                add("PASS", "remotion versions", ", ".join(f"{k}@{v}" for k, v in versions.items()))
            else:
                add("WARN", "remotion versions", json.dumps(versions))

            for name in ("three", "@react-three/fiber", "@react-three/postprocessing"):
                module_path = ENGINE / "node_modules" / name / "package.json"
                if module_path.is_file():
                    version = json.loads(module_path.read_text(encoding="utf-8"))["version"]
                    add("PASS", name, version)
                else:
                    add("FAIL", name, "missing from engine/node_modules")

    try:
        sys.path.insert(0, str(ROOT / "scripts"))
        from fetch_bridge_assets import NEEDED  # noqa: PLC0415

        asset_dir = ENGINE / "public" / "bridge" / "kenney"
        present = {p.stem for p in asset_dir.glob("*.glb")}
        missing = sorted(set(NEEDED) - present - {"tree"})
        if missing:
            add("FAIL", "bridge assets", f"missing {len(missing)}: {', '.join(missing)}")
        else:
            add("PASS", "bridge assets", f"{len(present)} GLBs in engine/public/bridge/kenney")
        if not (asset_dir / "Textures" / "colormap.png").is_file():
            add("FAIL", "bridge texture", "engine/public/bridge/kenney/Textures/colormap.png missing")
    except Exception as exc:  # noqa: BLE001
        add("WARN", "bridge assets", str(exc))

    temp = Path("D:/remotion-tmp")
    if temp.is_dir():
        free = shutil.disk_usage(temp).free / 1024**3
        add("PASS" if free > 10 else "WARN", "remotion temp", f"{temp} ({free:.1f} GB free)")
    else:
        add("WARN", "remotion temp", "D:/remotion-tmp missing; run scripts/render_remotion.py to create it")

    final = ROOT / "projects" / "data-sains-review-5min" / "render" / "final.mp4"
    if final.is_file():
        size = final.stat().st_size / 1024**2
        add("PASS", "data-sains final", f"{final.relative_to(ROOT)} ({size:.1f} MB)")
    else:
        add("WARN", "data-sains final", "render/final.mp4 not found")

    width = max(len(name) for _, name, _ in results)
    for status, name, detail in results:
        print(f"[{status}] {name.ljust(width)}  {detail}")

    failures = sum(1 for status, _, _ in results if status == "FAIL")
    warnings = sum(1 for status, _, _ in results if status == "WARN")
    print(f"\n{failures} failure(s), {warnings} warning(s)")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
