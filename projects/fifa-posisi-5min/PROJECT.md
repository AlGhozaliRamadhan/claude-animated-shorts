# Klasifikasi Posisi Pemain FIFA 23

## Brief

Video presentasi sekitar 7 menit untuk projek UAS Pengantar Data Sains (0638), kelas 15.3B.01, kelompok 5 orang. Topik: klasifikasi posisi pemain sepak bola dari 29 atribut kemampuan memakai Decision Tree, K-Nearest Neighbor, dan Random Forest. Format: motion graphics tipografi 1920x1080, 30 fps, bahasa Indonesia, VO lima pengisi suara. Video dipecah menjadi tiga bagian: scene 1-3, scene 4-6, dan scene 7-8. Deadline pengumpulan video: pertemuan 12, estimasi 11 Desember 2026.

Sumber artikel: `C:\Pribadi\ClassLead\matkul\0638-pengantar-data-sains\Project\proyek-jurnal-fifa\artikel\Artikel-15.3B.01-KlasifikasiPosisi.docx`

## Deliverables

- [x] Type test 18 detik di Remotion: tanda tanya dari 82 baris data, ledger Lamela, verdict GELANDANG 0,855, kartu nama, tesis
- [x] Naskah final (`naskah.md` v4) dan lima file naskah individu (`01-al-ghozali.md` s.d. `05-rafa.md`), lima pembicara sekuensial tanpa repetisi
- [x] Aset nyata: foto Lamela (CC BY-SA 4.0) dan lima chart notebook, dicatat di `aset/sources.md`
- [x] Komposisi Remotion Video 1 (scene 1-3)
- [x] Komposisi Video 2 (scene 4-6) sebagai komposisi terpisah `FifaVideo2`, belum disambung ke Video 1
- [x] Komposisi Video 3 (scene 7-8) sebagai komposisi terpisah `FifaVideo3`, belum disambung ke Video 1 atau Video 2
- [x] Penyambungan tiga video menjadi satu file (`render/final.mp4`, 7:37) dengan sound design
- [x] VO lima suara, disintesis edge-tts dan diletakkan per paragraf mengikuti cue visual, sudah masuk `render/final.mp4`
- [x] Sound design sintetis satu jalur untuk seluruh film (`render/audio/soundbed.wav`)
- [x] QA still per shot, tanpa aset hilang atau teks bertabrakan (Video 1, 2, 3 lolos)
- [x] Render final Video 1 (`render/video-1.mp4`, 3:06, 1920x1080, 30 fps)
- [x] Render final Video 2 dan Video 3 (`render/video-2.mp4` 3:05, `render/video-3.mp4` 1:26)
- [ ] Verifikasi angka terhadap Tabel 1 sampai 4

## Status

Terakhir diupdate: 2026-11-10

### Selesai

