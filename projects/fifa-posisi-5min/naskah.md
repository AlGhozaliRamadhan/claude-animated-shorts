# Naskah: Klasifikasi Posisi Pemain FIFA 23

Status: final v5, 10 November 2026.
Format: tiga video terpisah, 1920x1080, 30 fps, bahasa Indonesia.
Pembagian: Video 1 scene 1-3, Video 2 scene 4-6, Video 3 scene 7-8.
Sumber angka: `Artikel-15.3B.01-KlasifikasiPosisi.docx`, Tabel 1 sampai 4, dan notebook `klasifikasi_posisi.ipynb`.

---

## Prinsip naskah

- Satu paragraf satu ide. Satu beat satu kalimat.
- Tempo natural dan santai (~1,4 sampai 1,6 kata per detik), tanpa kesan tergesa-gesa atau hening panjang yang canggung.
- Kalimat lugas, langsung ke inti fakta, tanpa konstruksi klise perbandingan negatif ("bukan X, tapi Y").
- Tidak memakai em dash atau en dash.
- Tidak memakai "selanjutnya kita akan", "seperti yang bisa kita lihat", atau "hal ini menunjukkan bahwa".
- Setiap angka punya sumber di layar: Tabel 1, Tabel 3, Tabel 4, atau catatan data uji.
- Pemisahan fokus muncul di 15 detik pertama: model menguji sejauh mana 29 atribut angka mampu merekonstruksi posisi resmi yang tercatat di dataset.
- VO dibawakan oleh 5 pembicara berurutan secara bergantian tanpa pengulangan (1 → 2 → 3 → 4 → 5).
- Tidak ada nama pengisi suara di layar maupun di VO. Perpindahan pembicara dikenali dari suara, materi bahasan, dan perpindahan cut visual.

---

## Pembagian suara (5 Pembicara — Sekuensial Tanpa Repetisi)

| No | Pembicara | NIM | Scene | Bagian & Topik | Dokumen Khusus |
|---|---|---|---|---|---|
| Suara 1 | Al Ghozali Ramadhan | 15250708 | Scene 1 | Video 1: Pembuka, rumusan masalah, studi kasus Lamela | [`01-al-ghozali.md`](01-al-ghozali.md) |
| Suara 2 | Khalisya Ramadhani Putri Witama | 15250823 | Scene 2 & 3 | Video 1: Eksplorasi fitur, kolom, pembersihan, split data | [`02-khalisya.md`](02-khalisya.md) |
| Suara 3 | Fadly Salim | 15250559 | Scene 4 | Video 2: Metodologi 3 model klasifikasi (DT, KNN, RF) | [`03-fadly.md`](03-fadly.md) |
| Suara 4 | Selena Mireil Sachiko Balqis | 15250717 | Scene 5 & 6 | Video 2: Hasil evaluasi skor & analisis matriks konfusi | [`04-selena.md`](04-selena.md) |
| Suara 5 | Rafa Nursakha Putra Azka | 15250792 | Scene 7 & 8 | Video 3: Feature importance, keterbatasan, kesimpulan | [`05-rafa.md`](05-rafa.md) |

Urutan tampil berjalan teratur satu per satu tanpa repetisi atau pemanggilan ulang pembicara.

---

## Aturan media

- Jangan cuma teks. Setiap video minimal punya satu aset nyata yang membawa informasi, bukan hiasan.
- Jangan pakai gambar generatif untuk Lamela, Sevilla, pertandingan, atau peristiwa nyata. Foto orang harus foto asli.
- Sumber yang boleh: Wikimedia Commons, press kit resmi klub, dokumentasi sendiri, screenshot notebook sendiri, atau stok dengan lisensi jelas.
- Jangan pakai preview Getty/Shutterstock, gambar berwatermark, repost Pinterest/Instagram, atau frame siaran tanpa izin.
- Setiap aset dicatat di `aset/sources.md`. Lisensi CC BY atau CC BY-SA wajib dikreditkan di layar.
- Resolusi minimal 1280 px untuk full frame, 800 px untuk setengah frame. Jangan upscale lebih dari 1,5x.
- Foto tidak boleh menipu. Foto Lamela 2020 dipakai sebagai potret, bukan bukti ia masih di Sevilla saat data FIFA 23 diambil. Caption wajib memisahkan `FOTO 2020` dan `DATA FIFA 23`.
- Teks di atas foto wajib punya scrim. Jangan taruh type langsung di atas kostum, kerumunan, atau rumput.
- Footage hanya dari rekaman sendiri atau sumber berlisensi. Prioritas: screen recording notebook, dataset, dan chart. Bukan klip siaran.
- Satu aset satu tugas. Chart dipakai sebagai bukti, bukan wallpaper.
- Tidak ada elemen yang menempel di pojok, tepi kiri, tepi kanan, atas, atau bawah frame. Tidak ada header berjalan, tidak ada caption nama, tidak ada kredit di tepi. Kredit foto masuk ke dalam blok teks yang sama dengan nama pemain.

