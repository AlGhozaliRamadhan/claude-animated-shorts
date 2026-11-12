# Brainstorm: Video Presentasi Klasifikasi Posisi Pemain FIFA 23

Status: v0 untuk diskusi. Sudah digantikan oleh `naskah.md`.
Target awal: 5:00, 1920x1080, 30 fps, bahasa Indonesia.
Target final: sekitar 7:30, dipecah tiga video (scene 1-3, 4-6, 7-8).
Sumber utama: `Artikel-15.3B.01-KlasifikasiPosisi.docx` dan notebook `klasifikasi_posisi.ipynb`.

---

## 1. Rekomendasi singkat

Jangan buka dengan "penelitian ini menggunakan Decision Tree, KNN, dan Random Forest". Buka dengan satu pemain yang tidak punya wajah, tidak punya nama, dan hanya punya 29 angka. Penonton diminta menebak posisinya. Setelah tebakan mereka terbentuk, baru identitasnya dibuka: Érik Lamela, sayap kanan Sevilla. Di rapor data ia tercatat sebagai penyerang, tetapi model membacanya sebagai gelandang dengan keyakinan 85 persen.

Dari situ pertanyaan video menjadi jelas dan jujur:

> Bisakah 29 angka membaca posisi yang sudah tercatat di rapor data, tanpa pernah menonton pertandingan?

Bukan "di mana pemain ini seharusnya bermain". Itu pertanyaan yang berbeda, dan artikel ini tidak menjawabnya. Pemisahan ini harus muncul di 30 detik pertama, karena penonton akan langsung menguji klaim kita dengan pertanyaan itu.

Arah visual yang saya rekomendasikan: **rapor scouting yang hidup**. Kertas bone, type besar, data mono, satu aksen kuningan, dan merah hanya untuk temuan. Naskahnya bergerak seperti pemeriksaan rapor: satu kalimat bertahan, satu kata diganti, angka muncul di tempat yang sama. Ini alat paling kuat dari video referensi.

---

## 2. Yang saya pelajari dari `good typography.mp4`

Video referensi: 960x720, 20 fps, 18,84 detik. Bukan tutorial tipografi, tetapi iklan Apple yang memakai type sebagai objek utama. Saya ekstrak 2 frame per detik, lalu 20 frame per detik pada tiga bagian penting.

### 2.1 Peta beat

| Waktu | Yang terjadi | Yang bisa dipakai |
|---|---|---|
| 0,00 | Kertas kosong | Mulai dari ketiadaan, bukan dari judul |
| 0,05 sampai 0,25 | Sebuah titik, lalu goresan, lalu huruf "i" serif miring | Bentuk muncul sebelum artinya jelas. Rasa penasaran dibuat dalam 0,3 detik |
| 0,45 | Dua bulatan emas dan dua garis vertikal membentuk AirTag | Huruf berubah menjadi benda. Type adalah gambar |
| 0,50 sampai 1,05 | "just wanna be" diketik kata per kata, blok krem menyala di belakang "just", deretan titik merah di bawah kata yang belum selesai | Mengetik bukan hiasan, tetapi cara mengatur tempo |
| 1,15 | Hard cut ke hitam, teks putih | Tidak ada fade. Perubahan dunia harus terasa seperti potongan |
| 1,50 | Hard cut ke footage produk | Type dan gambar hidup bergantian, bukan bercampur |
| 10,50 sampai 12,50 | Kata "never" raksasa, miring 18 derajat, meluncur diagonal melintasi frame selama 1,3 detik lalu keluar dari tepi | Satu kata bisa menjadi seluruh gambar |
| 11,00 sampai 13,00 | Satu kalimat bertahan, satu token diganti tiap 0,5 detik: `never(×)leavn` lalu `never(🏃)leave ←` lalu `we(🏃)leave ←` lalu `we(🤝)both ↗` | **Alat paling berharga.** Mata tidak perlu mencari layout baru, hanya melihat satu perubahan |
| 13,00 sampai 16,00 | Kalimat yang sama menjadi bubble chat, lalu desktop, lalu kartu file | Type bisa menjadi antarmuka, bukan hanya tulisan di atas gambar |

