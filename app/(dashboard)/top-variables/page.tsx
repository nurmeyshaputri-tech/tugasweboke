'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { TopVariableItem } from '@/types/database';
import { Sparkles, CheckCircle2, ArrowRight, Trophy } from 'lucide-react';

export default function TopVariablesPage() {
  const [top5Items, setTop5Items] = useState<TopVariableItem[]>([]);
  const [sampleCount, setSampleCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/analysis')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTop5Items(data.top5 || []);
          setSampleCount(data.sample_count || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Header
        title="TOP 5 Variabel Prioritas Responden"
        subtitle="5 dimensi kualitas dengan skor rata-rata tertinggi dari responden yang menjadi bobot utama perangkingan"
      />

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Menghitung bobot TOP 5 variabel dari Supabase...</p>
        </div>
      ) : sampleCount === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="TOP 5 Variabel Belum Tersedia"
          description="TOP 5 variabel prioritas akan otomatis dihitung saat responden mengisi kuesioner survei."
          actionText="Buka Form Kuesioner Responden"
          actionHref="/survey"
        />
      ) : (
        <div className="space-y-8">
          {/* Header Card */}
          <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-purple-200 bg-purple-50/40">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-gray-900">
                  TOP 5 Variabel Prioritas Terkalkulasi
                </h2>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Otomatis Aktif
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Berdasarkan {sampleCount} responden nyata di Samarinda, kelima dimensi ini merupakan faktor yang paling menentukan kepuasan pelanggan.
              </p>
            </div>

            <Link
              href="/ranking"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-white font-extrabold text-xs shadow-glow hover:opacity-95 transition-all flex-shrink-0"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              Lihat Peringkat Photo Box
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>

          {/* TOP 5 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {top5Items.map((item) => (
              <Card
                key={item.variable_id}
                className="relative overflow-hidden text-center flex flex-col justify-between border border-purple-100 hover:border-brand-purple transition-all"
              >
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-purple-100 text-brand-purple font-mono font-black text-[10px]">
                  #{item.rank}
                </div>

                <div className="pt-4 pb-2">
                  <div className="text-2xl font-black text-brand-purple mb-1">
                    TOP {item.rank}
                  </div>
                  <div className="font-bold text-sm text-gray-900 leading-snug min-h-[40px] flex items-center justify-center">
                    {item.name}
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-50 space-y-1">
                  <div className="text-xs text-gray-500 font-medium">
                    Rata-rata: <strong className="text-gray-900">{item.average_score.toFixed(2)}</strong>
                  </div>
                  <div className="text-xs text-brand-pink font-extrabold">
                    Bobot: {item.weight_percentage}%
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Detailed Weight Table */}
          <Card className="p-0 overflow-hidden border border-purple-100">
            <div className="p-5 border-b border-purple-50 bg-purple-50/40">
              <h3 className="font-extrabold text-base text-gray-900">
                Rincian Normalisasi Bobot TOP 5 Variabel
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Formula Bobot: <code className="bg-white px-1.5 py-0.5 rounded border">Bobot = Rata-rata Variabel / Total Rata-rata TOP 5</code> (Total Bobot = 1.00 / 100%)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-purple-50/80 text-gray-700 text-xs uppercase font-extrabold border-b border-purple-100">
                  <tr>
                    <th className="py-3.5 px-4 text-center">Rank</th>
                    <th className="py-3.5 px-4">Kode</th>
                    <th className="py-3.5 px-4">Nama Variabel</th>
                    <th className="py-3.5 px-4 text-center">Rata-rata Skor</th>
                    <th className="py-3.5 px-4 text-center">Bobot (0 - 1)</th>
                    <th className="py-3.5 px-4 text-right">Persentase Bobot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {top5Items.map((item) => (
                    <tr key={item.variable_id} className="hover:bg-purple-50/30">
                      <td className="py-3.5 px-4 text-center font-bold">#{item.rank}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-gray-600">{item.code}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">{item.name}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-gray-700">{item.average_score.toFixed(2)}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-brand-purple">{item.weight}</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-brand-pink font-mono">{item.weight_percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