---

# Video 1: Data yang membaca pemain (0:00-3:06)

## Scene 1. Cold open: pemain tanpa wajah (0:00-1:04)

**Visual**

- `0:00` Layar gelap grafit. Belum ada teks terbaca. Satu garis rambut tipis menggambar di tengah, lalu tanda tanya raksasa mulai terbentuk dari 84 baris data mono.
- `0:00` Setelah tanda tanya terbaca, dua baris besar masuk dari kiri: `TEBAK POSISI ASLI`, lalu `ATAU`, lalu `CEK COCOK DI RAPOR`. Tidak ada judul, tidak ada logo.
- `0:02` Garis putih menggambar di bawah `TEBAK POSISI ASLI`. Baris kedua meredup dan bergeser sedikit ke kanan.
- `0:03` Catatan mono masuk di bawah: `VIDEO INI MENGUJI YANG PERTAMA`.
- `0:06` Kertas bone masuk lewat sapuan lembaran. Tanda tanya raksasa sekitar 1.000 px tinggal di posisi yang sama, sekarang bertinta hitam, lalu mengendap dan merayap masuk sepanjang shot.
- `0:06` Catatan mono di kiri tengah: `29 ANGKA / 1 PEMAIN / 3 KEMUNGKINAN`.
- `0:12` Tanda tanya pecah. 29 potong angka meluncur keluar dan membentuk satu kolom ledger di kiri.
- `0:20` Tiga kata berganti di tempat yang sama, masing-masing 12 frame: `BEK`, `GELANDANG`, `PENYERANG`.
- `0:30` Ledger menyala satu per satu: `Finishing 74`, `Dribbling 85`, `ShortPassing 80`, `Vision 78`, `StandingTackle 50`.
- `0:39` Tiga probabilitas muncul tanpa grafik batang: `DEFENDER 0,020`, `MIDFIELDER 0,855`, `FORWARD 0,125`. Angka `0,855` dibalik menjadi blok hitam dengan angka putih.
- `0:46` Hard cut ke papan bukti. Foto Lamela 1:1 dipin di kiri, teks nama dan asal di bawahnya. Kamera menahan di potret, lalu menarik keluar.
- `0:49` Dua foto Stadion Ramón Sánchez-Pizjuán dan fasad Sevilla FC masuk dan dipin di kanan. Tali menarik dari pin pemain ke pin klub.
- `0:52` Kartu rapor dipin di bawah: `POSISI DI RAPOR DATA`, `PENYERANG`, lima atribut, dan label `29 ATRIBUT`. Tali dari pin pemain dan pin klub bertemu di pin kartu.
- `0:55` Satu gerakan kamera tanpa cut: setelah papan terbaca penuh, kamera masuk pelan ke kartu rapor. Latar tetap papan yang sama, bukan halaman baru.
- `0:57` Hard cut kembali ke kertas. Satu kalimat 150 px: `Bukan posisi terbaik. Posisi yang tercatat.` Kata `tercatat` memakai serif miring.
- `0:59` Kalimat bertahan dengan dorongan kamera pelan sampai sapuan lembaran membawanya ke Scene 2. Tidak mengecil dan tidak turun.

**VO**