### 2.2 Angka yang saya ukur

- Palet: kertas `#ECECE7`, tinta `#0C0C0C`, putih `#F1F1F1`, emas `#A0700E`, merah `#B32223`, biru pesan `#0070D8`.
- Blok teks pembuka memakai 68 persen lebar frame. Tidak pernah penuh.
- Tinggi ascender ke descender 299 px dari 720 px, sekitar 41 persen tinggi frame. Tinggi huruf kecil sekitar 162 px, atau 22,5 persen tinggi frame.
- Caption kecil di bawah berada di y 655 dari 720, sekitar 91 persen tinggi frame, ukurannya sekitar 10 px.
- Satu baris, satu ide. Tidak ada paragraf di layar.
- Gerak utama: mengetik, menggeser, mengganti token. Opacity hanya pendukung.
- Tidak ada kartu, tidak ada border, tidak ada bayangan. Pemisahan dibuat oleh ruang dan skala.

### 2.3 Yang saya ambil, dan yang tidak

Diambil:

1. Frame pertama adalah objek, bukan title card.
2. Satu kalimat per beat, maksimal 68 persen lebar.
3. Kalimat bertahan, satu token berubah. Ini akan dipakai untuk label versus prediksi.
4. Hard cut antara kertas dan hitam. Tidak ada crossfade antar bab.
5. Satu aksen emas untuk kata yang sedang berubah. Merah hanya untuk temuan.
6. Kontras skala ekstrem: kata 300 px berdampingan dengan metadata 15 px.
7. Garis bawah tipis di bawah token yang berubah, bukan kotak dan bukan border.

Tidak diambil:

1. Footage produk dan musik iklan.
2. Emoji sebagai pengganti kata. Terlalu manis untuk argumen data.
3. Glitch di akhir. Kita butuh penutup yang tenang, bukan efek.
4. Caption lagu. Kita tidak memakai subtitle, hanya catatan data kecil sebagai tekstur.

---

## 3. Diagnosis artikel

### 3.1 Kekuatan

- Pertanyaannya bisa dijelaskan tanpa rumus: 29 angka, tiga posisi, tiga model.
- Ada tokoh alami: pemain yang sulit diklasifikasikan.
- Ada twist yang jujur: akurasi tertinggi bukan berarti modelnya selesai. Forward tetap paling sering salah.
- Ada temuan yang bisa dibahas: Vision masuk lima atribut teratas, padahal ia bukan atribut bertahan atau menyerang.

### 3.2 Angka yang harus dijaga

| Hal | Nilai |
|---|---|
| Baris awal | 18.539 pemain, 90 kolom |
| Duplikat | 119 dihapus |
| Kiper | 2.053 dikeluarkan |
| Data analisis | 16.367 |
| Defender | 6.230, 38,06 persen |
| Midfielder | 7.007, 42,81 persen |
| Forward | 3.130, 19,12 persen |
| Split | 13.093 latih, 3.274 uji |
| Decision Tree | akurasi 0,8543, F1 macro 0,8498, latih 0,27 s |
| K-Nearest Neighbor | akurasi 0,8903, F1 macro 0,8855, latih 0,05 s |
| Random Forest | akurasi 0,9053, F1 macro 0,9006, latih 1,92 s |
| Forward precision | 0,9145 |
| Forward recall | 0,8371 |
| Forward F1 | 0,8741 |
| Confusion Forward | 524 benar, 101 ditebak Midfielder, 1 ditebak Defender |
| Atribut teratas | SlidingTackle 0,0918; Finishing 0,0840; HeadingAccuracy 0,0725; StandingTackle 0,0716; Vision 0,0710 |

### 3.3 Ketegangan yang belum dipakai artikel

Artikel menulis bahwa Forward paling sulit dikenali. Tetapi ia tidak menunjukkan siapa yang salah. Padahal ada 101 penyerang yang ditebak gelandang. Itu bukan cacat kecil, itu jendela ke seluruh masalah: label posisi membagi pemain ke tiga kotak, sementara atribut pemain sayap dan gelandang serang memang tumpang tindih.

