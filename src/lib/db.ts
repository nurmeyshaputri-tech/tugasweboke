import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MANDATORY_VARIABLES } from './constants';
import {
  Variable,
  QuestionnaireEntry,
  QuestionnaireScore,
  SelectedTopVariables,
  PhotoboxCandidate,
  PhotoboxAssessment,
} from '@/types/database';

// ============================================================
// DATABASE SUPABASE (PostgreSQL)
// Semua data aplikasi disimpan di Supabase agar persisten
// saat aplikasi di-deploy ke Vercel (tanpa file lokal).
//
// Environment variables (isi di .env.local / Vercel):
//   NEXT_PUBLIC_SUPABASE_URL      -> Project URL di Supabase
//   NEXT_PUBLIC_SUPABASE_ANON_KEY -> anon/public key di Supabase
//
// Skema tabel: supabase/schema.sql (jalankan di SQL Editor)
// ============================================================

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !key ||
    url.includes('placeholder') ||
    url.includes('your-supabase') ||
    key.includes('placeholder') ||
    key === 'your-supabase-anon-key-here'
  ) {
    throw new Error(
      'Supabase belum dikonfigurasi. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah diisi, dan skema database (supabase/schema.sql) sudah dijalankan.'
    );
  }

  if (!supabase) {
    supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabase;
}

// ==================== VARIABLES (10 Variabel Tetap) ====================

export async function dbGetVariables(): Promise<Variable[]> {
  const sb = getSupabaseClient();

  const { data, error } = await sb
    .from('variables')
    .select('id, code, name, order_index')
    .order('order_index', { ascending: true });

  if (error) throw new Error(`Gagal membaca tabel variables: ${error.message}`);

  // Auto-seed: jika tabel variables kosong (misal schema belum dijalankan
  // sepenuhnya), isi 10 variabel standar secara otomatis.
  if (!data || data.length === 0) {
    const rows = MANDATORY_VARIABLES.map((v) => ({
      id: `var-${v.code.toLowerCase()}`,
      code: v.code,
      name: v.name,
      description: `Variabel ${v.code}: ${v.name}`,
      order_index: v.order_index,
    }));
    const { error: seedError } = await sb.from('variables').upsert(rows, {
      onConflict: 'id',
    });
    if (seedError) {
      throw new Error(
        `Tabel variables kosong dan auto-seed gagal: ${seedError.message}. Jalankan supabase/schema.sql di SQL Editor Supabase.`
      );
    }
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      order_index: r.order_index,
    }));
  }

  return data.map((r) => ({
    id: String(r.id),
    code: String(r.code),
    name: String(r.name),
    order_index: Number(r.order_index),
  }));
}

// ==================== QUESTIONNAIRE ENTRIES ====================

