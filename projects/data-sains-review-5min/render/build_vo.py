#!/usr/bin/env python3
"""Generate and fit the eight Indonesian VO scenes with edge-tts.

Each scene gets its own rate so the spoken audio ends before the next cut.
Outputs 48 kHz mono WAVs plus sentence-boundary JSON for sync checks.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import subprocess
import wave
from pathlib import Path

import edge_tts
import imageio_ffmpeg
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
VO_DIR = ROOT / "aset" / "vo"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
VOICE = "id-ID-ArdiNeural"

SCENES = [
    {
        "id": 1,
        "start": 0.0,
        "end": 19.0,
        "rate": -3,
        "text": (
            "Sebuah artikel ilmiah mengklaim modelnya memprediksi saham NVIDIA lima kali lebih akurat. "
            "Angkanya tampak meyakinkan. Tapi salah satu angka di tabel hasilnya mustahil secara matematika. "
            "Dan kalau satu angka itu salah, seberapa jauh kita bisa memercayai kesimpulannya?"
        ),
    },
    {
        "id": 2,
        "start": 19.0,
        "end": 45.0,
        "rate": 4,
        "text": (
            "Artikel itu adalah Prediksi Harga Saham NVIDIA Menggunakan Model LSTM dan GARCH, karya Syach, "
            "Baidawi, dan Sundari, terbit 2026. Kelompok 15.3B.01 menelaahnya dengan satu pertanyaan: apakah "
            "menambahkan volatilitas GARCH benar-benar membuat LSTM lebih akurat, dan apakah buktinya bisa "
            "dipercaya? Kami periksa dalam empat langkah: konsep, metode, hasil, lalu evaluasi."
        ),
    },
    {
        "id": 3,
        "start": 45.0,
        "end": 90.0,
        "rate": -4,
        "text": (
            "Idenya begini. Harga penutupan harian NVIDIA diubah menjadi log return, yaitu persentase perubahan "
            "harian, supaya rata-ratanya lebih stabil. Tapi tingkat gejolaknya tetap naik-turun: ada masa tenang, "
            "lalu mendadak badai. Pola inilah yang disebut volatility clustering, dan model GARCH(1,1) khusus "
            "menghitungnya, satu angka gejolak untuk setiap hari. Angka itu lalu digabung dengan deret harga 60 "
            "hari terakhir sebagai masukan LSTM, jaringan saraf yang mengenali pola urutan waktu, untuk menebak "
            "harga esok hari. Singkatnya: GARCH membaca seberapa kencang badainya, LSTM membaca ke mana arah anginnya."
        ),
    },
    {
        "id": 4,
        "start": 90.0,
        "end": 130.0,
        "rate": -6,
        "text": (
            "Alurnya lima tahap, dari pengumpulan data sampai evaluasi galat. Datanya riwayat harian NVIDIA dari "
            "Yahoo Finance, 2015 sampai awal 2024, dipecah menurut urutan waktu tanpa diacak: 80 persen awal untuk "
            "melatih, 20 persen akhir untuk menguji. Modelnya dua lapis LSTM, 100 lalu 50 unit, dilengkapi Batch "
            "Normalization dan Dropout agar tidak terlalu hafal data latih. Kami hitung ulang, dan total 72.051 "
            "parameter yang dilaporkan memang cocok. Bagian ini terbuka dan bisa diperiksa."
        ),
    },
    {
        "id": 5,
        "start": 130.0,
        "end": 160.0,
        "rate": 0,
        "text": (
            "Sekarang hasilnya, Tabel 4. Hybrid LSTM-GARCH mencatat MAE 1,72 dan RMSE 2,26. LSTM murni mencatat "
            "MAE 9,15 dan RMSE 6,72. Pada harga saham sekitar 60 dolar, galat hybrid hanya sekitar tiga persen. "
            "Sekilas, kemenangannya telak: MAE turun lebih dari lima kali lipat. Tapi lihat lagi baris LSTM murni."
        ),
    },
    {
        "id": 6,
        "start": 160.0,
        "end": 215.0,
        "rate": 1,
        "text": (
            "MAE adalah rata-rata selisih mutlak. RMSE mengkuadratkan selisih itu sebelum dirata-ratakan dan "
            "diakar, sehingga galat besar dihukum lebih berat. Contohnya tiga galat: satu, satu, dan sepuluh. "
            "MAE-nya empat, RMSE-nya hampir enam. Karena itu RMSE selalu lebih besar atau sama dengan MAE, dan "
            "baru sama kalau semua galat sama besar. Hodson menegaskan hal ini pada 2022. Tapi LSTM murni "
            "dilaporkan punya MAE 9,15 di atas RMSE 6,72. Itu mustahil. Kemungkinan paling wajar: angka MAE dan "
            "RMSE tertukar tempat. Kalau begitu pun, perbaikannya sekitar empat kali lipat, bukan lima. Angka "
            "hybrid sendiri konsisten. Yang goyah adalah pembandingnya, dan tanpa pembanding yang sahih, klaim "
            "lima kali lipat kehilangan pijakan."
        ),
    },
    {
        "id": 7,
        "start": 215.0,
        "end": 260.0,
        "rate": 0,
        "text": (
            "Itu bukan satu-satunya masalah. Kami menemukan enam celah, dari yang paling berat. Pertama, "
            "konfigurasi LSTM pembanding tidak dirinci, jadi perbandingan tak bisa diulang. Kedua, data hanya "
            "dipecah sekali, tanpa validasi silang runtun waktu. Ketiga, tidak ada uji signifikansi seperti "
            "Diebold-Mariano, uji standar untuk menentukan apakah selisih akurasi dua model benar-benar nyata "
            "atau hanya kebetulan. Keempat, GARCH dipasang tanpa uji stasioneritas dan uji efek ARCH. Dua "
            "lainnya soal ketelitian ilmiah: sitasi yang melenceng, seperti definisi machine learning yang "
            "dikutip dari buku etika robotika, dan penamaan DOI yang tidak konsisten dengan volume jurnal."
        ),
    },
    {
        "id": 8,
        "start": 260.0,
        "end": 300.0,
        "rate": -6,
        "text": (
            "Meski begitu, artikel ini punya nilai: alurnya runtut, arsitekturnya dilaporkan terbuka, dan "
            "kerangkanya layak diuji di Bursa Efek Indonesia, atau dibandingkan dengan ARIMA-GARCH dan ditambah "
            "sentimen berita. Jadi, apakah GARCH benar-benar membuat LSTM lebih akurat? Gagasannya masuk akal, "
            "tetapi artikel ini belum membuktikannya. Pelajaran untuk kita: sebelum bertanya seberapa kecil "
            "galatnya, tanya dulu apakah angkanya masuk akal. Saya mewakili kelompok 15.3B.01. Terima kasih "
            "sudah menyimak."
        ),
    },
]

# How much clean space to leave before the next cut.
TAILS = {1: 1.2, 2: 1.0, 3: 1.0, 4: 1.0, 5: 1.5, 6: 1.5, 7: 1.5, 8: 2.0}
LEAD = 0.30


def run_ffmpeg(args: list[str]) -> None:
    subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", *args], check=True)


def speech_bounds(wav_path: Path) -> tuple[float, float, float]:
    with wave.open(str(wav_path), "rb") as handle:
        sample_rate = handle.getframerate()
        channels = handle.getnchannels()
        frames = handle.getnframes()
        raw = handle.readframes(frames)
    samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    if channels == 2:
        samples = samples.reshape(-1, 2).mean(axis=1)
    window = max(1, int(0.02 * sample_rate))
    rms = np.array(
        [float(np.sqrt(np.mean(samples[i : i + window] ** 2))) for i in range(0, len(samples) - window, window)]
    )
    threshold = max(0.008, float(rms.max()) * 0.03)
    active = np.where(rms > threshold)[0]
    if len(active) == 0:
        return 0.0, frames / sample_rate, frames / sample_rate
    first = active[0] * 0.02
    last = active[-1] * 0.02 + 0.02
    return first, last, frames / sample_rate


async def synth(text: str, rate: int, mp3_path: Path, wav_path: Path) -> list[dict]:
    communicate = edge_tts.Communicate(text, VOICE, rate=f"{rate:+d}%")
    boundaries: list[dict] = []
    with mp3_path.open("wb") as handle:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                handle.write(chunk["data"])
            elif chunk["type"] in ("SentenceBoundary", "WordBoundary"):
                boundaries.append(
                    {
                        "type": chunk["type"],
                        "start": chunk["offset"] / 1e7,
                        "duration": chunk["duration"] / 1e7,
                        "text": chunk["text"],
                    }
                )
    run_ffmpeg(["-y", "-i", str(mp3_path), "-ar", "48000", "-ac", "1", "-sample_fmt", "s16", str(wav_path)])
    return boundaries


def trim_wav(src: Path, dst: Path, first: float, last: float) -> None:
    start = max(0.0, first - 0.05)
    end = last + 0.12
    run_ffmpeg(
        [
            "-y",
            "-i",
            str(src),
            "-af",
            f"atrim=start={start:.4f}:end={end:.4f},asetpts=PTS-STARTPTS",
            "-ar",
            "48000",
            "-ac",
            "1",
            "-sample_fmt",
            "s16",
            str(dst),
        ]
    )


async def fit_scene(scene: dict) -> dict:
    scene_id = scene["id"]
    target = scene["end"] - TAILS[scene_id] - (scene["start"] + LEAD)
    mp3_path = VO_DIR / f"vo_scene{scene_id}_raw.mp3"
    raw_wav = VO_DIR / f"vo_scene{scene_id}_raw.wav"
    final_wav = VO_DIR / f"vo_scene{scene_id}.wav"
    bounds_path = VO_DIR / f"vo_scene{scene_id}_sentences.json"

    rate = scene.get("rate", 0)
    best = None
    if "rate" in scene:
        boundaries = await synth(scene["text"], rate, mp3_path, raw_wav)
        first, last, total = speech_bounds(raw_wav)
        print(
            f"scene {scene_id}: rate {rate:+d}%  speech {last - first:5.2f}s  "
            f"target {target:5.2f}s  file {total:5.2f}s",
            flush=True,
        )
        best = {
            "rate": rate,
            "first": first,
            "last": last,
            "speech": last - first,
            "total": total,
            "boundaries": boundaries,
        }
        trim_wav(raw_wav, final_wav, best["first"], best["last"])
        shift = max(0.0, best["first"] - 0.05)
        for boundary in best["boundaries"]:
            boundary["start"] -= shift
        bounds_path.write_text(json.dumps(best, indent=2), encoding="utf-8")
        with wave.open(str(final_wav), "rb") as handle:
            fitted = handle.getnframes() / handle.getframerate()
        print(f"scene {scene_id}: final {fitted:5.2f}s at {scene['start'] + LEAD:.2f}s", flush=True)
        best["fitted"] = fitted
        best["placement"] = scene["start"] + LEAD
        return best

    for attempt in range(4):
        boundaries = await synth(scene["text"], rate, mp3_path, raw_wav)
        first, last, total = speech_bounds(raw_wav)
        speech = last - first
        print(
            f"scene {scene_id}: rate {rate:+d}%  speech {speech:5.2f}s  "
            f"target {target:5.2f}s  file {total:5.2f}s",
            flush=True,
        )
        best = {
            "rate": rate,
            "first": first,
            "last": last,
            "speech": speech,
            "total": total,
            "boundaries": boundaries,
        }
        if abs(speech - target) <= 0.45 or speech <= target < speech + 1.0:
            break
        suggested = rate + int(round((speech / target - 1.0) * 100))
        suggested = max(-12, min(12, suggested))
        if suggested == rate:
            break
        rate = suggested

    trim_wav(raw_wav, final_wav, best["first"], best["last"])
    shift = max(0.0, best["first"] - 0.05)
    for boundary in best["boundaries"]:
        boundary["start"] -= shift
    bounds_path.write_text(json.dumps(best, indent=2), encoding="utf-8")

    with wave.open(str(final_wav), "rb") as handle:
        fitted = handle.getnframes() / handle.getframerate()
    print(f"scene {scene_id}: final {fitted:5.2f}s at {scene['start'] + LEAD:.2f}s", flush=True)
    best["fitted"] = fitted
    best["placement"] = scene["start"] + LEAD
    return best


async def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--only", type=int, nargs="*", default=None, help="scene ids to regenerate")
    args = parser.parse_args()

    VO_DIR.mkdir(parents=True, exist_ok=True)
    manifest_path = VO_DIR / "manifest.json"
    previous: dict[int, dict] = {}
    if manifest_path.exists():
        previous = {item["scene"]: item for item in json.loads(manifest_path.read_text(encoding="utf-8"))}

    selected = [s for s in SCENES if args.only is None or s["id"] in args.only]
    results: dict[int, dict] = {}
    for scene in selected:
        results[scene["id"]] = await fit_scene(scene)

    manifest = []
    for scene in SCENES:
        if scene["id"] in results:
            result = results[scene["id"]]
            manifest.append(
                {
                    "scene": scene["id"],
                    "start": scene["start"],
                    "end": scene["end"],
                    "placement": result["placement"],
                    "duration": result["fitted"],
                    "file": f"vo_scene{scene['id']}.wav",
                    "rate": result["rate"],
                    "sentences": result["boundaries"],
                }
            )
        elif scene["id"] in previous:
            manifest.append(previous[scene["id"]])
        else:
            raise SystemExit(f"scene {scene['id']} missing from manifest; run without --only")
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    total = sum(item["duration"] for item in manifest)
    print(f"\nTotal spoken audio: {total:.1f}s across {len(manifest)} scenes", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