- Versi Sound Effects Only (10 November 2026): render master `render/final.mp4` (7:37, 13.710 frame, 1920x1080 30 fps, H.264 + AAC 48 kHz 192 kb/s stereo, 57,2 MB) dirakit ulang hanya dengan trek efek suara sintetis (`soundbed.wav`: tick data, dent angka, thud cut, sapuan kertas, stamp temuan, akor penutup, dan room tone) tanpa trek narasi/VO. Versi lengkap dengan narasi 5 pembicara tetap disimpan di `render/final-with-vo.mp4`.
- Master v5 (10 November 2026): kalibrasi tempo suara dan eliminasi jeda hening janggal (*awkward silence*). Kecepatan pembacaan TTS diturunkan dari +18% ke kecepatan normal manusiawi (+0%) agar artikulasi setiap pembicara terdengar santai, tenang, dan tidak terburu-buru. Jangkar waktu (`ANCHORS`) diatur ulang secara presisi dengan jeda napas merata (0,8 s.d. 1,5 detik) sehingga tidak ada hening kosong berkepanjangan (jeda hening kosong 15 detik di Scene 4 berhasil dipangkas total). Seluruh 8 scene tetap mencapai tempo tepat 1,00x tanpa overflow (+0,0s). Hasil dimux via `mix_vo.py --duck 0.70` ke `render/final.mp4` (7:37, 13.710 frame, 1920x1080 30 fps, H.264 + AAC 48 kHz 191 kb/s stereo, 57,2 MB).
- Master v4 (10 November 2026): render master diperbarui dengan audio VO v4 hasil humanisasi (5 pembicara berurutan tanpa repetisi). Disintesis menggunakan edge-tts dengan penempatan presisi di tiap cue visual (`ANCHORS`). Semua 8 scene mencapai tempo tepat 1,00x tanpa overflow/lebih waktu (+0,0s di seluruh scene). Hasil dimux via `mix_vo.py --duck 0.70` ke `render/final.mp4` (7:37, 13.710 frame, 1920x1080 30 fps, H.264 + AAC 48 kHz 191 kb/s stereo, 57,2 MB). Terverifikasi via `check_audio.py`: peak mix 0,725, 0 sampel clip, voice > bed +19,6 dB sebelum duck.
- Revisi naskah v4 & pemisahan 5 pembicara sekuensial (10 November 2026):
  - Seluruh naskah narasi (`naskah.md`) dibersihkan dari gaya klise AI perbandingan negatif ("bukan X, tapi Y" / "it wasn't X, it was Y"). Kalimat diubah menjadi pernyataan lugas, percaya diri, berbasis fakta data, dan mudah diucapkan dengan napas normal.
  - Pembagian suara dirombak menjadi lima pembicara tetap yang berbicara berurutan satu per satu tanpa repetisi/pemanggilan ulang:
    1. Al Ghozali Ramadhan (15250708) — Pembicara 1: Cold Open, rumusan masalah, studi kasus Lamela (Video 1, Scene 1)
    2. Khalisya Ramadhani Putri Witama (15250823) — Pembicara 2: Eksplorasi fitur, eliminasi kolom bocor, pembersihan data & split (Video 1, Scene 2 & 3)
    3. Fadly Salim (15250559) — Pembicara 3: Metodologi Decision Tree, KNN, Random Forest (Video 2, Scene 4)
    4. Selena Mireil Sachiko Balqis (15250717) — Pembicara 4: Skor evaluasi & analisis matriks konfusi (Video 2, Scene 5 & 6)
    5. Rafa Nursakha Putra Azka (15250792) — Pembicara 5: Feature importance, keterbatasan, penutup (Video 3, Scene 7 & 8)
  - Dibuatkan 5 file naskah mandiri siap rekam untuk tiap anggota: `01-al-ghozali.md`, `02-khalisya.md`, `03-fadly.md`, `04-selena.md`, dan `05-rafa.md`, lengkap dengan panduan cue visual per detik, teks ucapan, dan tips pelafalan istilah teknis.
  - Konfigurasi suara sintetis di `tools/build_vo.py` disesuaikan dengan gender dan karakter masing-masing anggota (ArdiNeural untuk pria, GadisNeural untuk wanita, dengan variasi pitch dan rate).
