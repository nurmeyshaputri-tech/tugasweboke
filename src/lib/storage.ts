import {
  Variable,
  QuestionnaireEntry,
  QuestionnaireScore,
  SelectedTopVariables,
  PhotoboxCandidate,
  PhotoboxAssessment,
} from '@/types/database';
import { MANDATORY_VARIABLES } from './constants';

const STORAGE_KEYS = {
  QUESTIONNAIRES: 'photobox_questionnaire_entries',
  SCORES: 'photobox_questionnaire_scores',
  TOP_VARIABLES: 'photobox_selected_top_variables',
  PHOTOBOXES: 'photobox_candidates',
  ASSESSMENTS: 'photobox_assessments',
  AUTH_USER: 'photobox_auth_user',
};

// 1. Get 10 Mandatory Variables
export function getVariables(): Variable[] {
  return MANDATORY_VARIABLES.map((v, idx) => ({
    id: `var-${v.code.toLowerCase()}`,
    code: v.code,
    name: v.name,
    order_index: v.order_index,
    description: `Variabel ${v.code}: ${v.name}`,
  }));
}

// Helper to check if browser localStorage is available
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// 2. Questionnaire Entries CRUD
export function getQuestionnaireEntries(): QuestionnaireEntry[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRES);
  return raw ? JSON.parse(raw) : [];
}

export function getQuestionnaireScores(): QuestionnaireScore[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
  return raw ? JSON.parse(raw) : [];
}

export function saveQuestionnaireEntry(
  respondentName: string,
  scoresMap: Record<string, number>, // variable_id -> score (1-5)
  notes?: string
): QuestionnaireEntry {
  const entries = getQuestionnaireEntries();
  const scores = getQuestionnaireScores();

  const newEntry: QuestionnaireEntry = {
    id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    respondent_name: respondentName || 'Owner / Admin Entry',
    notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const newScores: QuestionnaireScore[] = Object.entries(scoresMap).map(
    ([varId, scoreVal]) => ({
      id: `score-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      entry_id: newEntry.id,
      variable_id: varId,
      score: scoreVal,
      created_at: new Date().toISOString(),
    })
  );

  entries.push(newEntry);
  scores.push(...newScores);

  localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRES, JSON.stringify(entries));
  localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));

  return newEntry;
}

export function deleteQuestionnaireEntry(entryId: string): void {
  let entries = getQuestionnaireEntries();
  let scores = getQuestionnaireScores();

  entries = entries.filter((e) => e.id !== entryId);
  scores = scores.filter((s) => s.entry_id !== entryId);

  localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRES, JSON.stringify(entries));
  localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
}

// 3. Selected Top 5 Variables
export function getSelectedTopVariables(): SelectedTopVariables | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(STORAGE_KEYS.TOP_VARIABLES);
  return raw ? JSON.parse(raw) : null;
}

export function saveSelectedTopVariables(variableIds: string[]): SelectedTopVariables {
  const topVarObj: SelectedTopVariables = {
    id: `top5-${Date.now()}`,
    variable_ids: variableIds,
    is_active: true,
    confirmed_at: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.TOP_VARIABLES, JSON.stringify(topVarObj));
  return topVarObj;
}

// 4. Photo Box Candidates CRUD
export function getPhotoboxCandidates(): PhotoboxCandidate[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEYS.PHOTOBOXES);
  return raw ? JSON.parse(raw) : [];
}

export function savePhotoboxCandidate(candidate: {
  id?: string;
  name: string;
  location: string;
  price: number;
  description?: string;
  notes?: string;
}): PhotoboxCandidate {
  const list = getPhotoboxCandidates();

  if (candidate.id) {
    const idx = list.findIndex((item) => item.id === candidate.id);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        name: candidate.name,
        location: candidate.location,
        price: candidate.price,
        description: candidate.description,
        notes: candidate.notes,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.PHOTOBOXES, JSON.stringify(list));
      return list[idx];
    }
  }

  const newBox: PhotoboxCandidate = {
    id: `box-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: candidate.name,
    location: candidate.location,
    price: candidate.price,
    description: candidate.description,
    notes: candidate.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  list.push(newBox);
  localStorage.setItem(STORAGE_KEYS.PHOTOBOXES, JSON.stringify(list));
  return newBox;
}

export function deletePhotoboxCandidate(boxId: string): void {
  let list = getPhotoboxCandidates();
  list = list.filter((b) => b.id !== boxId);
  localStorage.setItem(STORAGE_KEYS.PHOTOBOXES, JSON.stringify(list));

  let assessments = getPhotoboxAssessments();
  assessments = assessments.filter((a) => a.photobox_id !== boxId);
  localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
}

// 5. Photobox Assessments CRUD
export function getPhotoboxAssessments(): PhotoboxAssessment[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
  return raw ? JSON.parse(raw) : [];
}

export function savePhotoboxAssessment(
  boxId: string,
  scoresMap: Record<string, number> // variable_id -> score 1-5
): PhotoboxAssessment[] {
  let assessments = getPhotoboxAssessments();
  // Remove previous assessments for this photobox
  assessments = assessments.filter((a) => a.photobox_id !== boxId);

  const newAssessments: PhotoboxAssessment[] = Object.entries(scoresMap).map(
    ([varId, scoreVal]) => ({
      id: `ass-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      photobox_id: boxId,
      variable_id: varId,
      score: scoreVal,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  );

  assessments.push(...newAssessments);
  localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));
  return newAssessments;
}

// 6. Reset Database
export function clearAllData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.QUESTIONNAIRES);
  localStorage.removeItem(STORAGE_KEYS.SCORES);
  localStorage.removeItem(STORAGE_KEYS.TOP_VARIABLES);
  localStorage.removeItem(STORAGE_KEYS.PHOTOBOXES);
  localStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
}

// 7. Auth User State
export function getAuthUser(): { email: string; name: string } | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  return raw ? JSON.parse(raw) : null;
}

export function setAuthUser(user: { email: string; name: string } | null): void {
  if (!isBrowser()) return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }
}
