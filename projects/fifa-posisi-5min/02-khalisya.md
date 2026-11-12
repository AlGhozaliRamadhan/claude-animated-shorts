# Naskah Pembicara 2: Khalisya Ramadhani Putri Witama

- **Nama**: Khalisya Ramadhani Putri Witama
- **NIM**: 15250823
- **Peran**: Pembicara 2 (Eksplorasi Fitur & Pembersihan Data)
- **Bagian Video**: Video 1 — Scene 2 (Fitur & Kolom) & Scene 3 (Pembersihan Data)
- **Waktu Tampil**: Menit 1:04 – 3:06 (Durasi: ~2 menit 2 detik)
- **Jumlah Kata**: ~150 kata total (Tempo santai & tenang, ~1,4 kata/detik)

---

## Ringkasan Tugas & Pesan Kunci

Kamu adalah pembicara kedua yang langsung melanjutkan setelah Al Ghozali selesai. Bagianmu membahas perjalanan data: dari dataset mentah Kaggle FIFA 23 (18.539 baris dan 90 kolom), penyaringan 29 atribut kemampuan teknis, pemilihan label `BestPosition`, hingga alasan mengapa kolom agregat (`Overall`, `Growth`) dan kolom pembocor target (`STRating` sampai `GKRating`) wajib dibuang.

Kemudian di Scene 3, kamu menjelaskan proses pembersihan: membuang 119 baris duplikat, memisahkan 2.053 kiper (menghasilkan 16.367 pemain lapangan), sebaran tiga kelas posisi yang tidak seimbang (Forward hanya 19%), dan stratified split 80:20 (13.093 data latih dan 3.274 data uji) yang menutup Video 1.

---

## Panduan Cue Visual & Naskah Narasi

### Bagian A: Scene 2 — Fitur dan Kolom Dataset (1:04 – 2:07)

#### Paragraf 1 (Cue `0.0` / `1:04` — Dinding 90 kolom mono rapat muncul di layar)
> Kita masuk ke data. Dataset Kaggle ini memuat 18.539 pemain dengan 90 kolom informasi.

#### Paragraf 2 (Cue `11.5` / `1:15` — 29 kolom menyala, kolom sisa meredup)
> Dari 90 kolom, kami mengambil 29 atribut kemampuan teknis. Kolom nama dan klub kami lepas.

#### Paragraf 3 (Cue `22.3` / `1:26` — Kolom `BestPosition` ditarik keluar dan membesar 120 px)
> Labelnya BestPosition, posisi utama pemain agar targetnya tunggal dan konsisten.

#### Paragraf 4 (Cue `30.0` / `1:34` — Teks model memproses nilai numerik)
> Model memprediksi label posisi murni dari nilai-nilai atribut numerik.

#### Paragraf 5 (Cue `36.0` / `1:40` — `RAPOR: PENYERANG` dan `MODEL: GELANDANG` berhadapan)
> Di sini rapor menuliskan penyerang, sedangkan model memprediksi gelandang.

#### Paragraf 6 (Cue `42.6` / `1:46` — Kolom `Overall`, `Potential`, `Growth` dicoret garis tipis)
> Kolom Overall, Potential, dan Growth kami saring karena hanya menilai kualitas umum.

#### Paragraf 7 (Cue `50.5` / `1:54` — Blok `STRating` hingga `GKRating` ditutup bar merah: `KUNCI JAWABAN`)
> STRating hingga GKRating juga dibuang karena memuat bocoran jawaban ke model.

#### Paragraf 8 (Cue `57.8` / `2:01` — Dinding kolom memudar, layar bersih menjelang cut)
> Berikutnya adalah pembersihan data.

---

### Bagian B: Scene 3 — Pembersihan & Split Data (2:07 – 3:06)

#### Paragraf 9 (Cue `0.0` / `2:07` — Angka besar berganti: `18.539` → `18.420` → `16.367`)
> Dari 18.539 baris awal, 119 duplikat dihapus dan 2.053 kiper dipisahkan, menyisakan 16.367 pemain lapangan.

#### Paragraf 10 (Cue `15.5` / `2:22` — Kiper meluncur keluar frame)
> Kiper dipisahkan karena keahliannya sangat spesifik dan bisa membiaskan akurasi.

#### Paragraf 11 (Cue `23.2` / `2:30` — Grafik batang 100%: Defender, Midfielder, Forward)
> Sebaran kelas bersih terdiri dari Defender 38,06 persen, Midfielder 42,81, dan Forward 19,12 persen.

#### Paragraf 12 (Cue `36.8` / `2:43` — Tipografi besar: `1 DARI 5` di atas garis)
> Porsi penyerang paling sedikit, hanya sekitar satu dari lima pemain.

#### Paragraf 13 (Cue `43.8` / `2:50` — Garis horizontal membelah 80:20: `13.093 LATIH`, `3.274 UJI`)
> Data dibagi dengan stratified split 80 banding 20, menghasilkan 13.093 data latih dan 3.274 data uji.

---

## Tips Penyampaian & Intonasi

1. **Gaya Bicara**: Santai, runtut, dan jelas. Tidak perlu terburu-buru.
2. **Pelafalan Angka**:
   - `18.539`: "delapan belas ribu lima ratus tiga puluh sembilan".
   - `16.367`: "enam belas ribu tiga ratus enam puluh tujuh".
   - `38,06%`: "tiga puluh delapan koma nol enam persen".
   - `42,81%`: "empat puluh dua koma delapan satu persen".
   - `19,12%`: "sembilan belas koma satu dua persen".
3. **Handoff**: Selesai di menit 3:06 (akhir Video 1). Pembicara 3 (Fadly) akan menyambung Video 2.
