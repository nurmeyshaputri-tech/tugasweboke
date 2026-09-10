import { NextResponse } from 'next/server';
import {
  dbGetVariables,
  dbGetQuestionnaireEntries,
  dbGetQuestionnaireScores,
} from '@/lib/sqlite';
import { calculateVariableAnalysis, computeTop5Weights } from '@/lib/rankingEngine';

export async function GET() {
  try {
    const variables = await dbGetVariables();
    const entries = await dbGetQuestionnaireEntries();
    const scores = await dbGetQuestionnaireScores();

    const analysis = calculateVariableAnalysis(variables, entries, scores);
    const top5 = computeTop5Weights(analysis);

    return NextResponse.json({
      success: true,
      sample_count: entries.length,
      analysis,
      top5,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