**Suara 1**
> Dua pertanyaan mendasar muncul: apakah komputer mampu menebak posisi asli seorang pemain, atau menilai kecocokannya menurut rapor data?
>
> Video ini berfokus pada pertanyaan pertama. Bila kita memiliki 29 angka atribut tanpa nama dan klub, bisakah kita menebak posisinya di lapangan?
>
> Pilihan posisinya ada tiga: bek, gelandang, atau penyerang. Model membaca 29 angka tersebut untuk menentukan kelas posisi yang tepat.
>
> Kami menguji satu contoh nyata dari data uji: Érik Lamela, sayap kanan Sevilla. Di data ia terdaftar penyerang, tetapi model membacanya sebagai gelandang dengan probabilitas 0,855.
>
> Fokus utama pengujian ini adalah membuktikan sejauh mana 29 angka atribut mampu merekonstruksi posisi resmi yang tercatat di data.
>
> Kami memanfaatkan profil kemampuan individu yang melekat pada setiap pemain sebagai fitur utama dalam proses klasifikasi.

**Audio**

- Kertas: gesekan halus saat tanda tanya pecah.
- Ketikan mono yang sangat pelan saat ledger muncul, bukan mesin tik penuh.
- Satu dentuman rendah saat hard cut ke papan bukti.
- Klik pin kecil saat foto dan kartu mendarat di papan, lalu gesekan tali tipis saat garis menghubungkan pin.
- Hening 0,4 detik sebelum `POSISI DI RAPOR DATA`.

---

## Scene 2. Rapor, bukan pertandingan (1:04-2:07)

**Visual**

- `1:04` Dinding berisi 90 nama kolom, tersusun rapat dalam mono 15 px. Layar terasa penuh untuk satu detik.
- `1:04` Di belakang dinding, screenshot tabel dataset bergerak pelan dari kiri ke kanan, opacity 18 persen. Dinding tetap di depan.
- `1:10` 29 kolom menyala. Sisanya turun ke 8 persen opacity dan runtuh ke bawah frame.
- `1:16` `BestPosition` ditarik keluar dari dinding, diperbesar menjadi 120 px.
- `1:24` Dua baris berhadapan di tengah: `RAPOR: PENYERANG` dan `MODEL: GELANDANG`. Kata `PENYERANG` bergeser sedikit ke kiri, `GELANDANG` mengisi ruang yang ditinggalkan.
- `1:32` Kalimat pemisah tugas muncul di bawah, 52 px, dua baris.
- `1:40` Kolom yang dibuang muncul sebagai daftar mono: `Overall`, `Potential`, `TotalStats`, `BaseStats`, `Growth`, `GKDiving` sampai `GKReflexes`. Satu garis tipis mencoret daftar itu dari kiri ke kanan.
- `1:50` `STRating` sampai `GKRating` masuk sebagai blok terpisah. Blok itu ditutup garis merah bata dari kiri ke kanan. Label kecil: `KUNCI JAWABAN`.
- `2:02` Dinding kolom memudar, kertas bersih menjelang cut.

**VO**

**Suara 2**
> Kita masuk ke data. Dataset Kaggle ini memuat 18.539 pemain dengan 90 kolom informasi.
>
> Dari 90 kolom, kami mengambil 29 atribut kemampuan teknis. Kolom nama dan klub kami lepas.
>
> Labelnya BestPosition, posisi utama pemain agar targetnya tunggal dan konsisten.
>
> Model memprediksi label posisi murni dari nilai-nilai atribut numerik.
>
> Di sini rapor menuliskan penyerang, sedangkan model memprediksi gelandang.
>
> Kolom Overall, Potential, dan Growth kami saring karena hanya menilai kualitas umum.
>
> STRating hingga GKRating juga dibuang karena memuat bocoran jawaban ke model.
>
> Berikutnya adalah pembersihan data.

**Audio**

- Napas rendah saat dinding 90 kolom muncul.
- Suara kertas robek kecil saat 61 kolom runtuh.
- Tidak ada musik melodi di scene ini, hanya nada dasar.
- Suara redaksi tegas saat blok kunci jawaban ditutup.

---

## Scene 3. Bersihkan data (2:07-3:06)

**Visual**

