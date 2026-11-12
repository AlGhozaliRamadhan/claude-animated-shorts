#!/usr/bin/env python3
"""Build the sound design for the three FIFA videos as one continuous bed.

The three videos are concatenated in frame order, so every cue is written as an
absolute frame on the master timeline:

    Video 1   0 .. 5579
    Video 2   5580 .. 11129
    Video 3   11130 .. 13709

Everything is synthesised: ticks for data, dents for numbers that stop, thuds and
sheet swipes for the cuts, stamps for the red findings, one warm chord for the
closing line. No sampled or licensed audio is used, so nothing needs crediting
and the file stays deterministic.

Usage:
    python projects/fifa-posisi-5min/tools/build_sound.py
    python projects/fifa-posisi-5min/tools/build_sound.py --out render/audio/soundbed.wav
"""

from __future__ import annotations

import argparse
import wave
from pathlib import Path

import numpy as np

SR = 48000
FPS = 30
VIDEO1_FRAMES = 5580
VIDEO2_FRAMES = 5550
VIDEO3_FRAMES = 2580
TOTAL_FRAMES = VIDEO1_FRAMES + VIDEO2_FRAMES + VIDEO3_FRAMES
TOTAL_SAMPLES = int(round(TOTAL_FRAMES / FPS * SR))

V2 = VIDEO1_FRAMES
V3 = VIDEO1_FRAMES + VIDEO2_FRAMES

RNG = np.random.default_rng(20261110)


def seconds(frames: float) -> float:
    return frames / FPS


# --------------------------------------------------------------------------
# voices
# --------------------------------------------------------------------------


def _t(dur: float) -> np.ndarray:
    return np.arange(int(round(dur * SR)), dtype=np.float64) / SR


def tick(gain: float = 1.0) -> np.ndarray:
    """Contact click, 4 ms. Data appearing, branches, tally marks."""
    t = _t(0.005)
    noise = RNG.standard_normal(len(t)) * np.exp(-t / 0.0007)
    return noise * 0.5 * gain


def dent(freq: float = 320.0, dur: float = 0.30, gain: float = 1.0) -> np.ndarray:
    """Struck metal, short. A number that stops moving."""
    t = _t(dur)
    attack = np.minimum(1.0, t / 0.0025)
    body = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.085)
    upper = np.sin(2 * np.pi * freq * 2.02 * t) * np.exp(-t / 0.032) * 0.3
    return (body + upper) * attack * 0.26 * gain


def thud(freq: float = 68.0, dur: float = 0.75, gain: float = 1.0) -> np.ndarray:
    """Low body under a cut. Felt more than heard."""
    t = _t(dur)
    attack = np.minimum(1.0, t / 0.006)
    low = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.26)
    sub = np.sin(2 * np.pi * freq * 0.5 * t) * np.exp(-t / 0.34) * 0.7
    return (low + sub) * attack * 0.28 * gain


def swipe(dur: float = 0.62, gain: float = 1.0, air: float = 0.35) -> np.ndarray:
    """Sheet of paper crossing the frame. Filtered noise with a slow envelope."""
    t = _t(dur)
    noise = RNG.standard_normal(len(t))
    kernel = np.hanning(96)
    kernel = kernel / kernel.sum()
    soft = np.convolve(noise, kernel, mode="same")
    grain = np.convolve(noise, np.hanning(5) / 3.0, mode="same")
    x = np.linspace(0.0, 1.0, len(t))
    env = np.sin(np.pi * np.clip(x, 0, 1)) ** 1.6
    return (soft + grain * air) * env * 0.17 * gain


def stamp(freq: float = 96.0, dur: float = 0.55, gain: float = 1.0) -> np.ndarray:
    """A finding landing. Only used where something is wrong."""
    t = _t(dur)
    click = RNG.standard_normal(len(t)) * np.exp(-t / 0.0045) * 0.5
    body = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.10)
    sub = np.sin(2 * np.pi * freq * 0.55 * t) * np.exp(-t / 0.22) * 0.8
    return (click + body + sub) * 0.34 * gain


