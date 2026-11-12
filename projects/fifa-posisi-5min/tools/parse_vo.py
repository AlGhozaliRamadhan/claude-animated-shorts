#!/usr/bin/env python3
"""Extract the VO blocks from naskah.md into a JSON plan.

The script is the single source of truth for what is said, but it is written for
a reader, not for a machine: speaker turns are `**Suara N**` followed by
blockquotes, scenes sit under `## Scene N.` and videos under `# Video N:`.

Output: one record per video, scene, speaker turn, paragraph.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "naskah.md"
OUT = ROOT / "render" / "audio" / "vo_plan.json"

VIDEO_RE = re.compile(r"^# Video (\d):")
SCENE_RE = re.compile(r"^## Scene (\d+)\.")
SPEAKER_RE = re.compile(r"^\*\*Suara (\d)\*\*")


def parse() -> list[dict]:
    videos: list[dict] = []
    video: dict | None = None
    scene: int | None = None
    speaker: int | None = None
    in_vo = False

    for raw in SCRIPT.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()

        m = VIDEO_RE.match(line)
        if m:
            video = {"video": int(m.group(1)), "turns": []}
            videos.append(video)
            scene, speaker, in_vo = None, None, False
            continue

        m = SCENE_RE.match(line)
        if m:
            scene, speaker, in_vo = int(m.group(1)), None, False
            continue

        if line.strip() == "**VO**":
            in_vo = True
            speaker = None
            continue

        if in_vo and line.strip().startswith("**Audio**"):
            in_vo = False
            speaker = None
            continue

        if not in_vo:
            continue

        m = SPEAKER_RE.match(line)
        if m:
            speaker = int(m.group(1))
            video["turns"].append({"scene": scene, "speaker": speaker, "lines": []})
            continue

        if line.startswith(">"):
            text = line[1:].strip()
            if not text:
                continue
            if not video["turns"] or video["turns"][-1]["speaker"] != speaker:
                video["turns"].append({"scene": scene, "speaker": speaker, "lines": []})
            video["turns"][-1]["lines"].append(text)

    return videos


def main() -> None:
    videos = parse()
    total_words = 0
    for v in videos:
        words = sum(len(l.split()) for t in v["turns"] for l in t["lines"])
        total_words += words
        print(f"video {v['video']}: {len(v['turns'])} turns, {words} words")
        by_speaker: dict[int, int] = {}
        for t in v["turns"]:
            w = sum(len(l.split()) for l in t["lines"])
            by_speaker[t["speaker"]] = by_speaker.get(t["speaker"], 0) + w
        print("   ", by_speaker)
    print("total words", total_words)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(videos, indent=2, ensure_ascii=False), encoding="utf-8")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
