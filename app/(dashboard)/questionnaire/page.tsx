'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { getVariables, saveQuestionnaireEntry } from '@/lib/storage';
import { LIKERT_OPTIONS } from '@/lib/constants';
import {
  ClipboardList,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Save,
  AlertCircle,
  User,
} from 'lucide-react';

export default function QuestionnairePage() {
  const router = useRouter();
  const variables = getVariables();

  const [respondentName, setRespondentName] = useState('Owner / Admin');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const currentVar = variables[currentIndex];
  const filledCount = Object.keys(scores).filter((k) => scores[k] > 0).length;
  const progressPercent = Math.round((filledCount / variables.length) * 100);

  const handleSelectScore = (scoreVal: number) => {
    setScores((prev) => ({
      ...prev,
      [currentVar.id]: scoreVal,
    }));
    setError('');
  };

  const handleNext = () => {
    if (!scores[currentVar.id]) {
      setError(`Harap beri nilai untuk variabel "${currentVar.name}" terlebih dahulu.`);
      return;
    }
    setError('');
    if (currentIndex < variables.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setError('');
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check all 10 variables filled
    const missing = variables.filter((v) => !scores[v.id]);
    if (missing.length > 0) {
      setError(`Terdapat ${missing.length} variabel yang belum diisi. Harap lengkapi seluruh 10 variabel.`);
      return;
    }

    saveQuestionnaireEntry(respondentName, scores);
    setSuccess(true);

    setTimeout(() => {
      router.push('/questionnaire-data');
    }, 1500);
  };

  return (
    <div>
      <Header
        title="Pengisian Kuesioner Likert 1–5"
        subtitle="Berikan nilai kepentingan untuk 10 variabel analisis Photo Box"
      />

      {success && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <div>Kuesioner Berhasil Disimpan ke Supabase Database!</div>
            <div className="text-xs font-normal text-emerald-700 mt-0.5">
              Mengalihkan Anda ke halaman Data Kuesioner...
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-semibold text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Box */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6">
            {/* Progress Header */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <span>
                  Pertanyaan {currentIndex + 1} dari {variables.length}
                </span>
                <span>{progressPercent}% Terisi ({filledCount}/10)</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-brand transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Respondent Name Input */}
            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-purple" />
                Nama Responden / Entry Tag
              </label>
              <input
                type="text"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                placeholder="Contoh: Entry Owner 1"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-purple bg-white"
              />
            </div>

            {/* Variable Question Box */}
            <div className="p-6 rounded-2xl bg-white border border-purple-100 shadow-sm text-center space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-brand-purple text-xs font-black uppercase tracking-wider">
                Pertanyaan {currentIndex + 1} dari {variables.length} ({currentVar.code})
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                {currentVar.name}
              </h2>
              <p className="text-xs text-gray-500 max-w-lg mx-auto">
                Berikan tingkat persetujuan Anda terhadap pernyataan kualitas: <strong className="text-gray-800">"{currentVar.name}"</strong>.
              </p>

              {/* Likert 1-5 Radio Options */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-4">
                {LIKERT_OPTIONS.map((opt) => {
                  const isSelected = scores[currentVar.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectScore(opt.value)}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'border-brand-purple bg-purple-100/80 text-brand-purple ring-2 ring-purple-300 font-extrabold shadow-md transform -translate-y-1'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:bg-purple-50/40'
                      }`}
                    >
                      <span className="text-lg font-black">{opt.value}</span>
                      <span className="text-[11px] font-semibold leading-tight">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation & Submit Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-purple-50">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </button>

              {currentIndex < variables.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-sm shadow-glow hover:opacity-95 transition-all"
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-sm shadow-lg hover:bg-emerald-700 transition-all transform hover:-translate-y-0.5"
                >
                  <Save className="w-4 h-4" />
                  Simpan Kuesioner
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Status Matrix */}
        <div>
          <Card className="space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2 border-b border-purple-50 pb-3">
              <ClipboardList className="w-5 h-5 text-brand-purple" />
              Daftar 10 Variabel
            </h3>

            <div className="space-y-2">
              {variables.map((v, idx) => {
                const isCurrent = idx === currentIndex;
                const score = scores[v.id];

                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setError('');
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'border-brand-purple bg-purple-50/80 font-bold text-brand-purple'
                        : score
                        ? 'border-emerald-200 bg-emerald-50/50 text-gray-800'
                        : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                        {v.code}
                      </span>
                      <span className="truncate">{v.name}</span>
                    </div>

                    {score ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px]">
                        {score}/5
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">Belum</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
