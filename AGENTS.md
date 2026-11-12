# AGENTS.md: Video Workspace

Baca ini dulu. Repo ini workspace produksi video, bukan aplikasi yang bisa di-`npm test`.

## 1. Peta repo

- `projects/[slug]/`: satu folder per video. Sumber kebenaran status ada di `PROJECT.md`.
- `engine/`: aplikasi Remotion yang benar-benar bisa dijalankan. Studio, typecheck, still, dan render ada di sini.
- `engine/src/videos/bridge/`: salinan kerja dari template, dipakai demo `BridgeShort`.
- `engine/src/videos/example-30s/`: contoh wrapper `Example30s` yang memotong `BridgeShort` lewat prop `frameMap`.
- `projects/example-30s/`: contoh output 30 detik, status ada di `PROJECT.md`.
- `templates/bridge/`: source starter animated short (referensi murni). Jangan edit saat mengerjakan project; edit salinannya di `engine/src/videos/<slug>/`.
- `templates/html/starter.html`: starter timeline HTML 12 detik, deterministik lewat `window.setTime(t)`.
- `templates/project/PROJECT.md`: template status project yang dipakai `scripts/new_project.py`.
- `templates/audio/`, `templates/scripts/`: audio dan helper render/QA untuk short.
- `references/`: bahan studi privat. Jangan upload, publikasi, atau kirim ke layanan lain.
- `scripts/doctor.py`: cek Node, npm, Python, Playwright, ffmpeg, dependencies, aset bridge, dan ruang temp.
- `scripts/new_project.py`: scaffold project `remotion`, `html`, atau `blank`.
- `scripts/preview_video.py`: harness screenshot untuk HTML timeline.
- `scripts/render_html.py`: render HTML timeline ke MP4 per frame.
- `scripts/render_remotion.py`: wrapper Remotion dengan temp di drive besar.
- `scripts/fetch_bridge_assets.py`: unduh props CC0 Kenney yang dipakai `world.ts`.
- `LESSONS.md`: catatan kegagalan nyata dan cara adaptasi. Baca sebelum mengubah render, cut, atau status project.
- `SKILL.md`: pipeline animated short (three.js + Remotion). Hanya untuk short; video presentasi HTML punya alur sendiri.

Root repo tidak punya `package.json`, test suite, lint, atau CI. `engine/package.json` hanya untuk app Remotion. Jangan mengarang perintah `npm test` / `npm run build` di root.

## 2. Mulai sesi

1. Kalau environment baru atau setelah pindah mesin, jalankan `python scripts/doctor.py`.
2. Baca `LESSONS.md`, terutama bagian render, cut, dan verifikasi.
3. Buka `projects/[slug]/PROJECT.md`.
4. Baca bagian **Status**. Lanjut dari item yang belum selesai, bukan dari nol.
5. Kalau `PROJECT.md` belum ada, buat dengan `scripts/new_project.py`, jangan salin manual.
6. Setelah sesi, update **Status**: tanggal, yang selesai, yang harus dilanjutkan.

Jangan tanya "mau mulai dari mana?" kalau `PROJECT.md` sudah menjawab. Untuk urusan engine, baca `engine/README.md`.

## 2b. Medium: video Remotion, bukan slide

- Setiap video baru dibuat sebagai komposisi Remotion di `engine/` atau timeline HTML deterministik untuk video presentasi. Bukan PPTX, bukan slideshow, bukan kumpulan gambar diam yang diberi fade.
- Jangan ambil jalan pintas "susun teks dan gambar, export jadi video". Itu menghasilkan deck yang bergerak, bukan video yang diedit.
- Kerjakan seperti edit video: riset ide dan referensi, tulis treatment dan shot list, tentukan gerak kamera/objek, cut, teks, dan audio, baru implementasi.
- Riset ide wajib sebelum video baru:
  1. Baca `references/STYLE_BIBLE.md` dan minimal dua report di `references/reports/`.
  2. Lihat minimal dua project atau komposisi yang sudah ada untuk memahami pola yang berhasil.
  3. Kalau masih kurang, cari referensi tambahan di web: struktur cerita, shot, transisi, tipografi, atau sound. Jangan upload atau kirim isi `references/` ke layanan lain.
  4. Tulis 3 sampai 5 arah treatment singkat, pilih satu dengan alasan, baru scaffold.
