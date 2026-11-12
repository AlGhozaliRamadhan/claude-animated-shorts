# Naskah Pembicara 3: Fadly Salim

- **Nama**: Fadly Salim
- **NIM**: 15250559
- **Peran**: Pembicara 3 (Metodologi Tiga Model Machine Learning)
- **Bagian Video**: Video 2 — Scene 4 (Tiga Pembaca: Decision Tree, KNN, Random Forest)
- **Waktu Tampil**: Menit 0:00 – 1:10 di Video 2 (Durasi: ~70 detik)
- **Jumlah Kata**: ~95 kata (Tempo stabil & santai, ~1,4 kata/detik)

---

## Ringkasan Tugas & Pesan Kunci

Kamu membuka bagian kedua video (Video 2). Tugas utamamu adalah membedah tiga algoritma klasifikasi: Decision Tree, K-Nearest Neighbor (KNN), dan Random Forest. Ketiganya menerima 29 fitur numerik yang persis sama.

Poin penting yang disampaikan:
- **Decision Tree**: menyusun percabangan aturan dari atribut pembeda utama, dibatasi `max_depth = 12` agar terhindar dari overfitting data latih.
- **Karakteristik Data**: kontras tajam atribut antara bek dan penyerang (StandingTackle 65,8 vs 28,2; Finishing 66,9 vs 36,3).
- **KNN**: mengambil keputusan dari lima tetangga terdekat menggunakan jarak setelah seluruh fitur distandarisasi.
- **Random Forest**: menggabungkan kekuatan 200 pohon keputusan acak (ensemble) untuk memperoleh prediksi yang stabil.
- Menegaskan bahwa seluruh model dievaluasi secara adil dengan split stratified 80:20 dan `random_state = 42`.

---

## Panduan Cue Visual & Naskah Narasi

### Paragraf 1 (Cue `0.0` / `0:00` — Pita 29 angka membentang di bagian atas layar)
> Tiga model machine learning ini mengolah 29 angka yang sama dengan prinsip kerja masing-masing.

### Paragraf 2 (Cue `6.0` / `0:12` — Cabang garis Decision Tree mulai menggambar simpul pertanyaan)
> Decision Tree menyusun aturan bertingkat. Kedalaman pohon kami batasi 12 tingkat agar tidak menghafal data latih.

### Paragraf 3 (Cue `15.0` / `0:22` — Perbandingan angka rata-rata StandingTackle dan Finishing di layar)
> Bek dan penyerang terpisah tegas: tekel bek 65,8 berbanding 28,2, sedangkan finishing penyerang mencapai 66,9.

### Paragraf 4 (Cue `26.0` / `0:30` — Scatter plot 2D KNN memadat, satu titik dikelilingi 5 tetangga terdekat)
> KNN mengambil keputusan dari lima tetangga paling mirip di sebaran data terstandarisasi.

### Paragraf 5 (Cue `35.0` / `0:42` — Label standardisasi fitur muncul di layar)
> Semua fitur distandarisasi agar perhitungan jarak berjalan seimbang.

### Paragraf 6 (Cue `44.0` / `0:46` — 200 garis tally Random Forest berkumpul dan mengelompok)
> Random Forest menggabungkan 200 pohon keputusan acak agar hasil prediksi lebih stabil.

### Paragraf 7 (Cue `52.5` / `0:56` — Kolom kunci jawaban ditutup bar merah bata, split 80:20 ditampilkan)
> Pembagian data 80 banding 20 dan seed 42 berlaku sama untuk ketiganya.

### Paragraf 8 (Cue `63.0` / `1:04` — Garis pemisah bergerak rapi menjelang pergantian shot skor)
> Mari kita lihat hasil evaluasinya.

---

## Tips Penyampaian & Intonasi

1. **Gaya Bicara**: Tenang, percaya diri, dan berbobot. Berikan jeda nafas wajar di tiap pergantian kalimat.
2. **Pelafalan Angka**:
   - `12`: "dua belas".
   - `65,8`: "enam puluh lima koma delapan".
   - `28,2`: "dua puluh delapan koma dua".
   - `66,9`: "enam puluh enam koma sembilan".
   - `200`: "dua ratus".
   - `80:20`: "delapan puluh banding dua puluh".
   - `42`: "empat puluh dua".
3. **Handoff**: Selesai di menit 1:10, Pembicara 4 (Selena) langsung menyambung dengan tabel skor.
