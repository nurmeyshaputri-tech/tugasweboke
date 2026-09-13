-- =========================================================
-- PHOTOBOX RANKING SYSTEM - DATABASE SCHEMA (SUPABASE)
-- =========================================================
-- Cara pakai:
-- 1. Buka Supabase Dashboard -> pilih proyek Anda
-- 2. Buka "SQL Editor" -> "New query"
-- 3. Salin SELURUH isi file ini, lalu klik "Run"
--
-- CATATAN: Menjalankan ulang skema ini akan MENGHAPUS SEMUA
-- data yang ada (tabel di-drop lalu dibuat ulang).
-- Ini normal karena aplikasi memulai dengan database kosong
-- (Zero Dummy Data).
-- =========================================================

-- Hapus tabel lama (jika pernah pakai versi schema sebelumnya)
DROP TABLE IF EXISTS public.photobox_assessments CASCADE;
DROP TABLE IF EXISTS public.photoboxes CASCADE;
DROP TABLE IF EXISTS public.selected_top_variables CASCADE;
DROP TABLE IF EXISTS public.questionnaire_scores CASCADE;
DROP TABLE IF EXISTS public.questionnaire_entries CASCADE;
DROP TABLE IF EXISTS public.variables CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. VARIABLES TABLE (10 Variabel Kuesioner - tetap, di-seed)
CREATE TABLE public.variables (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.variables (id, code, name, order_index) VALUES
    ('var-v01', 'V01', 'Kualitas Hasil Foto', 1),
    ('var-v02', 'V02', 'Harga atau Kesesuaian Harga', 2),
    ('var-v03', 'V03', 'Variasi Frame atau Template', 3),
    ('var-v04', 'V04', 'Kualitas Properti dan Aksesoris', 4),
    ('var-v05', 'V05', 'Kemudahan Penggunaan', 5),
    ('var-v06', 'V06', 'Kecepatan Proses Pengambilan Foto', 6),
    ('var-v07', 'V07', 'Lokasi dan Aksesibilitas', 7),
    ('var-v08', 'V08', 'Pelayanan', 8),
    ('var-v09', 'V09', 'Kualitas Cetakan Foto', 9),
    ('var-v10', 'V10', 'Fasilitas dan Kenyamanan Area Photo Box', 10);

-- 2. QUESTIONNAIRE ENTRIES TABLE (Data pengisian kuesioner)
CREATE TABLE public.questionnaire_entries (
    id TEXT PRIMARY KEY,
    respondent_name TEXT NOT NULL DEFAULT 'Owner / Admin Entry',
    age INT,
    photobox_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. QUESTIONNAIRE SCORES TABLE (Skor Likert 1-5 per entry & variabel)
CREATE TABLE public.questionnaire_scores (
    id TEXT PRIMARY KEY,
    entry_id TEXT NOT NULL REFERENCES public.questionnaire_entries(id) ON DELETE CASCADE,
    variable_id TEXT NOT NULL REFERENCES public.variables(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_entry_variable UNIQUE (entry_id, variable_id)
);

-- 4. SELECTED TOP 5 VARIABLES TABLE (TOP 5 variabel terkonfirmasi)
CREATE TABLE public.selected_top_variables (
    id TEXT PRIMARY KEY,
    variable_ids JSONB NOT NULL, -- Array 5 ID variabel, contoh: ["var-v01", ...]
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    confirmed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. PHOTOBOXES TABLE (Kandidat Photo Box)
CREATE TABLE public.photoboxes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PHOTOBOX ASSESSMENTS TABLE (Penilaian 1-5 per photobox per TOP 5 variabel)
CREATE TABLE public.photobox_assessments (
    id TEXT PRIMARY KEY,
    photobox_id TEXT NOT NULL REFERENCES public.photoboxes(id) ON DELETE CASCADE,
    variable_id TEXT NOT NULL REFERENCES public.variables(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_photobox_variable UNIQUE (photobox_id, variable_id)
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS)
-- Dipakai bersama anon/public key, jadi policy memberi
-- akses penuh (baca + tulis) untuk aplikasi.
-- =========================================================
ALTER TABLE public.variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selected_top_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photoboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photobox_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Akses penuh variabel" ON public.variables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses penuh questionnaire_entries" ON public.questionnaire_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses penuh questionnaire_scores" ON public.questionnaire_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses penuh selected_top_variables" ON public.selected_top_variables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses penuh photoboxes" ON public.photoboxes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses penuh photobox_assessments" ON public.photobox_assessments FOR ALL USING (true) WITH CHECK (true);

-- =========================================================
-- SELESAI!
-- Lanjutkan ke pengaturan environment variables (lihat README).
-- =========================================================
