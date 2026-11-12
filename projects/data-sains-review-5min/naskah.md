# Naskah Produksi Video 5 Menit: Review Jurnal NVIDIA LSTM-GARCH
**Kelompok Data Sains 15.3B.01** • Review Kritis atas Syach, Baidawi, & Sundari (2026) • Target Durasi: 5:00

---

## Format & Gaya Produksi Video

- **Format:** Video essay data science bergaya investigasi visual (ala Vox / Veritasium / Johnny Harris). Bukan rekaman slide presentasi biasa atau template animasi kaku, melainkan video dinamis yang menampilkan **dokumen fisik jurnal asli (PDF)**, coretan highlighter/spidol investigasi, grafik bursa riil NASDAQ (NVDA), visualisasi arsitektur deep learning kinetik, dan pembuktian matematis secara langsung di layar.
- **Visual:** Memanfaatkan potongan asli dari naskah jurnal penelitian (Halaman 1 untuk judul & abstrak, Halaman 6 untuk Tabel 4), grafik candlestick saham nyata, overlay analitis, dan transisi kamera dinamis (*macro zoom, whip pan, split screen*). Bebas dari klise template AI (tanpa neon grid biru di atas hitam pekat, tanpa kartu seragam dengan garis samping).
- **Audio & Sound Design:** Desain audio dokumenter organik: *subtle tension drone, paper rustle, marker highlight whoosh, camera shutter snap, tactile clicks, tape stop, dan low-end cinematic impacts*. Tidak menggunakan tuts piano tiruan/kaku.

---

## Ringkasan Struktur Scene (0:00 – 5:00)

| Scene | Waktu | Fokus Visual Video | Voiceover (VO) | Sound Design & SFX |
|---|---|---|---|---|
| **1. Cold Open** | 0:00–0:20 | Macro zoom dokumen asli Tabel 4, coretan spidol merah pada 9,15 | 37 kata | Paper slide, marker squeak, glitch tape-stop |
| **2. Makalah & Pertanyaan** | 0:20–0:45 | Halaman 1 jurnal, grafik NASDAQ NVDA, pertanyaan inti, peta 4 langkah | 49 kata | Camera shutter, atmospheric riser, crisp clicks |
| **3. Cara Kerja Hybrid** | 0:45–1:30 | Alur data return, kurva volatility clustering GARCH + LSTM | 83 kata | Data flow whoosh, low pulse |
| **4. Alur & Split Data** | 1:30–2:10 | Laser potong kronologis 80:20, blueprint arsitektur 72.051 parameter | 75 kata | Shutter clicks, mechanical lock-in |
| **5. Hasil di Atas Kertas** | 2:10–2:40 | Bedah Tabel 4 jurnal, klaim penurunan galat 5× lipat | 48 kata | Document zoom, subtle tension |
| **6. Mustahil Matematika** | 2:40–3:35 | Pembuktian aljabar MAE ≤ RMSE, kutipan Hodson 2022 | 104 kata | Deep sub impact, diagnostic alerts |
| **7. Enam Celah Audit** | 3:35–4:20 | B-roll forensik 6 celah (baseline gelap, single split, DOI) | 91 kata | Rapid tactile cuts, evidence stamps |
| **8. Putusan & Penutup** | 4:20–5:00 | Kesimpulan kritis, apresiasi keterbukaan, identitas tim | 65 kata | Warm cinematic swell, outro fade |

---

### Scene 1. Cold Open: Satu Angka yang Janggal (0:00–0:20)

