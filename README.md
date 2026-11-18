# AI Photo Studio (versi pameran)

Pengunjung memilih **aksesoris AR real-time** (kacamata, earpiece, mahkota) → memilih **tema dunia AI** → ambil foto →
AI mengubahnya → scan **QR code** untuk menyimpan hasil di HP.

Semua layanan memakai paket gratis: **Cloudflare Workers AI** (pembuat gambar), **Supabase** (penyimpanan foto + hitungan tema populer),
dan **MediaPipe** (pelacak wajah, berjalan di browser).

## Struktur (mana yang diubah untuk apa)

| Ingin mengubah… | Buka file |
|---|---|
| Menambah / mengubah **tema** & prompt-nya (13 tema bawaan) | `src/config/themes.ts` |
| Menambah / mengubah **aksesoris** (13 bawaan: nama, ikon, prompt) | `src/config/accessories.ts` |
| **Menggambar** aksesoris baru di wajah | `src/ar/drawAccessories.ts` |
| Mengaktifkan/mematikan **prompt kustom** | `ALLOW_CUSTOM_PROMPTS` di `src/config/constants.ts` |
| **Daftar kata terlarang** & batas panjang teks kustom | `src/config/safety.ts` **dan** `worker/index.js` (samakan keduanya) |
| Ukuran hasil, teks loading, aturan persetujuan, mode demo | `src/config/constants.ts` |
| Teks persetujuan privasi | `src/components/ConsentModal.tsx` |
| Model AI atau cara memanggilnya | `src/services/ai.ts` dan `worker/index.js` |
| Penyimpanan foto / QR | `src/services/storage.ts`, `src/components/ResultModal.tsx` |
| Tampilan (kamera, panel, modal) | `src/components/*.tsx` |
| Logika alur (ambil foto → AI → QR) | `src/App.tsx` |
| 8 gaya dari versi lama (arsip, tidak dipakai) | `extras/styles-8-preset.ts` |

### Menambah aksesoris baru
1. Di `src/ar/drawAccessories.ts`, tulis fungsi baru meniru `drawGlasses` (gambar dengan canvas; `g.eyeDistance` = skala, `g.angle` = kemiringan kepala).
2. Di `src/config/accessories.ts`, tambahkan satu objek (id, name, icon Font Awesome, `promptHint`, `draw`).

`promptHint` penting: kalimat itu memberi tahu AI agar aksesoris tetap muncul di hasil akhir.

## Prompt kustom (tema & aksesoris buatan pengunjung)
- **Buat Tema Sendiri:** kartu di panel tema. Pengunjung menulis ide (maks. 140 karakter), contoh *"astronot di bulan, gaya lukisan minyak"*.
  Bahasa Indonesia bisa dipakai; bahasa Inggris biasanya memberi hasil paling akurat.
- **Tambahan dari AI:** kolom di panel aksesoris (maks. 80 karakter), contoh *"topi koboi dan syal merah"*.
  Teks ini **tidak tampil di kamera** (aksesoris real-time hanya yang digambar di kode), tetapi AI menambahkannya ke hasil akhir.
  Bisa dipadukan dengan aksesoris AR pilihan.
- **Keamanan (penting untuk acara sekolah):** semua teks kustom otomatis ditambah instruksi "ramah untuk semua usia", lalu dicek
  terhadap daftar kata terlarang di **dua tempat**: aplikasi (pesan error cepat) dan Worker (penegakan sebenarnya, tidak bisa dilewati lewat browser).
  Daftar ini hanya penyaring dasar. Tetap sebaiknya ada panitia yang mengawasi kios. Matikan seluruh fitur dengan `ALLOW_CUSTOM_PROMPTS = false`.
- **Setiap kali mengubah `worker/index.js` (termasuk daftar kata), tempel ulang ke editor Worker dan klik Deploy.**

## Pemasangan (sekali saja)

**Prasyarat:** Node.js versi 20 atau lebih baru (cek: `node -v`).

