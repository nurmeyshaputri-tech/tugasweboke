'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import {
  MANDATORY_VARIABLES,
  LIKERT_OPTIONS,
  SURVEY_TITLE,
  SAMARINDA_PHOTOBOX_LIST,
} from '@/lib/constants';
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  User,
  Calendar,
  MapPin,
  Sparkles,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export default function SurveyPage() {
  const [variables, setVariables] = useState<any[]>(MANDATORY_VARIABLES);
  const [respondentName, setRespondentName] = useState('');
  const [age, setAge] = useState<string>('');
  const [selectedPhotobox, setSelectedPhotobox] = useState<string>(SAMARINDA_PHOTOBOX_LIST[0]);
  const [customPhotobox, setCustomPhotobox] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/survey')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.variables && data.variables.length > 0) {
          // Merge question_text from MANDATORY_VARIABLES if available
          const merged = data.variables.map((dbVar: any, idx: number) => {
            const staticVar = MANDATORY_VARIABLES.find((m) => m.code === dbVar.code) || MANDATORY_VARIABLES[idx];
            return {
              ...dbVar,
              question_number: idx + 1,
              question_text: staticVar?.question_text || `Seberapa penting faktor ${dbVar.name} bagi Anda?`,
            };
          });
          setVariables(merged);
        }
      })
      .catch(() => {
        // Keep MANDATORY_VARIABLES
      });
  }, []);

  const currentVar = variables[currentIndex] || MANDATORY_VARIABLES[currentIndex];
  const filledCount = Object.keys(scores).filter((k) => scores[k] > 0).length;
  const progressPercent = Math.round((filledCount / variables.length) * 100);

  const effectivePhotoboxName =
    selectedPhotobox === 'Lainnya (Tulis Sendiri)'
      ? customPhotobox.trim() || 'Photo Box Lainnya'
      : selectedPhotobox;

  const handleSelectScore = (scoreVal: number) => {
    const varKey = currentVar.id || `var-${currentVar.code.toLowerCase()}`;
    setScores((prev) => ({
      ...prev,
      [varKey]: scoreVal,
    }));
    setError('');
  };

  const currentScoreKey = currentVar.id || `var-${currentVar.code.toLowerCase()}`;
  const currentScore = scores[currentScoreKey];

  const handleNext = () => {
    if (!respondentName.trim()) {
      setError('Harap masukkan nama Anda terlebih dahulu di bagian atas.');
      return;
    }

    if (!currentScore) {
      setError(`Harap berikan penilaian untuk Pertanyaan ${currentIndex + 1} (${currentVar.name}).`);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!respondentName.trim()) {
      setError('Harap masukkan nama lengkap Anda.');
      return;
    }

    if (selectedPhotobox === 'Lainnya (Tulis Sendiri)' && !customPhotobox.trim()) {
      setError('Harap masukkan nama Photo Box yang ingin Anda review.');
      return;
    }

    const missing = variables.filter((v) => {
      const k = v.id || `var-${v.code.toLowerCase()}`;
      return !scores[k];
    });

    if (missing.length > 0) {
      setError(`Masih ada ${missing.length} pertanyaan yang belum dinilai. Harap lengkapi semua pertanyaan.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          respondent_name: respondentName.trim(),
          age: age ? parseInt(age, 10) : undefined,
          photobox_name: effectivePhotoboxName,
          scores,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.error || 'Gagal menyimpan jawaban kuesioner.');
      }
    } catch (err: any) {
      setError('Terjadi kendala koneksi saat menyimpan jawaban.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-purple-100 shadow-2xl p-8 sm:p-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">
              Terima Kasih, {respondentName}! 🎉
            </h2>
            <p className="text-xs font-semibold text-brand-purple">
              Review untuk: <span className="underline">{effectivePhotoboxName}</span>
            </p>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            Penilaian dan preferensi Anda telah berhasil tersimpan ke sistem survei <strong>"{SURVEY_TITLE}"</strong>. Kontribusi Anda sangat berarti dalam menentukan standar Photo Box terbaik di Kota Samarinda.
          </p>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Jawaban Anda Telah Tersimpan dengan Aman</span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setScores({});
                setCurrentIndex(0);
                setIsSubmitted(false);
                setRespondentName('');
                setAge('');
                setCustomPhotobox('');
                setSelectedPhotobox(SAMARINDA_PHOTOBOX_LIST[0]);
              }}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-gradient-brand text-white font-extrabold text-sm shadow-glow hover:opacity-95 transition-all transform hover:-translate-y-0.5"
            >
              <RotateCcw className="w-4 h-4" />
              Isi Kuesioner Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Branding */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-card flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-brand text-white flex items-center justify-center shadow-glow flex-shrink-0">
            <Camera className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 text-brand-purple text-[10px] font-extrabold uppercase tracking-wider mb-1">
              Kuesioner Konsumen Samarinda
            </span>
            <h1 className="font-black text-xl sm:text-2xl text-gray-900 leading-tight">
              {SURVEY_TITLE}
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Bantu kami menentukan faktor dan tempat Photo Box paling favorit & terbaik di Samarinda
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-semibold text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Survey Main Card */}
        <Card className="space-y-6 p-6 sm:p-8">
          {/* Progress Header */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              <span>Pertanyaan {currentIndex + 1} dari {variables.length}</span>
              <span>{progressPercent}% Terisi ({filledCount}/10)</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-brand transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Respondent Profile Data Form */}
          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Nama Responden */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-purple" />
                  Nama Lengkap / Panggilan *
                </label>
                <input
                  type="text"
                  required
                  value={respondentName}
                  onChange={(e) => setRespondentName(e.target.value)}
                  placeholder="Contoh: Sarah / Budi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-purple bg-white"
                />
              </div>

              {/* Usia Responden */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-purple" />
                  Usia (Tahun) *
                </label>
                <input
                  type="number"
                  min="10"
                  max="90"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Contoh: 21"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-purple bg-white"
                />
              </div>
            </div>

            {/* Pilihan Photo Box di Samarinda yang ingin direview */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-purple" />
                Photo Box di Samarinda yang Ingin Anda Nilai / Review *
              </label>
              <select
                value={selectedPhotobox}
                onChange={(e) => setSelectedPhotobox(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-brand-purple bg-white"
              >
                {SAMARINDA_PHOTOBOX_LIST.map((pb) => (
                  <option key={pb} value={pb}>
                    {pb}
                  </option>
                ))}
              </select>

              {selectedPhotobox === 'Lainnya (Tulis Sendiri)' && (
                <input
                  type="text"
                  value={customPhotobox}
                  onChange={(e) => setCustomPhotobox(e.target.value)}
                  placeholder="Tuliskan nama tempat Photo Box di Samarinda..."
                  className="mt-2 w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-xs sm:text-sm focus:outline-none focus:border-brand-purple bg-white"
                />
              )}
            </div>
          </div>

          {/* Current Question Block */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-purple-100 shadow-sm text-center space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-purple-100 text-brand-purple text-xs font-black uppercase tracking-wider">
              Pertanyaan {currentIndex + 1} dari {variables.length}
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
              {currentVar.name}
            </h2>

            <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              {currentVar.question_text ||
                `Menurut Anda, seberapa penting faktor "${currentVar.name}" saat Anda memilih tempat Photo Box di Samarinda?`}
            </p>

            {/* Skala Likert 1-5 */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-4">
              {LIKERT_OPTIONS.map((opt) => {
                const isSelected = currentScore === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectScore(opt.value)}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-brand-purple bg-purple-100/90 text-brand-purple ring-2 ring-purple-300 font-extrabold shadow-md transform -translate-y-1'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:bg-purple-50/40'
                    }`}
                  >
                    <span className="text-xl font-black">{opt.value}</span>
                    <span className="text-[11px] font-semibold leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-50">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </button>

            {currentIndex < variables.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs sm:text-sm shadow-glow hover:opacity-95 transition-all transform hover:-translate-y-0.5"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm shadow-lg hover:bg-emerald-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Menyimpan...' : 'Kirim Kuesioner'}
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
