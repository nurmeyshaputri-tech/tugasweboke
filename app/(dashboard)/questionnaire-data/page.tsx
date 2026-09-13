'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { QuestionnaireEntry, QuestionnaireScore, Variable } from '@/types/database';
import { SURVEY_TITLE } from '@/lib/constants';
import {
  Database,
  Plus,
  Trash2,
  Eye,
  Calendar,
  User,
  AlertTriangle,
  X,
  Share2,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function QuestionnaireDataPage() {
  const [entries, setEntries] = useState<QuestionnaireEntry[]>([]);
  const [scores, setScores] = useState<QuestionnaireScore[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<QuestionnaireEntry | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);

  const reloadData = () => {
    setLoading(true);
    fetch('/api/respondents')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEntries(data.entries || []);
          setScores(data.scores || []);
          setVariables(data.variables || []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/respondents?id=${id}`, { method: 'DELETE' });
    setDeleteTargetId(null);
    setSelectedEntry(null);
    reloadData();
  };

  const copySurveyLink = () => {
    const url = `${window.location.origin}/survey`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getEntryScoresMap = (entryId: string) => {
    const entryScores = scores.filter((s) => s.entry_id === entryId);
    const map: Record<string, number> = {};
    entryScores.forEach((s) => {
      map[s.variable_id] = s.score;
    });
    return map;
  };

  return (
    <div>
      <Header
        title="Panel Admin - Data Responden Kuesioner"
        subtitle={`Daftar responden kuesioner "${SURVEY_TITLE}" tersimpan di Supabase`}
      />

      {/* Share Survey Banner */}
      <Card className="mb-6 p-5 bg-gradient-subtle border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-purple" />
            <h4 className="font-extrabold text-sm text-gray-900">
              Tautan Kuesioner Publik: "{SURVEY_TITLE}"
            </h4>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Bagikan link ini ke pengunjung / responden di Samarinda agar mereka dapat mengisi identitas (nama, usia, tempat photobox) dan 10 pertanyaan tanpa login.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={copySurveyLink}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-purple-200 text-brand-purple font-bold text-xs shadow-sm hover:bg-purple-50 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedLink ? 'Tautan Disalin! ✓' : 'Salin Link Survey'}
          </button>

          <Link
            href="/survey"
            target="_blank"
            className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-glow hover:opacity-95"
          >
            Buka Form Responden ↗
          </Link>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-semibold text-gray-500">
          Total Responden Masuk: <strong className="text-gray-900">{entries.length}</strong>
        </div>

        <Link
          href="/questionnaire"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-100 text-brand-purple font-bold text-xs hover:bg-purple-200 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Input Entry Manual (Admin)
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Memuat data responden dari Supabase...</p>
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={Database}
          title="Belum Ada Data Responden"
          description="Bagikan link survey atau isi kuesioner terlebih dahulu untuk melihat data responden di sini."
          actionText="Buka Form Kuesioner Responden"
          actionHref="/survey"
        />
      ) : (
        <Card className="overflow-hidden p-0 border border-purple-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-purple-50/70 text-gray-700 text-xs uppercase font-extrabold border-b border-purple-100">
                <tr>
                  <th className="py-3.5 px-4">No</th>
                  <th className="py-3.5 px-4">Nama Responden</th>
                  <th className="py-3.5 px-4">Usia</th>
                  <th className="py-3.5 px-4">Photo Box Direview</th>
                  <th className="py-3.5 px-4">Waktu</th>
                  <th className="py-3.5 px-4 text-center">Skor 10 Pertanyaan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.map((entry, idx) => {
                  const entryScoresMap = getEntryScoresMap(entry.id);
                  const scoreCount = Object.keys(entryScoresMap).length;

                  return (
                    <tr key={entry.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-4 px-4 font-mono text-xs font-bold text-brand-purple">
                        #{idx + 1}
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {entry.respondent_name || 'Responden Publik'}
                      </td>
                      <td className="py-4 px-4 text-gray-700 text-xs font-semibold">
                        {entry.age ? `${entry.age} thn` : '-'}
                      </td>
                      <td className="py-4 px-4 text-gray-800 text-xs font-medium">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 text-brand-purple font-semibold">
                          <MapPin className="w-3 h-3" />
                          {entry.photobox_name || 'Tidak Ditentukan'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(entry.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                          {scoreCount} / 10 Terisi
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedEntry(entry)}
                          className="px-3 py-1.5 rounded-lg bg-purple-100 text-brand-purple hover:bg-purple-200 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Detail
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(entry.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-50 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">
                  Rincian Jawaban Responden
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Responden: <strong>{selectedEntry.respondent_name}</strong> ({selectedEntry.age ? `${selectedEntry.age} thn` : 'Usia -'}) | Review:{' '}
                  <strong>{selectedEntry.photobox_name || 'Samarinda'}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {variables.map((v, idx) => {
                const map = getEntryScoresMap(selectedEntry.id);
                const score = map[v.id] || 0;

                return (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[11px] font-bold text-brand-purple uppercase">
                        Pertanyaan {idx + 1} ({v.code})
                      </div>
                      <div className="text-xs font-extrabold text-gray-800">{v.name}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-brand-purple text-white font-extrabold text-xs">
                      Skor {score} / 5
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-right pt-4 border-t border-purple-50">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">
                Hapus Data Responden?
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Apakah Anda yakin ingin menghapus data responden ini dari database Supabase?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteTargetId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-extrabold hover:bg-red-700 shadow-md"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
