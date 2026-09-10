import {
  Variable,
  QuestionnaireEntry,
  QuestionnaireScore,
  VariableAnalysisResult,
  TopVariableItem,
  PhotoboxCandidate,
  PhotoboxAssessment,
  RankingResultItem,
  DynamicRecommendation,
} from '@/types/database';

/**
 * Calculates average Likert score for each variable based on questionnaire entries.
 */
export function calculateVariableAnalysis(
  variables: Variable[],
  entries: QuestionnaireEntry[],
  scores: QuestionnaireScore[]
): VariableAnalysisResult[] {
  const sampleCount = entries.length;
  if (sampleCount === 0) return [];

  const analysis = variables.map((v) => {
    const varScores = scores.filter((s) => s.variable_id === v.id);
    const totalScore = varScores.reduce((sum, s) => sum + s.score, 0);
    const avgScore = varScores.length > 0 ? totalScore / varScores.length : 0;

    return {
      rank: 0,
      variable_id: v.id,
      code: v.code,
      name: v.name,
      total_score: totalScore,
      sample_count: varScores.length,
      average_score: Number(avgScore.toFixed(2)),
    };
  });

  // Sort by average score descending
  analysis.sort((a, b) => b.average_score - a.average_score);

  // Assign ranks
  return analysis.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));
}

/**
 * Computes TOP 5 variables & their normalized weights based on respondent averages.
 */
export function computeTop5Weights(
  analysisResults: VariableAnalysisResult[]
): TopVariableItem[] {
  if (analysisResults.length === 0) return [];

  // Take top 5
  const top5 = analysisResults.slice(0, 5);
  const sumTop5Avg = top5.reduce((sum, item) => sum + item.average_score, 0);

  if (sumTop5Avg === 0) return [];

  return top5.map((item, idx) => {
    const weight = item.average_score / sumTop5Avg;
    return {
      rank: idx + 1,
      variable_id: item.variable_id,
      code: item.code,
      name: item.name,
      average_score: item.average_score,
      weight: Number(weight.toFixed(4)),
      weight_percentage: Number((weight * 100).toFixed(2)),
    };
  });
}

export interface PhotoboxRespondentAgg {
  photobox_name: string;
  respondent_count: number;
  variable_averages: Record<string, number>; // variable_id -> average score
}

/**
 * Aggregates all respondent evaluations grouped by the Photo Box they reviewed.
 */
export function aggregatePhotoboxFromRespondents(
  variables: Variable[],
  entries: QuestionnaireEntry[],
  scores: QuestionnaireScore[]
): PhotoboxRespondentAgg[] {
  if (entries.length === 0) return [];

  // Group entries by photobox_name
  const groups: Record<string, QuestionnaireEntry[]> = {};

  for (const entry of entries) {
    const pbName = entry.photobox_name?.trim() || 'Photo Box Umum (Samarinda)';
    if (!groups[pbName]) {
      groups[pbName] = [];
    }
    groups[pbName].push(entry);
  }

  const result: PhotoboxRespondentAgg[] = [];

  for (const [pbName, pbEntries] of Object.entries(groups)) {
    const entryIds = new Set(pbEntries.map((e) => e.id));
    const pbScores = scores.filter((s) => entryIds.has(s.entry_id));

    const varAvg: Record<string, number> = {};

    for (const v of variables) {
      const vScores = pbScores.filter((s) => s.variable_id === v.id);
      const sum = vScores.reduce((acc, curr) => acc + curr.score, 0);
      const avg = vScores.length > 0 ? sum / vScores.length : 0;
      varAvg[v.id] = Number(avg.toFixed(2));
    }

    result.push({
      photobox_name: pbName,
      respondent_count: pbEntries.length,
      variable_averages: varAvg,
    });
  }

  return result;
}

/**
 * Computes Automated Rankings directly from Respondent Survey Submissions using Weighted Average.
 */
export function computeRespondentRankings(
  variables: Variable[],
  entries: QuestionnaireEntry[],
  scores: QuestionnaireScore[],
  topVariables: TopVariableItem[]
): RankingResultItem[] {
  const aggregatedBoxes = aggregatePhotoboxFromRespondents(variables, entries, scores);
  if (aggregatedBoxes.length === 0 || topVariables.length === 0) return [];

  const results: RankingResultItem[] = [];

  for (const box of aggregatedBoxes) {
    let finalScore = 0;
    const varScoresMap: Record<string, number> = {};

    for (const topVar of topVariables) {
      const avgScore = box.variable_averages[topVar.variable_id] || 0;
      varScoresMap[topVar.variable_id] = avgScore;
      finalScore += avgScore * topVar.weight;
    }

    results.push({
      rank: 0,
      photobox_id: `box-${box.photobox_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: box.photobox_name,
      location: 'Samarinda, Kalimantan Timur',
      price: 35000,
      description: `Dinilai langsung oleh ${box.respondent_count} responden nyata`,
      final_score: Number(finalScore.toFixed(2)),
      status: 'Alternative',
      variable_scores: varScoresMap,
    });
  }

  // Sort descending by final score
  results.sort((a, b) => b.final_score - a.final_score);

  // Assign ranks & status
  return results.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    status: idx === 0 ? 'Recommended' : 'Alternative',
  }));
}

/**
 * Generates dynamic text recommendation based on actual respondent calculation results.
 */
export function generateDynamicRecommendation(
  rankings: RankingResultItem[],
  topVariables: TopVariableItem[]
): DynamicRecommendation | null {
  if (rankings.length === 0 || topVariables.length === 0) return null;

  const winner = rankings[0];
  const topVarDesc = topVariables[0];

  const winnerTopVarScore = winner.variable_scores[topVarDesc.variable_id] || 0;

  const summary = `"${winner.name}" terpilih sebagai Photo Box Terbaik di Samarinda dengan skor tertinggi ${winner.final_score.toFixed(
    2
  )} / 5.00 berdasarkan akumulasi penilaian langsung oleh responden kuesioner.`;

  const key_drivers = [
    `Memperoleh skor rata-rata ${winnerTopVarScore.toFixed(2)}/5 pada variabel prioritas utama "${topVarDesc.name}" (bobot ${topVarDesc.weight_percentage}%).`,
    `Menempati peringkat #1 dengan skor Weighted Average (${winner.final_score.toFixed(2)}) tertinggi di antara seluruh Photo Box di Samarinda.`,
    `Mendapat penilaian kepuasan konsisten di seluruh kriteria kualitas, frame, fasilitas, dan pelayanan dari responden.`,
  ];

  const explanation = `Berdasarkan pengisian kuesioner oleh responden, faktor "${topVarDesc.name}" menjadi kriteria yang paling diprioritaskan dengan nilai rata-rata ${topVarDesc.average_score.toFixed(
    2
  )}. ${winner.name} unggul secara dominan pada kriteria-kriteria berbobot tinggi tersebut, menjadikannya pilihan Photo Box paling direkomendasikan di Samarinda.`;

  return {
    winner_name: winner.name,
    winner_location: winner.location,
    winner_score: winner.final_score,
    summary_text: summary,
    key_drivers,
    explanation,
  };
}
