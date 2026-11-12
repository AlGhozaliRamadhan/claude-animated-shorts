# Naskah Pembicara 4: Selena Mireil Sachiko Balqis

- **Nama**: Selena Mireil Sachiko Balqis
- **NIM**: 15250717
- **Peran**: Pembicara 4 (Hasil Evaluasi Skor & Analriks Matriks Konfusi)
- **Bagian Video**: Video 2 — Scene 5 (Skor Model) & Scene 6 (Matriks Konfusi & Kasus Lamela)
- **Waktu Tampil**: Menit 1:10 – 3:05 di Video 2 (Durasi: ~1 menit 55 detik)
- **Jumlah Kata**: ~140 kata total (Scene 5: 70 kata, Scene 6: 70 kata; tempo santai ~1,4 kata/detik)

---

## Ringkasan Tugas & Pesan Kunci

Kamu adalah pembicara keempat yang memaparkan hasil evaluasi model dan analisis temuan penting. Bagian ini menyajikan angka perbandingan performa serta alasan di balik salah tebak model.

Poin-poin utama yang kamu sampaikan:
- **Perbandingan Skor**: Random Forest memimpin dengan akurasi 90,53% dan F1 macro 0,9006, diikuti KNN (89,03% / 0,8855) dan Decision Tree (85,43% / 0,8498).
- **Efisiensi Waktu**: Pelatihan KNN kilat (0,05 s) berbanding Random Forest (1,92 s), namun KNN membutuhkan kalkulasi jarak saat prediksi data baru.
- **Urgensi F1 Macro**: Menjelaskan mengapa F1 macro sangat penting saat menghadapi ketimpangan data (Forward hanya 19%).
- **Matriks Konfusi (Confusion Matrix)**: Dari 626 penyerang, 524 benar, dan 101 diprediksi sebagai gelandang.
- **Karakteristik Metrik Forward**: Recall Forward 83,71% dengan presisi 91,45%, serta 49 gelandang yang terprediksi penyerang.
- **Bedah Kasus Érik Lamela**: Mengurai mengapa kombinasi atribut Lamela (dribbling 85, passing 80, visi 78, tekel 50) membuatnya diklasifikasikan sebagai gelandang oleh model.

---

## Panduan Cue Visual & Naskah Narasi

### Bagian A: Scene 5 — Skor dan Metrik Evaluasi (1:10 – 2:05)

#### Paragraf 1 (Cue `0.0` / `1:10` — Tiga baris angka skor menghitung cepat di layar)
> Akurasi Decision Tree 85,43 persen, KNN 89,03, dan Random Forest 90,53 persen.

#### Paragraf 2 (Cue `11.2` / `1:21` — Kolom skor F1 macro muncul di bawah masing-masing baris)
> F1 macro mengikuti: 0,8498 pada Decision Tree, 0,8855 pada KNN, dan 0,9006 pada Random Forest.

#### Paragraf 3 (Cue `23.5` / `1:33` — Kolom waktu latih 0,05 s vs 1,92 s muncul di sisi kanan)
> Waktu latih KNN 0,05 detik dan Random Forest 1,92 detik, meski prediksi KNN lebih berat.

#### Paragraf 4 (Cue `33.5` / `1:43` — Watermark raksasa angka 90,53 muncul di latar belakang)
> Akurasi perlu dicermati karena merupakan rata-rata kelas yang jumlahnya timpang.

#### Paragraf 5 (Cue `40.5` / `1:50` — Teks besar: `Rata-rata menyembunyikan satu kelas`)
> F1 macro menjadi acuan utama untuk mengawasi kelas penyerang yang paling kecil.

#### Paragraf 6 (Cue `47.5` / `1:57` — Layar bertransisi ke lembaran kertas matriks)
> Sekarang kita periksa sebaran prediksinya.

---

### Bagian B: Scene 6 — Matriks Konfusi & Kasus Lamela (2:05 – 3:05)

#### Paragraf 7 (Cue `0.0` / `2:05` — Grid matriks 3x3 muncul dengan angka-angka hasil uji)
> Matriks konfusi mencatat dari 626 penyerang, 524 tepat dan 101 ditebak gelandang.

#### Paragraf 8 (Cue `8.5` / `2:13` — Sel angka 101 membesar dan berubah warna merah bata)
> Forward paling menantang dengan skor F1 0,8741.

#### Paragraf 9 (Cue `15.0` / `2:20` — Nilai PRECISION 91,45 dan RECALL 83,71 berhadapan)
> Recall Forward 83,71 persen, dan presisinya mencapai 91,45 persen.

#### Paragraf 10 (Cue `24.5` / `2:29` — Blok visual recall terbalik dengan huruf kontras)
> Model sangat selektif melabeli penyerang, sehingga sebagian penyerang terlewat.

#### Paragraf 11 (Cue `32.0` / `2:37` — Garis irisan antara gelandang dan penyerang ditampilkan)
> Sebaliknya, 49 gelandang ditebak penyerang karena karakteristik peran saling beririsan.

#### Paragraf 12 (Cue `39.5` / `2:44` — Foto Érik Lamela masuk kecil di kiri disertai deretan atributnya)
> Contohnya Lamela: dribbling 85, passing 80, visi 78, dan tekel 50.

#### Paragraf 13 (Cue `48.5` / `2:53` — Lima atribut menyala di antara kata PENYERANG dan GELANDANG)
> Atribut Lamela condong ke gelandang serang, sehingga model menempatkannya di posisi tengah.

---

## Tips Penyampaian & Intonasi

1. **Gaya Bicara**: Analitis, tenang, tidak buru-buru.
2. **Pelafalan Angka**:
   - `85,43%`: "delapan puluh lima koma empat tiga persen".
   - `89,03%`: "delapan puluh sembilan koma nol tiga persen".
   - `90,53%`: "sembilan puluh koma lima tiga persen".
   - `626`: "enam ratus dua puluh enam".
   - `524`: "lima ratus dua puluh empat".
   - `101`: "seratus satu".
3. **Handoff**: Selesai di menit 3:05 (akhir Video 2). Video 3 dibuka oleh Pembicara 5 (Rafa).
