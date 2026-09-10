import { createClient } from '@libsql/client';
import { MANDATORY_VARIABLES } from './constants';
import {
  Variable,
  QuestionnaireEntry,
  QuestionnaireScore,
  SelectedTopVariables,
  PhotoboxCandidate,
  PhotoboxAssessment,
} from '@/types/database';

// Initialize SQLite Client using local file database
const db = createClient({
  url: 'file:database.sqlite',
});

let isInitialized = false;

export async function initSQLite() {
  if (isInitialized) return;

  // 1. Create variables table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS variables (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL
    );
  `);

  // 2. Create questionnaire_entries table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS questionnaire_entries (
      id TEXT PRIMARY KEY,
      respondent_name TEXT NOT NULL,
      age INTEGER,
      photobox_name TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  try {
    await db.execute('ALTER TABLE questionnaire_entries ADD COLUMN age INTEGER;');
  } catch (e) {}

  try {
    await db.execute('ALTER TABLE questionnaire_entries ADD COLUMN photobox_name TEXT;');
  } catch (e) {}

  // 3. Create questionnaire_scores table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS questionnaire_scores (
      id TEXT PRIMARY KEY,
      entry_id TEXT NOT NULL,
      variable_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (entry_id) REFERENCES questionnaire_entries(id) ON DELETE CASCADE,
      FOREIGN KEY (variable_id) REFERENCES variables(id) ON DELETE CASCADE
    );
  `);

  // 4. Create selected_top_variables table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS selected_top_variables (
      id TEXT PRIMARY KEY,
      variable_ids TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      confirmed_at TEXT NOT NULL
    );
  `);

  // 5. Create photoboxes table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS photoboxes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 6. Create photobox_assessments table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS photobox_assessments (
      id TEXT PRIMARY KEY,
      photobox_id TEXT NOT NULL,
      variable_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (photobox_id) REFERENCES photoboxes(id) ON DELETE CASCADE,
      FOREIGN KEY (variable_id) REFERENCES variables(id) ON DELETE CASCADE
    );
  `);

  // Seed standard variables if not exists
  const existingVars = await db.execute('SELECT COUNT(*) as count FROM variables');
  const count = Number(existingVars.rows[0].count);

  if (count === 0) {
    for (const v of MANDATORY_VARIABLES) {
      await db.execute({
        sql: 'INSERT INTO variables (id, code, name, order_index) VALUES (?, ?, ?, ?)',
        args: [`var-${v.code.toLowerCase()}`, v.code, v.name, v.order_index],
      });
    }
  }

  isInitialized = true;
}

// ==================== REPOSITORY METHODS ====================

export async function dbGetVariables(): Promise<Variable[]> {
  await initSQLite();
  const res = await db.execute('SELECT * FROM variables ORDER BY order_index ASC');
  return res.rows.map((r) => ({
    id: String(r.id),
    code: String(r.code),
    name: String(r.name),
    order_index: Number(r.order_index),
  }));
}

export async function dbGetQuestionnaireEntries(): Promise<QuestionnaireEntry[]> {
  await initSQLite();
  const res = await db.execute('SELECT * FROM questionnaire_entries ORDER BY created_at DESC');
  return res.rows.map((r) => ({
    id: String(r.id),
    respondent_name: String(r.respondent_name),
    age: r.age ? Number(r.age) : undefined,
    photobox_name: r.photobox_name ? String(r.photobox_name) : undefined,
    notes: r.notes ? String(r.notes) : undefined,
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  }));
}