export async function dbGetQuestionnaireEntries(): Promise<QuestionnaireEntry[]> {
  const sb = getSupabaseClient();

  const { data, error } = await sb
    .from('questionnaire_entries')
    .select('id, respondent_name, age, photobox_name, notes, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Gagal membaca tabel questionnaire_entries: ${error.message}`);

  return (data || []).map((r) => ({
    id: String(r.id),
    respondent_name: r.respondent_name ? String(r.respondent_name) : undefined,
    age: r.age !== null && r.age !== undefined ? Number(r.age) : undefined,
    photobox_name: r.photobox_name ? String(r.photobox_name) : undefined,
    notes: r.notes ? String(r.notes) : undefined,
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function dbGetQuestionnaireScores(): Promise<QuestionnaireScore[]> {
  const sb = getSupabaseClient();

  const { data, error } = await sb
    .from('questionnaire_scores')
    .select('id, entry_id, variable_id, score, created_at');

  if (error) throw new Error(`Gagal membaca tabel questionnaire_scores: ${error.message}`);

  return (data || []).map((r) => ({
    id: String(r.id),
    entry_id: String(r.entry_id),
    variable_id: String(r.variable_id),
    score: Number(r.score),
    created_at: String(r.created_at),
  }));
}

export async function dbSaveQuestionnaireEntry(
  respondentName: string,
  scoresMap: Record<string, number>,
  age?: number,
  photoboxName?: string,
  notes?: string
): Promise<QuestionnaireEntry> {
  const sb = getSupabaseClient();

  const entryId = `entry-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const now = new Date().toISOString();

  const { error: entryError } = await sb.from('questionnaire_entries').insert({
    id: entryId,
    respondent_name: respondentName || 'Responden Publik',
    age: age || null,
    photobox_name: photoboxName || null,
    notes: notes || null,
    created_at: now,
    updated_at: now,
  });
  if (entryError) throw new Error(`Gagal menyimpan entry kuesioner: ${entryError.message}`);

  const scoreRows = Object.entries(scoresMap).map(([varId, scoreVal]) => ({
    id: `score-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    entry_id: entryId,
    variable_id: varId,
    score: scoreVal,
    created_at: now,
  }));

  if (scoreRows.length > 0) {
    const { error: scoreError } = await sb
      .from('questionnaire_scores')
      .insert(scoreRows);
    if (scoreError) throw new Error(`Gagal menyimpan skor kuesioner: ${scoreError.message}`);
  }

  return {
    id: entryId,
    respondent_name: respondentName,
    age,
    photobox_name: photoboxName,
    notes,
    created_at: now,
    updated_at: now,
  };
}

export async function dbDeleteQuestionnaireEntry(entryId: string): Promise<void> {
  const sb = getSupabaseClient();

  // Skor dihapus dulu (FK cascade juga membackup ini)
  const { error: scoreError } = await sb
    .from('questionnaire_scores')
    .delete()
    .eq('entry_id', entryId);
  if (scoreError) throw new Error(`Gagal menghapus skor entry: ${scoreError.message}`);

  const { error } = await sb.from('questionnaire_entries').delete().eq('id', entryId);
  if (error) throw new Error(`Gagal menghapus entry kuesioner: ${error.message}`);
}

// ==================== SELECTED TOP 5 VARIABLES ====================

export async function dbGetSelectedTopVariables(): Promise<SelectedTopVariables | null> {
  const sb = getSupabaseClient();

  const { data, error } = await sb
    .from('selected_top_variables')
    .select('id, variable_ids, is_active, confirmed_at')
    .order('confirmed_at', { ascending: false })
    .limit(1);

  if (error) throw new Error(`Gagal membaca tabel selected_top_variables: ${error.message}`);
  if (!data || data.length === 0) return null;

  const row = data[0];
  const rawIds = row.variable_ids;
  const variableIds = Array.isArray(rawIds)
    ? rawIds.map((v) => String(v))
    : typeof rawIds === 'string'
      ? JSON.parse(rawIds)
      : [];

  return {
    id: String(row.id),
    variable_ids: variableIds,
    is_active: Boolean(row.is_active),
    confirmed_at: String(row.confirmed_at),
  };
}

export async function dbSaveSelectedTopVariables(variableIds: string[]): Promise<SelectedTopVariables> {
  const sb = getSupabaseClient();

  const id = `top5-${Date.now()}`;
  const now = new Date().toISOString();

  const { error } = await sb.from('selected_top_variables').insert({
    id,
    variable_ids: variableIds,
    is_active: true,
    confirmed_at: now,
  });
  if (error) throw new Error(`Gagal menyimpan TOP 5 variabel: ${error.message}`);

  return {
    id,
    variable_ids: variableIds,
    is_active: true,
    confirmed_at: now,
  };
}

// ==================== PHOTOBOX CANDIDATES ====================

export async function dbGetPhotoboxCandidates(): Promise<PhotoboxCandidate[]> {
  const sb = getSupabaseClient();

  const { data, error } = await sb
    .from('photoboxes')
    .select('id, name, location, price, description, notes, created_at, updated_at')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Gagal membaca tabel photoboxes: ${error.message}`);

  return (data || []).map((r) => ({
    id: String(r.id),
    name: String(r.name),
    location: String(r.location),
    price: Number(r.price),
    description: r.description ? String(r.description) : undefined,
    notes: r.notes ? String(r.notes) : undefined,
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function dbSavePhotoboxCandidate(candidate: {
  id?: string;
  name: string;
  location: string;
  price: number;
  description?: string;
  notes?: string;
}): Promise<PhotoboxCandidate> {
  const sb = getSupabaseClient();
  const now = new Date().toISOString();

  if (candidate.id) {
    const { error } = await sb
      .from('photoboxes')
      .update({
        name: candidate.name,
        location: candidate.location,
        price: candidate.price,
        description: candidate.description || null,
        notes: candidate.notes || null,
        updated_at: now,
      })
      .eq('id', candidate.id);
    if (error) throw new Error(`Gagal memperbarui kandidat Photo Box: ${error.message}`);

    return {
      id: candidate.id,
      name: candidate.name,
      location: candidate.location,
      price: candidate.price,
      description: candidate.description,
      notes: candidate.notes,
      created_at: now,
      updated_at: now,
    };
  }

  const newId = `box-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

  const { error } = await sb.from('photoboxes').insert({
    id: newId,
    name: candidate.name,
    location: candidate.location,
    price: candidate.price,
    description: candidate.description || null,
    notes: candidate.notes || null,
    created_at: now,
    updated_at: now,
  });
  if (error) throw new Error(`Gagal menyimpan kandidat Photo Box: ${error.message}`);

  return {
    id: newId,
    name: candidate.name,
    location: candidate.location,
    price: candidate.price,
    description: candidate.description,
    notes: candidate.notes,
    created_at: now,
    updated_at: now,
  };
}

export async function dbDeletePhotoboxCandidate(boxId: string): Promise<void> {
  const sb = getSupabaseClient();

  const { error: assError } = await sb
    .from('photobox_assessments')
    .delete()
    .eq('photobox_id', boxId);
  if (assError) throw new Error(`Gagal menghapus assessment: ${assError.message}`);

  const { error } = await sb.from('photoboxes').delete().eq('id', boxId);
  if (error) throw new Error(`Gagal menghapus kandidat Photo Box: ${error.message}`);
}

// ==================== PHOTOBOX ASSESSMENTS ====================

export async function dbGetPhotoboxAssessments(): Promise<PhotoboxAssessment[]> {
  const sb = getSupabaseClient();

  const { data, error } = await sb
    .from('photobox_assessments')
    .select('id, photobox_id, variable_id, score, created_at, updated_at');

  if (error) throw new Error(`Gagal membaca tabel photobox_assessments: ${error.message}`);

  return (data || []).map((r) => ({
    id: String(r.id),
    photobox_id: String(r.photobox_id),
    variable_id: String(r.variable_id),
    score: Number(r.score),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function dbSavePhotoboxAssessment(
  boxId: string,
  scoresMap: Record<string, number>
): Promise<void> {
  const sb = getSupabaseClient();
  const now = new Date().toISOString();

  // Hapus penilaian lama untuk photobox ini (replace-all)
  const { error: delError } = await sb
    .from('photobox_assessments')
    .delete()
    .eq('photobox_id', boxId);
  if (delError) throw new Error(`Gagal menghapus assessment lama: ${delError.message}`);

  const rows = Object.entries(scoresMap).map(([varId, scoreVal]) => ({
    id: `ass-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    photobox_id: boxId,
    variable_id: varId,
    score: scoreVal,
    created_at: now,
    updated_at: now,
  }));

  if (rows.length > 0) {
    const { error } = await sb.from('photobox_assessments').insert(rows);
    if (error) throw new Error(`Gagal menyimpan assessment: ${error.message}`);
  }
}

// ==================== RESET DATABASE ====================

export async function dbResetAllData(): Promise<void> {
  const sb = getSupabaseClient();

  const tables = [
    'questionnaire_scores',
    'questionnaire_entries',
    'selected_top_variables',
    'photobox_assessments',
    'photoboxes',
  ];

  for (const table of tables) {
    // PostgREST tidak mendukung delete() tanpa filter, jadi dipakai
    // filter yang tidak mungkin ter-match untuk menghapus semua baris.
    const { error } = await sb.from(table).delete().neq('id', '__semua_baris__');
    if (error) throw new Error(`Gagal mengosongkan tabel ${table}: ${error.message}`);
  }
}