- Setiap scene minimal punya satu gerakan utama yang terlihat, bukan hanya fade. Lihat bagian 5.
- Kalau user minta cepat atau sederhana, tawarkan versi ringkas yang tetap diedit. Jangan turun ke slide deck tanpa izin dan jangan sembunyikan tradeoff.

## 3. Struktur project

```
projects/[slug]/
├── PROJECT.md
├── naskah.md
├── naskah-draft.md
├── aset/
└── render/
```

- Jangan taruh file di luar folder project.
- Jangan buat `naskah-v2.md`; update `naskah.md` langsung.
- File kerja boleh berantakan di `naskah-draft.md`, tapi `naskah.md` harus siap baca.

Mulai project baru dengan scaffold, bukan copy-paste manual:

```powershell
python scripts/new_project.py my-short --title "My Short" --kind remotion
python scripts/new_project.py campus-talk --title "Campus Talk" --kind html
python scripts/new_project.py notes --title "Notes" --kind blank
```

`remotion` menyalin `templates/bridge/` ke `engine/src/videos/<slug>/` dan mendaftarkan composition id. `html` menyalin `templates/html/starter.html` ke `projects/<slug>/aset/timeline.html`.

## 4. Gate sebelum render (wajib)

Jangan render/ekspor sebelum lolos semua langkah ini:

1. Jalankan preview di timestamp kunci (pembuka, setiap transisi, setiap beat, frame terakhir). Untuk HTML timeline:

   ```powershell
   python scripts/preview_video.py projects/<slug>/aset/<file>.html --times 0,4,8,13,16,20,24,30,34,40,46 --out projects/<slug>/aset/qa_preview
   ```

   Untuk komposisi Remotion, render still di frame yang mewakili setiap shot:

   ```powershell
   python scripts/render_remotion.py --still <CompositionId> projects/<slug>/render/qa/f060.png --frame 60 --scale 0.5
   ```

2. Buka sendiri PNG hasilnya. Cek:
   - gambar/aset hilang, broken image, atau area putih kosong;
   - teks, kartu, atau badge tumpang tindih atau terpotong;
   - elemen penting keluar safe area atau tertutup layer lain;
   - z-order salah (highlight di belakang teks, jurnal menutup teks putih);
   - frame blank/freeze dan transisi yang tidak masuk akal;
   - path aset relatif terhadap lokasi file HTML.
3. Untuk preview HTML, `report.json` wajib `brokenImages: []`, `consoleErrors: []`, `pageErrors: []`. Kalau tidak, perbaiki dulu.
4. Baru render video. Jangan suruh user yang mengecek; laporkan path screenshot dan hasil lolos/gagal.

Preview bukan real-time recording. `window.setTime(t)` harus menghasilkan frame deterministik.

## 5. Standar animasi

- Fade in/fade out saja tidak cukup. Setiap scene minimal punya satu gerakan objek:
  kertas masuk/miring/zoom, highlighter menyapu, stempel menghantam, garis grafik menggambar, angka menghitung, kartu/panah bergerak.
- Elemen masuk dengan gerak lalu settle. Opacity hanya pendukung, bukan animasi utama.
- Semua state timeline dari `window.setTime(t)`. Jangan pakai CSS `transition`, `Date.now()`, atau `Math.random()` untuk elemen yang dirender per frame; hasil preview dan render bisa beda.
- Satu beat = satu ide. Reaksi visual mendarat 0–3 frame sebelum kata yang relevan.

### Aturan visual yang tidak boleh dilanggar

