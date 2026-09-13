import { NextResponse } from 'next/server';
import {
  dbGetVariables,
  dbGetQuestionnaireEntries,
  dbGetQuestionnaireScores,
  dbSaveQuestionnaireEntry,
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { respondent_name, age, photobox_name, scores, notes } = body;

    if (!scores || Object.keys(scores).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nilai kuesioner wajib diisi.' },
        { status: 400 }
      );
    }

    const newEntry = await dbSaveQuestionnaireEntry(
      respondent_name || 'Responden Publik',
      scores,
      age ? Number(age) : undefined,
      photobox_name || undefined,
      notes
    );

    return NextResponse.json({
      success: true,
      message: 'Kuesioner berhasil disimpan ke database Supabase!',
      entry: newEntry,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