Contoh nyata dari data uji, dihitung ulang dengan `random_state=42`:

| Item | Nilai |
|---|---|
| Nama | É. Lamela |
| Klub | Sevilla FC |
| Posisi di dataset | RW, dipetakan ke Forward |
| Prediksi Random Forest | Midfielder |
| Probabilitas | Defender 0,020; Midfielder 0,855; Forward 0,125 |
| Finishing | 74 |
| Dribbling | 85 |
| ShortPassing | 80 |
| Vision | 78 |
| StandingTackle | 50 |
| SlidingTackle | 54 |

Ini bukan angka di Tabel 3. Ini contoh per pemain yang dihitung ulang dari notebook dan seed yang sama. Kalau dipakai di video, sebut sebagai "contoh dari data uji", bukan sebagai temuan baru artikel.

---

## 4. Framing yang harus muncul di awal

Pengguna memberi catatan yang sangat penting: video harus jelas sejak awal apakah tugasnya

1. menyuruh komputer menebak **posisi asli** pemain, atau
2. memeriksa **kecocokan pemain menurut rapor** yang sudah ada.

Artikel memilih nomor 2. Label yang dipakai adalah `BestPosition`, yaitu penilaian penyusun dataset. Model tidak menonton pertandingan, tidak menghitung menit bermain, dan tidak tahu taktik klub. Model hanya mereproduksi label yang sudah ada dari 29 atribut.

Rumusan yang saya usulkan, muncul di sekitar 0:35:

> Kita tidak sedang mencari posisi terbaik untuk Lamela. Kita sedang menguji apakah 29 angka bisa menebak posisi yang sudah ditulis di rapor datanya.

Kalimat ini harus tinggal di layar sebagai catatan kecil saat dataset diperkenalkan. Tanpa itu, penonton berhak bertanya "kok komputer berani bilang Lamela gelandang?" dan seluruh video kehilangan kredibilitas.

Konsekuensi lain: kesalahan model tidak otomatis berarti model bodoh. Bisa jadi labelnya yang kabur, atau pemainnya memang bermain di dua peran. Ini justru tesis yang lebih matang.

---

## 5. Lima arah treatment

### A. Rapor yang hidup (rekomendasi)

Seluruh video dirancang seperti rapor scouting. Kertas bone, nama atribut mono, verdict besar, dan satu pemain sebagai benang merah. Type masuk seperti sedang diisi, bukan seperti slide yang muncul.

Hook: "Bagaimana cara mesin tahu posisi pemain tanpa pernah menonton pertandingan?"

Kekuatan: jujur terhadap sifat data, visualnya tenang dan mahal, cocok dengan referensi tipografi.
Risiko: kalau tidak ada gerak, rapor bisa terasa statis. Solusinya, setiap beat punya satu gerakan utama.

### B. Tiga pembaca

Tiga model diperkenalkan sebagai tiga cara membaca 29 angka yang sama: pohon yang bertanya, lima tetangga terdekat, dan 200 pohon yang memilih. Visualnya satu deret angka yang berubah menjadi tiga diagram berbeda.

Hook: "29 angka yang sama. Tiga cara membacanya."

Kekuatan: metode paling mudah dipahami.
Risiko: terasa seperti kuliah. Kurang tokoh, kurang taruhan emosional.

### C. Kesalahan yang benar

Mulai dari 101 penyerang yang disebut gelandang, lalu mundur untuk menjelaskan mengapa. Akurasi bukan klimaks, tetapi akibat sampingan.

Hook: "Model ini salah menebak 101 penyerang. Kesalahannya justru yang paling menarik."

Kekuatan: narasi detektif, critical thinking, sangat kuat untuk nilai kampus.
Risiko: kalau dibuka terlalu jauh, penonton kehilangan alasan menonton sisa video.

### D. Peta 29 angka

Pemain sebagai titik di ruang 29 dimensi. Posisi sebagai wilayah. Kamera bergerak di antara gugus pemain.