- **Jangan pakai bilah warna vertikal di tepi kiri elemen.** `border-left` berwarna, pita merah di sisi kiri kartu, atau garis aksen kiri terlihat seperti template dan membuat layout miring. Pakai garis horizontal, underline, aksen di dalam elemen, atau stempel.
- **Foreground di atas background ramai wajib punya scrim.** Kalau teks, kartu, atau angka diletakkan di atas grafik, dokumen, tekstur, atau garis yang bergerak, pasang backdrop gelap/paper di belakangnya supaya background tidak menyerang foreground. Scrim ikut animasi muncul/hilang bersama elemennya, jangan muncul mendadak.
- **Periksa kontras dan z-order, bukan cuma posisi.** Teks tidak boleh menabrak elemen lain, dan tidak boleh ada garis/aset di belakang teks yang membuat huruf susah dibaca.
- **Setiap scene butuh gerakan utama yang terlihat.** Fade saja tidak pernah cukup; minimal satu objek bergerak, satu garis menggambar, satu angka menghitung, atau satu kamera bergerak per beat besar.
- **Merah hanya untuk satu hal: temuan yang mustahil/salah.** Jangan pakai merah untuk nomor bab, label, ikon, panah, bar chart, badge netral, atau aksen dekoratif. Kalau semua elemen merah, penonton berhenti melihat mana yang benar-benar penting. Palet kerja: hitam, bone/putih, dan kuningan (`--acc`) hanya untuk satu atau dua highlight. Jangan jadikan kuningan warna struktural untuk nomor, label, ikon, atau garis. Merah bata (`--alert`) khusus temuan.
- **Jangan pakai garis border berwarna.** Kalau garis benar-benar perlu, pakai hairline netral (`rgba(...,0.14)`), bukan merah atau aksen. Warna aksen hanya untuk teks/objek, bukan untuk garis tepi.
- **Minimalkan garis pemisah.** Jangan pasang rule atas/bawah tiap panel, kartu, baris daftar, atau footer. Pisahkan blok dengan jarak, hierarki tipografi, dan bidang warna. Garis hanya untuk hal fungsional: sumbu chart, penghubung diagram, outline stamp, atau batas objek yang memang kotak.
- **Jangan terlalu sering pakai box.** Hindari kartu berisi background + border + shadow untuk setiap blok. Susun dengan tipografi, jarak, hairline, dan satu bidang warna saja. Kotak hanya untuk benda yang memang kotak (dokumen, stempel, chip kecil), bukan untuk semua konten.

## 6. Video presentasi HTML: data-sains (selesai, jangan diubah)

- `projects/data-sains-review-5min/`: 1920x1080, 8 scene, durasi 5:00, naskah `naskah.md`. Status: final untuk project kampus.
- Deliverable final: `render/final.mp4` (5:00, 1920x1080, 30 fps). Jangan render ulang, jangan ubah timeline, aset, atau file final ini saat mengerjakan pekerjaan lain.
- Timeline aktif: `aset/documentary_v3.html`, API frame `window.setTime(detik)`. Ini hanya referensi alur HTML, bukan template kerja.
- Aset ada di `aset/paper_pages/`. Dari `aset/documentary_v3.html`, path yang benar `paper_pages/page_6.png`, bukan `../paper_pages/page_6.png`. Path salah membuat gambar blank.
- `editorial_*.html` dan `scene_player.html` adalah versi lama. Jangan campur ke timeline aktif.
- Catatan bug historis, disimpan sebagai referensi. Jangan ubah project ini tanpa izin:
  - `../paper_pages/...` → gambar jurnal tidak load;
  - warning bar menimpa lingkaran merah di Scene 1;
  - teks pertanyaan Scene 2 selebar layar sehingga menabrak jurnal putih di kiri;
  - badge identitas menimpa label `NVDA / NASDAQ` di kanan atas.
- Angka wajib: Hybrid MAE 1.72 / RMSE 2.26; LSTM murni MAE 9.15 / RMSE 6.72. MAE > RMSE di baseline adalah temuan review, bukan typo yang boleh dibetulkan.

