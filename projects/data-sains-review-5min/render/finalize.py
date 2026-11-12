#!/usr/bin/env python3
"""Mux the rendered picture with the soundtrack and verify the deliverable.

Checks: duration, streams, frame count, decoded loudness / true peak, and
extracts one frame per scene plus the hard cuts for a final visual pass.

Usage
    python render/finalize.py
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
sys.path.insert(0, str(REPO / "templates" / "audio"))
sys.path.insert(0, str(ROOT / "render"))

import dsp  # noqa: E402

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
VIDEO = ROOT / "render" / "video.mp4"
AUDIO = ROOT / "render" / "audio" / "mix.wav"
OUT = ROOT / "render" / "final.mp4"
FRAMES = ROOT / "render" / "final_frames"

CHECK_TIMES = [4.0, 22.0, 30.0, 40.0, 48.0, 92.0, 133.5, 170.0, 220.6, 260.6, 278.6, 294.0]
CUT_TIMES = [19.0, 38.8, 45.0, 90.0, 130.0, 160.0, 215.0, 260.0]


def run(args: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run([FFMPEG, "-hide_banner", *args], capture_output=True, text=True)


def main() -> int:
    if not VIDEO.is_file():
        raise SystemExit(f"missing render: {VIDEO}")
    if not AUDIO.is_file():
        raise SystemExit(f"missing mix: {AUDIO}")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    mux = run(
        [
            "-y", "-i", str(VIDEO), "-i", str(AUDIO),
            "-map", "0:v:0", "-map", "1:a:0",
            "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-ar", "48000",
            "-movflags", "+faststart", "-shortest", str(OUT),
        ]
    )
    if mux.returncode != 0:
        print(mux.stderr[-4000:])
        raise SystemExit("mux failed")

    report = run(["-i", str(OUT)])
    text = report.stderr
    duration = next((line.strip() for line in text.splitlines() if "Duration:" in line), "?")
    video_line = next((line.strip() for line in text.splitlines() if "Video: h264" in line), "?")
    audio_line = next((line.strip() for line in text.splitlines() if "Audio: aac" in line), "?")
    print(duration)
    print(video_line)
    print(audio_line)

    count = run(["-i", str(OUT), "-map", "0:v:0", "-c", "copy", "-f", "null", "-"])
    frames = [line for line in count.stderr.splitlines() if line.startswith("frame=")]
    print(frames[-1] if frames else "frame count: ?")

    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "decoded.wav"
        dec = run(["-y", "-i", str(OUT), "-vn", "-ar", "48000", "-ac", "2", "-c:a", "pcm_s24le", str(wav)])
        if dec.returncode != 0:
            print(dec.stderr[-3000:])
            raise SystemExit("audio decode failed")
        x, _ = dsp.read_wav(str(wav))
        print(f"decoded audio: {x.shape[1]/48000:.2f}s  {dsp.integrated(x):.2f} LUFS  "
              f"{dsp.true_peak(x):.2f} dBTP")

    FRAMES.mkdir(parents=True, exist_ok=True)
    for stale in FRAMES.glob("*.jpg"):
        stale.unlink()
    for t in CHECK_TIMES + CUT_TIMES:
        target = FRAMES / f"t_{t:07.2f}.jpg"
        run(["-y", "-ss", f"{t:.3f}", "-i", str(OUT), "-frames:v", "1",
             "-q:v", "3", str(target)])

    info = {
        "duration": duration.split("Duration:")[-1].split(",")[0].strip(),
        "video": video_line,
        "audio": audio_line,
        "frames": frames[-1].strip() if frames else None,
        "lufs": round(float(dsp.integrated(x)), 2),
        "true_peak": round(float(dsp.true_peak(x)), 2),
        "size_mb": round(OUT.stat().st_size / 1e6, 1),
    }
    (ROOT / "render" / "final.json").write_text(json.dumps(info, indent=2), encoding="utf-8")
    print(f"wrote {OUT} ({info['size_mb']} MB), {len(CHECK_TIMES) + len(CUT_TIMES)} frames in {FRAMES}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