**Visual Video:**
- `[0:00]` Pembuka sinematik: Kamera makro meluncur di atas dokumen asli PDF jurnal ilmiah (*Page 6: Evaluasi Kuantitatif*).
- `[0:04]` Goresan highlighter kuning transparan menyapu teks klaim artikel: *“model LSTM-GARCH menunjukkan kinerja yang secara signifikan lebih baik...”*
- `[0:08]` Kamera melakukan *zoom-in* ekstrem ke **Tabel 4 asli**: baris *Model LSTM-GARCH (MAE 1.72)* berhadapan dengan *Model LSTM murni (MAE 9.15 | RMSE 6.72)*.
- `[0:10]` Grafis kinetik `5× LEBIH AKURAT?` muncul di atas dokumen.
- `[0:13]` Suara *tape-stop* mendadak! Spidol merah melingkari angka `9.15` dan `6.72` secara kasar di atas dokumen jurnal.
- `[0:15]` Overlay peringatan investigasi menghantam layar:  
  **`⚠️ SECARA MATEMATIS MUSTAHIL`**  
  `Kaidah Fundamental: RMSE Wajib ≥ MAE (Hodson, 2022)`
- `[0:18]` Potong cepat (*whip cut*) ke gelap.

**SFX & Audio:**
- Gesekan kertas (*paper slide*), desing goresan spidol highlighter, *camera lens focus click*, *tape-stop glitch* di 0:13, hening total 2 detik sebelum babak berikutnya.

**Voiceover (VO):**
> Sebuah artikel ilmiah mengklaim modelnya memprediksi saham NVIDIA lima kali lebih akurat. Angkanya tampak meyakinkan. Tapi salah satu angka di tabel hasilnya mustahil secara matematika. Dan kalau satu angka itu salah, seberapa jauh kita bisa memercayai kesimpulannya?

---

### Scene 2. Makalah dan Pertanyaan Inti (0:20–0:45)

**Visual Video:**
- `[0:20]` Transisi sinematik menyapu ke **Halaman 1 asli jurnal**: masthead *Jurnal SINTA: Sistem Informasi dan Teknologi Komputasi*, nama penulis *Ferry Mulyanto Syach, Tubagus Baidawi, & Jaka Sundari (2026)*.
- `[0:24]` Spidol kuning menyoroti judul utama: *Prediksi Harga Saham NVIDIA Menggunakan Model LSTM dan GARCH*. Lencana identitas kelompok mengunci di pojok layar: `KELOMPOK 15.3B.01 • CRITICAL REVIEW`.
- `[0:28]` Dokumen jurnal bertransisi halus melayang di atas grafik bursa saham riil NASDAQ: NVDA yang menanjak liar selama booming AI (2015 s.d. 2024).
- `[0:33]` Layar memfokuskan pertanyaan investigasi utama dalam tipografi editorial yang berbobot:  
  **“Does GARCH volatility truly improve LSTM accuracy?”**  
  *(Apakah menambahkan volatilitas GARCH benar-benar membuat LSTM lebih akurat, dan apakah buktinya bisa dipercaya?)*
- `[0:40]` Peta investigasi 4 babak mengambil alih satu halaman penuh: empat kolom besar `KONSEP`, `METODE`, `HASIL`, `EVALUASI`, terhubung garis waktu yang menyala satu per satu.

**SFX & Audio:**
- *Shutter click* kamera, desing dokumen meluncur, *ambient tension riser* sinematik, bunyi *click* taktis saat 4 pilar review muncul.

**Voiceover (VO):**
> Artikel itu adalah Prediksi Harga Saham NVIDIA Menggunakan Model LSTM dan GARCH, karya Syach, Baidawi, dan Sundari, terbit 2026. Kelompok 15.3B.01 menelaahnya dengan satu pertanyaan: apakah menambahkan volatilitas GARCH benar-benar membuat LSTM lebih akurat, dan apakah buktinya bisa dipercaya? Kami periksa dalam empat langkah: konsep, metode, hasil, lalu evaluasi.

---

### Scene 3. Cara Kerja Hybrid (0:45–1:30)