### 1. Supabase
1. Buat akun & project baru di supabase.com (paket Free).
2. **SQL Editor → New query**, tempel isi `supabase/setup.sql`, klik **Run**.
3. **Project Settings → API**, salin **Project URL** dan **anon / publishable key**.

### 2. Cloudflare Worker
Jika Worker produksi dari versi sebelumnya sudah terpasang, **tidak perlu diubah**.
Jika belum: Worker Anda → **Edit code** → tempel `worker/index.js` → **Deploy**. Pastikan binding **Workers AI** bernama `AI` ada
(Settings → Bindings). Opsional: variabel `EVENT_KEY` (harus sama dengan `VITE_EVENT_KEY` di `.env`).

### 3. Aplikasi
```bash
cp .env.example .env      # lalu isi nilainya
npm install
npm run dev
```
Buka alamat yang muncul (biasanya http://localhost:5173) dan klik **Aktifkan Kamera**.

## Hari acara
```bash
npm run build
npm run preview
```
- Jalankan dari laptop sendiri lewat `localhost` (kamera hanya diizinkan di localhost/https).
- **Buka aplikasi sekali sebelum acara** dengan internet menyala. Pelacak wajah mengunduh model (±10 MB) dari CDN pada pemakaian pertama,
  lalu disimpan di cache browser.
- Jangan menaruh aplikasi ini di hosting publik tanpa mengamankan Worker, karena isi `.env` ikut terbawa ke browser.

## Cara kerja yang perlu diketahui
- **Aksesoris ikut ke foto.** Saat tombol ambil foto ditekan, bingkai video dan aksesoris digabung, lalu dikirim ke AI dengan instruksi agar aksesoris dipertahankan.
  AI menggambar ulang aksesoris itu dalam gaya tema, jadi bentuknya bisa sedikit berbeda dari pratinjau.
- **Foto yang diunggah manual (ikon upload) tidak memakai aksesoris**, karena pelacakan wajah hanya berjalan pada kamera langsung.
- **Persetujuan tiap pengunjung.** Dengan `ASK_CONSENT_EVERY_PHOTO = true`, kotak persetujuan muncul sebelum foto dikirim,
  dan diminta lagi untuk pengunjung berikutnya. Foto baru dikirim ke layanan AI setelah "Setuju".
- **Label "Populer"** muncul pada tema yang paling sering dipilih semua pengunjung (butuh Supabase).
- **Mode demo** (`VITE_DEMO_MODE=true`): tanpa AI dan tanpa kuota, hanya efek warna. Untuk menguji tampilan.

## Batas gratis
- **Cloudflare:** 10.000 Neuron/hari, reset pukul **07.00 WIB**. Dengan `OUTPUT_SIZE = 512`, hasil uji ±55 Neuron per foto (±180 foto/hari).
  Jika habis, aplikasi menampilkan pesan kuota habis. Tidak ada tagihan otomatis di paket Free.
- **Supabase:** penyimpanan 1 GB, bandwidth 5 GB/bulan. Project Free dijeda jika tidak dipakai 7 hari — buka dashboard-nya beberapa hari sebelum acara.

## Setelah acara (penting: banyak peserta masih di bawah umur)
1. Supabase → **Storage → photos** → hapus semua file (atau hapus bucket-nya).
2. Supabase → **Table Editor → style_picks** → kosongkan tabel jika tidak ingin menyimpan data tren.

## Jika ada masalah
- *Status "Tracker Error"* → pelacak wajah gagal dimuat (cek internet; pastikan `index.html` masih memuat skrip MediaPipe).
- *Status "Searching" terus* → wajah belum terdeteksi; perbaiki cahaya, hadap kamera. Aksesoris hanya muncul saat status "Locked".
- *"VITE_WORKER_URL belum diisi"* → file `.env` belum dibuat atau server belum di-restart setelah mengedit `.env`.
- *Kuota AI habis* → tunggu reset 07.00 WIB, atau turunkan `OUTPUT_SIZE`.
- *QR gagal dibuat* → cek isian Supabase di `.env` dan pastikan `setup.sql` sudah dijalankan; tombol "Coba Buat QR Lagi" mengulang unggahan.
