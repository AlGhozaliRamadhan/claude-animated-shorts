# Naskah Draft v0: Klasifikasi Posisi Pemain FIFA 23

Status: draf lama, digantikan oleh [`naskah.md`](naskah.md). Jangan dipakai untuk produksi.
Target awal: 5:00, 1920x1080, 30 fps, bahasa Indonesia.
Sumber angka: `Artikel-15.3B.01-KlasifikasiPosisi.docx`, Tabel 1 sampai 4, dan notebook `klasifikasi_posisi.ipynb`.

---

## Prinsip naskah

- Satu paragraf satu ide. Satu beat satu kalimat.
- Kalimat 12 sampai 20 kata. Bisa diucapkan dengan napas normal.
- Tidak memakai em dash.
- Tidak memakai "selanjutnya kita akan", "seperti yang bisa kita lihat", atau "hal ini menunjukkan bahwa".
- Setiap angka punya sumber di layar: Tabel 1, Tabel 3, Tabel 4, atau catatan data uji.
- Pemisahan tugas muncul di awal: model menebak label yang tercatat, bukan posisi terbaik menurut penilaian kita.

---

## Scene 1. Cold open: pemain tanpa wajah (0:00-0:30)

**Visual**

- `0:00` Kertas bone. Tanda tanya raksasa setinggi 620 px, di dalamnya terdapat 29 potong teks mono berisi nama atribut dan nilainya. Tidak ada judul, tidak ada logo.
- `0:00` Catatan kaki 14 px di bawah: `29 ANGKA / 1 PEMAIN / 3 KEMUNGKINAN`.
- `0:05` Tanda tanya pecah. 29 potong angka meluncur keluar dan membentuk satu kolom ledger di kiri.
- `0:12` Tiga kata berganti di tempat yang sama, masing-masing 12 frame: `BEK`, `GELANDANG`, `PENYERANG`.
- `0:24` Ledger menyala satu per satu: `Finishing 74`, `Dribbling 85`, `ShortPassing 80`, `Vision 78`, `StandingTackle 50`.
- `0:42` Tiga probabilitas muncul tanpa grafik batang: `DEFENDER 0,020`, `MIDFIELDER 0,855`, `FORWARD 0,125`. Kata `GELANDANG` mendapat garis bawah kuningan.
- `1:00` Hard cut ke hitam. Tiga baris putih: `ÉRIK LAMELA`, `SAYAP KANAN`, `SEVILLA`.
- `1:08` Baris keempat masuk: `RAPOR: PENYERANG`.
- `1:20` Hard cut kembali ke kertas. Satu kalimat 150 px: `Bukan posisi terbaik. Posisi yang tercatat.` Kata `tercatat` memakai serif miring.
- `1:20` Kalimat mengecil ke 36 px dan naik ke sudut atas, menjadi header berjalan sampai Scene 2.

**VO**

> Bagaimana cara mesin tahu posisi seorang pemain, tanpa pernah menonton satu pertandingan pun?
>
> Kita mulai dari satu pemain. Namanya Érik Lamela. Sayap kanan Sevilla.
>
> Di rapor datanya, ia tercatat sebagai penyerang.
>
> Tetapi ketika 29 atributnya dibaca model, jawabannya berubah. Gelandang, dengan keyakinan 85 persen.
>
> Jadi pertanyaannya bukan di mana ia seharusnya bermain.
>
> Pertanyaannya, seberapa jauh 29 angka bisa membaca posisi yang sudah ditulis untuknya.

**Audio**

- Kertas: gesekan halus saat tanda tanya pecah.
- Ketikan mono yang sangat pelan saat ledger muncul, bukan mesin tik penuh.
- Satu dentuman rendah saat hard cut ke hitam.
- Hening 0,4 detik sebelum `RAPOR: PENYERANG`.

---

## Scene 2. Rapor, bukan pertandingan (0:30-1:10)

**Visual**

- `0:30` Dinding berisi 90 nama kolom, tersusun rapat dalam mono 15 px. Layar terasa penuh untuk satu detik.
- `0:34` 29 kolom menyala. Sisanya turun ke 8 persen opacity dan runtuh ke bawah frame.
- `0:40` `BestPosition` ditarik keluar dari dinding, diperbesar menjadi 120 px.
- `0:46` Dua baris berhadapan di tengah: `RAPOR: PENYERANG` dan `MODEL: GELANDANG`. Kata `PENYERANG` bergeser sedikit ke kiri, `GELANDANG` mengisi ruang yang ditinggalkan.
- `0:52` Kalimat pemisah tugas muncul di bawah, 52 px, dua baris.
- `1:02` Kolom yang dibuang muncul sebagai daftar mono: `Overall`, `Potential`, `TotalStats`, `BaseStats`, `Growth`, `GKDiving` sampai `GKReflexes`. Satu garis tipis mencoret daftar itu dari kiri ke kanan.
- `1:08` Header berjalan tetap di atas: `RAPOR / 29 ATRIBUT / 16.367 PEMAIN`.