**Visual Video:**
- `[0:45]` Halaman 1 dari 2, masukan model X: grafik harga harian NVDA mengalir masuk, lalu rumus $\text{LogReturn} = \ln(P_t / P_{t-1})$ mengubah tren harga menjadi kurva return yang berfluktuasi di sekitar nol.
- `[1:00]` Kurva fluktuasi menyorot fenomena *volatility clustering*: periode tenang mendadak disusul badai gejolak pasar. Halaman berganti dengan gerak geser horizontal.
- `[1:06]` Halaman 2 dari 2, keluaran model Y: dua cabang bertemu. Cabang 1 membawa estimasi GARCH(1,1), cabang 2 membawa jendela harga 60 hari terakhir.
- `[1:15]` Kedua aliran data menyatu masuk ke input multi-fitur jaringan syaraf tiruan LSTM.
- `[1:22]` Visual analogi: GARCH mengukur seberapa kencang badainya, LSTM membaca ke mana arah anginnya.

**SFX & Audio:**
- *Data flow pulse*, desing mekanis saat dua cabang data bergabung, *deep smooth whoosh*.

**Voiceover (VO):**
> Idenya begini. Harga penutupan harian NVIDIA diubah menjadi log return, yaitu persentase perubahan harian, supaya rata-ratanya lebih stabil. Tapi tingkat gejolaknya tetap naik-turun: ada masa tenang, lalu mendadak badai. Pola inilah yang disebut volatility clustering, dan model GARCH(1,1) khusus menghitungnya, satu angka gejolak untuk setiap hari. Angka itu lalu digabung dengan deret harga 60 hari terakhir sebagai masukan LSTM, jaringan saraf yang mengenali pola urutan waktu, untuk menebak harga esok hari. Singkatnya: GARCH membaca seberapa kencang badainya, LSTM membaca ke mana arah anginnya.

---

### Scene 4. Alur, Split, dan Arsitektur (1:30–2:10)

**Visual Video:**
- `[1:30]` Lima stasiun kerja berurutan: `KUMPUL DATA → RETURN → GARCH → LATIH LSTM → EVALUASI`.
- `[1:40]` Garis waktu riwayat transaksi 2015 s.d. 2024 dari Yahoo Finance, mula-mula berlabel `NVDA · RIWAYAT HARGA HARIAN`. Garis pemotong jatuh tegas di tanggal `6 Juli 2022`: label berganti menjadi 80% data latih (2015–Juli 2022) dan 20% data uji (Juli 2022–Februari 2024). Penanda: *Pemisahan kronologis tanpa pengacakan*.
- `[1:52]` Cetak biru arsitektur deep learning: LSTM 100 unit → Batch Normalization → Dropout → LSTM 50 unit → Batch Normalization → Dense 1 output.
- `[2:02]` Odometer parameter berputar cepat dan mengunci di angka `72.051 PARAMETER`. Lencana verifikasi: *Dihitung ulang cocok*.

**SFX & Audio:**
- *Relay clicks*, desing laser pemotong data, *digital ticker*, suara *lock-in* mekanis.

**Voiceover (VO):**
> Alurnya lima tahap, dari pengumpulan data sampai evaluasi galat. Datanya riwayat harian NVIDIA dari Yahoo Finance, 2015 sampai awal 2024, dipecah menurut urutan waktu tanpa diacak: 80 persen awal untuk melatih, 20 persen akhir untuk menguji. Modelnya dua lapis LSTM, 100 lalu 50 unit, dilengkapi Batch Normalization dan Dropout agar tidak terlalu hafal data latih. Kami hitung ulang, dan total 72.051 parameter yang dilaporkan memang cocok. Bagian ini terbuka dan bisa diperiksa.

---

### Scene 5. Hasil di Atas Kertas (2:10–2:40)

**Visual Video:**
- `[2:10]` Cuplikan Halaman 6 dokumen jurnal: Tabel 4 menampilkan perbandingan metrik evaluasi model.
- `[2:18]` Grafik bar perbandingan muncul: MAE Hybrid 1,72 vs LSTM Murni 9,15 (penurunan galat > 5×). RMSE Hybrid 2,26 vs Baseline 6,72.
- `[2:25]` Perbandingan galat terhadap harga saham aktual: galat 1,72 hanya setara ±3% dari harga saham NVIDIA di kisaran $60.
- `[2:32]` Kamera mendadak membeku (*sudden freeze*). Garis sorotan berpindah mengunci baris LSTM murni.
- `[2:34]` Jeda hening 2 detik memberi waktu penonton mencerna kejanggalan angka.

