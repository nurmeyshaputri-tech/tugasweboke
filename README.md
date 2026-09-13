# PhotoBox Ranking System

Aplikasi web full-stack untuk pengisian kuesioner, analisis preferensi variabel, seleksi TOP 5, penilaian assessment, dan perangkingan **Photo Box Terbaik di Samarinda** berbasis metode **Weighted Average**.

Aplikasi dimulai dengan database **kosong (Zero Dummy Data)** — seluruh visualisasi chart, analisis, dan ranking dihitung secara real-time dari input nyata melalui website.

---

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router, React 18, TypeScript) + API Routes
- **Styling**: Tailwind CSS (Modern Theme Purple `#7C3AED`, Pink `#EC4899`, Blue `#2563EB`)
- **Database**: Supabase (PostgreSQL) — data tersimpan permanen di cloud
- **Visualisasi Chart**: Recharts (Bar Chart & Radar Chart)
- **Deployment Platform**: Vercel

---

## 🚀 Fitur Utama & Alur Aplikasi

1. **Autentikasi Owner (`/login`)**: Proteksi halaman khusus peran Owner/Admin (session lokal di browser).
2. **Dashboard (`/dashboard`)**: Ringkasan real-time status kuesioner, analisis, TOP 5, kandidat Photo Box, dan perangkingan.
3. **Kuesioner Likert 1–5 (`/questionnaire`)**: Pengisian 10 variabel kuesioner oleh Owner/Admin.
4. **Data Kuesioner (`/questionnaire-data`)**: Kelola entri kuesioner (lihat detail, hapus).
5. **Analisis Variabel (`/analysis`)**: Perhitungan rata-rata skor Likert & visualisasi Bar Chart perbandingan 10 variabel.
6. **TOP 5 Variabel (`/top-variables`)**: Penentuan otomatis & konfirmasi 5 variabel prioritas tertinggi.
7. **Kandidat Photo Box (`/photoboxes`)**: Kelola kandidat Photo Box (Nama, Lokasi, Harga, Deskripsi, Catatan).
8. **Assessment Photo Box (`/assessment`)**: Penilaian kandidat 1–5 untuk TOP 5 variabel terkonfirmasi.
9. **Halaman Perangkingan (`/ranking`)**:
   - Perhitungan Weighted Average ($Score = \sum (Assessment \times Weight)$)
   - Hero Card Rekomendasi Utama #1 (Status `Recommended` vs `Alternative`)
   - Bar Chart & Radar Chart
   - Laporan narasi rekomendasi otomatis dinamis (Mathematical Drivers)
10. **Pengaturan System (`/settings`)**: Detail akun dan opsi reset database kosong.
11. **Kuesioner Publik (`/survey`)**: Halaman pengisian kuesioner untuk responden (tanpa login).

---

## ⚙️ Installation & Local Setup

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Buat Database di Supabase

1. Buat akun gratis di [Supabase](https://supabase.com) lalu buat **proyek baru** (region bebas, misal *Asia Southeast 1 / Singapore* agar cepat dari Indonesia).
2. Buka **SQL Editor** di dashboard Supabase → **New query**.
3. Salin seluruh isi berkas `supabase/schema.sql` dari proyek ini, tempel, lalu klik **Run**.
   - ⚠️ Menjalankan ulang skema akan menghapus semua data (normal, karena aplikasi dimulai dari database kosong).

### 3. Ambil URL & API Key Proyek Supabase

1. Di dashboard proyek Supabase, buka **Project Settings** → **API**.
2. Salin:
   - **Project URL** (contoh: `https://abcd1234.supabase.co`)
   - **anon / public key** (string panjang, aman dipakai di browser)

### 4. Buat File Environment Variables

Buat berkas `.env.local` di root proyek:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT-ANDADA.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ANON-KEY-ANDADA
```

> File `.env.local` tidak ikut ter-commit (sudah ada di `.gitignore`), jadi aman.

### 5. Menjalankan Aplikasi Secara Lokal

```bash
npm run dev
```

Buka browser di `http://localhost:3000`.

- Login Owner: gunakan email & password apa pun (misal `owner@photobox.ai` / `password123`) → masuk ke Dashboard.
- Responden mengisi kuesioner publik di halaman `/survey` tanpa perlu login.

---

## 🌐 Deployment ke Vercel (Langkah demi Langkah)

1. **Pastikan repository sudah ter-push ke GitHub** (proyek ini sudah ada di `nurmeyshaputri-tech/tugasweboke`).
2. Buka [Vercel](https://vercel.com) → **Add New Project** → hubungkan repository GitHub ini.
3. Pada bagian **Environment Variables**, tambahkan **dua** variable:
   - `NEXT_PUBLIC_SUPABASE_URL` → isi Project URL Supabase Anda
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → isi anon/public key Supabase Anda
4. Klik **Deploy**. Tunggu beberapa menit sampai build selesai.
5. Website siap! Buka URL Vercel Anda:
   - Data kuesioner, analisis, TOP 5, kandidat, assessment, dan ranking tersimpan di Supabase dan **tidak hilang** meskipun Vercel me-restart server.
   - Jika ingin mengubah data / mereset database kosong: gunakan tombol reset di halaman `/settings` (setelah login), atau jalankan ulang `supabase/schema.sql` di SQL Editor.

> 💡 Setelah mengubah kode di GitHub dan push, Vercel akan otomatis build ulang & update website.

---

## 📁 Struktur Proyek

```
app/
  (dashboard)/     # Halaman khusus Owner/Admin (dashboard, analysis, dll.)
  api/             # API Routes backend (survey, ranking, assessment, dll.)
  login/           # Halaman login Owner
  survey/          # Kuesioner publik untuk responden
src/
  components/      # Komponen UI reusable
  lib/
    db.ts          # Data layer Supabase (semua operasi database)
    storage.ts     # Session login lokal (browser)
    constants.ts   # 10 variabel kuesioner & opsi Likert
    rankingEngine.ts # Perhitungan Weighted Average
  types/           # Tipe TypeScript
supabase/
  schema.sql       # Skema database (jalankan di SQL Editor Supabase)
```