**VO**

> Data yang dipakai adalah FIFA 23 Complete Player Dataset dari Kaggle. Isinya 18.539 pemain dan 90 kolom.
>
> Setiap pemain punya satu label BestPosition. Label inilah yang diminta ditebak mesin.
>
> Jadi model tidak mencari posisi terbaik. Ia tidak menilai apakah Lamela cocok jadi gelandang. Ia hanya mencoba mereproduksi posisi yang sudah tertulis di rapor data.
>
> Untuk itu, 29 atribut kemampuan dipakai sebagai petunjuk. Kolom penilaian posisi justru dibuang.
>
> Dua puluh sembilan atribut itu berisi kemampuan teknis seperti crossing, finishing, passing, dan tackling. Nama, klub, dan usia tidak dipakai, karena model harus membaca kemampuan, bukan identitas.
>
> Kolom Overall, Potential, TotalStats, BaseStats, dan Growth juga dikeluarkan. Semuanya menilai kualitas umum atau hanya ringkasan turunan, bukan peran bermain.
>
> Kita tidak sedang mencari posisi terbaik. Kita sedang menguji apakah 29 angka bisa menebak posisi yang sudah tercatat.

**Audio**

- Napas rendah saat dinding 90 kolom muncul.
- Suara kertas robek kecil saat 61 kolom runtuh.
- Tidak ada musik melodi di scene ini, hanya nada dasar.

---

## Scene 3. Bersihkan data (1:10-1:55)

**Visual**

- `1:10` Angka `18.539` di tengah, 220 px. Angka itu mengganti dirinya sendiri di tempat yang sama: `18.539`, lalu `18.420`, lalu `16.367`.
- `1:18` Di kiri, `119` baris duplikat dicoret. Di kanan, `2.053` kiper meluncur keluar frame.
- `1:30` Tiga kelas muncul sebagai satu garis 100 persen: `DEFENDER 38,06`, `MIDFIELDER 42,81`, `FORWARD 19,12`. Hanya segmen Forward yang memakai kuningan.
- `1:38` Kata `1 DARI 5` muncul 280 px di atas garis, serif miring untuk `5`.
- `1:46` Tiga angka jumlah di bawah garis: `6.230`, `7.007`, `3.130`, mono 42 px.
- `1:52` Catatan kecil: `Split stratified 80:20`.

**VO**

> Sebelum dilatih, data dibersihkan. 119 baris duplikat dihapus, lalu 2.053 penjaga gawang dikeluarkan.
>
> Kiper dipisahkan karena atributnya berbeda jenis dan hampir selalu memisahkan diri sempurna. Memasukkannya hanya akan menaikkan akurasi tanpa menambah wawasan.
>
> Tersisa 16.367 pemain lapangan. Defender 6.230, midfielder 7.007, forward 3.130.
>
> Artinya, hanya satu dari lima pemain adalah penyerang. Ketimpangan ini penting. Model bisa terlihat pintar hanya dengan menebak kelas mayoritas.
>
> Karena itu, akurasi saja tidak cukup. F1 macro dipakai sebagai acuan, dan pembagian data dibuat stratified agar proporsi tiga kelas tetap sama di data latih dan uji.
>
> Data uji berisi 3.274 pemain, cukup untuk mengukur tiga kelas tanpa membuat satu kelas mendominasi.

**Audio**

- Tiga ketukan angka saat 18.539 berubah menjadi 16.367.
- Satu nada tinggi tipis saat segmen Forward menyala.
- Hening singkat setelah `1 dari 5`.

---

## Scene 4. Tiga pembaca (1:55-2:50)

**Visual**

- `1:55` Satu deret 29 angka membentang di bagian atas, tidak bergerak selama scene ini. Ini jangkar visual.
- `2:00` Tiga nama model berganti di bawah deret: `DECISION TREE`, `K-NEAREST NEIGHBOR`, `RANDOM FOREST`.
- `2:05` Decision Tree: garis bercabang tipis turun ke bawah, 1 menjadi 2, 2 menjadi 4, 4 menjadi 8. Label pertanyaan muncul di simpul: `Finishing?`, `StandingTackle?`, `Vision?`.
- `2:20` KNN: deret angka memadat menjadi scatter dua dimensi. Satu titik putih dikelilingi lima titik lain, lima garis tipis menghubungkan.
- `2:35` Random Forest: 200 garis vertikal kecil di bagian bawah, seperti tally. Garis-garis itu berkelompok dan memilih satu jawaban.
- `2:42` Deret `STRating` sampai `GKRating` muncul, lalu ditutup bar merah bata dari kiri ke kanan. Label kecil: `KUNCI JAWABAN`.
- `2:46` Satu garis horizontal 80 persen, potong di 80. Kiri `13.093 LATIH`, kanan `3.274 UJI`.