- `2:07` Angka `18.539` di tengah, 220 px. Angka itu mengganti dirinya sendiri di tempat yang sama: `18.539`, lalu `18.420`, lalu `16.367`.
- `2:07` Di belakang angka, potongan screenshot notebook `df.shape` dan `drop_duplicates`, opacity 16 persen, blur 1 px.
- `2:15` Di kiri, `119` baris duplikat dicoret. Di kanan, `2.053` kiper meluncur keluar frame.
- `2:25` Tiga kelas muncul sebagai satu garis 100 persen: `DEFENDER 38,06`, `MIDFIELDER 42,81`, `FORWARD 19,12`. Tiga segmen dibedakan lewat nilai abu, dari tinta pekat ke nada paling terang di segmen Forward. Di belakang, `notebook/01_sebaran_kelas.png` muncul 1 detik, opacity 20 persen, duotone.
- `2:35` Kata `1 DARI 5` muncul 280 px di atas garis, serif miring untuk `5`.
- `2:43` Tiga angka jumlah di bawah garis: `6.230`, `7.007`, `3.130`, mono 42 px.
- `2:51` Catatan kecil: `Split stratified 80:20`.
- `2:55` Garis horizontal 80 persen, potong di 80. Kiri `13.093 LATIH`, kanan `3.274 UJI`.

**VO**

**Suara 2**
> Dari 18.539 baris awal, 119 duplikat dihapus dan 2.053 kiper dipisahkan, menyisakan 16.367 pemain lapangan.
>
> Kiper dipisahkan karena keahliannya sangat spesifik dan bisa membiaskan akurasi.
>
> Sebaran kelas bersih terdiri dari Defender 38,06 persen, Midfielder 42,81, dan Forward 19,12 persen.
>
> Porsi penyerang paling sedikit, hanya sekitar satu dari lima pemain.
>
> Data dibagi dengan stratified split 80 banding 20, menghasilkan 13.093 data latih dan 3.274 data uji.

**Audio**

- Tiga ketukan angka saat 18.539 berubah menjadi 16.367.
- Satu nada tinggi tipis saat segmen Forward menyala.
- Hening singkat setelah `1 dari 5`.

---

# Video 2: Tiga pembaca, satu jawaban (0:00-3:05)

## Scene 4. Tiga pembaca (0:00-1:10)

**Visual**

- `0:00` Satu deret 29 angka membentang di bagian atas, tidak bergerak selama scene ini. Ini jangkar visual.
- `0:06` Tiga nama model berganti di bawah deret: `DECISION TREE`, `K-NEAREST NEIGHBOR`, `RANDOM FOREST`.
- `0:12` Decision Tree: garis bercabang tipis turun ke bawah, 1 menjadi 2, 2 menjadi 4, 4 menjadi 8. Label pertanyaan muncul di simpul: `Finishing?`, `StandingTackle?`, `Vision?`.
- `0:30` KNN: deret angka memadat menjadi scatter dua dimensi. Satu titik putih dikelilingi lima titik lain, lima garis tipis menghubungkan. Di belakang, `notebook/03_sebaran_atribut.png` muncul 1,5 detik, opacity 30 persen, duotone.
- `0:46` Random Forest: 200 garis vertikal kecil di bagian bawah, seperti tally. Garis-garis itu berkelompok dan memilih satu jawaban.
- `0:56` Deret `STRating` sampai `GKRating` muncul, lalu ditutup bar merah bata dari kiri ke kanan. Label kecil: `KUNCI JAWABAN`.
- `1:02` Satu garis horizontal 80 persen, potong di 80. Kiri `13.093 LATIH`, kanan `3.274 UJI`.

**VO**

**Suara 3**
> Tiga model machine learning ini mengolah 29 angka yang sama dengan prinsip kerja masing-masing.
>
> Decision Tree menyusun aturan bertingkat. Kedalaman pohon kami batasi 12 tingkat agar tidak menghafal data latih.
>
> Bek dan penyerang terpisah tegas: tekel bek 65,8 berbanding 28,2, sedangkan finishing penyerang mencapai 66,9.
>
> KNN mengambil keputusan dari lima tetangga paling mirip di sebaran data terstandarisasi.
>
> Semua fitur distandarisasi agar perhitungan jarak berjalan seimbang.
>
> Random Forest menggabungkan 200 pohon keputusan acak agar hasil prediksi lebih stabil.
>
> Pembagian data 80 banding 20 dan seed 42 berlaku sama untuk ketiganya.
>
> Mari kita lihat hasil evaluasinya.

**Audio**