**SFX & Audio:**
- *Paper slide*, *data chime*, alunan *low tension drone* yang masuk perlahan di 2:30.

**Voiceover (VO):**
> Sekarang hasilnya, Tabel 4. Hybrid LSTM-GARCH mencatat MAE 1,72 dan RMSE 2,26. LSTM murni mencatat MAE 9,15 dan RMSE 6,72. Pada harga saham sekitar 60 dolar, galat hybrid hanya sekitar tiga persen. Sekilas, kemenangannya telak: MAE turun lebih dari lima kali lipat. Tapi lihat lagi baris LSTM murni.

---

### Scene 6. Mustahil Secara Matematika (2:40–3:35)

**Visual Video:**
- `[2:40]` Efek guncangan visual investigasi. Rumus aljabar fundamental terproyeksi di layar:  
  $$\mathbf{MAE \le RMSE}$$
- `[2:48]` Contoh visual sederhana: tiga sampel galat 1, 1, dan 10. Nilai MAE = 4, sedangkan RMSE $\approx$ 5,8. Animasi menunjukkan bagaimana pengkuadratan selalu menghukum galat ekstrem lebih berat.
- `[3:00]` Kaidah matematis: *RMSE selalu $\ge$ MAE, dan hanya sama jika semua galat bernilai sama persis*. Rujukan jurnal metodologi: *Hodson (2022)*.
- `[3:08]` Zoom makro ke angka Tabel 4 artikel: `MAE 9,15 > RMSE 6,72`. Stempel merah menghantam naskah: `TIDAK MUNGKIN SECARA MATEMATIS`.
- `[3:16]` Analisis skenario rasional: jika angka tertukar (MAE 6,72 dan RMSE 9,15), maka perbaikan performa sebenarnya hanya sekitar 4× lipat, bukan 5× lipat.
- `[3:25]` Baris pembanding diberi tanda tidak sahih.

**SFX & Audio:**
- *Glitch sound*, hentakan *sub-bass impact* saat stempel merah jatuh, nada peringatan data singkat.

**Voiceover (VO):**
> MAE adalah rata-rata selisih mutlak. RMSE mengkuadratkan selisih itu sebelum dirata-ratakan dan diakar, sehingga galat besar dihukum lebih berat. Contohnya tiga galat: satu, satu, dan sepuluh. MAE-nya empat, RMSE-nya hampir enam. Karena itu RMSE selalu lebih besar atau sama dengan MAE, dan baru sama kalau semua galat sama besar. Hodson menegaskan hal ini pada 2022. Tapi LSTM murni dilaporkan punya MAE 9,15 di atas RMSE 6,72. Itu mustahil. Kemungkinan paling wajar: angka MAE dan RMSE tertukar tempat. Kalau begitu pun, perbaikannya sekitar empat kali lipat, bukan lima. Angka hybrid sendiri konsisten. Yang goyah adalah pembandingnya, dan tanpa pembanding yang sahih, klaim lima kali lipat kehilangan pijakan.

---

### Scene 7. Enam Celah Metodologi (3:35–4:20)

**Visual Video:**
- `[3:35]` Papan bukti audit bergerak horizontal, enam temuan tampil satu per satu. Tiap temuan dipasangkan potongan halaman jurnal asli dengan lingkaran merah pada bagian yang disorot.
  1. `BASELINE GELAP`: Tabel 4 halaman 6, kolom LSTM murni dilingkari; konfigurasi hiperparameter pembanding tidak dijelaskan.
  2. `SINGLE SPLIT`: Paragraf metode halaman 7, kalimat pembagian 80% dan 20% dilingkari; hanya satu kali potong tanpa validasi silang deret waktu.
  3. `TANPA UJI SIGNIFIKANSI`: Kalimat "signifikan lebih baik" di halaman 6 dilingkari; tidak ada uji statistik atau nilai p (Diebold-Mariano absen).
  4. `GARCH TANPA UJI AWAL`: Tabel 2 halaman 3 dengan judul GARCH dilingkari; tidak ada uji stasioneritas dan uji efek ARCH.
  5. `SITASI MELENCENG`: Rujukan [10] di halaman 2 dilingkari pada definisi machine learning yang bersandar pada buku etika robotika.
  6. `POLA DOI TIDAK KONSISTEN`: DOI `v2i4` di halaman 1 dilingkari; terbitan resmi Vol. 3 No. 2, tetapi DOI tetap mengarah ke artikel yang sama.

