#!/usr/bin/env python3
"""Measure the finished mix: voice level, bed level, duck depth, clipping.

Run after `build_vo.py` and `mix_vo.py`, or after a re-mux. It reads the three
stems (bed, voice, mix) plus the final MP4, so a mismatch shows up here before
anyone watches the whole thing.

    python projects/fifa-posisi-5min/tools/check_audio.py
"""

from __future__ import annotations

import subprocess
import wave
from pathlib import Path

import imageio_ffmpeg
import numpy as np

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "render" / "audio"
MP4 = ROOT / "render" / "final.mp4"
SR = 48000


def read(path: Path) -> np.ndarray:
    with wave.open(str(path)) as w:
        ch = w.getnchannels()
        data = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2")
    return data.astype(np.float32).reshape(-1, ch) / 32768.0


def db(value: float) -> float:
    return 20 * np.log10(max(float(value), 1e-9))


def main() -> None:
    bed = read(AUDIO / "soundbed.wav")[:, 0]
    voice = read(AUDIO / "vo-master.wav")[:, 0]
    mix = read(AUDIO / "mix.wav")[:, 0]
    n = min(len(bed), len(voice), len(mix))
    bed, voice, mix = bed[:n], voice[:n], mix[:n]

    win = SR // 2
    nw = n // win
    vb = np.sqrt((voice[: nw * win].reshape(nw, win) ** 2).mean(axis=1))
    bb = np.sqrt((bed[: nw * win].reshape(nw, win) ** 2).mean(axis=1))
    mb = np.sqrt((mix[: nw * win].reshape(nw, win) ** 2).mean(axis=1))

    speech = vb > 0.02
    gap = vb <= 0.005

    print(f"durasi       {n / SR:.2f} s")
    print(f"jendela      {nw} x 0,5 s ({speech.sum()} bicara, {gap.sum()} jeda)")
    print(f"voice        median {db(np.median(vb[speech])):6.1f} dB")
    print(f"bed  bicara  median {db(np.median(bb[speech])):6.1f} dB")
    print(f"bed  jeda    median {db(np.median(bb[gap])):6.1f} dB")
    print(f"mix  bicara  median {db(np.median(mb[speech])):6.1f} dB")
    print(f"mix  jeda    median {db(np.median(mb[gap])):6.1f} dB")
    print(f"voice > bed  {db(np.median(vb[speech])) - db(np.median(bb[speech])):+.1f} dB sebelum duck")
    print(f"peak mix     {np.abs(mix).max():.3f}, clip {(np.abs(mix) > 0.999).sum()} sampel")

    runs, cur = [], 0
    for value in speech:
        cur = 0 if value else cur + 1
        runs.append(cur)
    print(f"jeda terpanjang tanpa suara {max(runs) * 0.5:.1f} s")

    r = subprocess.run([FFMPEG, "-hide_banner", "-i", str(MP4)], capture_output=True, text=True)
    for line in r.stderr.splitlines():
        if "Duration:" in line or "Stream #0:0" in line or "Stream #0:1" in line:
            print(line.strip())


if __name__ == "__main__":
    main()
