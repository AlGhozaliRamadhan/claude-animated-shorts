# Aturan kerja: fifa-posisi-5min

Project ini punya aturan sendiri karena mediumnya video presentasi sekitar 7
menit yang dipecah tiga bagian, bukan short animasi 3D. Baca berurutan sebelum
menyentuh file apa pun.

## 0. Wajib dibaca dulu

1. `../../AGENTS.md` di root repo. Itu kebijakan induk: medium, gate preview,
   larangan em dash, larangan bilah warna vertikal, dan aturan render.
2. `../../engine/README.md` untuk perintah Remotion yang benar.
3. `../../LESSONS.md`, terutama bagian render dan cut.
4. `TYPOGRAPHY.md` di folder ini. Isinya hasil ekstraksi frame per frame dari
   video referensi dan angka yang sudah diukur. Jangan mengarang aturan type
   baru sebelum membaca ini.

Kalau salah satu belum dibaca, jangan ubah timeline, kamera, atau naskah.

## 1. Engine

- Video ini **Remotion**, bukan HTML timeline, bukan PPTX, bukan slide.
- Naskah final ada di `naskah.md`. Pembagian video: Video 1 scene 1-3,
  Video 2 scene 4-6, Video 3 scene 7-8. Jangan ubah pembagian ini tanpa
  memperbarui `naskah.md`, `PROJECT.md`, dan komposisi terkait.
- Komposisi: `engine/src/videos/fifa-posisi-5min/TypeTest.tsx`,
  id `FifaColdOpen`, 1920x1080, 30 fps, 540 frame untuk type test.
- Registry: `engine/video-registry.json` dan `engine/src/videos/registry.ts`.
  Kalau menambah komposisi, dua-duanya harus sinkron.
- Render hanya lewat wrapper dari root:
  `python scripts/render_remotion.py FifaColdOpen <out.mp4> --scale 1.0 --concurrency 1`
- Still untuk QA:
  `python scripts/render_remotion.py --still FifaColdOpen <out.png> --frame <n> --scale 0.5`
- Setelah mengubah TSX: `cd engine; npm run typecheck`.

## 2. Bentuk video, bukan deck

Ini bukan daftar saran. Kalau satu baris dilanggar, hasilnya bukan video.

- Setiap shot punya **gerakan utama**: kamera bergerak, type masuk, angka
  menghitung, garis menggambar, atau objek berpindah. Fade saja tidak sah.
- Kamera adalah satu dunia besar (`#world`) yang di-translate dan di-scale.
  Jangan membuat slide baru di tengah frame tanpa alasan cerita.
- Cut antar bab **hard cut**. Tidak ada crossfade antar shot.
- Tidak ada kartu, panel, border, shadow, atau badge. Pemisah memakai jarak,
  skala, dan bidang warna.
- Tidak ada label di pojok kiri atas atau kanan atas. Itu yang membuatnya
  terasa seperti PPTX.
- Tidak ada elemen yang menempel di pojok, tepi kiri, tepi kanan, atas, atau
  bawah frame. Tidak ada header berjalan, caption nama, atau kredit di tepi.
  Kredit foto masuk ke blok teks yang sama dengan nama pemain.
- Tidak ada nama pengisi suara, baik di layar maupun di VO. Handoff dikenali
  dari ganti suara dan cut, bukan dari label atau perkenalan.
- Tidak ada bilah warna vertikal di tepi elemen.
- Merah hanya untuk temuan yang salah. Tidak ada warna aksen: penekanan
  memakai nilai, bobot, dan blok terbalik (huruf kertas di atas bidang tinta),
  maksimal satu highlight per shot.
- Satu baris satu ide. Blok teks maksimal 68 persen lebar frame.
- Semua state deterministik dari `useCurrentFrame()`. Jangan pakai
  `Math.random()`, `Date.now()`, atau animasi CSS yang berjalan sendiri.
- Bahasa naskah Indonesia, tanpa em dash.

## 3. Gate sebelum menyatakan selesai

1. `npm run typecheck` lolos.
2. Still di frame pembuka, setiap perpindahan shot, dan frame terakhir.
   Untuk type test: 12, 60, 90, 104, 110, 128, 140, 190, 200, 214, 233,
   270, 286, 287, 300, 340, 378, 379, 420, 539.
   Untuk Video 1: 0, 179, 180, 1180, 1380, 1440, 1560, 1624, 1625, 1709,
   1710, 1920, 2700, 3420, 3810, 4900, 5579. Frame cut wajib punya isi, jangan kertas kosong.
3. Buka sendiri setiap PNG. Cek teks terpotong, elemen keluar frame, z-order,
   dan frame kosong. Laporkan path-nya, jangan menyuruh user mengecek.
4. Render MP4, lalu tonton hasilnya. Render yang lolos still belum tentu enak
   dilihat saat bergerak.
5. Update `PROJECT.md` bagian Status.

## 4. Media: foto, chart, footage

Video tidak boleh cuma teks. Setiap video minimal punya satu aset nyata yang
membawa informasi, bukan hiasan.

- Jangan pakai gambar generatif untuk Lamela, Sevilla, pertandingan, atau
  peristiwa nyata. Foto orang harus foto asli.
- Sumber yang boleh: Wikimedia Commons, press kit resmi klub, dokumentasi
  sendiri, screenshot notebook sendiri, atau stok dengan lisensi jelas.
- Jangan pakai preview Getty/Shutterstock, gambar berwatermark, repost
  Pinterest/Instagram, atau frame siaran tanpa izin.
- Setiap aset dicatat di `aset/sources.md`: file, subjek, URL, pembuat,
  lisensi, tanggal unduh, dan perubahan.
- Lisensi CC BY atau CC BY-SA wajib dikreditkan di layar atau kartu penutup.
  Kalau gambar di-crop atau di-duotone, tulis bahwa gambar diubah.
- Resolusi minimal 1280 px untuk full frame, 800 px untuk setengah frame.
  Jangan upscale lebih dari 1,5x.
- Foto tidak boleh menipu. Foto Lamela 2020 dipakai sebagai potret, bukan
  bukti ia masih di Sevilla saat data FIFA 23 diambil. Caption wajib
  memisahkan `FOTO 2020` dan `DATA FIFA 23`.
- Teks di atas foto wajib punya scrim. Jangan taruh type langsung di atas
  kostum, kerumunan, atau rumput.
- Footage hanya dari rekaman sendiri atau sumber berlisensi. Prioritas:
  screen recording notebook, dataset, dan chart. Bukan klip siaran.
- Satu aset satu tugas. Chart dipakai sebagai bukti, bukan wallpaper.
  Maksimal satu chart per scene, opacity 14 sampai 30 persen.

## 5. Jangan disentuh

- `projects/data-sains-review-5min/` adalah project final orang lain.
- `templates/Typography lyrics music video/` dan `reference-frames/` hanya
  bahan studi privat. Jangan upload, publikasikan, atau kirim ke layanan lain.