def paper(dur: float = 0.9, gain: float = 1.0) -> np.ndarray:
    """A sheet being set down. Neutral, no pitch."""
    t = _t(dur)
    noise = RNG.standard_normal(len(t))
    kernel = np.hanning(240)
    kernel = kernel / kernel.sum()
    soft = np.convolve(noise, kernel, mode="same")
    env = np.exp(-t / 0.28) * np.minimum(1.0, t / 0.05)
    return soft * env * 0.24 * gain


def chord(freqs=(110.0, 164.81, 220.0, 277.18), dur: float = 4.2, gain: float = 1.0):
    """The only harmonic event in the film. Warm, short, not grand."""
    t = _t(dur)
    env = np.minimum(1.0, t / 0.55) * np.exp(-t / 1.5)
    sig = np.zeros_like(t)
    for f in freqs:
        sig += np.sin(2 * np.pi * f * t)
        sig += 0.18 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / 0.8)
    return sig / len(freqs) * env * 0.22 * gain


# --------------------------------------------------------------------------
# master buffer
# --------------------------------------------------------------------------

BUF = np.zeros((TOTAL_SAMPLES, 2), dtype=np.float32)


def place(sig: np.ndarray, frame: float, gain: float = 1.0, pan: float = 0.0) -> None:
    start = int(round(seconds(frame) * SR))
    sig = np.asarray(sig, dtype=np.float64)
    if start < 0:
        sig = sig[-start:]
        start = 0
    n = min(len(sig), TOTAL_SAMPLES - start)
    if n <= 0:
        return
    theta = (pan + 1.0) * np.pi / 4.0
    gl, gr = np.cos(theta), np.sin(theta)
    BUF[start : start + n, 0] += (sig[:n] * gain * gl).astype(np.float32)
    BUF[start : start + n, 1] += (sig[:n] * gain * gr).astype(np.float32)


# --------------------------------------------------------------------------
# room tone
# --------------------------------------------------------------------------


def room_tone() -> None:
    """Very low filtered noise so silence still has air in it."""
    kernel = np.hanning(160)
    kernel = kernel / kernel.sum()
    block = SR * 4
    for s in range(0, TOTAL_SAMPLES, block):
        n = min(block + len(kernel), TOTAL_SAMPLES - s)
        if n <= 0:
            break
        noise = RNG.standard_normal(n)
        soft = np.convolve(noise, kernel, mode="same")[:block]
        length = len(soft)
        if length <= 0:
            continue
        x = np.linspace(0.0, 1.0, max(TOTAL_SAMPLES - s, 1))[:length]
        swell = 0.82 + 0.18 * np.sin(2 * np.pi * 0.05 * (x + s / TOTAL_SAMPLES))
        BUF[s : s + length, 0] += (soft * swell * 0.022).astype(np.float32)
        BUF[s : s + length, 1] += (soft * swell * 0.022).astype(np.float32)


def drone() -> None:
    """One low A held under the whole film, breathing slowly.

    Without narration a cue-only bed reads as broken silence between hits, so
    there is a continuous floor. Two slightly detuned roots beat against each
    other at 0.18 Hz, which is slow enough to feel like room, not music.
    """
    parts = [
        (55.0, 0.42, 0.0),
        (55.18, 0.30, 0.4),
        (82.41, 0.22, 1.2),
        (110.0, 0.12, 2.1),
        (220.0, 0.05, 0.9),
    ]
    block = SR * 4
    for s in range(0, TOTAL_SAMPLES, block):
        n = min(block, TOTAL_SAMPLES - s)
        if n <= 0:
            break
        t = (np.arange(s, s + n, dtype=np.float64)) / SR
        sig = np.zeros(n, dtype=np.float64)
        for freq, amp, phase in parts:
            sig += amp * np.sin(2 * np.pi * freq * t + phase)
        lfo = 0.78 + 0.22 * np.sin(2 * np.pi * 0.017 * t + 1.1)
        sig *= lfo * 0.042
        BUF[s : s + n, 0] += sig.astype(np.float32)
        BUF[s : s + n, 1] += sig.astype(np.float32)


room_tone()
drone()

# --------------------------------------------------------------------------
# cuts: sheet swipe plus low body
# --------------------------------------------------------------------------