- Satu klik setiap cabang Decision Tree terbentuk.
- Desing halus saat scatter KNN menyusun diri.
- 200 tick sangat pelan saat Random Forest memilih.
- Suara redaksi tegas saat kolom kunci jawaban ditutup.

---

## Scene 5. Skor (1:10-2:05)

**Visual**

- `1:10` Tiga baris skor, tanpa kartu. Nama model di kiri, akurasi di kanan, mono 96 px.
- `1:16` Angka menghitung: `85,43`, `89,03`, `90,53`. Baris Random Forest mendapat garis bawah tebal dan angka yang lebih berat.
- `1:26` F1 macro muncul di bawah tiap baris: `0,8498`, `0,8855`, `0,9006`.
- `1:34` Waktu latih muncul di kolom paling kanan: `0,27 s`, `0,05 s`, `1,92 s`.
- `1:42` Angka `90,53` mengecil menjadi watermark 420 px di belakang, opacity 12 persen.
- `1:50` Satu kalimat 120 px di depan: `Rata-rata menyembunyikan satu kelas.`

**VO**

**Suara 4**
> Akurasi Decision Tree 85,43 persen, KNN 89,03, dan Random Forest 90,53 persen.
>
> F1 macro mengikuti: 0,8498 pada Decision Tree, 0,8855 pada KNN, dan 0,9006 pada Random Forest.
>
> Waktu latih KNN 0,05 detik dan Random Forest 1,92 detik, meski prediksi KNN lebih berat.
>
> Akurasi perlu dicermati karena merupakan rata-rata kelas yang jumlahnya timpang.
>
> F1 macro menjadi acuan utama untuk mengawasi kelas penyerang yang paling kecil.
>
> Sekarang kita periksa sebaran prediksinya.

**Audio**

- Tiga denting pendek saat angka berhenti.
- Nada bawah panjang saat watermark muncul.
- Hening sebelum kalimat terakhir.

---

## Scene 6. Kesalahan yang benar (2:05-3:05)

**Visual**

- `2:05` Hard cut ke kertas. Grid 3x3 angka, tanpa isian warna, hanya type di atas kertas.
- `2:05` Di belakang grid, screenshot `notebook/04_confusion_matrix.png`, opacity 14 persen, blur 1 px.
- `2:10` Label baris dan kolom: `DEFENDER`, `MIDFIELDER`, `FORWARD`, mono 18 px.
- `2:16` Angka terisi: 1.165, 81, 0, 78, 1.275, 49, 1, 101, 524.
- `2:24` Sel `101` membesar 1,4 kali dan berubah merah bata. Garis merah tipis tumbuh di bawahnya. Catatan: `FORWARD DIKIRA MIDFIELDER`.
- `2:34` Dua angka berhadapan: `PRECISION 91,45` dan `RECALL 83,71`. Kata `PRECISION` tenang, `RECALL` dibalik menjadi blok tinta dengan huruf kertas.
- `2:44` Foto Lamela yang sama masuk kecil di kiri, crop 4:5, duotone. Ledger Lamela di tengah. Di kanan, dua kata besar: `PENYERANG` dan `GELANDANG`, dipisahkan ruang kosong, bukan garis.
- `2:54` Lima nilai menyala di antara dua kata: `74`, `85`, `80`, `78`, `50`.

**VO**

**Suara 4**
> Matriks konfusi mencatat dari 626 penyerang, 524 tepat dan 101 ditebak gelandang.
>
> Forward paling menantang dengan skor F1 0,8741.
>
> Recall Forward 83,71 persen, dan presisinya mencapai 91,45 persen.
>
> Model sangat selektif melabeli penyerang, sehingga sebagian penyerang terlewat.
>
> Sebaliknya, 49 gelandang ditebak penyerang karena karakteristik peran saling beririsan.
>
> Contohnya Lamela: dribbling 85, passing 80, visi 78, dan tekel 50.
>
> Atribut Lamela condong ke gelandang serang, sehingga model menempatkannya di posisi tengah.

**Audio**

- Satu ketukan keras saat sel 101 menyala.
- Denting rendah saat precision dan recall muncul.
- Tidak ada musik selama dua detik setelah nada penutup.

---

# Video 3: Yang dilihat model, dan yang tidak (0:00-1:26)

## Scene 7. Yang dilihat model (0:00-0:45)

**Visual**

