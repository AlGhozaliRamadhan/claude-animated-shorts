#!/usr/bin/env python3
"""Mix the VO over the sound design, then mux it back onto the master picture.

The bed is ducked by the voice envelope instead of a static volume trim, so the
cues that sit under speech drop away and the ones in the gaps stay audible. The
picture is stream-copied, so nothing is re-encoded except the audio.

    python projects/fifa-posisi-5min/tools/mix_vo.py
    python projects/fifa-posisi-5min/tools/mix_vo.py --duck 0.5
"""

from __future__ import annotations

import argparse
import subprocess
import sys
import wave
from pathlib import Path

import imageio_ffmpeg
import numpy as np

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
ROOT = Path(__file__).resolve().parents[1]
RENDER = ROOT / "render"
AUDIO = RENDER / "audio"
SR = 48000

BED = AUDIO / "soundbed.wav"
VOICE = AUDIO / "vo-master.wav"
MIX = AUDIO / "mix.wav"
PICTURE = RENDER / "final.mp4"


def read(path: Path) -> np.ndarray:
    with wave.open(str(path)) as w:
        ch = w.getnchannels()
        data = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2")
    return data.astype(np.float32).reshape(-1, ch) / 32768.0


def write(path: Path, data: np.ndarray) -> None:
    pcm = np.clip(data, -1.0, 1.0)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(data.shape[1])
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((pcm * 32767.0).astype("<i2").tobytes())


def envelope(voice: np.ndarray) -> np.ndarray:
    """Peak envelope with a fast attack and a slow release, one value per sample.

    Normalised against the 80th percentile of the loud blocks instead of the
    absolute peak, so a single plosive does not flatten the whole curve and the
    duck actually reaches its floor while the voice is talking.
    """
    step = SR // 200  # 5 ms
    n = len(voice) // step
    peak = np.abs(voice[: n * step]).reshape(n, step).max(axis=1)
    loud = peak[peak > 0.02]
    ref = float(np.percentile(loud, 80)) if len(loud) else 1.0
    peak = np.clip(peak / max(ref, 1e-6), 0.0, 1.0)

    attack = 1.0 - np.exp(-step / (SR * 0.025))
    release = 1.0 - np.exp(-step / (SR * 0.320))
    out = np.empty(n, dtype=np.float32)
    acc = 0.0
    for i, value in enumerate(peak):
        coef = attack if value > acc else release
        acc += coef * (value - acc)
        out[i] = acc
    return np.repeat(out, step)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--duck", type=float, default=0.62, help="how far the bed drops under voice")
    ap.add_argument("--out", default=str(RENDER / "final.mp4"))
    args = ap.parse_args()

    for p in (BED, VOICE):
        if not p.exists():
            print(f"missing {p}")
            return 1

    bed = read(BED)
    voice = read(VOICE)
    n = min(len(bed), len(voice))
    bed, voice = bed[:n], voice[:n]

    env = envelope(voice[:n, 0])
    env = env[:n]
    duck = 1.0 - args.duck * env
    mixed = bed * duck[:, None] * 0.95 + voice

    peak = float(np.max(np.abs(mixed)))
    if peak > 0:
        mixed = mixed / peak * 0.90
    mixed = np.tanh(mixed * 1.02).astype(np.float32)
    write(MIX, mixed)

    dur = n / SR
    rms = float(np.sqrt((mixed ** 2).mean()))
    print(f"mix {dur:.2f} s, peak before limit {peak:.3f}, rms {20 * np.log10(max(rms, 1e-9)):.1f} dBFS")

    out = Path(args.out)
    tmp = out.with_suffix(".tmp.mp4")
    cmd = [
        FFMPEG, "-y", "-v", "error",
        "-i", str(PICTURE), "-i", str(MIX),
        "-map", "0:v:0", "-map", "1:a:0",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
        "-shortest", "-movflags", "+faststart", str(tmp),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-2000:])
        return 1
    tmp.replace(out)

    print(f"wrote {out}  {out.stat().st_size / 1048576:.1f} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