- Master, 10 November: tiga render disambung dengan `tools/assemble.py` menjadi `render/final.mp4`, 7:37 (13.710 frame), 1920x1080, 30 fps, H.264 + AAC 48 kHz stereo 192 kb/s, 57,2 MB. Sambungan memakai stream copy, bukan render ulang, jadi tidak ada generasi kedua. Frame per frame sudah dicek: frame master 5580 identik dengan `video-2.mp4` frame 0, frame master 11130 identik dengan `video-3.mp4` frame 0, dan frame 11128-11129 masih milik Video 2. Tidak ada frame dobel atau hilang di dua sambungan.
- Sound design dibuat `tools/build_sound.py`, hasilnya `render/audio/soundbed.wav` (457,00 detik, stereo 48 kHz 16-bit). Semua suara disintesis dengan numpy, tidak ada sampel atau audio berlisensi, jadi tidak ada yang perlu dikreditkan dan hasilnya deterministik.
- Isi sound bed: tick untuk data yang muncul, dent untuk angka yang berhenti, thud rendah di bawah tiap cut, sapuan kertas di cut, stamp hanya untuk temuan (101 Forward, 119 duplikat), satu akor hangat di kalimat penutup, plus drone A rendah 55/55,18/82,41/110/220 Hz dan room tone yang menyapu seluruh durasi supaya jeda tidak mati.
- Level terukur: mean -34,1 dB, max -3,0 dB, median per 5 detik -35,8 dB, terendah -40,3 dB. Normalisasi akhir ke 0,88 lalu tanh, jadi tidak ada clip.
- Sinkronisasi dicek, bukan diasumsikan: audio hasil mux sama panjangnya dengan wav (457,000 detik) dan korelasi amplop tertinggi di lag 0. Onset cue diukur ulang dari `final.mp4`: cut 180 dan 1180, sambungan 5580, cut 9330, stamp 9900, masuk Video 3 11130, akor 13380 semuanya meleset 0 sampai 2 frame.
- Decode penuh `final.mp4` menghasilkan tepat 13.710 frame tanpa error, dan frame terakhir (13.709) hitam sesuai potong ke hitam Video 3.
- QA frame master di `render/qa-master-exact/`: 0, 3000, 5578, 5579, 5580, 7000, 8500, 10000, 11128, 11129, 11130, 12000, 13000, 13680, 13709. Ekstraksi memakai filter `select` per nomor frame, bukan `-ss`, karena `-ss` pada file hasil concat meleset sampai satu detik.
- Cara mengulang: `python projects/fifa-posisi-5min/tools/build_sound.py` lalu `python projects/fifa-posisi-5min/tools/assemble.py --sound`. `assemble.py` juga menulis `render/master-silent.mp4` sebagai bahan sebelum mux.
- VO, 10 November: tidak ada rekaman anggota, jadi narasi disintesis dengan edge-tts (dua suara Indonesia yang tersedia, `id-ID-ArdiNeural` dan `id-ID-GadisNeural`). Lima suara naskah dipetakan dari dua suara itu lewat pitch dan rate, supaya pergantian pembicara terdengar tanpa label di layar. VO ini sintetis dan sebaiknya diganti rekaman anggota kalau nanti ada.
- VO v3, 10 November, setelah catatan bahwa v2 terlalu cepat dan tidak cocok dengan gambar. Naskah ditulis ulang: 720 kata (Video 1 269, Video 2 290, Video 3 161), turun dari 1.076 kata. Pemotongan jatuh di kalimat yang tidak menjelaskan penelitian, lalu diganti isi artikel yang sebelumnya tidak ada: celah penelitian, profil atribut, F1 per kelas.
- Pace diubah, bukan cuma dipelankan. Rate dasar sekarang +18 persen (suara 3 dan 5 +20 persen), `MAX_TEMPO` 1,08, dan jumlah kata maksimum per scene dijaga supaya `atempo` nyaris tidak dipakai. Scene 6 satu-satunya yang terpaksa 1,07. Terukur: 441 detik suara di 457 detik gambar, sekitar 1,63 kata per detik, dibanding 2,26 sampai 2,60 pada v2.
- Penempatan sekarang per paragraf, bukan per scene. `ANCHORS` di `tools/build_vo.py` menaruh tiap paragraf di detik lokal tempat cue visualnya muncul; paragraf tidak boleh mulai sebelum paragraf sebelumnya selesai, jadi daftar cue yang padat menggeser, bukan menumpuk. Kalau scene tetap kepanjangan, jeda antar paragraf dipadatkan lebih dulu; `atempo` baru dipakai kalau kata-katanya sendiri tidak muat.
- Cache audio sekarang memakai hash teks + voice + rate + pitch, jadi mengubah satu kalimat tidak mungkin memakai ulang audio lama yang sudah tidak cocok.
- Angka yang dibacakan penuh memakan waktu jauh lebih besar daripada jumlah katanya (satu paragraf 10 kata bisa 11 detik). Karena itu nilai importance dan F1 per kelas dibiarkan dibawa layar, tidak dieja satu per satu di VO.
- Hasil per scene (slot, baca, tempo, akhir): S1 63,9 / 63,1 / 1,00 / 63,1; S2 62,9 / 59,4 / 1,00 / 59,4; S3 58,9 / 55,5 / 1,00 / 55,5; S4 69,9 / 66,5 / 1,00 / 66,5; S5 54,9 / 55,6 / 1,01 / 54,8; S6 59,9 / 64,1 / 1,07 / 59,8; S7 44,9 / 43,9 / 1,00 / 43,9; S8 39,9 / 38,4 / 1,00 / 38,4. Tidak ada scene yang meluber ke cut berikutnya.
- Angka yang dibetulkan dari v2: precision Forward 0,9145 adalah tertinggi kedua setelah Defender 0,9365, bukan yang tertinggi; probabilitas Lamela disebut 0,855 sesuai layar, bukan "85 persen" yang dibulatkan; angka 18.420 yang tampil di layar sekarang disebut sebagai hasil setelah duplikat dihapus.
- `tools/mix_vo.py` mencampur VO di atas `soundbed.wav` dengan ducking dari amplop suara (attack 25 ms, release 320 ms, `--duck 0.70`, lantai -10,5 dB), bukan potongan volume statis. Hasilnya `render/audio/mix.wav`, lalu di-mux ke `render/final.mp4` dengan video stream copy. Mux lewat nama `final.tmp.mp4` karena ffmpeg menolak menulis ke file input yang sama.
- `tools/check_audio.py` memverifikasi hasil: voice median -19,5 dB, bed -39,0 dB saat bicara dan -38,5 dB di jeda, voice di atas bed +19,4 dB sebelum duck, peak mix 0,725 dengan 0 sampel clip, jeda terpanjang tanpa suara 5,0 detik. Audio di `final.mp4`: AAC 48 kHz stereo 192 kb/s dalam durasi 7:37.
- Cara mengulang seluruh jalur audio: `build_sound.py`, `assemble.py --sound`, `parse_vo.py`, `build_vo.py`, lalu `mix_vo.py --duck 0.70`. `build_vo.py --force` menyintesis ulang semua paragraf, bukan memakai cache.
- Fase 3, 10 November: Video 3 (scene 7-8) dibangun sebagai komposisi terpisah `FifaVideo3` di `engine/src/videos/fifa-posisi-5min/Video3.tsx`, 2.580 frame (1:26), 1920x1080, 30 fps. Belum disambung ke Video 1 atau Video 2, tanpa VO.
- Scene 7 (0:00-0:45): lima atribut ditumpuk kiri dengan ukuran menurun 150 sampai 82 px, nilai importance masuk di kolom kanan pada 0:10, `VISION` dibalik jadi blok tinta pada 0:20, lalu cut ke kalimat `Bukan dua kutub. Ada peran penghubung.` dengan `penghubung` dibalik. Chart `notebook-05-importance.png` muncul 22 persen di kanan bawah pada beat kedua.
- Scene 8 (0:45-1:26): kalimat penutup empat baris 124 px dengan `bertanya` di serif miring, tiga baris batasan masuk pada 0:55, lalu shot Lamela dengan `RAPOR: PENYERANG` dan `MODEL: GELANDANG` pada 1:05, baris `Mungkin keduanya benar.` pada 1:15, potong ke hitam di 1:25, dan hitam satu detik.
- Durasi 1:26, bukan 1:35. Naskah menaruh potong ke hitam di 1:25 dengan sisa hitam 0,5 detik, jadi sisa 10 detik hanya akan jadi frame kosong. Angka 1:35 adalah target nominal, bukan durasi konten.
- Tiga sapuan lembaran di cut 840, 1350, dan 1950 (masing-masing 20 frame, frame cut satu bidang tinta utuh). Potong ke hitam di 1:25 sengaja hard cut tanpa sapuan, sesuai naskah.
- Aset nyata di Video 3: foto Lamela dan `notebook-05-importance.png` (22 persen). Keduanya sudah tercatat di `aset/sources.md`.
- QA still Video 3 di `render/qa-v3-1/` dan `render/qa-v3-2/`, frame MP4 final di `render/qa-v3-final/`: frame 0, 120, 340, 650, 830, 880, 1060, 1340, 1420, 1700, 1900, 1990, 2120, 2300, 2540, 2579.
- Revisi dari QA: frame 0 sempat kosong dan sudah diisi tiga kata yang sedang masuk, blok tinta `penghubung` diperlebar ke bawah supaya ekor `p` dan `g` tidak terpotong, jarak titik setelah `penghubung` dirapatkan, chart dinaikkan dan diperbesar, `RAPOR` dan foto Lamela masuk lebih awal supaya frame setelah cut tidak tipis.
- `npm run typecheck` lolos, `npm run compositions` menampilkan `FifaVideo3` 30 fps 1920x1080 2580 frame.
- Fase 2, 10 November: Video 2 (scene 4-6) dibangun sebagai komposisi terpisah `FifaVideo2` di `engine/src/videos/fifa-posisi-5min/Video2.tsx`, 5.550 frame (3:05), 1920x1080, 30 fps. Belum disambung ke Video 1, tanpa VO, sesuai permintaan.
- Scene 4 (0:00-1:10): pita 29 angka sebagai jangkar di bagian atas, kalimat `29 angka yang sama / tiga cara membaca`, tiga nama model berganti di tempat, pohon keputusan yang menggambar cabang lalu satu jalur, scatter KNN dengan satu titik putih dan lima tetangga, 200 garis tally Random Forest yang mengelompok ke tiga kelas, blok `STRating` sampai `GKRating` ditutup garis merah bata sebagai kunci jawaban, lalu split 80:20 `13.093 latih / 3.274 uji`.
- Scene 5 (1:10-2:05): tiga baris skor tanpa kartu, akurasi menghitung ke 85,43 / 89,03 / 90,53, F1 macro dan waktu latih masuk sebagai kolom, lalu cut ke `90,53` sebagai watermark 12 persen dengan kalimat `Rata-rata menyembunyikan satu kelas.`
- Scene 6 (2:05-3:05): confusion matrix 3x3 dengan hairline, sel 101 `FORWARD dikira MIDFIELDER` dibesarkan dan diberi warna temuan, precision 91,45 dan recall 83,71 berhadapan dengan blok terbalik pada recall, lalu foto Lamela dengan lima dari 29 atribut dan dua kata `PENYERANG` dan `GELANDANG`.
- Sembilan sapuan lembaran grafit di cut 360, 900, 1380, 1680, 2100, 3060, 3750, 4620, 4920. Frame cut tetap satu bidang tinta utuh, sama seperti Video 1.
- Aset nyata di Video 2: foto Lamela, `notebook-03-sebaran-atribut.png` (30 persen, sekitar 1,5 detik di scene 4), `notebook-04-confusion.png` (14 persen di scene 6). Semua sudah tercatat di `aset/sources.md`.
- QA still Video 2 di `render/qa-v2-1/`, `render/qa-v2-2/`, `render/qa-v2-3/`, `render/qa-v2-4/`: pembuka, pita, roll nama, pohon, KNN, Random Forest, blok kunci jawaban, split, tiga baris skor, watermark, confusion matrix, sel 101, precision/recall, foto Lamela, frame terakhir.
- Preview bergerak 0,5 skala: `render/qa-v2-motion/preview05.mp4` (3:05, 960x540, 30 fps). 26 frame diekstrak dari MP4 hasil encode ke `render/qa-v2-motion/frames/` untuk cek cut dan isi frame.
- `npm run typecheck` lolos, `npm run compositions` menampilkan `FifaVideo2` 30 fps 1920x1080 5550 frame.
- Revisi 9 November, catatan klien atas Video 1:
  - Palet diganti total ke monokrom grafit dan kertas. Kuningan dihapus dari semua frame; aksen sekarang nilai, bobot, dan blok terbalik. Merah oksida hanya untuk temuan (119 duplikat dan label kunci jawaban).
  - Cold open baru: 8 frame pertama gelap tanpa teks, lalu tanda tanya raksasa sekitar 1.000 px terbentuk dari 84 baris data (garis luar menggambar, baris mengalir dari atas ke bawah). Teks dua tugas baru masuk setelah tanda tanya terbaca.
  - Tanda tanya Scene 1 diperbesar, diposisikan ulang, dan memakai komponen yang sama dengan cold open supaya sapuan kertas di frame 180 terasa seperti objek yang sama berganti kertas.
  - Sapuan lembaran 20 frame di enam perpindahan: 180 (kertas), 1180, 1380, 1710, 1920, 3810 (grafit). Tidak ada cut telanjang yang tersisa.
  - Kamera papan bukti sekarang satu gerakan: tahan di potret, tarik keluar ke papan penuh, lalu dolly masuk ke kartu rapor. Boolean `insert` yang membuat lompatan di local 245 dihapus.
  - Kalimat tesis tidak lagi mengecil dan turun. Kalimat bertahan dengan dorongan kamera pelan, lalu dibawa sapuan lembaran.
