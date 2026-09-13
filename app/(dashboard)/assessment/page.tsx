'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SURVEY_TITLE } from '@/lib/constants';
import { Variable, TopVariableItem } from '@/types/database';
import {
  CheckSquare,
  Camera,
  Users,
  ArrowRight,
  Sparkles,
  MapPin,
  Star,
} from 'lucide-react';

interface AggregatedBox {
  photobox_name: string;
  respondent_count: number;
  variable_averages: Record<string, number>;
}

export default function AssessmentPage() {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [aggregatedBoxes, setAggregatedBoxes] = useState<AggregatedBox[]>([]);
  const [top5Variables, setTop5Variables] = useState<TopVariableItem[]>([]);
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/assessment')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVariables(data.variables || []);
          setAggregatedBoxes(data.aggregatedBoxes || []);
          setTop5Variables(data.top5Variables || []);
          setTotalEntries(data.totalEntries || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Header
        title="Rekapitulasi Penilaian Photo Box dari Responden"
        subtitle={`Rata-rata penilaian 10 dimensi kualitas untuk setiap Photo Box di Samarinda dari ${totalEntries} responden`}
      />

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Memuat rekapitulasi penilaian responden dari Supabase...</p>
        </div>
      ) : aggregatedBoxes.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="Belum Ada Penilaian Photo Box"
          description="Rekapitulasi penilaian akan otomatis tampil saat responden mengisi kuesioner dan memilih Photo Box yang dinilai."
          actionText="Buka Form Kuesioner Responden"
          actionHref="/survey"
        />
      ) : (
        <div className="space-y-8">
          {/* Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 bg-gradient-subtle border border-purple-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-brand-purple flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-bold uppercase">Total Responden</div>
                <div className="text-2xl font-black text-gray-900">{totalEntries} Orang</div>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-subtle border border-purple-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-brand-pink flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-bold uppercase">Photo Box Direview</div>
                <div className="text-2xl font-black text-gray-900">{aggregatedBoxes.length} Tempat</div>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-subtle border border-purple-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-bold uppercase">Metode Perhitungan</div>
                <div className="text-sm font-black text-gray-900">Otomatis Real-time</div>
              </div>
            </Card>
          </div>

          {/* Aggregated Assessment Matrix per Photo Box */}
          <div className="space-y-6">
            <h3 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              Rata-rata Skor Dimensi Penilaian Tiap Photo Box
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {aggregatedBoxes.map((box, idx) => (
                <Card key={idx} className="space-y-4 border border-purple-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-purple-50 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-brand-purple font-extrabold text-[11px]">
                          Photo Box #{idx + 1}
                        </span>
                        <h4 className="font-black text-lg text-gray-900">{box.photobox_name}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-pink" /> Wilayah Samarinda | Direview oleh{' '}
                        <strong className="text-gray-800">{box.respondent_count} responden</strong>
                      </p>
                    </div>

                    <Link
                      href="/ranking"
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-purple-50 text-brand-purple hover:bg-purple-100 font-bold text-xs transition-all self-start sm:self-auto"
                    >
                      <span>Lihat Peringkat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* 10 Variable Grid Scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {variables.map((v, vIdx) => {
                      const avg = box.variable_averages[v.id] || 0;
                      return (
                        <div
                          key={v.id}
                          className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-center space-y-1"
                        >
                          <div className="text-[10px] font-bold text-brand-purple uppercase truncate">
                            P{vIdx + 1} ({v.code})
                          </div>
                          <div className="text-[11px] font-semibold text-gray-700 truncate" title={v.name}>
                            {v.name}
                          </div>
                          <div className="text-base font-black font-mono text-gray-900">
                            {avg.toFixed(2)} <span className="text-[10px] font-normal text-gray-400">/ 5</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Direct CTA to Final Rankings */}
          <div className="flex justify-end pt-4">
            <Link
              href="/ranking"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-brand text-white font-extrabold text-sm shadow-glow hover:opacity-95 transition-all transform hover:-translate-y-0.5"
            >
              <span>Buka Klasemen Peringkat Akhir & Rekomendasi Juara</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