export async function dbGetQuestionnaireScores(): Promise<QuestionnaireScore[]> {
  await initSQLite();
  const res = await db.execute('SELECT * FROM questionnaire_scores');
  return res.rows.map((r) => ({
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
  await initSQLite();

  const entryId = `entry-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const now = new Date().toISOString();

  await db.execute({
    sql: 'INSERT INTO questionnaire_entries (id, respondent_name, age, photobox_name, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [
      entryId,
      respondentName || 'Responden Publik',
      age || null,
      photoboxName || null,
      notes || null,
      now,
      now,
    ],
  });

  for (const [varId, scoreVal] of Object.entries(scoresMap)) {
    const scoreId = `score-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    await db.execute({
      sql: 'INSERT INTO questionnaire_scores (id, entry_id, variable_id, score, created_at) VALUES (?, ?, ?, ?, ?)',
      args: [scoreId, entryId, varId, scoreVal, now],
    });
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
  await initSQLite();
  await db.execute({
    sql: 'DELETE FROM questionnaire_scores WHERE entry_id = ?',
    args: [entryId],
  });
  await db.execute({
    sql: 'DELETE FROM questionnaire_entries WHERE id = ?',
    args: [entryId],
  });
}

export async function dbGetSelectedTopVariables(): Promise<SelectedTopVariables | null> {
  await initSQLite();
  const res = await db.execute('SELECT * FROM selected_top_variables ORDER BY confirmed_at DESC LIMIT 1');
  if (res.rows.length === 0) return null;

  const row = res.rows[0];
  return {
    id: String(row.id),
    variable_ids: JSON.parse(String(row.variable_ids)),
    is_active: Boolean(row.is_active),
    confirmed_at: String(row.confirmed_at),
  };
}

export async function dbSaveSelectedTopVariables(variableIds: string[]): Promise<SelectedTopVariables> {
  await initSQLite();
  const id = `top5-${Date.now()}`;
  const now = new Date().toISOString();

  await db.execute({
    sql: 'INSERT INTO selected_top_variables (id, variable_ids, is_active, confirmed_at) VALUES (?, ?, 1, ?)',
    args: [id, JSON.stringify(variableIds), now],
  });

  return {
    id,
    variable_ids: variableIds,
    is_active: true,
    confirmed_at: now,
  };
}

export async function dbGetPhotoboxCandidates(): Promise<PhotoboxCandidate[]> {
  await initSQLite();
  const res = await db.execute('SELECT * FROM photoboxes ORDER BY created_at ASC');
  return res.rows.map((r) => ({
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
  await initSQLite();
  const now = new Date().toISOString();

  if (candidate.id) {
    await db.execute({
      sql: 'UPDATE photoboxes SET name = ?, location = ?, price = ?, description = ?, notes = ?, updated_at = ? WHERE id = ?',
      args: [
        candidate.name,
        candidate.location,
        candidate.price,
        candidate.description || null,
        candidate.notes || null,
        now,
        candidate.id,
      ],
    });
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
  await db.execute({
    sql: 'INSERT INTO photoboxes (id, name, location, price, description, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    args: [
      newId,
      candidate.name,
      candidate.location,
      candidate.price,
      candidate.description || null,
      candidate.notes || null,
      now,
      now,
    ],
  });

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
  await initSQLite();
  await db.execute({
    sql: 'DELETE FROM photobox_assessments WHERE photobox_id = ?',
    args: [boxId],
  });
  await db.execute({
    sql: 'DELETE FROM photoboxes WHERE id = ?',
    args: [boxId],
  });
}

export async function dbGetPhotoboxAssessments(): Promise<PhotoboxAssessment[]> {
  await initSQLite();
  const res = await db.execute('SELECT * FROM photobox_assessments');
  return res.rows.map((r) => ({
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
  await initSQLite();
  const now = new Date().toISOString();

  await db.execute({
    sql: 'DELETE FROM photobox_assessments WHERE photobox_id = ?',
    args: [boxId],
  });

  for (const [varId, scoreVal] of Object.entries(scoresMap)) {
    const assId = `ass-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    await db.execute({
      sql: 'INSERT INTO photobox_assessments (id, photobox_id, variable_id, score, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      args: [assId, boxId, varId, scoreVal, now, now],
    });
  }
}

export async function dbResetAllData(): Promise<void> {
  await initSQLite();
  await db.execute('DELETE FROM questionnaire_scores');
  await db.execute('DELETE FROM questionnaire_entries');
  await db.execute('DELETE FROM selected_top_variables');
  await db.execute('DELETE FROM photobox_assessments');
  await db.execute('DELETE FROM photoboxes');
}
