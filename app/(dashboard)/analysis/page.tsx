'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { VariableAnalysisResult } from '@/types/database';
import { BarChart3, ArrowRight, Sparkles, TrendingUp, Trophy } from 'lucide-react';

export default function AnalysisPage() {
  const [analysisResults, setAnalysisResults] = useState<VariableAnalysisResult[]>([]);
  const [sampleCount, setSampleCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/analysis')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnalysisResults(data.analysis || []);
          setSampleCount(data.sample_count || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Header
        title="Analisis Statistik 10 Variabel Kuesioner"
        subtitle="Perhitungan otomatis rata-rata skor Likert 1–5 dari seluruh data responden kuesioner nyata"
      />

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Menganalisis data kuesioner dari Supabase...</p>
        </div>
      ) : sampleCount === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Belum Ada Data Kuesioner Responden"
          description="Bagikan tautan survei kepada responden untuk memulai analisis statistik 10 variabel secara otomatis."
          actionText="Buka Form Kuesioner Responden"
          actionHref="/survey"
        />
      ) : (
        <div className="space-y-8">
          {/* Header Action Banner */}
          <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-brand text-white shadow-glow">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider opacity-90">
                Analisis Otomatis Selesai ({sampleCount} Responden Nyata)
              </div>
              <h2 className="text-xl font-black mt-0.5">
                Top 5 Variabel Prioritas Konsumen Samarinda Terhitung
              </h2>
            </div>
            <div className="flex gap-2">
              <Link
                href="/top-variables"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand-purple font-extrabold text-xs shadow-md hover:bg-purple-50 transition-all flex-shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                Lihat TOP 5
              </Link>
              <Link
                href="/ranking"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-900/40 border border-white/30 text-white font-extrabold text-xs hover:bg-purple-900/60 transition-all flex-shrink-0"
              >
                <Trophy className="w-4 h-4 text-amber-300" />
                Lihat Peringkat
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          {/* Bar Chart Visualization */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-purple-50 pb-3">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-purple" />
                Grafik Batang Urutan Rata-rata 10 Variabel
              </h3>
              <span className="text-xs text-gray-500 font-medium">Skala Likert 1–5 (Mean Score)</span>
            </div>

            <BarChartComponent
              data={analysisResults.map((item) => ({
                name: item.code,
                value: item.average_score,
                full_name: item.name,
              }))}
              dataKey="value"
              yAxisDomain={[0, 5]}
            />
          </Card>

          {/* Table Ranking Analysis */}
          <Card className="p-0 overflow-hidden border border-purple-100">
            <div className="p-5 border-b border-purple-50 flex items-center justify-between bg-purple-50/40">
              <h3 className="font-extrabold text-base text-gray-900">
                Tabel Urutan Nilai Rata-rata Variabel
              </h3>
              <span className="text-xs font-bold text-brand-purple">
                Total {analysisResults.length} Variabel
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-purple-50/80 text-gray-700 text-xs uppercase font-extrabold border-b border-purple-100">
                  <tr>
                    <th className="py-3.5 px-4 text-center">Rank</th>
                    <th className="py-3.5 px-4">Kode</th>
                    <th className="py-3.5 px-4">Nama Variabel Kuesioner</th>
                    <th className="py-3.5 px-4 text-center">Total Nilai</th>
                    <th className="py-3.5 px-4 text-center">Jumlah Sampel</th>
                    <th className="py-3.5 px-4 text-right">Rata-rata (Mean)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analysisResults.map((item) => {
                    const isTop5 = item.rank <= 5;

                    return (
                      <tr
                        key={item.variable_id}
                        className={`hover:bg-purple-50/30 transition-colors ${
                          isTop5 ? 'bg-purple-50/20 font-semibold' : ''
                        }`}
                      >
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-black ${
                              isTop5
                                ? 'bg-gradient-brand text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            #{item.rank}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-xs font-bold text-gray-600">
                          {item.code}
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-900">
                          {item.name}
                          {isTop5 && (
                            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-extrabold bg-pink-100 text-brand-pink">
                              TOP #{item.rank} Prioritas
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600 font-mono">
                          {item.total_score}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600">
                          {item.sample_count} responden
                        </td>
                        <td className="py-4 px-4 text-right font-extrabold text-base text-brand-purple font-mono">
                          {item.average_score.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