CUTS = [
    180, 1180, 1380, 1710, 1920, 3810,
    V2 + 360, V2 + 900, V2 + 1380, V2 + 1680, V2 + 2100,
    V2 + 3060, V2 + 3750, V2 + 4620, V2 + 4920,
    V3 + 840, V3 + 1350, V3 + 1950,
]

for i, cut in enumerate(CUTS):
    pan = -0.35 if i % 2 == 0 else 0.35
    place(swipe(0.60, 0.9), cut - 12, pan=pan)
    place(thud(66 + (i % 3) * 4), cut, gain=0.9)

# --------------------------------------------------------------------------
# Video 1
# --------------------------------------------------------------------------

# Cold open: a dark page and four lines of type sliding up. No sheet here, so the
# sound is one soft body under the headline and dry ticks on the small lines.
place(thud(48, 1.5, 0.55), 14)
for f in [8, 34, 40, 78]:
    place(tick(0.6), f, gain=0.5, pan=-0.2)
place(paper(0.5, 0.4), 56, pan=-0.15)

# Scene 1: chips landing across the page, then the five-row ledger.
place(paper(0.6, 0.45), 584, pan=-0.3)
for i in range(0, 29, 3):
    place(tick(0.5), 880 + i * 3, gain=0.4, pan=-0.55 + i * 0.038)
for i in range(5):
    place(tick(0.65), 896 + i * 7, gain=0.55, pan=-0.45 + i * 0.22)
place(dent(300, 0.3, 0.6), 1080, pan=0.15)

# Scene 2: the board, then the report card, then the rating column.
for i, f in enumerate([1920 + 500, 1920 + 690, 1920 + 870, 1920 + 1010]):
    place(paper(0.7, 0.55), f, pan=-0.2)
for f in [1920 + 1260, 1920 + 1300, 1920 + 1340]:
    place(dent(300, 0.24, 0.8), f, pan=0.25)

# Scene 3: the counter, then the duplicate, then the strike.
for i, f in enumerate([3810 + 44, 3810 + 104, 3810 + 196]):
    place(dent(280 + i * 60, 0.3, 0.8), f, pan=-0.25 + i * 0.25)
for f in [3810 + 12, 3810 + 88, 3810 + 172]:
    place(tick(0.6), f, gain=0.45, pan=0.3)
place(tick(1.2), 3810 + 236, pan=0.2)
place(stamp(96, 0.6, 0.85), 3810 + 250)
place(dent(240, 0.35, 0.7), 3810 + 640, pan=-0.25)

# --------------------------------------------------------------------------
# Video 2, scene 4: three readers
# --------------------------------------------------------------------------

for i in range(11):
    place(tick(0.5), V2 + 2 + i * 4, gain=0.55, pan=-0.6 + i * 0.11)

for i, f in enumerate([V2 + 180, V2 + 240, V2 + 300]):
    place(dent(260 + i * 40, 0.28, 0.75), f, pan=-0.15)

for f in [V2 + 380, V2 + 392, V2 + 404, V2 + 416]:
    place(tick(0.8), f, pan=0.2)

for i in range(6):
    place(tick(0.55), V2 + 912 + i * 12, gain=0.7, pan=-0.4 + i * 0.14)
place(dent(420, 0.3, 0.7), V2 + 1000, pan=-0.2)

for i in range(12):
    place(tick(0.45), V2 + 1390 + i * 9, gain=0.6, pan=0.5 - i * 0.08)
place(swipe(0.5, 0.5), V2 + 1496, pan=0.1)
place(dent(300, 0.3, 0.8), V2 + 1586, pan=0.15)

place(stamp(90, 0.55, 0.75), V2 + 1830)
place(dent(340, 0.26, 0.7), V2 + 1920, pan=-0.1)

# --------------------------------------------------------------------------
# Video 2, scene 5: the score
# --------------------------------------------------------------------------

for i in range(3):
    place(dent(300 + i * 70, 0.3, 0.75), V2 + 2100 + 92 + i * 14, pan=-0.3 + i * 0.28)