- `0:00` Lima kata disusun vertikal, kiri rata. Ukuran menurun mengikuti peringkat, bukan grafik batang.
- `0:00` Di belakang, screen recording notebook yang menggulir 29 kolom, opacity 22 persen. Kalau belum ada, pakai `notebook/05_feature_importance.png` sebagai still.
- `0:00` `SLIDINGTACKLE` 150 px, `FINISHING` 132 px, `HEADINGACCURACY` 112 px, `STANDINGTACKLE` 96 px, `VISION` 82 px.
- `0:10` Nilai importance muncul di kanan, mono 28 px: `0,0918`, `0,0840`, `0,0725`, `0,0716`, `0,0710`.
- `0:20` Empat kata pertama tetap tinta. `VISION` dibalik menjadi blok tinta dengan huruf kertas.
- `0:28` Satu kalimat 96 px di bawah: `Bukan dua kutub. Ada peran penghubung.`

**VO**

**Suara 5**
> Lima atribut paling berpengaruh dalam model Random Forest adalah SlidingTackle, Finishing, HeadingAccuracy, StandingTackle, dan Vision.
>
> Atribut tekel dan penyelesaian akhir memberikan kontribusi dominan dalam membedakan area bertahan dan lini depan.
>
> Masuknya atribut Vision di peringkat lima besar memberikan wawasan penting mengenai peran membaca permainan yang khas pada gelandang.
>
> Model mengenali keberadaan peran penghubung di lini tengah yang menjembatani pertahanan dan penyerangan.
>
> Nilai importance ini secara murni menunjukkan bobot fitur yang paling diandalkan model dalam memisahkan keputusan kelas.

**Audio**

- Lima ketukan berbeda tinggi, satu per kata.
- Nada kuningan hangat saat Vision menyala.
- Hening 0,5 detik sebelum kalimat penutup scene.

---

## Scene 8. Penutup (0:45-1:26)

**Visual**

- `0:45` Kertas bone. Kalimat 130 px, tiga baris: `Data memberi cara lain` lalu `untuk memahami` lalu `permainan.` Kata `memahami` memakai serif miring.
- `0:55` Tiga baris batasan muncul di bawah, mono 18 px: `LABEL = BESTPOSITION`, `SATU MUSIM, PEMAIN LAKI-LAKI`, `KIPER DIPISAHKAN`.
- `1:05` Foto Lamela kecil di kiri, crop kepala, duotone, opacity 90 persen. Ledger Lamela di kanan: `RAPOR: PENYERANG` dan `MODEL: GELANDANG`.
- `1:15` Satu baris terakhir, 58 px: `Mungkin keduanya benar.`
- `1:25` Potong ke hitam. Tidak ada logo, tidak ada animasi penutup.

**VO**

**Suara 5**
> Sebagai penutup, eksplorasi ini melengkapi pengamatan visual secara kuantitatif.
>
> Batasan riset ini: data FIFA 23 satu musim pemain pria, dan kiper sudah dipisahkan.
>
> Peluang pengembangan ke depan mencakup model kiper, pendekatan multilabel, dan data tracking pertandingan.
>
> Akurasi 90,53 persen membuktikan atribut teknis mampu memetakan posisi pemain secara terukur.
>
> Kasus Lamela menegaskan bahwa analisis data menangkap dimensi peran pemain yang lebih luwes.

**Audio**

- Satu akor hangat, pendek, tidak megah.
- Kertas diletakkan satu kali.
- Hitam selama 0,5 detik, lalu selesai.

---

## Catatan produksi

- Total VO dihitung dengan `python projects/fifa-posisi-5min/tools/parse_vo.py`.
- Total VO v5 adalah ~650 kata, tempo natural manusiawi (1,4 kata/detik) dengan kecepatan bacaan 0% tanpa percepatan artifisial, terdistribusi ke 5 pembicara berurutan tanpa pengulangan (Al Ghozali -> Khalisya -> Fadly -> Selena -> Rafa).
- VO ditaruh per paragraf dan dijangkarkan ke cue visual di tiap scene dengan jeda nafas halus (0,8 - 1,5 detik) sehingga tidak ada hening panjang kosong.
- File naskah perorangan siap cetak dan rekam tersedia di `01-al-ghozali.md` hingga `05-rafa.md`.
