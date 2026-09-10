'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SURVEY_TITLE } from '@/lib/constants';
import { RankingResultItem, TopVariableItem } from '@/types/database';
import {
  Users,
  BarChart3,
  Sparkles,
  Camera,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export default function DashboardPage() {
  const [entryCount, setEntryCount] = useState<number>(0);
  const [candidateCount, setCandidateCount] = useState<number>(0);
  const [rankings, setRankings] = useState<RankingResultItem[]>([]);
  const [topVariables, setTopVariables] = useState<TopVariableItem[]>([]);
  const [topRankName, setTopRankName] = useState<string | null>(null);
  const [topRankScore, setTopRankScore] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ranking')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const totalResp = data.totalRespondents || 0;
          setEntryCount(totalResp);
          setRankings(data.rankings || []);
          setTopVariables(data.topVariables || []);
          setCandidateCount((data.aggregatedBoxes || []).length);

          if (data.rankings && data.rankings.length > 0) {
            setTopRankName(data.rankings[0].name);
            setTopRankScore(data.rankings[0].final_score);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const copySurveyLink = () => {
    const url = `${window.location.origin}/survey`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div>
      <Header
        title="Dashboard Decision Support Panel"
        subtitle={`Sistem Analisis & Perangkingan Otomatis "${SURVEY_TITLE}"`}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-brand-purple flex items-center justify-center border border-purple-100">
            <Users className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900">
              {entryCount}
            </div>
            <div className="text-xs text-gray-500 font-medium">Total Responden Masuk</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-brand-pink flex items-center justify-center border border-pink-100">
            <Camera className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900">
              {candidateCount}
            </div>
            <div className="text-xs text-gray-500 font-medium">Photo Box Direview</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center border border-blue-100">
            <Sparkles className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">
              {topVariables.length > 0 ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> 5 Dimensi Aktif
                </span>
              ) : (
                <span className="text-amber-600">Menunggu Responden</span>
              )}
            </div>
            <div className="text-xs text-gray-500 font-medium">TOP Variabel Prioritas</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Trophy className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 truncate max-w-[140px]">
              {topRankName || 'Belum Ada'}
            </div>
            <div className="text-xs text-gray-500 font-medium">Peringkat #1 Terbaik</div>
          </div>
        </Card>
      </div>

      {/* Action Banner */}
      <Card className="mb-8 p-6 bg-gradient-brand text-white shadow-glow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider">
            Sistem Kuesioner Responden Mandiri
          </span>
          <h3 className="text-xl font-black mt-1">
            Bagikan Link Kuesioner kepada Konsumen di Samarinda
          </h3>
          <p className="text-xs text-white/90 mt-1">
            Admin tidak perlu menginput data manual. Seluruh statistik, rata-rata Likert, dan perangkingan terhitung otomatis dari responden.
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={copySurveyLink}
            className="px-5 py-3 rounded-xl bg-white text-brand-purple font-extrabold text-xs shadow-md hover:bg-purple-50 transition-all flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            {copiedLink ? 'Link Disalin! ✓' : 'Salin Link Survey'}
          </button>
          <Link
            href="/ranking"
            className="px-5 py-3 rounded-xl bg-purple-900/40 border border-white/30 text-white font-extrabold text-xs hover:bg-purple-900/60 transition-all flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            Buka Klasemen
          </Link>
        </div>
      </Card>

      {/* Main Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Summary Card */}
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-purple-50 pb-4">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-purple" />
              Klasemen Photo Box Terbaik Saat Ini
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-brand-purple">
              Real-time SQLite
            </span>
          </div>

          {rankings.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="Belum Ada Responden"
              description="Ajak responden mengisi kuesioner agar klasemen perangkingan otomatis terisi."
              actionText="Buka Form Kuesioner Responden"
              actionHref="/survey"
            />
          ) : (
            <div className="space-y-3">
              {rankings.slice(0, 5).map((r) => (
                <div
                  key={r.photobox_id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    r.rank === 1
                      ? 'bg-purple-50/80 border-purple-200 shadow-sm'
                      : 'bg-white border-gray-100 hover:border-purple-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                        r.rank === 1
                          ? 'bg-gradient-brand text-white shadow-glow'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      #{r.rank}
                    </span>
                    <div>
                      <div className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                        {r.name}
                        {r.rank === 1 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                            Juara #1
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{r.description}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-base font-black text-brand-purple">
                      {r.final_score.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-gray-400">Skor Akhir</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Winner Highlight Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-pink" />
              Rekomendasi Teratas
            </h3>

            {topRankName && topRankScore ? (
              <div className="p-6 rounded-2xl bg-gradient-brand text-white shadow-glow my-4 text-center space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  🏆 Photo Box Terbaik di Samarinda
                </div>
                <div className="text-2xl font-black">{topRankName}</div>
                <div className="text-3xl font-mono font-black py-1">
                  {topRankScore.toFixed(2)} <span className="text-xs font-normal opacity-80">/ 5.00</span>
                </div>
                <div className="text-xs opacity-90 font-medium">
                  Berdasarkan kalkulasi Weighted Average dari responden
                </div>
              </div>
            ) : (
              <div className="my-4">
                <EmptyState
                  icon={Trophy}
                  title="Menunggu Responden"
                  description="Kuesioner responden akan langsung menentukan pemenang secara otomatis."
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-purple-50 text-center">
            <Link
              href="/ranking"
              className="text-xs font-bold text-brand-purple hover:underline inline-flex items-center gap-1"
            >
              Lihat Detail Analisis & Grafik <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
