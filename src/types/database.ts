export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'OWNER' | 'ADMIN';
  created_at: string;
  updated_at: string;
}

export interface Variable {
  id: string;
  code: string;
  name: string;
  description?: string;
  order_index: number;
  created_at?: string;
}

export interface QuestionnaireEntry {
  id: string;
  user_id?: string;
  respondent_name?: string;
  age?: number;
  photobox_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  scores?: QuestionnaireScore[];
}

export interface QuestionnaireScore {
  id?: string;
  entry_id: string;
  variable_id: string;
  score: number; // 1-5 Likert scale
  created_at?: string;
}

export interface SelectedTopVariables {
  id: string;
  user_id?: string;
  variable_ids: string[];
  is_active: boolean;
  confirmed_at: string;
}

export interface PhotoboxCandidate {
  id: string;
  user_id?: string;
  name: string;
  location: string;
  price: number;
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  assessments?: PhotoboxAssessment[];
}

export interface PhotoboxAssessment {
  id?: string;
  photobox_id: string;
  variable_id: string;
  score: number; // 1-5 score
  created_at?: string;
  updated_at?: string;
}

// Calculated analytical types
export interface VariableAnalysisResult {
  rank: number;
  variable_id: string;
  code: string;
  name: string;
  total_score: number;
  sample_count: number;
  average_score: number;
}

export interface TopVariableItem {
  rank: number;
  variable_id: string;
  code: string;
  name: string;
  average_score: number;
  weight: number; // Normalized weight (0 - 1)
  weight_percentage: number; // (0 - 100%)
}

export interface RankingResultItem {
  rank: number;
  photobox_id: string;
  name: string;
  location: string;
  price: number;
  description?: string;
  final_score: number; // Weighted Average
  status: 'Recommended' | 'Alternative';
  variable_scores: Record<string, number>; // variable_id -> score (1-5)
}

export interface DynamicRecommendation {
  winner_name: string;
  winner_location: string;
  winner_score: number;
  summary_text: string;
  key_drivers: string[];
  explanation: string;
}
