# Example 30s

## Brief

Video contoh 30 detik untuk workspace ini: potongan trailer dari short
"The Bridge That Fell for a Song" (67 detik, composition `BridgeShort`).
Tujuannya menunjukkan alur Remotion dari scaffold sampai render tanpa
menyentuh project data-sains. Format vertikal 1080x1920, 30 fps, 900 frame.
Tanpa audio karena stem voice tidak disertakan di repo; fokus contoh ini adalah
pipeline visual dan dokumentasinya.

## Deliverables

- [x] Composition `Example30s` di `engine/src/videos/example-30s/Excerpt.tsx`
- [x] Potongan cerita: frame cerita 987-1406, cut, 1545-2024
- [x] Kartu judul dan credit akhir deterministik
- [x] Still QA di `render/qa/`
- [x] Render final `render/final.mp4`
- [x] Verifikasi final: 30 detik, 1080x1920, 30 fps
- [x] `PROJECT.md` dan `naskah.md` diperbarui

## Status

Terakhir diupdate: 2026-11-06

### Selesai

- Scaffold `projects/example-30s/` dan salinan bridge di
  `engine/src/videos/example-30s/`.
- Composition `Example30s` terdaftar lewat `engine/video-registry.json` dan
  `engine/src/videos/registry.ts`. Durasi 900 frame, 30 fps, 1080x1920.
- `BridgeShort` sekarang menerima prop `frameMap`, jadi satu canvas bisa
  memotong timeline cerita tanpa memuat world dua kali. Salinan engine dan
  template tetap identik.
- Edit 30 detik: segmen A frame cerita 987-1406, hard cut, segmen B frame cerita
  1545-2024. Cut jatuh satu frame sebelum crossfade shot 11 ke shot 12 supaya
  tidak ada double exposure.
- Kartu judul 0-2 detik dan credit akhir 27,1-30 detik, semua keadaan dihitung
  dari frame.
- QA still diperiksa: `f000`, `f030`, `f070`, `f100`, `f200`, `f419`, `f420`,
  `f600`, `f780`, `f850`, `f885`, `f899`. Tidak ada frame kosong, teks
  terpotong, atau aset hilang.
- Render final selesai: `render/final.mp4`, 900 frame, durasi 30.00 detik,
  1080x1920, 30 fps, H.264 High, 69.7 MB, tanpa audio.
- Verifikasi frame hasil encode: `encoded_f000`, `encoded_f030`, `encoded_f419`,
  `encoded_f420`, `encoded_f850`, `encoded_f885`, `encoded_f899`. Visual sama
  dengan still, cut bersih, credit terbaca, fade akhir bekerja.
- Render berhasil dengan `--concurrency 1`. Percobaan pertama di concurrency 4
  berhenti di frame 145 karena browser WebGL kehabisan waktu.
- `npm run typecheck` lolos. `npm run compositions` menampilkan `Example30s`
  30.00 detik.
- Dokumentasi `README.md`, `engine/README.md`, `AGENTS.md`, dan `SKILL.md`
  diperbarui.
- `python scripts/doctor.py` lolos tanpa failure atau warning.
- `projects/data-sains-review-5min/render/final.mp4` tidak berubah:
  47.051.596 byte, mtime 5 November 2026 12:35:33.

### Sedang dikerjakan

- Tidak ada.

### Belum dimulai

- Tidak ada.

## Catatan

**Peta frame:**

| Composition | Story frame | Isi |
|---|---|---|
| 0-419 | 987-1406 | bolt, snap, fall, river sitters, golden sway |
| 420-899 | 1545-2024 | park swing, golden march, officer, rebuilt bridge, crane out |

- 30 detik x 30 fps = 900 frame.
- Segmen B mulai di 1545, satu frame sebelum camera key 12b di 1546, supaya
  push-in park tetap terlihat.
- Contoh ini memakai salinan bridge di folder yang sama: `Excerpt.tsx` mengimpor
  `BridgeShort` dari `./Bridge`. Project lain juga memakai salinan sendiri di
  `engine/src/videos/<slug>/`; jangan edit `templates/bridge/` untuk pekerjaan
  project.
- Render ulang:

  ```powershell
  python scripts/render_remotion.py Example30s projects/example-30s/render/final.mp4 --scale 1.0 --concurrency 1
  ```

- Pakai `--concurrency 1` untuk komposisi three.js ini. Concurrency 4 pernah
  membuat browser crash di frame 145 dengan error timeout 33000ms.
- `--scale 1.3333` menghasilkan 1440x2560 kalau perlu versi 2K.
- Tanpa audio. Kalau nanti perlu, mux music stem setelah video, jangan render
  ulang seluruh 900 frame hanya untuk audio.

## Link File

- Source composition -> [`Excerpt.tsx`](../../engine/src/videos/example-30s/Excerpt.tsx)
- World dan komponen bridge -> [`Bridge.tsx`](../../engine/src/videos/example-30s/Bridge.tsx)
- Naskah dan edit list -> [`naskah.md`](naskah.md)
- QA still -> [`render/qa/`](render/qa/)
- Video final -> [`render/final.mp4`](render/final.mp4)
