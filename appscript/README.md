# Petualangan Pengurangan — Versi Google Apps Script

Folder ini berisi versi **Google Apps Script (GAS)** dari game matematika
"Petualangan Pengurangan" (pengurangan 1–50 untuk siswa kelas 2 SD),
dibuat oleh **Widodo, guru SD**.

Karena Apps Script tidak mendukung React/Vite, seluruh aplikasi sudah
diubah menjadi **HTML + CSS + JavaScript murni (vanilla)** yang berjalan
di `HtmlService`, ditambah **backend `Code.gs`** untuk menyimpan skor
siswa secara otomatis ke Google Sheets.

## 📁 Struktur File

| File               | Peran      | Keterangan                                                        |
|---------------------|-----------|--------------------------------------------------------------------|
| `Code.gs`           | Backend   | Menyajikan halaman, menyimpan & mengambil skor dari Google Sheets |
| `Index.html`        | Frontend  | Kerangka HTML utama (memanggil Stylesheet & JavaScript)            |
| `Stylesheet.html`   | Frontend  | Semua CSS tema hutan/kayu/perkamen                                 |
| `JavaScript.html`   | Frontend  | Logika game, render tampilan, efek suara, komunikasi ke backend    |

## 🚀 Cara Deploy ke Google Apps Script

1. Buka **https://script.google.com/** lalu klik **Proyek Baru**.
2. Hapus isi file `Code.gs` bawaan, lalu salin-tempel isi `Code.gs` dari folder ini.
3. Klik ikon **+** di sebelah "File" → pilih **HTML** → beri nama **Index** →
   salin-tempel isi `Index.html`.
4. Ulangi langkah 3 untuk membuat file HTML **Stylesheet** dan **JavaScript**,
   masing-masing isi dengan konten `Stylesheet.html` dan `JavaScript.html`.

   > ⚠️ Nama file **harus persis**: `Index`, `Stylesheet`, `JavaScript`
   > (tanpa akhiran `.html` saat mengetik nama file di editor Apps Script).

5. Klik **Deploy** → **New deployment** (Penerapan Baru).
6. Pilih ikon gerigi ⚙️ → **Web app**.
7. Atur:
   - **Execute as**: `Me` (Saya)
   - **Who has access**: `Anyone` (Siapa saja) — agar siswa bisa mengakses tanpa login
8. Klik **Deploy**, izinkan akses (Authorize) saat diminta.
9. Salin **Web app URL** yang muncul — inilah link game untuk dibagikan ke siswa.

## 📊 Fitur Backend (Google Sheets Otomatis)

Saat game pertama kali dimainkan, sebuah Google Spreadsheet baru bernama
**"Data Game - Petualangan Pengurangan"** akan otomatis dibuat di Google
Drive akun Anda, berisi sheet **"Skor Siswa"** dengan kolom:

```
Waktu | Nama Siswa | ID Level | Nama Level | Skor | Total Soal | Bintang
```

Setiap kali siswa menyelesaikan satu level, satu baris baru otomatis
ditambahkan. Guru bisa membuka spreadsheet ini kapan saja untuk memantau
progres seluruh siswa.

Fitur backend lain:
- `getStudentProgress(nama)` — mengambil skor terbaik & level yang terbuka
  untuk siswa tersebut (dipakai agar progres tersimpan walau ganti perangkat,
  asalkan nama yang diketik sama).
- `getLeaderboard()` — menghitung papan peringkat 10 besar berdasarkan total
  skor gabungan semua level.

## 🎮 Fitur Game

- 5 level (Hutan Hijau, Sungai Ceria, Gua Misteri, Puncak Gunung, Istana Harta)
- Tiap level: 10 soal pengurangan, 3 pilihan jawaban
- Rentang bilangan bertahap dari 1–10 hingga 20–50
- Level berikutnya terbuka otomatis jika skor ≥ 6/10
- Efek suara berbeda untuk: klik tombol, jawaban benar, jawaban salah,
  dan level selesai (dibuat dengan Web Audio API, tanpa file audio eksternal)
- Animasi bintang, confetti, dan papan kayu/perkamen bertema hutan
- Progres & nama siswa tersimpan di browser (localStorage) + tersinkron ke
  Google Sheets

## ✏️ Kustomisasi

- **Ganti nama pembuat**: cari teks `Widodo guru sd` di `JavaScript.html`
  (bagian `created-by-badge`).
- **Ubah rentang soal per level**: edit array `LEVELS` di `JavaScript.html`
  (ubah `minRange` / `maxRange`).
- **Ubah syarat buka level**: cari `finalScore >= 6` di fungsi `finishLevel()`
  pada `JavaScript.html`.
- **Ganti warna tema**: edit variabel warna di `Stylesheet.html`.

## ❓ Catatan

- Karena keterbatasan Apps Script dalam membundel file gambar besar,
  karakter petualang & monyet pada versi ini digambarkan menggunakan
  **emoji** (🧑‍🌾 🐒) alih-alih gambar AI seperti pada versi React/Vite.
  Anda bisa menggantinya dengan gambar sendiri yang di-hosting di Google
  Drive (ubah menjadi link "share publicly" lalu gunakan tag `<img>`).
- Aplikasi ini murni client-side rendering (tanpa framework), sehingga
  ringan dan cepat dimuat meski di koneksi internet sekolah yang terbatas.