- QA still dan segmen gerak ada di `render/qa-anim2/`: `f0000` (gelap), `f0090` (tanda tanya + teks), `f0179/f0180/f0188` (sapuan kertas), `board/` (11 frame kamera), `f1700/f1740/f1900` (kartu rapor dan tesis), `f2400/f2650/f3420` (Scene 2), `f4900/f5100/f5579` (Scene 3).
- Render final Video 1 selesai: `render/video-1.mp4`, 3:06 (5.580 frame), 1920x1080, 30 fps, 32,4 MB. Metadata dicek dengan ffmpeg.
- QA frame dari file MP4 final ada di `render/qa-final/` (23 frame: 0, 90, 179, 180, 188, 1180, 1380, 1440, 1560, 1624, 1625, 1700, 1709, 1710, 1740, 1900, 1920, 1940, 2700, 3420, 3810, 4900, 5579). Semua frame cut punya isi, tidak ada aset hilang, dan tidak ada teks yang bertabrakan.
- `FifaColdOpen` (type test 18 detik) ikut diubah ke palet monokrom yang sama, lalu dirender ulang ke `render/type-test-remotion.mp4` (18,0 detik, 1920x1080, 30 fps). QA still di `render/qa-cold/` (12, 90, 128, 190, 233, 287, 340, 420, 539).
- `npm run typecheck` lolos setelah semua perubahan.

