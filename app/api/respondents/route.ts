import { NextResponse } from 'next/server';
import {
  dbGetVariables,
  dbGetQuestionnaireEntries,
  dbGetQuestionnaireScores,
  dbDeleteQuestionnaireEntry,
} from '@/lib/db';

export async function GET() {
  try {
    const variables = await dbGetVariables();
    const entries = await dbGetQuestionnaireEntries();
    const scores = await dbGetQuestionnaireScores();

    return NextResponse.json({
      success: true,
      variables,
      entries,
      scores,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await dbDeleteQuestionnaireEntry(id);
    return NextResponse.json({ success: true, message: 'Data responden berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
