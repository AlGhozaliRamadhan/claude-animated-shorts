#!/usr/bin/env python3
"""Synthesise the VO from naskah.md and lay it on the master timeline.

There is no recorded narration for this project, so the voice track is generated
with edge-tts (id-ID-ArdiNeural and id-ID-GadisNeural). Five speakers come from
two base voices, separated by pitch and rate so a handoff is audible without any
label on screen, which is what the script asks for.

Placement is per paragraph, anchored to the visual cue that paragraph talks about,
so the line about the proof board lands while the board is on screen instead of
running on its own clock. Numbers are rewritten into Indonesian words before
synthesis, because a misread figure is worse than a synthetic voice.

    python projects/fifa-posisi-5min/tools/build_vo.py            # synth + place
    python projects/fifa-posisi-5min/tools/build_vo.py --force    # ignore cache
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import re
import subprocess
import wave
from pathlib import Path

import edge_tts
import imageio_ffmpeg
import numpy as np

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "render" / "audio"
PLAN = AUDIO / "vo_plan.json"
CACHE = AUDIO / "vo"

SR = 48000
FPS = 30

# ---------------------------------------------------------------- timeline
# Scene starts in master frames. Video 1 = 5580, Video 2 = 5550, Video 3 = 2580.
V2 = 5580
V3 = 11130
VIDEO_END = {1: 5580, 2: V2 + 5550, 3: V3 + 2580}

SCENES: dict[int, list[int]] = {
    # scene id -> [start frame, end frame]
    1: [0, 1920],
    2: [1920, 3810],
    3: [3810, 5580],
    4: [V2 + 0, V2 + 2100],
    5: [V2 + 2100, V2 + 3750],
    6: [V2 + 3750, V2 + 5550],
    7: [V3 + 0, V3 + 1350],
    8: [V3 + 1350, V3 + 2550],
}

# ---------------------------------------------------------------- voices
# Two base voices, five characters. pitch is in Hz for edge-tts.
# Rate is kept low and uniform on purpose: the v2 pass ran +34..38% and then
# squeezed the overflow with atempo, which compounded to 1.8x in scene 3.
VOICES = {
    1: {"voice": "id-ID-ArdiNeural", "rate": "+0%", "pitch": "+0Hz"},    # Al Ghozali (Male)
    2: {"voice": "id-ID-GadisNeural", "rate": "+0%", "pitch": "+0Hz"},   # Khalisya (Female)
    3: {"voice": "id-ID-ArdiNeural", "rate": "+0%", "pitch": "+18Hz"},   # Fadly (Male)
    4: {"voice": "id-ID-GadisNeural", "rate": "+0%", "pitch": "+24Hz"},  # Selena (Female)
    5: {"voice": "id-ID-ArdiNeural", "rate": "+0%", "pitch": "-16Hz"},   # Rafa (Male)
}

GAP_MIN = 0.30     # minimum air between paragraphs of one speaker
MAX_TEMPO = 1.08   # hard cap; anything above this means the scene has too many words
TAIL = 4 / FPS     # keep the last word off the cut

# Scene-local seconds where each paragraph should start, calibrated to visual cues
# and smooth natural breathing pauses (0.8 - 1.5s) without awkward silence voids.
ANCHORS: dict[int, list[float]] = {
    1: [0.0, 8.8, 19.2, 30.0, 43.5, 52.5],
    2: [0.0, 11.5, 22.3, 30.0, 36.0, 42.6, 50.5, 57.8],
    3: [0.0, 15.5, 23.2, 36.8, 43.8],
    4: [0.0, 6.0, 15.0, 26.0, 35.0, 44.0, 52.5, 63.0],
    5: [0.0, 11.2, 23.5, 33.5, 40.5, 47.5],
    6: [0.0, 8.5, 15.0, 24.5, 32.0, 39.5, 48.5],
    7: [0.0, 10.2, 17.5, 25.5, 34.0],
    8: [0.0, 6.5, 14.2, 21.8, 29.5],
}

# ---------------------------------------------------------------- numbers
ONES = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"]
TEENS = [
    "sepuluh", "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas",
    "enam belas", "tujuh belas", "delapan belas", "sembilan belas",
]
TENS = ["", "", "dua puluh", "tiga puluh", "empat puluh", "lima puluh", "enam puluh",
        "tujuh puluh", "delapan puluh", "sembilan puluh"]


def _under_1000(n: int) -> str:
    if n < 10:
        return ONES[n]
    if n < 20:
        return TEENS[n - 10]
    if n < 100:
        tens, ones = divmod(n, 10)
        return TENS[tens] + (" " + ONES[ones] if ones else "")
    hundreds, rest = divmod(n, 100)
    head = "seratus" if hundreds == 1 else ONES[hundreds] + " ratus"
    return head + (" " + _under_1000(rest) if rest else "")


def int_id(n: int) -> str:
    if n == 0:
        return "nol"
    if n < 1000:
        return _under_1000(n)
    thousands, rest = divmod(n, 1000)
    head = "seribu" if thousands == 1 else int_id(thousands) + " ribu"
    return head + (" " + _under_1000(rest) if rest else "")


DECIMAL = re.compile(r"\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?")


def number_to_words(match: re.Match) -> str:
    token = match.group(0)
    whole, _, frac = token.partition(",")
    text = int_id(int(whole.replace(".", "")))
    if frac:
        digits = " ".join("nol" if d == "0" else ONES[int(d)] for d in frac)
        text += " koma " + digits
    return text


SPOKEN = {
    "80:20": "80 banding 20",
    "K-Nearest Neighbor": "K Nearest Neighbor",
    "KNN": "K N N",
    "F1 macro": "F satu makro",
    "F1": "F satu",
    "SlidingTackle": "Sliding Tackle",
    "StandingTackle": "Standing Tackle",
    "HeadingAccuracy": "Heading Accuracy",
    "ShortPassing": "Short Passing",
    "BestPosition": "Best Position",
    "TotalStats": "Total Stats",
    "BaseStats": "Base Stats",
    "GKDiving": "GK Diving",
    "GKReflexes": "GK Reflexes",
    "STRating": "S T Rating",
    "GKRating": "G K Rating",
    "random_state": "random state",
    "importance-nya": "tingkat kepentingannya",
    "importance": "tingkat kepentingan",
    "Érik Lamela": "Erik Lamela",
}


def speakable(text: str) -> str:
    for src, dst in SPOKEN.items():
        text = text.replace(src, dst)
    return DECIMAL.sub(number_to_words, text)


# ---------------------------------------------------------------- synthesis
def cache_name(key: str, text: str, cfg: dict) -> str:
    """Cache key includes the text and voice settings, so editing a line cannot
    silently reuse the old audio."""
    digest = hashlib.md5(
        (text + "|" + cfg["voice"] + "|" + cfg["rate"] + "|" + cfg["pitch"]).encode("utf-8")
    ).hexdigest()[:8]
    return f"{key}-{digest}"


def cached_synth(text: str, speaker: int, key: str, force: bool) -> Path:
    cfg = VOICES[speaker]
    key = cache_name(key, text, cfg)
    out = CACHE / f"{key}.wav"
    if out.exists() and not force:
        return out

    CACHE.mkdir(parents=True, exist_ok=True)
    mp3 = CACHE / f"{key}.mp3"
    asyncio.run(
        edge_tts.Communicate(
            text,
            cfg["voice"],
            rate=cfg["rate"],
            pitch=cfg["pitch"],
        ).save(str(mp3))
    )
    subprocess.run(
        [FFMPEG, "-y", "-v", "error", "-i", str(mp3), "-ac", "1", "-ar", str(SR), str(out)],
        check=True,
    )
    mp3.unlink(missing_ok=True)
    return out


def read_wav(path: Path) -> np.ndarray:
    with wave.open(str(path)) as w:
        data = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2")
    return data.astype(np.float32) / 32768.0


def write_wav(path: Path, data: np.ndarray, channels: int = 1) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    pcm = np.clip(data, -1.0, 1.0)
    pcm16 = (pcm * 32767.0).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(channels)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm16.tobytes())


def atempo(sig: np.ndarray, tempo: float) -> np.ndarray:
    """Time-compress with ffmpeg so the voice keeps its pitch."""
    if abs(tempo - 1.0) < 0.01:
        return sig
    tmp_in = CACHE / "_tempo_in.wav"
    tmp_out = CACHE / "_tempo_out.wav"
    write_wav(tmp_in, sig)
    subprocess.run(
        [FFMPEG, "-y", "-v", "error", "-i", str(tmp_in), "-filter:a", f"atempo={tempo:.4f}",
         "-ac", "1", "-ar", str(SR), str(tmp_out)],
        check=True,
    )
    out = read_wav(tmp_out)
    tmp_in.unlink(missing_ok=True)
    tmp_out.unlink(missing_ok=True)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="re-synthesise every paragraph")
    args = ap.parse_args()

    plan = json.loads(PLAN.read_text(encoding="utf-8"))
    total_samples = 0
    for v in plan:
        total_samples += VIDEO_END[v["video"]] - (VIDEO_END[v["video"] - 1] if v["video"] > 1 else 0)
    master = np.zeros((int(round(total_samples / FPS * SR)), 2), dtype=np.float32)

    report = []
    for v in plan:
        vid = v["video"]
        for turn in v["turns"]:
            scene = turn["scene"]
            speaker = turn["speaker"]
            start_frame, end_frame = SCENES[scene]
            avail = (end_frame - start_frame) / FPS - TAIL

            parts = []
            for i, line in enumerate(turn["lines"]):
                key = f"v{vid}-s{scene}-{i:02d}"
                text = speakable(line)
                wav = cached_synth(text, speaker, key, args.force)
                parts.append(read_wav(wav))

            # Place each paragraph at its visual cue, never overlapping the previous one.
            anchors = ANCHORS[scene]
            starts: list[float] = []
            cursor = 0.0
            for i, part in enumerate(parts):
                target = anchors[i] if i < len(anchors) else cursor
                start = max(target, cursor)
                starts.append(start)
                cursor = start + len(part) / SR + GAP_MIN

            read = starts[-1] + len(parts[-1]) / SR

            # Trim the air between paragraphs before touching the speech. Only if
            # the words themselves do not fit does the scene get time-compressed.
            gaps = [starts[i + 1] - (starts[i] + len(parts[i]) / SR)
                    for i in range(len(parts) - 1)]
            extra = [max(0.0, g - GAP_MIN) for g in gaps]
            total_extra = sum(extra)
            need = read - avail
            if need > 0 and total_extra > 0:
                keep = max(0.0, (total_extra - need) / total_extra)
                cursor = starts[0]
                starts = [cursor]
                for i, gap in enumerate(gaps):
                    cursor += len(parts[i]) / SR + GAP_MIN + extra[i] * keep
                    starts.append(cursor)
                read = starts[-1] + len(parts[-1]) / SR

            tempo = 1.0
            if read > avail:
                tempo = min(MAX_TEMPO, read / avail)

            buffer = np.zeros(int(round(read * SR)), dtype=np.float32)
            for start, part in zip(starts, parts):
                at_part = int(round(start * SR))
                room = len(buffer) - at_part
                buffer[at_part:at_part + min(len(part), room)] += part[:max(0, room)]

            if tempo > 1.0:
                buffer = atempo(buffer, tempo)

            final = len(buffer) / SR
            overflow = max(0.0, final - avail)
            air = max(0.0, avail - final)
            gaps = [starts[i + 1] - (starts[i] + len(parts[i]) / SR) for i in range(len(parts) - 1)]

            at = int(round(start_frame / FPS * SR))
            n = min(len(buffer), len(master) - at)
            master[at:at + n, 0] += buffer[:n]
            master[at:at + n, 1] += buffer[:n]

            report.append(
                {
                    "scene": scene,
                    "speaker": speaker,
                    "slot": round(avail, 2),
                    "read": round(read, 2),
                    "tempo": round(tempo, 3),
                    "final": round(final, 2),
                    "overflow": round(overflow, 2),
                    "air": round(air, 2),
                    "gap_min": round(min(gaps), 2) if gaps else None,
                    "gap_max": round(max(gaps), 2) if gaps else None,
                }
            )
            print(
                f"scene {scene} suara {speaker}: {len(parts)} paragraf, "
                f"slot {avail:5.1f}s, baca {read:5.1f}s, tempo {tempo:.2f}, "
                f"akhir {final:5.1f}s, sisa {air:4.1f}s, lebih {overflow:+.1f}s"
            )

    write_wav(AUDIO / "vo-master.wav", master, channels=2)
    (AUDIO / "vo-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print("wrote", AUDIO / "vo-master.wav")


if __name__ == "__main__":
    main()