### Selesai sebelumnya

- Analisis frame by frame video referensi `templates/Typography lyrics music video/good typography.mp4` (960x720, 20 fps, 18,84 detik): beat, palet, ukuran type, dan tata bahasa gerak. Hasil ukur ada di `TYPOGRAPHY.md`.
- Brainstorm arah treatment dan sistem tipografi (`brainstorm.md`).
- Draf naskah v0 delapan scene (`naskah-draft.md`), 762 kata VO.
- Verifikasi ulang notebook dengan `random_state=42`: 101 Forward ditebak Midfielder, termasuk É. Lamela (RW, Sevilla) dengan probabilitas Midfielder 0,855.
- Font lokal terpasang di `engine/public/fifa/fonts/`: Inter Tight 400/600/800, Instrument Serif italic, IBM Plex Mono 400/500/600, Archivo Black.
- Aturan kerja project ditulis di `AGENTS.md`: medium Remotion, larangan bentuk deck, gate QA.
- Type test 18 detik sebagai komposisi Remotion `FifaColdOpen` (`engine/src/videos/fifa-posisi-5min/TypeTest.tsx`), 540 frame. Lolos `npm run typecheck`, QA still, dan render MP4.
- Perbaikan dari QA bergerak: akhiran aksen É tidak lagi terpotong, kolom label dan angka ledger dirapatkan, angka nol tidak lagi menumpuk di atas tanda tanya, roll kata dipendekkan ke 4 frame, tesis masuk dengan cut ke gerak.
- Naskah final v2 (`naskah.md`) dengan VO lima suara, 1.098 kata, durasi target 7:00-7:45. Satu suara memandu, empat suara menjelaskan bagian masing-masing, tanpa nama di layar.
- Pembagian video dikunci: Video 1 scene 1-3, Video 2 scene 4-6, Video 3 scene 7-8.
- `count_vo.py` sekarang membaca `naskah.md` dan menerima path opsional.
- Aset nyata masuk: foto Lamela 2020 dari Wikimedia Commons (Steffen Prößdorf, CC BY-SA 4.0) di `aset/lamela/`, serta lima chart dan satu CSV dari notebook di `aset/notebook/`. Sumber dan lisensi dicatat di `aset/sources.md`.
- Aturan media ditulis di `AGENTS.md` dan `naskah.md`: foto asli, bukan gambar generatif; chart sebagai bukti; kredit lisensi di layar; footage prioritas rekaman notebook sendiri.
- Video 1 (`engine/src/videos/fifa-posisi-5min/Video1.tsx`, id `FifaVideo1`, 5.580 frame, 3:06) dengan scene 1-3 lengkap.
- Revisi 8 November: intro 6 detik menyebut dua tugas (menebak posisi asli atau menilai kecocokan menurut rapor) dan menyatakan yang diuji adalah yang pertama.
- Scene foto Lamela diganti papan bukti: potret 1:1 berpin dengan nama di bawahnya, dua foto Stadion Ramón Sánchez-Pizjuán, kartu rapor `PENYERANG`, label `29 ATRIBUT`, dan tali yang menghubungkan pin. Kamera menahan di potret, menarik keluar ke seluruh papan, lalu cut ke kartu rapor.
- Dua aset baru diunduh dari Wikimedia Commons dan dicatat di `aset/sources.md`: foto stadion 2022 (Niels98, CC BY-SA 4.0) dan fasad Sevilla FC 2024 (CarlosVdeHabsburgo, CC BY-SA 4.0).
- Nama pengisi suara dihapus dari layar dan dari VO. Handoff memakai ganti suara, bukan caption atau nama.
- Semua elemen yang menempel di pojok, tepi kiri/kanan, atas, atau bawah dihapus: caption nama, kredit foto di tepi, catatan di dasar frame, dan header berjalan.
- QA still Video 1: `render/qa-v2c/f0000.png` (intro), `render/qa-v3/` (frame cut 180, 1180, 1710, 1920, 3810, 5579), `render/qa-v7/` (scene 2: 2650, 2700, 3100, 3420), `render/qa-v8/` (pass penuh 0, 90, 179, 180, 1180, 1380, 1440, 1705, 1710, 1920, 3420, 3809, 3810, 4900, 5579), dan `render/qa-board-final/` (papan bukti: 1380, 1440, 1500, 1560, 1600, 1624, 1625, 1709). Semua frame cut punya isi, tidak ada kertas kosong, tidak ada teks terpotong di tepi.