**VO**

> Tiga model membaca 29 angka yang sama dengan cara berbeda.
>
> Decision Tree bertanya berurutan. Apakah Finishing tinggi? Apakah StandingTackle rendah? Setiap jawaban mempersempit kemungkinan. Kedalamannya dibatasi 12 agar tidak menghafal data latih.
>
> K-Nearest Neighbor tidak membangun aturan. Ia mencari lima pemain paling mirip, lalu mengambil suara terbanyak. Karena bergantung pada jarak, semua fitur distandardisasi.
>
> Random Forest melatih 200 pohon pada sampel dan subset fitur acak, lalu memungut suara terbanyak. Korelasi antar atribut tidak lagi bergantung pada satu pohon.
>
> Pembagian data 80:20 dilakukan sekali di awal, lalu dipakai semua model. Standardisasi hanya di-fit pada data latih.
>
> Kolom STRating sampai GKRating tidak dipakai. Kolom itu menilai kecocokan per posisi, jadi memakainya sama dengan memberi model kunci jawaban.

**Audio**

- Satu klik setiap cabang Decision Tree terbentuk.
- Desing halus saat scatter KNN menyusun diri.
- 200 tick sangat pelan saat Random Forest memilih.
- Suara redaksi tegas saat kolom kunci jawaban ditutup.

---

## Scene 5. Skor (2:50-3:25)

**Visual**

- `2:50` Tiga baris skor, tanpa kartu. Nama model di kiri, akurasi di kanan, mono 96 px.
- `2:54` Angka menghitung: `85,43`, `89,03`, `90,53`. Baris Random Forest mendapat garis bawah kuningan.
- `3:04` F1 macro muncul di bawah tiap baris: `0,8498`, `0,8855`, `0,9006`.
- `3:10` Waktu latih muncul di kolom paling kanan: `0,27 s`, `0,05 s`, `1,92 s`.
- `3:16` Angka `90,53` mengecil menjadi watermark 420 px di belakang, opacity 12 persen.
- `3:20` Satu kalimat 120 px di depan: `Rata-rata menyembunyikan satu kelas.`

**VO**

> Hasilnya ada di Tabel 3. Decision Tree 85,43 persen. K-Nearest Neighbor 89,03. Random Forest 90,53, dengan F1 macro 0,9006.
>
> Selisih satu setengah poin antara KNN dan Random Forest terlihat kecil. Tetapi waktu latihnya berbeda jauh: 0,05 detik lawan 1,92 detik.
>
> Namun akurasi menyembunyikan sesuatu. Ia adalah rata-rata dari tiga kelas yang tidak sama besar. Kalau kita hanya melihat 90 persen, kita belum tahu kelas mana yang dikorbankan.
>
> F1 macro memaksa model tetap dinilai pada kelas kecil, bukan hanya pada mayoritas.

**Audio**

- Tiga denting pendek saat angka berhenti.
- Nada bawah panjang saat watermark muncul.
- Hening sebelum kalimat terakhir.

---

## Scene 6. Kesalahan yang benar (3:25-4:10)

**Visual**

- `3:25` Hard cut ke kertas. Grid 3x3 angka, tanpa isian warna, hanya type di atas kertas.
- `3:28` Label baris dan kolom: `DEFENDER`, `MIDFIELDER`, `FORWARD`, mono 18 px.
- `3:32` Angka terisi: 1.165, 81, 0, 78, 1.275, 49, 1, 101, 524.
- `3:40` Sel `101` membesar 1,4 kali dan berubah merah bata. Garis merah tipis tumbuh di bawahnya. Catatan: `FORWARD DIKIRA MIDFIELDER`.
- `3:50` Dua angka berhadapan: `PRECISION 91,45` dan `RECALL 83,71`. Kata `PRECISION` tenang, `RECALL` diberi garis bawah kuningan.
- `3:58` Ledger Lamela kembali di kiri. Di kanan, dua kata besar: `PENYERANG` dan `GELANDANG`, dipisahkan ruang kosong, bukan garis.
- `4:04` Lima nilai menyala di antara dua kata: `74`, `85`, `80`, `78`, `50`.

