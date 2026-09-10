import { NextResponse } from 'next/server';
import {
  dbGetVariables,
  dbGetQuestionnaireEntries,
  dbGetQuestionnaireScores,
} from '@/lib/sqlite';
import {
  calculateVariableAnalysis,
  computeTop5Weights,
  computeRespondentRankings,
  generateDynamicRecommendation,
  aggregatePhotoboxFromRespondents,
} from '@/lib/rankingEngine';

export async function GET() {
  try {
    const variables = await dbGetVariables();
    const entries = await dbGetQuestionnaireEntries();
    const scores = await dbGetQuestionnaireScores();

    if (entries.length === 0) {
      return NextResponse.json({
        success: true,
        isAssessmentReady: false,
        totalRespondents: 0,
        rankings: [],
        topVariables: [],
        recommendation: null,
        aggregatedBoxes: [],
      });
    }

    const analysis = calculateVariableAnalysis(variables, entries, scores);
    const top5Weights = computeTop5Weights(analysis);
    const aggregatedBoxes = aggregatePhotoboxFromRespondents(variables, entries, scores);
    const rankings = computeRespondentRankings(variables, entries, scores, top5Weights);
    const recommendation = generateDynamicRecommendation(rankings, top5Weights);

    return NextResponse.json({
      success: true,
      isAssessmentReady: rankings.length > 0,
      totalRespondents: entries.length,
      rankings,
      topVariables: top5Weights,
      analysis,
      recommendation,
      aggregatedBoxes,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