### Sedang dikerjakan

- (kosong)

### Belum dimulai

- QA tonton penuh 7:37 oleh orang, bukan hanya still dan pengukuran.
- Ganti VO sintetis dengan rekaman lima anggota kalau kelompok mau suara asli. Jalurnya sudah siap: rekam per paragraf, taruh di `render/audio/vo/` dengan nama file yang sama, lalu jalankan `mix_vo.py`.

## Catatan

**Framing yang dikunci:** video menguji apakah 29 atribut bisa menebak label `BestPosition` yang sudah tercatat di dataset. Video tidak menjawab "di mana pemain seharusnya bermain". Dua tugas itu disebut sebagai pilihan di 6 detik pertama, lalu video menyatakan yang diuji adalah yang pertama. Jangan menunda pemisahan ini ke tengah video.

**Aturan layar:** tidak ada nama pengisi suara, tidak ada caption pembicara, dan tidak ada elemen yang menempel di pojok atau tepi frame. Kredit foto masuk ke blok teks yang sama dengan nama pemain.

**Angka yang tidak boleh salah:**

| Klaim | Nilai | Sumber |
|---|---|---|
| Baris awal | 18.539 pemain, 90 kolom | Tabel 1 |
| Duplikat | 119 dihapus | Tabel 1 |
| Kiper | 2.053 dikeluarkan | Tabel 1 |
| Data analisis | 16.367 | Tabel 1 |
| Defender | 6.230, 38,06% | Tabel 2 |
| Midfielder | 7.007, 42,81% | Tabel 2 |
| Forward | 3.130, 19,12% | Tabel 2 |
| Split | 13.093 latih, 3.274 uji | Bagian 2.5 |
| Decision Tree | akurasi 0,8543, F1 macro 0,8498, 0,27 s | Tabel 3 |
| K-Nearest Neighbor | akurasi 0,8903, F1 macro 0,8855, 0,05 s | Tabel 3 |
| Random Forest | akurasi 0,9053, F1 macro 0,9006, 1,92 s | Tabel 3 |
| Forward precision | 0,9145 (tertinggi kedua setelah Defender) | Bagian 3.3 |
| Defender precision | 0,9365 (tertinggi) | Bagian 3.3 |
| Forward recall | 0,8371 | Bagian 3.3 |
| F1 per kelas | Defender 0,9357; Midfielder 0,8919; Forward 0,8741 | Bagian 3.3 |
| Profil atribut | StandingTackle bek 65,8 vs penyerang 28,2; Finishing penyerang 66,9 vs bek 36,3 | Bagian 3.1 |
| Confusion Forward | 524 benar, 101 Midfielder, 1 Defender | Gambar 4 |
| Atribut teratas | SlidingTackle 0,0918; Finishing 0,0840; HeadingAccuracy 0,0725; StandingTackle 0,0716; Vision 0,0710 | Tabel 4 |
| Seed | `random_state=42` | Bagian 2.5 |

