import { NextResponse } from 'next/server';
import {
  dbGetVariables,
  dbGetQuestionnaireEntries,
  dbGetQuestionnaireScores,
  dbSaveQuestionnaireEntry,
  friendlyErrorMessage,
} from '@/lib/db';

function calculateRanking(
  entries: any[],
  scores: any[],
  variables: any[]
) {
  const photoboxMap: Record<string, any> = {};

  // Kelompokkan responden berdasarkan Photo Box yang dinilai
  entries.forEach((entry) => {
    const name = entry.photobox_name;

    if (!name) return;

    if (!photoboxMap[name]) {
      photoboxMap[name] = {
        photobox_name: name,
        total_responden: 0,
        total_score: 0,
        criteria: {},
      };
    }

    photoboxMap[name].total_responden += 1;
  });

  // Masukkan nilai setiap kriteria
  scores.forEach((score) => {
    const entry = entries.find((e) => e.id === score.entry_id);

    if (!entry || !entry.photobox_name) return;

    const box = photoboxMap[entry.photobox_name];

    if (!box) return;

    const variable = variables.find(
      (v) => String(v.id) === String(score.variable_id)
    );

    const criterionName = variable?.name || score.variable_id;

    if (!box.criteria[criterionName]) {
      box.criteria[criterionName] = {
        total: 0,
        count: 0,
      };
    }

    box.criteria[criterionName].total += Number(score.score);
    box.criteria[criterionName].count += 1;
  });

  // Hitung nilai akhir setiap Photo Box
  const ranking = Object.values(photoboxMap).map((box: any) => {
    const criteriaValues = Object.entries(box.criteria).map(
      ([name, value]: any) => ({
        name,
        average: value.count > 0 ? value.total / value.count : 0,
      })
    );

    const totalAverage =
      criteriaValues.length > 0
        ? criteriaValues.reduce(
            (sum, item) => sum + item.average,
            0
          ) / criteriaValues.length
        : 0;

    // Skala 1-5 diubah menjadi 0-100
    const finalScore = (totalAverage / 5) * 100;

    return {
      photobox_name: box.photobox_name,
      total_responden: box.total_responden,
      nilai_rata_rata: Number(totalAverage.toFixed(2)),
      nilai_akhir: Number(finalScore.toFixed(2)),
      criteria: criteriaValues.map((item) => ({
        nama: item.name,
        nilai: Number(item.average.toFixed(2)),
      })),
    };
  });

  // Urutkan dari nilai tertinggi ke terendah
  ranking.sort((a, b) => b.nilai_akhir - a.nilai_akhir);

  // Tambahkan ranking
  return ranking.map((item, index) => ({
    peringkat: index + 1,
    ...item,
  }));
}

export async function GET() {
  try {
    const variables = await dbGetVariables();
    const entries = await dbGetQuestionnaireEntries();
    const scores = await dbGetQuestionnaireScores();

    const ranking = calculateRanking(entries, scores, variables);

    return NextResponse.json({
      success: true,
      variables,
      entries,
      scores,
      ranking,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: friendlyErrorMessage(error.message),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      respondent_name,
      age,
      photobox_name,
      scores,
      notes,
    } = body;

    if (!scores || Object.keys(scores).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nilai kuesioner wajib diisi.',
        },
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

    // Ambil ulang semua data setelah responden baru masuk
    const variables = await dbGetVariables();
    const entries = await dbGetQuestionnaireEntries();
    const allScores = await dbGetQuestionnaireScores();

    // Hitung ulang ranking secara otomatis
    const ranking = calculateRanking(
      entries,
      allScores,
      variables
    );

    return NextResponse.json({
      success: true,
      message: 'Kuesioner berhasil disimpan dan ranking berhasil dihitung!',
      entry: newEntry,
      ranking,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: friendlyErrorMessage(error.message),
      },
      { status: 500 }
    );
  }
}
