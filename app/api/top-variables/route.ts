import { NextResponse } from 'next/server';
import {
  dbGetVariables,
  dbGetQuestionnaireEntries,
  dbGetQuestionnaireScores,
  dbGetSelectedTopVariables,
  dbSaveSelectedTopVariables,
  friendlyErrorMessage,
} from '@/lib/db';
import { calculateVariableAnalysis, computeTop5Weights } from '@/lib/rankingEngine';

export async function GET() {
  try {
    const variables = await dbGetVariables();
    const entries = await dbGetQuestionnaireEntries();
    const scores = await dbGetQuestionnaireScores();
    const confirmed = await dbGetSelectedTopVariables();

    const analysis = calculateVariableAnalysis(variables, entries, scores);
    const top5 = computeTop5Weights(analysis);

    return NextResponse.json({
      success: true,
      top5,
      confirmed,
      is_confirmed: Boolean(confirmed && confirmed.variable_ids.length === 5),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: friendlyErrorMessage(error.message) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { variable_ids } = body;

    if (!variable_ids || variable_ids.length !== 5) {
      return NextResponse.json(
        { success: false, error: 'Harap sediakan tepat 5 ID variabel.' },
        { status: 400 }
      );
    }

    const saved = await dbSaveSelectedTopVariables(variable_ids);
    return NextResponse.json({
      success: true,
      message: 'TOP 5 Variabel berhasil dikonfirmasi ke Supabase!',
      data: saved,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: friendlyErrorMessage(error.message) }, { status: 500 });
  }
}