**Contoh per pemain:** É. Lamela, RW Sevilla, diprediksi Midfielder dengan probabilitas 0,855. Ini bukan angka di artikel, tetapi hasil hitung ulang notebook dengan seed yang sama. Di video harus disebut sebagai "contoh dari data uji", bukan temuan baru.

**Palet:** ink `#17181A`, deep `#1B1C1E`, bone `#E7E7E4`, paper `#F6F6F3`, muted `#6F7073`, accent grafit `#3A3B3E`, alert `#8C3B31`, hairline `rgba(23,24,26,0.16)`. Kuningan dihapus: seluruh frame monokrom grayscale, dan merah oksida hanya untuk temuan (garis duplikat 119 dan label kunci jawaban). `TypeTest.tsx` memakai konstanta warna yang sama.

**Transisi:** enam perpindahan memakai satu lembar penuh setinggi frame (180, 1180, 1380, 1710, 1920, 3810), 20 frame, easing kubik. Lembar menutup frame tepat di frame cut, jadi still di frame cut memang satu bidang warna utuh, bukan frame kosong. Saat diputar, lembar bergerak sekitar 240 px per frame di titik tercepat, sehingga tidak terbaca sebagai kedipan.

**Tipografi:** Inter Tight (display), Instrument Serif Italic (suara manusia), IBM Plex Mono (data). Font disimpan lokal di `engine/public/fifa/fonts/` supaya render tidak bergantung jaringan.

**Media:** foto Lamela dari Wikimedia Commons (Steffen Prößdorf, CC BY-SA 4.0), chart dari notebook kelompok. Detail dan kredit di `aset/sources.md`. Jangan pakai gambar generatif untuk orang, klub, atau pertandingan nyata.

