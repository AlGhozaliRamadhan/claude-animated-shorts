"""Download the CC0 Kenney props used by templates/bridge.

The bridge template loads these from Remotion's public/ folder:

    public/bridge/kenney/<name>.glb

Only the props that are actually referenced are copied.  Trees and bushes are
drawn procedurally by build.ts (see VEG), so their GLBs are optional.

Usage:
    python scripts/fetch_bridge_assets.py
    python scripts/fetch_bridge_assets.py --force
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
import tempfile
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "engine" / "public" / "bridge" / "kenney"

# Exact names from world.ts (KENNEY array).
NEEDED = [
    "tree_oak",
    "tree_default",
    "tree_detailed",
    "tree_fat",
    "tree_cone",
    "tree-high-round",
    "tree",
    "plant_bushLarge",
    "plant_bushDetailed",
    "plant_bush",
    "hedge",
    "flower_redA",
    "flower_yellowA",
    "flower_purpleA",
    "grass_large",
    "grass",
    "lily_large",
    "lantern",
    "cart",
    "stall-red",
    "stall-green",
    "stall-bench",
    "banner-red",
    "banner-green",
    "windmill",
    "canoe",
]

# Packs that contain the props. Both are CC0.
PACKS = [
    ("nature-kit", "https://kenney.nl/assets/nature-kit"),
    ("fantasy-town-kit", "https://kenney.nl/assets/fantasy-town-kit"),
]

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"


def get(url: str, referer: str | None = None) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    if referer:
        req.add_header("Referer", referer)
    with urllib.request.urlopen(req, timeout=120) as response:
        return response.read()


def resolve_download(page_url: str) -> str:
    html = get(page_url).decode("utf-8", "replace")
    match = re.search(r"data-download-id='([0-9a-f]+)'", html)
    if not match:
        raise RuntimeError(f"download id not found on {page_url}")
    payload = json.loads(get(f"https://kenney.nl/download-link/{match.group(1)}", page_url))
    url = payload.get("url")
    if not url:
        raise RuntimeError(f"download link not returned for {page_url}")
    return url


def download_pack(slug: str, page_url: str, tmp: Path) -> Path:
    target = tmp / f"{slug}.zip"
    print(f"  downloading {slug}...")
    target.write_bytes(get(resolve_download(page_url), page_url))
    return target


def extract_props(zip_path: Path, wanted: set[str], dest: Path) -> set[str]:
    found: set[str] = set()
    with zipfile.ZipFile(zip_path) as archive:
        for entry in archive.infolist():
            lower = entry.filename.lower()
            if "/textures/" in lower and lower.endswith((".png", ".jpg", ".jpeg")):
                # GLTFLoader resolves the atlas relative to the model:
                # public/bridge/kenney/Textures/colormap.png
                texture_dir = dest / "Textures"
                texture_dir.mkdir(exist_ok=True)
                with archive.open(entry) as source, (texture_dir / Path(entry.filename).name).open("wb") as target:
                    shutil.copyfileobj(source, target)
                continue
            if not lower.endswith(".glb"):
                continue
            name = Path(entry.filename).stem
            if name not in wanted:
                continue
            out = dest / f"{name}.glb"
            with archive.open(entry) as source, out.open("wb") as target:
                shutil.copyfileobj(source, target)
            found.add(name)

        license_entry = next(
            (e for e in archive.infolist() if e.filename.lower() == "license.txt"),
            None,
        )
        if license_entry:
            licence = dest / f"LICENSE-{zip_path.stem}.txt"
            licence.write_bytes(archive.read(license_entry))
    return found


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="overwrite existing GLBs")
    args = parser.parse_args()

    DEST.mkdir(parents=True, exist_ok=True)

    if not args.force:
        existing = {p.stem for p in DEST.glob("*.glb")}
        if set(NEEDED) - {"tree"} <= existing:
            print(f"assets already present in {DEST} ({len(existing)} GLBs)")
            return 0

    wanted = set(NEEDED)
    found: set[str] = set()

    with tempfile.TemporaryDirectory(prefix="kenney-") as tmp_dir:
        tmp = Path(tmp_dir)
        for slug, page_url in PACKS:
            try:
                zip_path = download_pack(slug, page_url, tmp)
                found |= extract_props(zip_path, wanted, DEST)
            except Exception as exc:  # noqa: BLE001 - report and continue to the next pack
                print(f"  ! {slug}: {exc}", file=sys.stderr)

    # build.ts draws these procedurally, so a missing GLB is fine.
    optional = {"tree"}
    missing = sorted(wanted - found - optional)

    print(f"\ncopied {len(found)} GLBs to {DEST}")
    if missing:
        print("missing (not fatal, prop() skips them): " + ", ".join(missing), file=sys.stderr)
    if not (DEST / "LICENSE-nature-kit.txt").exists():
        (DEST / "LICENSE-nature-kit.txt").write_text(
            "Kenney Nature Kit and Fantasy Town Kit, CC0 1.0.\n"
            "https://creativecommons.org/publicdomain/zero/1.0/\n",
            encoding="utf-8",
        )
    return 0 if not missing else 1


if __name__ == "__main__":
    raise SystemExit(main())