**SFX & Audio:**
- Suara *evidence photo snap*, *rapid tactile shutter clicks* saat tiap berkas celah diungkapkan.

**Voiceover (VO):**
> Itu bukan satu-satunya masalah. Kami menemukan enam celah, dari yang paling berat. Pertama, konfigurasi LSTM pembanding tidak dirinci, jadi perbandingan tak bisa diulang. Kedua, data hanya dipecah sekali, tanpa validasi silang runtun waktu. Ketiga, tidak ada uji signifikansi seperti Diebold-Mariano, uji standar untuk menentukan apakah selisih akurasi dua model benar-benar nyata atau hanya kebetulan. Keempat, GARCH dipasang tanpa uji stasioneritas dan uji efek ARCH. Dua lainnya soal ketelitian ilmiah: sitasi yang melenceng, seperti definisi machine learning yang dikutip dari buku etika robotika, dan penamaan DOI yang tidak konsisten dengan volume jurnal.

---

### Scene 8. Putusan dan Penutup (4:20–5:00)

**Visual Video:**
- `[4:20]` Suasana beralih ke nada tenang dan objektif. Di sisi kiri layar, dirangkum kekuatan artikel: alur kerja lima tahap runtut, transparansi 72.051 parameter, dan keterbukaan data.
- `[4:30]` Di sisi kanan, tiga arah penelitian lanjutan terbuka: replikasi pada saham Bursa Efek Indonesia (IHSG), komparasi multi-model dengan ARIMA-GARCH, dan integrasi sentimen berita keuangan.
- `[4:38]` Tiga kesimpulan akhir tertata rapi:  
  *Gagasan konsep: kuat dan masuk akal secara teori.*  
  *Bukti empiris artikel: belum kokoh akibat cacat angka baseline.*  
  *Nilai akademis: studi kasus pembelajaran data science yang sangat berharga.*
- `[4:46]` Pesan penutup: *“Sebelum bertanya seberapa kecil galatnya, periksa dulu apakah angkanya masuk akal.”*
- `[4:51]` Matriks 8 rujukan ilmiah, identitas Kelompok 15.3B.01, dan transisi halus ke hitam (*fade to black*).

**SFX & Audio:**
- *Warm cinematic atmospheric swell*, nada tenang berwibawa, hening sempurna tepat di menit 5:00.

**Voiceover (VO):**
> Meski begitu, artikel ini punya nilai: alurnya runtut, arsitekturnya dilaporkan terbuka, dan kerangkanya layak diuji di Bursa Efek Indonesia, atau dibandingkan dengan ARIMA-GARCH dan ditambah sentimen berita. Jadi, apakah GARCH benar-benar membuat LSTM lebih akurat? Gagasannya masuk akal, tetapi artikel ini belum membuktikannya. Pelajaran untuk kita: sebelum bertanya seberapa kecil galatnya, tanya dulu apakah angkanya masuk akal. Saya mewakili kelompok 15.3B.01. Terima kasih sudah menyimak.

---

## Catatan Teknis Pelafalan

- `1,72` → *“satu koma tujuh dua”*
- `2,26` → *“dua koma dua enam”*
- `9,15` → *“sembilan koma satu lima”*
- `6,72` → *“enam koma tujuh dua”*
- `72.051` → *“tujuh puluh dua ribu lima puluh satu”*
- `LSTM` → *“L-S-T-M”*
- `GARCH` → *“Garch”* (/ɡɑːrtʃ/)
- `Diebold-Mariano` → *“Di-bold Ma-ri-a-no”*