**Sound:** satu jalur sintetis untuk seluruh film dari `tools/build_sound.py`, tanpa sampel. Cue ditulis dalam nomor frame absolut master, jadi kalau durasi salah satu video berubah, konstanta `V2`/`V3` dan daftar `CUTS` di skrip itu harus diperbarui. Jangan menambahkan musik jadi atau stok audio: palette-nya sengaja kering supaya VO tetap duduk di atasnya.

**VO:** disintesis edge-tts, bukan rekaman anggota. Dua suara dasar (`id-ID-ArdiNeural`, `id-ID-GadisNeural`) dibentuk jadi lima karakter lewat pitch dan rate; pemetaannya ada di `VOICES` pada `tools/build_vo.py`. Rate dasar +18 sampai +20 persen dan `atempo` dibatasi 1,08, jadi tidak ada lagi tumpukan percepatan seperti v2. Penempatan per paragraf memakai `ANCHORS` (detik lokal per scene, diambil dari bagian Visual `naskah.md`); kalau cue visual berubah, angka di situ yang harus diperbarui, bukan naskahnya. Konsekuensi yang tersisa: scene 6 masih dipadatkan 1,07, dan beberapa nilai chart (importance, F1 per kelas selain Forward) sengaja hanya dibawa layar karena mengejanya memakan 10 detik lebih per paragraf. Kalau ada rekaman asli, pakai rekaman itu; jalur sintetis ini hanya supaya video tidak diam.

**Pembagian suara dan video:**

| Video | Scene | Durasi target | Suara |
|---|---|---|---|
| Video 1 | 1-3 | 3:06 | Suara 1, 2, 3 |
| Video 2 | 4-6 | 3:05 | Suara 4, 5, 2 |
| Video 3 | 7-8 | 1:26 | Suara 3, 1 |
| Master | 1-8 | 7:37 | — |

Video 3 dipangkas dari target 1:35 ke 1:26 karena naskah memotong ke hitam di 1:25. Master adalah ketiga render disambung apa adanya, jadi durasinya jumlah ketiganya, bukan target 7:45.

Etiket suara dibuat tanpa nama: satu pemandu dan empat suara bagian. Nama pengisi suara tidak pernah muncul di layar atau di VO, jadi pemetaan suara ke anggota cukup disimpan di luar repo ini.

## Link File

- Brainstorm dan analisis referensi → [`brainstorm.md`](brainstorm.md)
- Aturan tipografi hasil ekstraksi referensi → [`TYPOGRAPHY.md`](TYPOGRAPHY.md)
- Aturan kerja project → [`AGENTS.md`](AGENTS.md)
- Draf naskah → [`naskah-draft.md`](naskah-draft.md)
- Naskah final → [`naskah.md`](naskah.md)
- Sumber aset foto dan chart → [`aset/sources.md`](aset/sources.md)
- Komposisi type test → `engine/src/videos/fifa-posisi-5min/TypeTest.tsx`
- Render type test → [`render/type-test-remotion.mp4`](render/type-test-remotion.mp4)
- Komposisi Video 1, 2, 3 → `engine/src/videos/fifa-posisi-5min/Video1.tsx`, `Video2.tsx`, `Video3.tsx`
- Render per bagian → [`render/video-1.mp4`](render/video-1.mp4), [`render/video-2.mp4`](render/video-2.mp4), [`render/video-3.mp4`](render/video-3.mp4)
- **Deliverable: master 7:37** → [`render/final.mp4`](render/final.mp4)
- Sound design → [`render/audio/soundbed.wav`](render/audio/soundbed.wav), skrip `tools/build_sound.py`
- VO → `render/audio/vo-master.wav`, `render/audio/vo_plan.json`, skrip `tools/parse_vo.py`, `tools/build_vo.py`
- Mix akhir → `render/audio/mix.wav`, skrip `tools/mix_vo.py`, verifikasi `tools/check_audio.py`
- Penyambung dan mux → `tools/assemble.py`
- Artikel sumber → `C:\Pribadi\ClassLead\matkul\0638-pengantar-data-sains\Project\proyek-jurnal-fifa\artikel\Artikel-15.3B.01-KlasifikasiPosisi.docx`
- Notebook sumber → `C:\Pribadi\ClassLead\matkul\0638-pengantar-data-sains\Project\proyek-jurnal-fifa\notebook\klasifikasi_posisi.ipynb`