for i in range(3):
    place(dent(520 + i * 40, 0.22, 0.5), V2 + 2100 + 512 + i * 10, pan=0.35)
for i in range(3):
    place(tick(0.7), V2 + 2100 + 740 + i * 8, pan=0.5)

place(thud(55, 1.4, 0.75), V2 + 3060 + 40)
place(dent(190, 0.5, 0.65), V2 + 3060 + 286, pan=0.2)

# --------------------------------------------------------------------------
# Video 2, scene 6: the errors
# --------------------------------------------------------------------------

place(tick(0.9), V2 + 3750 + 34, pan=0.1)
for i in range(9):
    place(tick(0.7), V2 + 3750 + 210 + i * 6, gain=0.65, pan=-0.5 + i * 0.12)
place(stamp(104, 0.7, 1.0), V2 + 3750 + 570)
place(thud(62, 0.9, 0.55), V2 + 3750 + 592)

place(swipe(0.5, 0.45), V2 + 4620 + 62, pan=-0.3)
for f in [V2 + 4620 + 168, V2 + 4620 + 176]:
    place(dent(280, 0.3, 0.6), f, pan=-0.2)

for i, f in enumerate([V2 + 4920 + 34, V2 + 4920 + 46]):
    place(dent(340 + i * 60, 0.3, 0.75), f, pan=0.15)

# --------------------------------------------------------------------------
# Video 3, scene 7: what the model looks at
# --------------------------------------------------------------------------

# Video 3 starts inside Video 2's ending, so the section change gets its own body.
place(thud(58, 1.0, 1.0), V3, pan=0.0)
place(tick(0.5), V3 + 10, pan=-0.35)

for i in range(5):
    place(tick(0.75), V3 + 300 + i * 12, gain=0.7, pan=0.45)
place(dent(200, 0.55, 0.8), V3 + 600, pan=-0.4)
place(dent(260, 0.35, 0.55), V3 + 690, pan=-0.3)

place(dent(300, 0.3, 0.7), V3 + 840 + 10, pan=-0.2)
place(dent(240, 0.3, 0.6), V3 + 840 + 66, pan=0.25)
place(tick(0.7), V3 + 840 + 300, pan=-0.2)

# --------------------------------------------------------------------------
# Video 3, scene 8: closing
# --------------------------------------------------------------------------

for i in range(4):
    place(dent(210 + i * 30, 0.26, 0.5), V3 + 1350 + 6 + i * 12, pan=-0.25)
for i in range(3):
    place(tick(0.6), V3 + 1350 + 302 + i * 12, gain=0.6, pan=-0.4)

place(paper(1.0, 0.6), V3 + 1950 + 4, pan=-0.35)
place(dent(320, 0.3, 0.65), V3 + 1950 + 30, pan=0.1)
place(stamp(120, 0.5, 0.55), V3 + 1950 + 122, pan=0.25)
place(dent(240, 0.6, 0.8), V3 + 1950 + 300, pan=0.0)

place(chord(gain=0.85), V3 + 1950 + 300, pan=0.0)
place(thud(52, 1.2, 0.55), V3 + 2550, pan=0.0)

# --------------------------------------------------------------------------
# finish
# --------------------------------------------------------------------------

tail_start = int(round(seconds(V3 + 2550) * SR))
BUF[tail_start:, :] *= np.linspace(1.0, 0.0, TOTAL_SAMPLES - tail_start)[:, None] ** 1.5

peak = float(np.max(np.abs(BUF)))
if peak > 0:
    BUF = BUF / peak * 0.88
BUF = np.tanh(BUF.astype(np.float64) * 1.0).astype(np.float32)

print(f"peak before limit: {peak:.3f}")
print(f"duration: {TOTAL_SAMPLES / SR:.2f} s ({TOTAL_FRAMES} frames)")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--out",
        default=str(
            Path(__file__).resolve().parents[1] / "render" / "audio" / "soundbed.wav"
        ),
    )
    args = ap.parse_args()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    pcm = np.clip(BUF, -1.0, 1.0)
    pcm16 = (pcm * 32767.0).astype("<i2")
    with wave.open(str(out), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm16.tobytes())
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
