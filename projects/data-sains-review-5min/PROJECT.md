# Video 5 Menit: Review Jurnal NVIDIA LSTM-GARCH

## Brief

Video presentasi 5 menit untuk tugas kelompok Pengantar Data Sains (0638), kelas 15.3B.01.
Topik: review artikel *Prediksi Harga Saham NVIDIA Menggunakan Model LSTM dan GARCH* (Syach, Baidawi, Sundari, 2026).
Format: rekaman layar + suara, naskah revisi 8 scene video essay motion graphics bergaya editorial minimalis.
Durasi: 5:00.

File sumber ada di:
`C:\Pribadi\ClassLead\matkul\0638-pengantar-data-sains\Project\`

## Deliverables

- [x] Naskah final video motion graphics (`naskah.md`): versi revisi 8 scene, durasi 5:00
- [x] Video preview Scene 1 & 2 (`video_scene1_2.mp4`): 1080p, durasi 0:48, audio VO + denting tuts piano
- [x] Desain editorial hitam-putih (gaya Swiss typography, arsitektural charcoal & warm paper). Kuningan hanya untuk highlight, merah bata khusus temuan.
- [x] Integrasi cue audio denting tuts piano akustik (*felt piano cues*) tersinkronisasi
- [x] Render video animasi sisa scene (Scene 3–8)
- [x] Mux audio + video utuh 5 menit (`render/final.mp4`)
- [ ] Pengumpulan video ke dosen

## Status
Terakhir diupdate: 2026-11-05

### Selesai

- Naskah final 8 scene di [`naskah.md`](naskah.md).
- Timeline aktif `aset/documentary_v3.html` (1920x1080, 8 scene + halaman peta 4 langkah, 5:00) selesai dibangun dengan `window.setTime(t)` deterministik.
- Revisi tampilan 2026-11-05: garis putih di atas pertanyaan Scene 2 dihapus; caption chart dipindah ke kiri agar tidak menabrak grafik; chart NVDA digambar ulang dengan sumbu tahun, gridline, reveal wipe, scan line, dan titik ujung; peta 4 langkah dipindah dari bawah Scene 2 menjadi halaman Scene 2B (0:38.8–0:45).
- Audio Scene 2B ditambah empat tick ringan selaras masuknya langkah 01–04.
- Perbaikan QA: path aset jurnal, warning bar Scene 1, teks pertanyaan Scene 2, badge identitas Scene 2, stamp Scene 6, dan sambungan diagram Scene 3.
- Palette baru: hitam dan bone/putih. Kuningan hanya untuk bar hybrid Scene 5 dan frasa penutup Scene 8. Merah bata hanya untuk temuan mustahil di Scene 1, 5, dan 6.
- De-boxing: kartu, panel, dan ringkasan diganti tipografi, jarak, dan satu bidang warna.
- Nomor scene di sudut kiri atas dan counter `0/6` di kanan atas dihapus.
- Separator dekoratif dihapus di seluruh scene: rule atas/bawah panel, rule kartu audit, rule stasiun Scene 4, rule nav Scene 2, rule badge, dan garis tabel Scene 6/7/8. Sisa garis hanya yang fungsional: sumbu chart, penghubung diagram, outline stamp, dan outline kotak demo.
- Daftar Scene 8 dirapatkan dengan padding, bukan garis baris.
- VO delapan scene selesai (`aset/vo/`, voice `id-ID-ArdiNeural`), total 274,84 detik, dengan manifest dan batas kalimat.
- Soundtrack 300 detik selesai (`render/audio/mix.wav`): VO + bed Scene 1/2 + pad/pulse sintetis + SFX, ducking musik 6,5 dB dan SFX 4,5 dB di bawah VO, master -16 LUFS.
- QA preview seluruh scene lolos: `brokenImages: []`, `consoleErrors: []`, `pageErrors: []`.
- Bug label Scene 5 diperbaiki: label hybrid tidak lagi tampil `0,00` sebelum bar mulai.
- Revisi keterbacaan 2026-11-05: Scene 3 dipecah menjadi dua halaman (X di 0:45–1:05, Y di 1:06–1:30) dengan page-turn horizontal; Scene 4 memakai rel lima stasiun, timeline 80/20 yang dimulai dari bar penuh `NVDA · RIWAYAT HARGA HARIAN`, dan odometer `72.051`; Scene 6 diperbesar (rumus 118 px, kotak galat dan persamaan lebih besar); Scene 7 memakai panel bukti horizontal dengan potongan halaman jurnal asli dan lingkaran merah pada tiap temuan.
- Crop bukti Scene 7 dibuat ulang dari `aset/paper_pages/` ke `aset/evidence/`: Tabel 4, split 80/20, kalimat signifikan, Tabel 2 GARCH, sitasi [10], dan DOI.
- SFX baru: page-turn Scene 3 (65,35 s dan 66,18 s) serta split timeline Scene 4 (100,42 s dan 102,95 s).
- Render penuh 9.000 frame selesai dan dimux dengan soundtrack revisi: `render/final.mp4`, 5:00.00, 1920x1080, 30 fps, H.264 `yuv420p(tv, bt709)`, AAC 320k 48 kHz stereo, 47,1 MB.
- Verifikasi akhir render revisi: -16,01 LUFS, true peak -2,10 dBTP; 20 frame kunci (termasuk semua batas cut, Scene 3 halaman 1, Scene 4 rel/timeline, Scene 6 demo, dan Scene 7 panel bukti) diperiksa. Tidak ada aset hilang atau teks bertabrakan.
- `render/finalize.py` sekarang membersihkan `render/final_frames/` sebelum mengekstrak frame, supaya tidak ada frame lama tertinggal.

### Sedang dikerjakan

- Tidak ada. Video siap dikumpulkan.

### Belum dimulai

- Pengumpulan ke dosen

## Catatan

**Angka kritis dari Tabel 4, tidak boleh salah:**

| Model | MAE | RMSE |
|---|---|---|
| Hybrid LSTM-GARCH | 1.72 | 2.26 |
| LSTM murni (pembanding) | 9.15 | 6.72 ← ini yang mustahil |

> Angka LSTM murni tidak valid: MAE > RMSE tidak mungkin secara matematis (RMSE selalu ≥ MAE karena pengkuadratan).

## Link File

- Video final 5 menit → [`render/final.mp4`](render/final.mp4)
- Video Preview Scene 1 & 2 → [`video_scene1_2.mp4`](video_scene1_2.mp4)
- Stills Preview → [`aset/video_stills/`](aset/video_stills/)
- Naskah final → [`naskah.md`](naskah.md)
- Slide asli PPTX → `C:\Pribadi\ClassLead\matkul\0638-pengantar-data-sains\Project\Presentasi_Review_Jurnal_15.3B.01_5menit.pptx`
