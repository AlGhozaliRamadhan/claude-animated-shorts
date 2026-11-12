#!/usr/bin/env python3
"""Create a new project folder with the right skeleton.

Usage:
    python scripts/new_project.py my-video --title "My Video"
    python scripts/new_project.py campus-talk --title "Campus Talk" --kind html
    python scripts/new_project.py notes --title "Notes" --kind blank

Kinds:
    remotion  copy templates/bridge into engine/src/videos/<slug> and register it
    html      copy templates/html/starter.html into projects/<slug>/aset/
    blank     only PROJECT.md, naskah.md and aset/
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT / "projects"
TEMPLATE_PROJECT = ROOT / "templates" / "project" / "PROJECT.md"
BRIDGE_TEMPLATE = ROOT / "templates" / "bridge"
HTML_TEMPLATE = ROOT / "templates" / "html" / "starter.html"
ENGINE = ROOT / "engine"
REGISTRY_JSON = ENGINE / "video-registry.json"
REGISTRY_TS = ENGINE / "src" / "videos" / "registry.ts"


def pascal_case(slug: str) -> str:
    return "".join(part.capitalize() for part in re.split(r"[-_]+", slug) if part)


def project_doc(title: str) -> str:
    text = TEMPLATE_PROJECT.read_text(encoding="utf-8")
    text = text.replace("# [Judul Project]", f"# {title}")
    text = text.replace(
        "[Satu paragraf: apa videonya, untuk apa, format apa, durasi target, "
        "siapa yang menyampaikan, deadline kalau ada]",
        "Tulis brief satu paragraf: video apa, untuk apa, format, durasi target, "
        "siapa penyampai, dan deadline.",
    )
    text = text.replace("[Judul Project]", title)
    text = text.replace("YYYY-MM-DD", date.today().isoformat())
    return text


def script_doc(title: str) -> str:
    return (
        f"# {title}\n\n"
        "## Naskah\n\n"
        "Tulis naskah di sini. Target kata: 750-810 untuk 5 menit, "
        "1500-1650 untuk 10 menit.\n\n"
        "## Catatan\n\n"
        "- Satu paragraf satu ide.\n"
        "- Angka harus punya sumber.\n"
        "- Jangan pakai em dash.\n"
    )


def load_registry() -> list[dict]:
    if not REGISTRY_JSON.is_file():
        return []
    data = json.loads(REGISTRY_JSON.read_text(encoding="utf-8"))
    return data.get("videos", [])


def write_registry(entries: list[dict]) -> None:
    REGISTRY_JSON.parent.mkdir(parents=True, exist_ok=True)
    REGISTRY_JSON.write_text(
        json.dumps({"videos": entries}, indent=2) + "\n", encoding="utf-8"
    )

    lines = ['import type { ComponentType } from "react";']
    for entry in entries:
        module = entry.get("module", "Bridge")
        suffix = re.sub(r"[^A-Za-z0-9_]", "_", entry["id"])
        component = f'{entry["component"]}__{suffix}'
        frames = f'{entry["framesExport"]}__{suffix}'
        lines.append(
            f'import {{ {entry["component"]} as {component}, '
            f'{entry["framesExport"]} as {frames} }} '
            f'from "./{entry["dir"]}/{module}";'
        )
    lines.extend(
        [
            "",
            "export type VideoEntry = {",
            "  id: string;",
            "  component: ComponentType;",
            "  durationInFrames: number;",
            "  fps: number;",
            "  width: number;",
            "  height: number;",
            "};",
            "",
            "// Generated from engine/video-registry.json by scripts/new_project.py.",
            "export const VIDEO_ENTRIES: VideoEntry[] = [",
        ]
    )
    for entry in entries:
        suffix = re.sub(r"[^A-Za-z0-9_]", "_", entry["id"])
        component = f'{entry["component"]}__{suffix}'
        frames = f'{entry["framesExport"]}__{suffix}'
        lines.extend(
            [
                "  {",
                f'    id: "{entry["id"]}",',
                f"    component: {component},",
                f"    durationInFrames: {frames},",
                f'    fps: {entry["fps"]},',
                f'    width: {entry["width"]},',
                f'    height: {entry["height"]},',
                "  },",
            ]
        )
    lines.extend(["];", ""])
    REGISTRY_TS.write_text("\n".join(lines), encoding="utf-8")


def create_remotion(slug: str, composition_id: str) -> None:
    destination = ENGINE / "src" / "videos" / slug
    if destination.exists():
        raise SystemExit(f"video source already exists: {destination}")
    destination.mkdir(parents=True)

    for source in BRIDGE_TEMPLATE.iterdir():
        if source.suffix in {".ts", ".tsx"}:
            shutil.copy2(source, destination / source.name)

    entries = load_registry()
    if any(entry["id"] == composition_id for entry in entries):
        raise SystemExit(f"composition id already registered: {composition_id}")

    entries.append(
        {
            "id": composition_id,
            "dir": slug,
            "module": "Bridge",
            "component": "BridgeShort",
            "framesExport": "BRIDGE_FRAMES",
            "fps": 30,
            "width": 1080,
            "height": 1920,
        }
    )
    write_registry(entries)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug", help="folder name, lowercase with dashes")
    parser.add_argument("--title", default=None, help="human title")
    parser.add_argument(
        "--kind",
        choices=("remotion", "html", "blank"),
        default="remotion",
        help="project type (default: remotion)",
    )
    parser.add_argument("--id", default=None, help="Remotion composition id")
    args = parser.parse_args()

    slug = args.slug.strip()
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", slug):
        raise SystemExit("slug must be lowercase letters, digits and dashes")

    title = args.title or slug.replace("-", " ").title()
    composition_id = args.id or pascal_case(slug)

    project = PROJECTS / slug
    if project.exists() and any(project.iterdir()):
        raise SystemExit(f"project already exists and is not empty: {project}")

    if args.kind == "remotion":
        destination = ENGINE / "src" / "videos" / slug
        if destination.exists():
            raise SystemExit(f"video source already exists: {destination}")
        if any(entry["id"] == composition_id for entry in load_registry()):
            raise SystemExit(f"composition id already registered: {composition_id}")

    (project / "aset").mkdir(parents=True, exist_ok=True)
    (project / "render").mkdir(exist_ok=True)
    (project / "PROJECT.md").write_text(project_doc(title), encoding="utf-8")
    (project / "naskah.md").write_text(script_doc(title), encoding="utf-8")

    if args.kind == "remotion":
        create_remotion(slug, composition_id)
        print(f"created projects/{slug} + engine/src/videos/{slug}")
        print(f"composition id: {composition_id}")
        print("\nnext:")
        print("  cd engine")
        print("  npm run dev")
        print(f"  python ../scripts/render_remotion.py {composition_id} ../projects/{slug}/render/final.mp4 --scale 1.3333")
    elif args.kind == "html":
        destination = project / "aset" / "timeline.html"
        shutil.copy2(HTML_TEMPLATE, destination)
        print(f"created projects/{slug} from templates/html/starter.html")
        print("\nnext:")
        print(f"  python scripts/preview_video.py projects/{slug}/aset/timeline.html --times 0,2,4,6,8,10 --out projects/{slug}/aset/qa")
        print(f"  python scripts/render_html.py projects/{slug}/aset/timeline.html --out projects/{slug}/render/video.mp4")
    else:
        print(f"created projects/{slug}")

    print(f"\nPROJECT.md: projects/{slug}/PROJECT.md")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
