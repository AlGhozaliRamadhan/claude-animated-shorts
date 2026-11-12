# Typography study: good typography.mp4

Sumber: `templates/Typography lyrics music video/good typography.mp4`
Spesifikasi: 960x720, 20 fps, 18,84 detik, H.264, audio AAC.
Frame diekstrak ke `reference-frames/` (2 fps) dan `reference-frames/beat/`
(20 fps pada tiga bagian). Ini bahan privat, jangan dipublikasikan.

Cara mengulang ekstraksi:

```
python projects/fifa-posisi-5min/tools/extract_ref.py
python projects/fifa-posisi-5min/tools/measure_ref.py
```

## 1. Peta beat

| Waktu | Frame | Yang terjadi | Grammar |
|---|---|---|---|
| 0,00 | 001 | Kertas kosong | Mulai dari ketiadaan |
| 0,15 | 004 | Satu titik kuningan, lalu goresan | Objek sebelum arti |
| 0,45 | 010 | Dua bulatan dan dua garis membentuk huruf "i" serif | Type berubah jadi benda |
| 0,55-1,05 | 012-022 | "just wanna be" diketik kata per kata, blok krem menyala di belakang "just" | Mengetik mengatur tempo |
| 1,15 | 024 | Hard cut ke hitam, "i just wanna be" putih | Cut, bukan fade |
| 1,50-8,00 | 031-160 | Footage produk AirTag, latar hijau lalu hitam | Type dan gambar hidup bergantian |
| 8,50-10,40 | 170-208 | Desktop, Finder, file card | Type menjadi antarmuka |
| 10,50 | 210 | "never" raksasa miring 18 derajat, meluncur diagonal | Satu kata memenuhi frame |
| 11,00-12,40 | 220-248 | Satu kalimat bertahan, token diganti: `never(x)leavn` → `never(🏃)leave` → `we(🏃)leave` → `we(🤝)both` | **Alat utama: satu token berubah** |
| 12,60-13,40 | 252-268 | Kalimat yang sama mengecil, bubble chat masuk | Type menjadi UI |
| 13,60-16,00 | 272-320 | Dua bubble, desktop, file card, kursor | Skala berubah, layout tetap |
| 16,60-18,84 | 332-377 | Glitch hitam, selesai | Tidak dipakai |

## 2. Angka yang diukur

Diukur dari PNG 960x720 dengan `tools/measure_ref.py`, kotak piksel yang berbeda
dari warna latar, mengabaikan caption bawah.

| Frame | Isi | Lebar blok | Tinggi blok | Margin kiri/kanan | Margin atas/bawah |
|---|---|---|---|---|---|
| f_002 (0,5 s) | "just wanna be" + objek | 55,1% | 41,8% | 19,5% / 25,5% | 29,2% / 29,2% |
| f_023 (11,0 s) | "never(" raksasa di hitam | 81,0% | 15,4% | 8,6% / 10,4% | 41,9% / 42,8% |
| f_026 (12,5 s) | "we(🤝)both ↗" | 70,5% | 14,2% | 14,5% / 15,1% | 42,6% / 43,3% |
| f_027 (13,0 s) | Bubble chat kecil | 26,2% | 10,0% | 37,5% / 36,4% | 45,0% / 45,1% |
| f_028 (13,5 s) | Dua bubble + teks | 75,8% | 26,8% | 14,0% / 10,3% | 33,2% / 40,1% |

Kesimpulan yang bisa dipakai:

1. Blok teks hidup di **26 sampai 81 persen lebar**, mayoritas 55 sampai 76
   persen. Tidak pernah 100 persen kecuali footage.
2. Satu baris statement tingginya **14 sampai 15 persen** frame, sekitar 100
   sampai 110 px di 720p. Setara 150 sampai 165 px di 1080p.
3. Blok selalu **dekat tengah vertikal** (margin atas dan bawah hampir sama),
   bukan menempel atas.
4. Caption kecil ada di **91 persen tinggi frame**, ukuran sekitar 10 px di
   720p, mono, huruf kapital, warna redup.
5. Kata raksasa boleh sampai **81 persen lebar** dan dipotong tepi frame.
6. Satu baris satu ide. Tidak ada paragraf.

Palet yang diambil dari frame: kertas `#ECECE7`, tinta `#0C0C0C`, emas
`#A0700E`, merah `#B32223`, biru pesan `#0070D8`. Di project ini emas digeser
sedikit ke `#A9781C` supaya cocok dengan kertas bone.

## 3. Tata bahasa gerak yang dipakai

| Gerak | Bukti di referensi | Penerapan di `TypeTest.tsx` |
|---|---|---|
| Objek dulu, arti kemudian | Titik dan goresan sebelum huruf "i" | Titik tinta, lalu tanda tanya dari data |
| Kamera, bukan slide | Kamera menembus footage dan desktop | Satu dunia 2600x1500, kamera pull-back, pan, push-in |
| Roll kata di tempat | `never` → `we` → `both` | Track `BEK → GELANDANG → PENYERANG → GELANDANG` |
| Angka menghitung | Jarak "0,3 m" berubah | Probabilitas 0,000 → 0,855 |
| Hard cut antar dunia | Kertas ke hitam di 1,15 s | Kertas ke hitam di 9,57 s, kembali di 12,63 s |
| Underline pada token | Garis di bawah kata yang berubah | Garis tinta di bawah GELANDANG dan `tercatat` |
| Satu kata memenuhi frame | "never" 81 persen lebar | GELANDANG 140 px, 9 karakter, satu baris |
| Kontras skala ekstrem | Kata 300 px vs caption 10 px | 184 px vs 12 px mono |

## 4. Yang sengaja tidak diambil

- Footage produk dan musik iklan.
- Emoji sebagai pengganti kata.
- Glitch di akhir. Penutup kita tenang.
- Caption lagu. Kita tidak memakai subtitle.

## 5. Larangan yang lahir dari study ini

- Jangan taruh label di pojok kiri atas atau kanan atas. Referensi tidak
  melakukannya; caption-nya di tengah bawah dan sangat kecil.
- Jangan membuat blok teks selebar frame. Maksimal 68 persen, kecuali satu kata
  hero yang memang boleh dipotong tepi.
- Jangan memakai kartu, panel, border, atau bayangan. Pemisah adalah ruang.
- Jangan memakai fade sebagai gerakan utama.
- Jangan memakai bilah warna vertikal di tepi elemen.
- Jangan memakai merah untuk hiasan.
