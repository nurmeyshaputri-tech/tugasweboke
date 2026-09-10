'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { RadarChartComponent, RadarChartItem } from '@/components/charts/RadarChartComponent';
import { SURVEY_TITLE } from '@/lib/constants';
import {
  RankingResultItem,
  TopVariableItem,
  DynamicRecommendation,
} from '@/types/database';
import {
  Trophy,
  Sparkles,
  MapPin,
  CheckCircle2,
  BarChart3,
  Award,
  BookOpen,
  Share2,
  Users,
} from 'lucide-react';

export default function RankingPage() {
  const [rankings, setRankings] = useState<RankingResultItem[]>([]);
  const [topVariables, setTopVariables] = useState<TopVariableItem[]>([]);
  const [recommendation, setRecommendation] = useState<DynamicRecommendation | null>(null);
  const [totalRespondents, setTotalRespondents] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/ranking')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRankings(data.rankings || []);
          setTopVariables(data.topVariables || []);
          setRecommendation(data.recommendation || null);
          setTotalRespondents(data.totalRespondents || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Format data for Radar Chart
  const radarData: RadarChartItem[] = topVariables.map((topVar) => {
    const row: RadarChartItem = {
      subject: topVar.name,
    };
    rankings.forEach((r) => {
      row[r.name] = r.variable_scores[topVar.variable_id] || 0;
    });
    return row;
  });

  return (
    <div>
      <Header
        title={`Peringkat & Hasil Rekomendasi Photo Box Terbaik`}
        subtitle={`Kalkulasi otomatis metode Weighted Average dari jawaban ${totalRespondents} responden kuesioner "${SURVEY_TITLE}"`}
      />

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Menghitung peringkat otomatis dari data kuesioner responden...</p>
        </div>
      ) : rankings.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="Belum Ada Data Penilaian Responden"
          description="Peringkat dan rekomendasi Photo Box terbaik akan terhitung otomatis begitu responden mengisi kuesioner."
          actionText="Buka Form Kuesioner Responden"
          actionHref="/survey"
        />
      ) : (
        <div className="space-y-8">
          {/* Main Winner Recommendation Hero Card */}
          {rankings.length > 0 && (
            <Card className="bg-gradient-brand text-white p-8 sm:p-10 shadow-glow relative overflow-hidden">
              <div className="absolute top-4 right-4 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-extrabold text-xs tracking-wide">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    REKOMENDASI #1 PHOTO BOX TERBAIK DI SAMARINDA
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                    {rankings[0].name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/90">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-pink-300" />
                      {rankings[0].location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-purple-200" />
                      {rankings[0].description}
                    </span>
                  </div>

                  {recommendation && (
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed pt-2">
                      {recommendation.summary_text}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[180px] flex-shrink-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
                    Skor Weighted Average
                  </div>
                  <div className="text-5xl font-black font-mono my-1">
                    {rankings[0].final_score.toFixed(2)}
                  </div>
                  <div className="text-xs font-black px-3 py-1 rounded-full bg-emerald-400 text-gray-900 shadow-sm mt-1">
                    Peringkat 1 (Terbaik)
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Ranking Table */}
          <Card className="p-0 overflow-hidden border border-purple-100">
            <div className="p-5 border-b border-purple-50 flex items-center justify-between bg-purple-50/40">
              <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-purple" />
                Klasemen Peringkat Photo Box di Samarinda
              </h3>
              <span className="text-xs text-brand-purple font-extrabold">
                Total {totalRespondents} Responden Terhitung
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-purple-50/80 text-gray-700 text-xs uppercase font-extrabold border-b border-purple-100">
                  <tr>
                    <th className="py-3.5 px-4 text-center">Peringkat</th>
                    <th className="py-3.5 px-4">Nama Photo Box</th>
                    <th className="py-3.5 px-4">Keterangan Responden</th>
                    <th className="py-3.5 px-4 text-center">Skor Akhir (1–5)</th>
                    <th className="py-3.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rankings.map((item) => {
                    const isWinner = item.rank === 1;

                    return (
                      <tr
                        key={item.photobox_id}
                        className={`hover:bg-purple-50/30 transition-colors ${
                          isWinner ? 'bg-purple-50/30 font-semibold' : ''
                        }`}
                      >
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`w-8 h-8 rounded-full inline-flex items-center justify-center font-black text-xs ${
                              isWinner
                                ? 'bg-gradient-brand text-white shadow-glow'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            #{item.rank}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-900">
                          {item.name}
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-xs">
                          {item.description}
                        </td>
                        <td className="py-4 px-4 text-center font-mono font-extrabold text-base text-brand-purple">
                          {item.final_score.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          {isWinner ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Paling Direkomendasikan
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-bold text-xs">
                              Alternatif #{item.rank}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart of Final Scores */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-purple-50 pb-3">
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-purple" />
                  Grafik Perbandingan Skor Akhir Photo Box
                </h3>
              </div>

              <BarChartComponent
                data={rankings.map((r) => ({
                  name: r.name,
                  value: r.final_score,
                }))}
                dataKey="value"
                yAxisDomain={[0, 5]}
                height={300}
              />
            </Card>

            {/* Radar Chart */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-purple-50 pb-3">
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-pink" />
                  Profil Dimensi Penilaian (Radar Chart)
                </h3>
              </div>

              <RadarChartComponent
                data={radarData}
                candidates={rankings.map((r) => r.name)}
                height={300}
              />
            </Card>
          </div>

          {/* Dynamic Mathematical Recommendation Textual Report */}
          {recommendation && (
            <Card className="space-y-4 bg-purple-50/40 border border-purple-100">
              <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
                <BookOpen className="w-5 h-5 text-brand-purple" />
                <h3 className="font-extrabold text-base text-gray-900">
                  Narasi Rekomendasi Keputusan Otomatis
                </h3>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                <p className="font-bold text-gray-900">
                  {recommendation.summary_text}
                </p>

                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Faktor Kunci Keunggulan:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 font-medium">
                    {recommendation.key_drivers.map((driver, idx) => (
                      <li key={idx}>{driver}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white border border-purple-100 text-xs text-gray-600 leading-normal">
                  <strong className="text-gray-900 block mb-1">Rasionalitas Perhitungan Metode:</strong>
                  {recommendation.explanation}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
