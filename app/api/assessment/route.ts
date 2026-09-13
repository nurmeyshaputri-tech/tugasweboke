import { NextResponse } from 'next/server';
import {
  dbGetVariables,
  dbGetQuestionnaireEntries,
  dbGetQuestionnaireScores,
} from '@/lib/db';
import {
  calculateVariableAnalysis,
  computeTop5Weights,
  aggregatePhotoboxFromRespondents,
} from '@/lib/rankingEngine';

export async function GET() {
  try {
    const variables = await dbGetVariables();
    const entries = await dbGetQuestionnaireEntries();
    const scores = await dbGetQuestionnaireScores();

    const analysis = calculateVariableAnalysis(variables, entries, scores);
    const top5Weights = computeTop5Weights(analysis);
    const aggregatedBoxes = aggregatePhotoboxFromRespondents(variables, entries, scores);

    return NextResponse.json({
      success: true,
      variables,
      totalEntries: entries.length,
      top5Variables: top5Weights,
      aggregatedBoxes,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