## 6b. Contoh output 30 detik

- `projects/example-30s/`: trailer 30 detik dari `BridgeShort`, composition `Example30s` (900 frame, 30 fps, 1080x1920), tanpa audio.
- Source: `engine/src/videos/example-30s/Excerpt.tsx`. Dia memakai salinan bridge di folder yang sama (`./Bridge`) dan prop `frameMap`: frame cerita 987-1406, cut, frame cerita 1545-2024.
- Contoh ini referensi reuse, bukan project kerja. Jangan mengubah `BridgeShort` tanpa menjaga `frameMap` tetap kompatibel dan menyamakan `templates/bridge/`.
- Render ulang hanya kalau perlu:

  ```powershell
  python scripts/render_remotion.py Example30s projects/example-30s/render/final.mp4 --scale 1.0 --concurrency 1
  ```

- QA still ada di `projects/example-30s/render/qa/`. Cek minimal frame 30 (judul), 419/420 (cut), 885 (credit akhir), dan 899 (frame terakhir).

## 7. Konten: anti-slop

- Setiap kalimat bisa diucapkan dengan napas normal; ideal 12–20 kata.
- Satu paragraf satu ide. Transisi merangkum yang baru dan menghubungkan ke berikutnya.
- Jangan pakai template: "Selanjutnya kita akan...", "Seperti yang bisa kita lihat...", "Hal ini menunjukkan bahwa...".
- Kata kerja aktif. Angka harus punya sumber (Tabel X, Gambar Y, halaman Z); jangan bulatkan tanpa alasan.
- Jangan pakai em dash. Ganti dengan koma, titik, titik dua, atau tanda hubung biasa.
- Target kata: 5 menit = 750–810 kata; 10 menit = 1500–1650 kata. Hitung sebelum menyatakan selesai.

## 8. Format PROJECT.md

```markdown
# [Judul]

## Brief
[Satu paragraf: video apa, untuk apa, format, durasi, siapa penyampai]

## Deliverables
- [ ] ...

## Status
Terakhir diupdate: YYYY-MM-DD

### Selesai
- ...

### Sedang dikerjakan
- ...

### Belum dimulai
- ...

## Catatan
[Keputusan teknis, angka penting, hal lintas sesi]
```

## 9. Render / export

- `ffmpeg` tidak ada di PATH. Ambil path-nya:
  `python -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"`
- HTML timeline: preview dulu, lalu render per frame lewat Playwright, bukan screen recording real-time.

  ```powershell
  python scripts/render_html.py projects/<slug>/aset/timeline.html --out projects/<slug>/render/video.mp4
  ```

- Remotion: pakai wrapper dari root, jangan panggil `npx` langsung tanpa temp.

  ```powershell
  python scripts/render_remotion.py <CompositionId> projects/<slug>/render/final.mp4 --scale 1.3333
  ```

  Atau dari `engine/`: `npm run render -- <CompositionId> out/<name>.mp4 --scale 1.3333`.
- `scripts/render_remotion.py` memindahkan `TEMP`/`TMP` ke `D:\remotion-tmp` (atau `%REMOTION_TMP%`). Jangan render Remotion dengan temp di `C:` yang sempit.
- Simpan hasil akhir di `projects/<slug>/render/`. Jangan menaruh output render di root repo.
- `engine/README.md` memuat versi package yang di-pin dan troubleshooting canvas blank.

## 10. Sebelum menyatakan selesai

- [ ] screenshot QA bersih, tanpa aset hilang / overlap
- [ ] `npm run typecheck` lolos kalau menyentuh `engine/`
- [ ] `python scripts/doctor.py` tanpa failure kalau mengubah setup
- [ ] naskah dihitung kata
- [ ] `PROJECT.md` **Status** sudah diupdate
- [ ] tidak ada file versi duplikat
- [ ] `Example30s` masih bisa dirender kalau `BridgeShort` berubah (cek frame 30, 419, 420, 885)
- [ ] `projects/data-sains-review-5min/` tidak berubah