**VO**

> Confusion matrix membuka itu. Dari 626 penyerang di data uji, 524 dikenali benar. 101 ditebak gelandang. Hanya satu ditebak bek.
>
> Recall Forward 83,71 persen, yang terendah. Tetapi precision-nya 91,45 persen, yang tertinggi.
>
> Artinya, model jarang salah menuduh orang sebagai penyerang, tetapi cukup sering melewatkan penyerang asli.
>
> Kesalahan juga terjadi arah sebaliknya. 49 gelandang ditebak penyerang. Jadi batas antara dua peran ini memang tipis dari dua sisi.
>
> Lamela masuk kelompok itu. Finishing 74, dribbling 85, short passing 80, vision 78, standing tackle 50.
>
> Profilnya berada di antara sayap dan gelandang serang. Kesalahan model bukan sekadar kelemahan algoritma. Ia menunjukkan batas peran yang memang kabur.

**Audio**

- Satu ketukan keras saat sel 101 menyala.
- Denting rendah saat precision dan recall muncul.
- Tidak ada musik selama dua detik setelah `kabur`.

---

## Scene 7. Yang dilihat model (4:10-4:45)

**Visual**

- `4:10` Lima kata disusun vertikal, kiri rata. Ukuran menurun mengikuti peringkat, bukan grafik batang.
- `SLIDINGTACKLE` 150 px, `FINISHING` 132 px, `HEADINGACCURACY` 112 px, `STANDINGTACKLE` 96 px, `VISION` 82 px.
- `4:18` Nilai importance muncul di kanan, mono 28 px: `0,0918`, `0,0840`, `0,0725`, `0,0716`, `0,0710`.
- `4:28` Empat kata pertama tetap tinta. `VISION` berubah kuningan.
- `4:34` Satu kalimat 96 px di bawah: `Bukan dua kutub. Ada peran penghubung.`

**VO**

> Lima atribut paling berpengaruh: SlidingTackle, Finishing, HeadingAccuracy, StandingTackle, dan Vision.
>
> Empat pertama jelas. Dua untuk bertahan, dua untuk menyerang.
>
> Vision yang masuk lima besar lebih menarik. Ia bukan atribut bertahan atau menyerang, melainkan kemampuan membaca permainan.
>
> Model tidak hanya menemukan dua kutub. Ia juga mengenali peran penghubung di antaranya.
>
> Penting diingat, importance bukan sebab akibat. Angka ini menunjukkan apa yang dipakai model, bukan apa yang membuat seorang pemain bagus. Itu sebabnya gelandang menjadi wilayah paling sulit dan paling menarik.

**Audio**

- Lima ketukan berbeda tinggi, satu per kata.
- Nada kuningan hangat saat Vision menyala.
- Hening 0,5 detik sebelum kalimat penutup scene.

---

## Scene 8. Penutup (4:45-5:00)

**Visual**

- `4:45` Kertas bone. Kalimat 130 px, tiga baris: `Data tidak menggantikan mata.` lalu `Ia memberi mata itu` lalu `pertanyaan yang lebih baik.` Kata `pertanyaan` memakai serif miring.
- `4:52` Tiga baris batasan muncul di bawah, mono 18 px: `LABEL = BESTPOSITION`, `SATU MUSIM, PEMAIN LAKI-LAKI`, `KIPER DIKELUARKAN`.
- `4:56` Kartu Lamela kembali, kecil di kanan: `RAPOR: PENYERANG` dan `MODEL: GELANDANG`.
- `4:58` Satu baris terakhir, 58 px: `Mungkin keduanya benar.`
- `5:00` Potong ke hitam. Tidak ada logo, tidak ada animasi penutup.

**VO**

> Jadi, bisakah 29 angka menggantikan mata pelatih? Belum.
>
> Label dalam dataset adalah penilaian penyusun data, bukan posisi yang dimainkan sepanjang musim. Data ini juga hanya satu musim dan hanya pemain laki-laki.
>
> Pengembangan berikutnya bisa memakai label multilabel atau data pelacakan pertandingan.
>
> Tetapi 90,53 persen menunjukkan sesuatu. Data tidak menggantikan mata. Ia memberi mata itu pertanyaan yang lebih baik.
>
> Termasuk pertanyaan tentang Lamela. Mungkin model tidak sepenuhnya salah.

**Audio**

- Satu akor hangat, pendek, tidak megah.
- Kertas diletakkan satu kali.
- Hitam selama 0,5 detik, lalu selesai.

---

## Total kata VO

Dihitung otomatis oleh `scripts/count_vo.py` setelah naskah ini disetujui. Target 750 sampai 810 kata.
