# PhotoBox Ranking System

Aplikasi web full-stack terpadu untuk pengisian kuesioner, analisis preferensi variabel, seleksi TOP 5, penilaian assessment, dan perangkingan **Photo Box Terbaik** berbasis metode **Weighted Average**.

Aplikasi ini dibangun khusus tanpa data fiktif (Zero Dummy Data). Database akan dimulai dalam keadaan **kosong** dan seluruh visualisasi chart, analisis, serta ranking dihitung secara real-time dari input nyata Owner/Admin melalui website.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router, React 18, TypeScript)
- **Styling**: Tailwind CSS (Modern Theme Purple `#7C3AED`, Pink `#EC4899`, Blue `#2563EB`)
- **Database & Auth**: Supabase (PostgreSQL & Supabase Auth)
- **Visualisasi Chart**: Recharts (Bar Chart & Radar Chart)
- **Deployment Platform**: Vercel

---

## 🚀 Fitur Utama & Alur Aplikasi

1. **Autentikasi Owner (`/login`)**: Proteksi halaman khusus peran Owner/Admin.
2. **Dashboard (`/dashboard`)**: Ringkasan real-time status kuesioner, analisis, TOP 5, kandidat Photo Box, dan perangkingan.
3. **Kuesioner Likert 1–5 (`/questionnaire`)**: Pengisian langsung 10 variabel kuesioner (tanpa Google Form).
4. **Data Kuesioner (`/questionnaire-data`)**: Kelola entri kuesioner (lihat detail, edit, hapus).
5. **Analisis Variabel (`/analysis`)**: Perhitungan rata-rata skor Likert & visualisasi Bar Chart perbandingan 10 variabel.
6. **TOP 5 Variabel (`/top-variables`)**: Penentuan otomatis & konfirmasi 5 variabel prioritas tertinggi.
7. **Kandidat Photo Box (`/photoboxes`)**: Kelola kandidat Photo Box (Nama, Lokasi, Harga, Deskripsi, Catatan).
8. **Assessment Photo Box (`/assessment`)**: Penilaian kandidat 1–5 untuk TOP 5 variabel terkonfirmasi.
9. **Halaman Perangkingan (`/ranking`)**:
   - Perhitungan Weighted Average ($Score = \sum (Assessment \times Weight)$)
   - Hero Card Rekomendasi Utama #1 (Status `Recommended` vs `Alternative`)
   - Bar Chart & Radar Chart
   - Laporan narasi rekomendasi otomatis dinamis (Mathematical Drivers)
10. **Pengaturan System (`/settings`)**: Detail akun, status Supabase, dan opsi reset database kosong.

---

## ⚙️ Panduan Installation & Local Setup

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Database Supabase

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Buka **SQL Editor** pada dashboard Supabase Anda.
3. Salin seluruh isi berkas `supabase/schema.sql` pada proyek ini dan jalankan (**Run**) di SQL Editor.

### 3. Atur Environment Variables

Buat berkas `.env.local` di root proyek:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 4. Menjalankan Aplikasi Secara Lokal

```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 🌐 Panduan Deployment ke Vercel

1. Push repository proyek ini ke GitHub / GitLab.
2. Buka [Vercel Dashboard](https://vercel.com) dan klik **Add New Project**.
3. Hubungkan repository GitHub Anda.
4. Pada menu **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klik **Deploy**.