Hook: "Setiap pemain punya 29 koordinat. Di peta itu, posisi jadi terlihat."

Kekuatan: indah dan data-native.
Risiko: 29 dimensi tidak bisa digambar jujur dalam 2D. Kita hanya punya Finishing dan StandingTackle untuk scatter, jadi metafora peta akan menipu.

### E. Coba tebak

Tiga ronde tebak posisi. Penonton menebak, lalu mesin menebak, lalu kita membandingkan.

Hook: "Coba tebak. Bek, gelandang, atau penyerang?"

Kekuatan: partisipatif, retensi tinggi di awal.
Risiko: dalam 5 menit, gimmick ini cepat habis. Cocok sebagai pembuka, bukan sebagai seluruh struktur.

### Rekomendasi

Gabungan A dan C: **rapor sebagai sistem visual, kesalahan sebagai tulang cerita**. Mulai dengan tebak-tebakan Lamela, buka rapor dan labelnya, jelaskan mesin dan datanya, lalu kembali ke 101 kesalahan dan Lamela di akhir. Penonton mendapat hook partisipatif, penjelasan metode, dan tesis yang matang.

---

## 6. Sistem tipografi

### 6.1 Tiga peran huruf

| Peran | Huruf | Pemakaian |
|---|---|---|
| Suara utama | Inter Tight, 700/800 | Pertanyaan, verdict, kata raksasa. Tracking -0,03em |
| Suara manusia | Instrument Serif Italic | Kata yang mempertanyakan, bukan menghakimi: "seharusnya", "mungkin", "tercatat" |
| Suara data | IBM Plex Mono, 400/500 | Nama atribut, angka, label kecil, catatan sumber. Uppercase, tracking 0,12em |

Tiga huruf saja. Jangan tambah font keempat.

Kontras serif miring dan grotesque adalah warisan langsung dari video referensi: huruf "i" serif di pembuka, lalu seluruh kalimat memakai grotesque. Kita pakai serif hanya untuk satu atau dua kata per scene, supaya terasa seperti suara manusia yang menyela data.

### 6.2 Skala pada 1920x1080

| Peran | Ukuran | Contoh |
|---|---|---|
| Hero | 320 sampai 420 px | "PENYERANG", "GELANDANG", "?" |
| Statement | 140 sampai 200 px | Satu kalimat penuh, 6 sampai 8 kata |
| Substatement | 72 sampai 96 px | Penjelasan satu baris |
| Data besar | 48 sampai 64 px | Angka confusion matrix, akurasi |
| Label | 18 sampai 22 px mono | Nama atribut, satuan, sumber |
| Catatan kaki | 14 sampai 16 px mono | "Data uji, random_state 42" |

Aturan keras: satu baris maksimal 68 persen lebar frame. Jika lebih, pecah menjadi dua baris dengan hierarki, bukan mengecilkan semuanya.

### 6.3 Grid dan ruang

- Margin aman 96 px di semua sisi.
- Grid 12 kolom, gutter 24 px.
- Baseline 8 px.
- Tidak ada kartu, panel, atau border. Pemisah memakai jarak, skala, dan satu bidang warna.
- Garis hanya untuk hal fungsional: sumbu, garis bawah token yang berubah, penghubung diagram, dan garis tipis pada tabel confusion matrix.
- Tidak ada bilah warna vertikal di tepi kiri elemen.

### 6.4 Palet

| Nama | Nilai | Pemakaian |
|---|---|---|
| Bone | `#ECECE7` | Latar utama |
| Ink | `#0C0C0C` | Latar kedua dan teks di kertas |
| Paper white | `#F4F1EA` | Teks di atas hitam |
| Brass | `#A9781C` | Satu kata yang sedang berubah, satu highlight per scene |
| Alert | `#B32223` | Hanya 101 kesalahan dan kolom kunci jawaban |
| Muted | `#6F6A61` | Metadata, label sekunder |

Emas bukan warna struktural. Jangan dipakai untuk nomor bab, ikon, panah, atau garis. Merah hanya untuk hal yang benar-benar temuan: 101 penyerang yang disebut gelandang, dan kolom `STRating` sampai `GKRating` yang berfungsi sebagai kunci jawaban.

