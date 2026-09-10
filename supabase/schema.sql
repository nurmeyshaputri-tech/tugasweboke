-- =========================================================
-- PHOTOBOX RANKING SYSTEM - DATABASE SCHEMA (SUPABASE)
-- =========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Owner / Admin user profile)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'OWNER' CHECK (role IN ('OWNER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. VARIABLES TABLE (10 Variables for Questionnaire)
CREATE TABLE IF NOT EXISTS public.variables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert the 10 mandatory variables if not present
INSERT INTO public.variables (code, name, order_index) VALUES
('V01', 'Kualitas Hasil Foto', 1),
('V02', 'Harga atau Kesesuaian Harga', 2),
('V03', 'Variasi Frame atau Template', 3),
('V04', 'Kualitas Properti dan Aksesoris', 4),
('V05', 'Kemudahan Penggunaan', 5),
('V06', 'Kecepatan Proses Pengambilan Foto', 6),
('V07', 'Lokasi dan Aksesibilitas', 7),
('V08', 'Pelayanan', 8),
('V09', 'Kualitas Cetakan Foto', 9),
('V10', 'Fasilitas dan Kenyamanan Area Photo Box', 10)
ON CONFLICT (code) DO NOTHING;

-- 3. QUESTIONNAIRE ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.questionnaire_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    respondent_name TEXT DEFAULT 'Owner / Admin Entry',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. QUESTIONNAIRE SCORES TABLE (Likert 1-5 for each entry & variable)
CREATE TABLE IF NOT EXISTS public.questionnaire_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID NOT NULL REFERENCES public.questionnaire_entries(id) ON DELETE CASCADE,
    variable_id UUID NOT NULL REFERENCES public.variables(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_entry_variable UNIQUE(entry_id, variable_id)
);

-- 5. SELECTED TOP 5 VARIABLES TABLE
CREATE TABLE IF NOT EXISTS public.selected_top_variables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    variable_ids JSONB NOT NULL, -- Array of 5 variable UUIDs
    is_active BOOLEAN DEFAULT TRUE,
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PHOTOBOXES TABLE (Photo Box Candidates)
CREATE TABLE IF NOT EXISTS public.photoboxes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PHOTOBOX ASSESSMENTS TABLE (Assessment score 1-5 per photobox per TOP 5 variable)
CREATE TABLE IF NOT EXISTS public.photobox_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photobox_id UUID NOT NULL REFERENCES public.photoboxes(id) ON DELETE CASCADE,
    variable_id UUID NOT NULL REFERENCES public.variables(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_photobox_variable UNIQUE(photobox_id, variable_id)
);

-- Row Level Security (RLS) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selected_top_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photoboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photobox_assessments ENABLE ROW LEVEL SECURITY;

-- Allow public/authenticated access policies
CREATE POLICY "Allow public select variables" ON public.variables FOR SELECT USING (true);
CREATE POLICY "Allow all access to questionnaire_entries" ON public.questionnaire_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to questionnaire_scores" ON public.questionnaire_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to selected_top_variables" ON public.selected_top_variables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to photoboxes" ON public.photoboxes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to photobox_assessments" ON public.photobox_assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow user full access to own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'OWNER');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
