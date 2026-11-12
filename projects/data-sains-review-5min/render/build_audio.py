#!/usr/bin/env python3
"""Build the complete 300 s soundtrack for the NVIDIA review timeline.

Layers
  vo     eight fitted Indonesian VO takes, placed from vo/manifest.json
  music  S1/S2 beds from the earlier preview plus synthesized pads and pulses
  sfx    beat-synced impacts, ticks, whooshes, glitches and piano cues

The music and sfx buses are side-chain ducked under the VO, then the sum is
high-passed, given a gentle presence lift, normalized to -16 LUFS and limited
to -1.5 dBTP. Outputs 24-bit WAV stems plus the final mix.

Usage
    python render/build_audio.py
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
sys.path.insert(0, str(REPO / "templates" / "audio"))

import dsp  # noqa: E402
from scipy import signal  # noqa: E402

SR = dsp.SR
DUR = 300.0
N = dsp.ns(DUR)
ASET = ROOT / "aset"
VO_DIR = ASET / "vo"
OUT = ROOT / "render" / "audio"
OUT.mkdir(parents=True, exist_ok=True)

CUTS = [19.0, 45.0, 90.0, 130.0, 160.0, 215.0, 260.0]
SCENES = [(0, 19), (19, 38.8), (38.8, 45), (45, 90), (90, 130), (130, 160), (160, 215), (215, 260), (260, 300)]

rnd = dsp.rng(20261105)


# ------------------------------------------------------------------ sources
def load(name: str, stereo: bool = False) -> np.ndarray:
    x, sr = dsp.read_wav(str(ASET / name))
    if sr != SR:
        x = signal.resample_poly(x, SR, sr, axis=-1)
    x = np.asarray(x, float)
    if x.shape[0] == 1 and stereo:
        x = dsp.st(x[0])
    return x


def fit(x: np.ndarray, seconds: float) -> np.ndarray:
    """trim or pad to an exact length"""
    n = dsp.ns(seconds)
    if x.shape[1] >= n:
        return x[:, :n].copy()
    return np.pad(x, ((0, 0), (0, n - x.shape[1])))


def loop_to(x: np.ndarray, seconds: float) -> np.ndarray:
    n = dsp.ns(seconds)
    reps = int(np.ceil(n / x.shape[1]))
    return np.tile(x, (1, reps))[:, :n].copy()


# ------------------------------------------------------------------ design
def impact(dur: float = 2.4, f0: float = 66.0, f1: float = 30.0) -> np.ndarray:
    t = dsp.tt(dur)
    f = f1 + (f0 - f1) * np.exp(-t / 0.16)
    body = np.sin(dsp.phase(f)) * np.exp(-t / 0.52)
    thump = dsp.lp(rnd.standard_normal(len(t)), 160, 2) * np.exp(-t / 0.07)
    air = dsp.bp(rnd.standard_normal(len(t)), 500, 3500, 1) * np.exp(-t / 0.05) * 0.18
    y = body + 0.55 * thump + air
    return dsp.fades(y / (np.abs(y).max() + 1e-9), 0.002, 0.35)


def pulse(dur: float = 0.55, f0: float = 78.0, f1: float = 44.0) -> np.ndarray:
    t = dsp.tt(dur)
    f = f1 + (f0 - f1) * np.exp(-t / 0.055)
    y = np.sin(dsp.phase(f)) * np.exp(-t / 0.15)
    y += 0.3 * dsp.lp(rnd.standard_normal(len(t)), 130, 2) * np.exp(-t / 0.03)
    return dsp.fades(y / (np.abs(y).max() + 1e-9), 0.003, 0.12)


def tick(f: float = 2200.0, dur: float = 0.07, q: float = 9.0, decay: float = 0.009) -> np.ndarray:
    t = dsp.tt(dur)
    y = dsp.reson(rnd.standard_normal(len(t)), f, q) * np.exp(-t / decay)
    y += 0.25 * dsp.hp(rnd.standard_normal(len(t)), 5000, 1) * np.exp(-t / 0.002)
    return dsp.fades(y / (np.abs(y).max() + 1e-9), 0.0003, 0.02)


def swoosh(dur: float = 0.75, reverse: bool = False) -> np.ndarray:
    x = load("sfx_swoosh.wav")
    y = signal.resample(x, dsp.ns(dur), axis=-1)
    y = y / (np.abs(y).max() + 1e-9)
    if reverse:
        y = y[:, ::-1].copy()
    return dsp.fades(y, 0.02, 0.08)


def piano(dur: float = 3.5, semitones: float = 0.0, soft: float = 1.0) -> np.ndarray:
    x = load("sfx_piano_single.wav")
    if semitones:
        ratio = 2.0 ** (semitones / 12.0)
        x = signal.resample(x, max(8, int(round(x.shape[1] / ratio))), axis=-1)
    x = fit(x, dur)
    x = dsp.lp(x, 3200) * soft
    return dsp.fades(x / (np.abs(x).max() + 1e-9), 0.004, 0.5)


def piano_run() -> np.ndarray:
    x = load("sfx_piano_run.wav")
    return dsp.fades(x / (np.abs(x).max() + 1e-9), 0.004, 0.4)


def riser(dur: float = 3.0, f0: float = 170.0, f1: float = 950.0) -> np.ndarray:
    t = dsp.tt(dur)
    env = (t / dur) ** 2.1
    nz = dsp.bp(rnd.standard_normal(len(t)), 500, 5200, 1) * env * 0.55
    tone = np.sin(dsp.phase(f0 * (f1 / f0) ** (t / dur))) * env * 0.35
    return dsp.fades(nz + tone, 0.15, 0.012)


def dropout(dur: float = 1.2, f0: float = 96.0, f1: float = 26.0) -> np.ndarray:
    t = dsp.tt(dur)
    f = f1 + (f0 - f1) * np.exp(-t / 0.22)
    y = np.sin(dsp.phase(f)) * np.exp(-t / 0.38)
    y += 0.3 * dsp.lp(rnd.standard_normal(len(t)), 380, 2) * np.exp(-t / 0.05)
    return dsp.fades(y / (np.abs(y).max() + 1e-9), 0.002, 0.25)


def ride(x: np.ndarray, win: float = 0.4, limit_db: float = 5.0) -> np.ndarray:
    """slow gain rider: tames the beating between detuned pad voices"""
    mono = np.abs(x) if x.ndim == 1 else np.abs(x).max(0)
    w = dsp.ns(win)
    frames = len(mono) // w
    rms = 20 * np.log10(
        np.sqrt(np.mean(mono[: frames * w].reshape(frames, w) ** 2, axis=1)) + 1e-9
    )
    target = np.percentile(rms, 75)
    gain_db = np.clip(target - rms, -limit_db, limit_db)
    a = 1 - np.exp(-1.0 / max(1.0, 0.6 / win))  # gain curve is per frame, not per sample
    smooth = signal.lfilter([a], [1, -(1 - a)], gain_db)
    gain = np.interp(
        np.arange(len(mono)),
        np.arange(frames) * w + w / 2,
        smooth,
        left=smooth[0],
        right=smooth[-1],
    )
    return x * dsp.dbg(gain)


def pad(dur: float, freqs: list[float], seed: int, cutoff: float = 1150.0,
        attack: float = 1.6, release: float = 1.6) -> np.ndarray:
    n = dsp.ns(dur)
    t = dsp.tt(dur)
    r = dsp.rng(seed)
    y = np.zeros(n)
    for i, f in enumerate(freqs):
        for det in (-0.0014, 0.0011):
            ph = dsp.TAU * f * (1 + det) * t + r.uniform(0, dsp.TAU)
            lfo = 1.0 + 0.16 * np.sin(dsp.TAU * r.uniform(0.025, 0.065) * t + r.uniform(0, dsp.TAU))
            y += (0.86 ** i) * lfo * np.sin(ph)
    y = dsp.lp(y, cutoff, 2)
    # a little air so the pad is not a pure sine stack
    y += 0.05 * dsp.bp(r.standard_normal(n), 400, 2400, 1)
    y = ride(y)
    env = np.minimum(1.0, t / attack) * np.minimum(1.0, np.maximum(0.0, (dur - t) / release))
    return dsp.fades(y * env, 0.01, 0.05)


# ------------------------------------------------------------------ score
def build_music() -> np.ndarray:
    bus = np.zeros((2, N))

    # S1 and S2: keep the beds that were already cut to the picture
    bed1 = fit(load("sfx_scene1_v3.wav", stereo=True), 19.0)
    bed1 = dsp.fades(bed1, 0.01, 0.8)
    bed1 = dsp.norm_to(bed1, -27.0, "integrated")
    dsp.place(bus, bed1, 0.0)

    bed2 = fit(load("sfx_scene2_v3.wav", stereo=True), 26.0)
    bed2 = dsp.fades(bed2, 0.02, 0.8)
    bed2 = dsp.norm_to(bed2, -30.0, "integrated")
    dsp.place(bus, bed2, 19.0)

    # pads: overlap the cuts so chords crossfade
    chords = [
        ((0, 19), [73.42, 110.00, 174.61, 146.83], 11, 1000),
        ((19, 45), [73.42, 110.00, 130.81, 174.61], 12, 1080),
        ((45, 90), [73.42, 110.00, 130.81, 174.61], 13, 1200),
        ((90, 130), [58.27, 87.31, 146.83, 220.00], 14, 1150),
        ((130, 160), [73.42, 87.31, 110.00, 130.81], 15, 1050),
        ((160, 205), [73.42, 103.83, 130.81, 174.61], 16, 950),
        ((205, 215), [73.42, 110.00, 146.83, 174.61], 17, 1150),
        ((215, 260), [73.42, 87.31, 110.00, 164.81], 18, 1000),
        ((260, 284), [87.31, 130.81, 174.61, 220.00], 19, 1200),
        ((284, 300), [73.42, 110.00, 146.83, 174.61], 20, 1000),
    ]
    for (start, end), freqs, seed, cutoff in chords:
        dur = end - start + 1.5
        p = pad(dur, freqs, seed, cutoff, attack=0.8, release=0.8)
        p = dsp.widen(p, dsp.rng(seed + 100), ms=17.0, amount=0.7)
        p = dsp.norm_to(p, -31.5, "integrated")
        dsp.place(bus, p, max(0.0, start - 0.75))

    # slow heartbeats in the explanation and method scenes
    for tm in np.arange(45.6, 89.0, 4.0):
        dsp.place(bus, dsp.pan(pulse(0.5), -0.15), tm, dsp.dbg(-30))
    for tm in np.arange(94.6, 126.0, 4.0):
        dsp.place(bus, dsp.pan(pulse(0.45), 0.12), tm, dsp.dbg(-32))

    return bus


# ------------------------------------------------------------------ sfx
def build_sfx() -> tuple[np.ndarray, np.ndarray]:
    bus = np.zeros((2, N))
    hits = np.zeros((2, N))  # not ducked

    def put(x, t, gain_db=0.0, pan=0.0, dest=bus):
        x = np.asarray(x, float)
        if x.ndim == 2 and x.shape[0] == 1:
            x = x[0]
        dsp.place(dest, dsp.pan(x, pan) if pan else dsp.st(x), t, dsp.dbg(gain_db))

    # ---- cuts: reverse swell into the black frame, sub hit on it
    for cut in CUTS:
        put(swoosh(0.9, reverse=True), cut - 0.86, -19.0, 0.0)
        put(impact(2.2, 64, 29), cut, -13.0, 0.0, hits)

    # ---- S1
    put(load("sfx_glitch.wav"), 12.10, -15.0, -0.1)
    put(swoosh(0.55, reverse=True), 18.35, -24.0)

    # ---- S2
    for t in (20.15, 22.95, 26.70):
        put(tick(1900, 0.06), t, -25.0, 0.2)
    put(swoosh(0.7), 31.65, -22.0, -0.2)
    put(tick(1500, 0.08), 31.95, -24.0, 0.0)

    # ---- S2B: peta empat langkah
    put(pulse(0.55, 70, 38), 38.82, -27.0, 0.0)
    for i in range(4):
        put(tick(1850 + i * 150, 0.055), 39.35 + i * 0.52, -26.0, -0.22 + 0.14 * i)

    # ---- S3
    put(pulse(0.6, 72, 40), 45.38, -22.0)
    put(swoosh(0.6), 47.52, -26.0, 0.25)
    put(tick(2100, 0.07), 48.55, -23.0, -0.1)
    for i in range(5):
        put(tick(2400 + i * 180, 0.05), 48.92 + i * 0.16, -27.0, -0.1 + 0.05 * i)
    put(pulse(0.55, 66, 36), 55.20, -21.0)
    put(impact(1.8, 58, 30), 61.95, -18.0, -0.15)
    # page turn: X page slides out, Y page slides in
    put(swoosh(0.55), 65.35, -27.0, 0.15)
    put(tick(1750, 0.06), 66.18, -27.0, 0.1)
    put(tick(1700, 0.07), 69.82, -23.0, 0.1)
    put(pulse(0.45), 70.25, -24.0, 0.15)
    put(tick(2000, 0.05), 71.55, -26.0, 0.2)
    put(piano(3.5, 0.0, 0.7), 79.75, -22.0, -0.12)

    # ---- S4
    put(pulse(0.5, 70, 38), 90.35, -25.0)
    for i in range(5):
        put(tick(1500 + i * 120, 0.07), 90.42 + i * 0.40, -21.0, -0.25 + 0.12 * i)
    put(tick(2300, 0.06), 93.22, -22.0, 0.0)
    put(swoosh(0.45), 100.42, -29.0, 0.2)
    put(tick(1350, 0.05), 102.95, -27.0, 0.1)
    put(swoosh(0.8), 107.70, -22.0, 0.1)
    put(pulse(0.6, 70, 38), 107.92, -23.0, 0.1)
    for i in range(5):
        put(tick(1900 + i * 150, 0.05), 107.95 + i * 0.6, -27.0, 0.15)
    put(tick(2200, 0.06), 116.22, -23.0, -0.15)
    # counter: 18 fast ticks, rising pitch
    for i in range(18):
        put(tick(1500 + i * 95, 0.035, 12, 0.006), 116.92 + i * 0.19, -30.0, -0.1 + 0.012 * i)
    put(impact(1.6, 72, 34), 121.22, -17.0, 0.0, hits)

    # ---- S5
    put(swoosh(0.7), 130.25, -24.0, 0.25)
    put(tick(2100, 0.06), 131.62, -24.0, -0.2)
    put(piano(3.5, 0.0, 0.8), 133.30, -20.0, -0.1)
    put(tick(1400, 0.08), 138.92, -22.0, 0.15)
    put(tick(1250, 0.08), 139.27, -22.0, 0.15)
    put(tick(2000, 0.06), 144.32, -25.0, -0.05)
    put(impact(1.9, 70, 32), 152.78, -14.0, 0.05, hits)
    put(dropout(1.2), 154.42, -17.0, 0.0, hits)
    put(swoosh(0.5, reverse=True), 159.35, -24.0)

    # ---- S6
    put(pulse(0.6, 70, 36), 160.35, -24.0)
    for i in range(3):
        put(tick(1800 + i * 220, 0.07), 169.72 + i * 0.42, -22.0, -0.2 + 0.2 * i)
    put(impact(1.4, 74, 40), 174.55, -20.0, -0.1)
    put(impact(1.5, 84, 44), 175.95, -19.0, 0.1)
    put(piano(3.5, 0.0, 0.6), 178.25, -23.0, 0.0)
    put(tick(1700, 0.07), 184.42, -24.0, -0.15)
    put(riser(2.9, 170, 900), 191.25, -26.0, 0.0)
    put(load("sfx_glitch.wav"), 194.12, -11.0, 0.0, hits)
    put(impact(2.1, 72, 28), 194.15, -12.0, 0.0, hits)
    put(tick(2100, 0.06), 196.42, -22.0, 0.15)
    put(piano(3.5, -2.0, 0.7), 200.55, -21.0, 0.1)
    put(pulse(0.55), 208.12, -22.0, 0.0)

    # ---- S7: camera lands on each panel
    put(pulse(0.55, 72, 40), 220.45, -20.0, -0.2)
    for start, pane in zip([226.85, 232.05, 241.55, 247.05, 251.05], range(1, 6)):
        put(swoosh(0.62), start + 0.02, -24.0, -0.25 + 0.1 * pane)
        put(pulse(0.45, 68, 38), start + 0.95, -22.0, -0.2 + 0.08 * pane)
    put(piano(3.5, -3.0, 0.75), 256.90, -25.0, 0.0)

    # ---- S8
    put(pulse(0.7, 66, 34), 260.30, -21.0)
    for i in range(3):
        put(tick(2100 + i * 160, 0.05), 260.47 + i * 0.16, -27.0, -0.1 + 0.1 * i)
    put(pulse(0.5, 70, 38), 268.98, -23.0, 0.1)
    for i in range(3):
        put(tick(1800 + i * 150, 0.06), 269.15 + i * 1.15, -25.0, -0.15 + 0.1 * i)
    put(piano(3.5, -5.0, 0.85), 273.62, -20.0, -0.1)
    put(dropout(1.0, 82, 28), 277.55, -19.0, 0.0, hits)
    for i in range(3):
        put(tick(1700 + i * 200, 0.06), 278.45 + i * 0.30, -24.0, -0.1 + 0.1 * i)
    put(piano_run(), 283.95, -19.0, -0.05)
    for i, t in enumerate((284.45, 287.00, 288.85)):
        put(tick(2300 - i * 200, 0.05), t, -27.0, 0.1)
    put(tick(1900, 0.06), 289.97, -26.0, 0.0)

    # final resolve
    dsp.place(hits, dsp.st(fit(piano(6.0, -7.0, 0.8), 6.0)), 294.4, dsp.dbg(-22))

    return bus, hits


# ------------------------------------------------------------------ mix
def duck_curve(vo: np.ndarray, depth_db: float, thr_db: float = -45.0,
               range_db: float = 18.0, lookahead: float = 0.12) -> np.ndarray:
    mono = np.abs(vo).max(0)
    win = dsp.ns(0.05)
    frames = len(mono) // win
    rms = np.sqrt(np.mean(mono[: frames * win].reshape(frames, win) ** 2, axis=1) + 1e-12)
    level = 20 * np.log10(rms + 1e-9)
    target = np.clip((thr_db - level) / range_db, 0.0, 1.0)
    full = np.interp(np.arange(N) / win, np.arange(frames), target, left=0.0, right=0.0)
    # anticipate, then smooth with a fast attack / slow release
    shifted = np.interp(np.arange(N) + dsp.ns(lookahead), np.arange(N), full)
    a_att = 1 - np.exp(-1.0 / (dsp.ns(0.045)))
    a_rel = 1 - np.exp(-1.0 / (dsp.ns(0.30)))
    out = np.empty(N)
    cur = shifted[0]
    # vectorized one-pole with different coefficients is easier as a lfilter on each
    # direction: take the fast-attack smoothing, then the slow-release smoothing
    fast = signal.lfilter([a_att], [1, -(1 - a_att)], shifted)
    slow = signal.lfilter([a_rel], [1, -(1 - a_rel)], fast)
    out = np.maximum(fast, slow)
    return dsp.dbg(-depth_db * out).astype(np.float32)


def main() -> int:
    manifest = json.loads((VO_DIR / "manifest.json").read_text(encoding="utf-8"))

    vo = np.zeros((2, N))
    for scene in manifest:
        x = load(f"vo/{scene['file']}")[0]
        dsp.place(vo, x, scene["placement"])

    print("building music...", flush=True)
    music = build_music()
    print("building sfx...", flush=True)
    sfx, hits = build_sfx()

    print("ducking...", flush=True)
    duck_music = duck_curve(vo, 6.5, -46.0, 20.0)
    duck_sfx = duck_curve(vo, 4.5, -46.0, 20.0)

    mix = vo + music * duck_music + sfx * duck_sfx + hits

    print("mastering...", flush=True)
    mix = dsp.hp(mix, 26, 2)
    mix = dsp.peq(mix, 280, -0.7, 0.9)
    mix = dsp.shelf(mix, 7200, 0.7, "high")

    lufs = dsp.integrated(mix)
    gain = dsp.dbg(-16.0 - lufs)
    mix *= gain
    tp = dsp.true_peak(mix)
    print(f"pre-limiter: {lufs:.2f} LUFS -> gain {20*np.log10(gain):+.2f} dB, true peak {tp:.2f} dBTP")

    # master fade matches the picture fade (297.3 -> 300.0)
    fade = np.ones(N)
    a, b = dsp.ns(297.2), N
    fade[a:b] = dsp.ramp(b - a)[::-1]
    mix *= fade

    # peak safety with ffmpeg's lookahead limiter
    raw = OUT / "mix_raw.wav"
    final = OUT / "mix.wav"
    dsp.write_wav(str(raw), mix, bits=24)
    ffmpeg = _ffmpeg()
    subprocess.run(
        [ffmpeg, "-y", "-hide_banner", "-loglevel", "error", "-i", str(raw),
         "-af", "alimiter=limit=0.841:attack=5:release=80:level=false",
         "-ar", "48000", "-ac", "2", "-c:a", "pcm_s24le", str(final)],
        check=True,
    )

    # report and stems
    out, _ = dsp.read_wav(str(final))  # read_wav needs a path string, not Path
    print(f"final: {dsp.integrated(out):.2f} LUFS  true peak {dsp.true_peak(out):.2f} dBTP  "
          f"{out.shape[1]/SR:.2f}s")
    dsp.write_wav(str(OUT / "vo.wav"), vo, bits=24)
    dsp.write_wav(str(OUT / "music.wav"), music * duck_music, bits=24)
    dsp.write_wav(str(OUT / "sfx.wav"), sfx * duck_sfx + hits, bits=24)
    raw.unlink(missing_ok=True)

    cues = {
        "cuts": CUTS,
        "vo": [{"scene": s["scene"], "at": s["placement"], "dur": s["duration"]} for s in manifest],
        "scenes": SCENES,
        "lufs": round(float(dsp.integrated(out)), 2),
        "true_peak": round(float(dsp.true_peak(out)), 2),
    }
    (OUT / "mix.json").write_text(json.dumps(cues, indent=2), encoding="utf-8")
    print(f"wrote {final}")
    return 0


def _ffmpeg() -> str:
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


if __name__ == "__main__":
    raise SystemExit(main())