### 6.5 Tata bahasa gerak

1. **Type on.** Kata muncul dengan clip-path dari kiri, 6 sampai 10 frame per kata. Bukan fade.
2. **Token swap.** Kalimat tetap di tempat, satu kata diganti. Contoh: "RAPOR: PENYERANG" menjadi "MODEL: GELANDANG" tanpa menggeser kata lain.
3. **Slam.** Kata hero masuk dari 1,15 kali ukuran ke 1,0 dalam 4 frame, dengan overshoot 1 frame. Hanya untuk verdict.
4. **Drift.** Kata raksasa meluncur diagonal 20 sampai 40 px per frame selama 20 sampai 30 frame, lalu keluar frame. Dipakai sekali, di kata "PENYERANG" saat konflik label dibuka.
5. **Hard cut.** Kertas ke hitam, hitam ke kertas. Tidak ada dissolve antar bab.
6. **Count.** Angka menghitung dengan lebar digit tetap, 12 sampai 18 frame. Tidak boleh ada layout shift.
7. **Satu gerakan utama per beat.** Fade hanya pendukung.

---

## 7. Struktur 5 menit

| Scene | Waktu | Isi | Kata |
|---|---|---|---|
| 1. Cold open | 0:00-0:30 | "?" dari 29 angka, Lamela tanpa nama, tebakan model, twist label | 70 |
| 2. Rapor, bukan pertandingan | 0:30-1:10 | Dataset, BestPosition, 29 atribut, pemisahan tugas | 95 |
| 3. Bersihkan data | 1:10-1:55 | Duplikat, kiper, 16.367, sebaran kelas, ketimpangan | 100 |
| 4. Tiga pembaca | 1:55-2:50 | Decision Tree, KNN, Random Forest, kunci jawaban, split | 135 |
| 5. Skor | 2:50-3:25 | Akurasi dan F1, waktu latih, akurasi menyembunyikan kelas | 85 |
| 6. Kesalahan yang benar | 3:25-4:10 | Confusion matrix, 101, precision versus recall, Lamela | 120 |
| 7. Yang dilihat model | 4:10-4:45 | Lima atribut, Vision sebagai penghubung | 85 |
| 8. Penutup | 4:45-5:00 | Batasan, tesis, kembali ke Lamela | 70 |

Total sekitar 760 kata. Target 750 sampai 810.

---

## 8. Rencana produksi

1. Kunci arah dan naskah v1.
2. Unduh dan simpan font secara lokal: Inter Tight, Instrument Serif, IBM Plex Mono. Jangan bergantung pada Google Fonts saat render.
3. Buat type test 8 detik: "?" dari 29 angka, ledger Lamela, verdict GELANDANG. Render 3 still pada 0,0 s, 4,0 s, dan 7,5 s. Ini menguji apakah hooknya benar-benar terasa dalam satu detik pertama.
4. Setelah type test lolos, bangun timeline penuh di `projects/fifa-posisi-5min/aset/timeline.html` dengan `window.setTime(t)`.
5. VO dan sound design setelah gambar terkunci.
6. QA per scene, lalu render 9.000 frame.

---

## 9. Pertanyaan yang masih terbuka

1. Nama pemain: pakai Érik Lamela apa anonimkan menjadi "Pemain A, sayap kanan, 29 tahun"? Rekomendasi saya pakai nama asli, karena tebakan penonton jadi punya taruhan. Framing harus sopan: ini contoh label yang kabur, bukan vonis bahwa Lamela bukan penyerang.
2. Suara: TTS `id-ID-ArdiNeural` seperti project sebelumnya, atau rekaman suara sendiri? Untuk video kampus, suara manusia akan lebih meyakinkan.
3. Apakah identitas kelompok dan nama lima anggota perlu muncul di akhir? Project sebelumnya memakainya.
4. Apakah dosen meminta angka tabel ditampilkan lengkap, atau cukup angka kunci? Rekomendasi saya angka kunci saja, tabel lengkap masuk lampiran artikel.
