'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PhotoboxCandidate } from '@/types/database';
import {
  Camera,
  Plus,
  Trash2,
  Edit,
  MapPin,
  Tag,
  ArrowRight,
  X,
  AlertTriangle,
} from 'lucide-react';

export default function PhotoboxesPage() {
  const [candidates, setCandidates] = useState<PhotoboxCandidate[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCandidate, setEditingCandidate] = useState<PhotoboxCandidate | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const reloadCandidates = async () => {
    try {
      const res = await fetch('/api/photoboxes');
      const data = await res.json();
      if (data.success) {
        setCandidates(data.candidates || []);
      }
    } catch {
      // Data akan tetap kosong bila database belum terhubung
    }
  };

  useEffect(() => {
    reloadCandidates();
  }, []);

  const openAddModal = () => {
    setEditingCandidate(null);
    setName('');
    setLocation('');
    setPrice('');
    setDescription('');
    setNotes('');
    setShowModal(true);
  };

  const openEditModal = (item: PhotoboxCandidate) => {
    setEditingCandidate(item);
    setName(item.name);
    setLocation(item.location);
    setPrice(item.price.toString());
    setDescription(item.description || '');
    setNotes(item.notes || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !price) return;

    setSaving(true);
    setFormError('');
    try {
      const res = await fetch('/api/photoboxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCandidate?.id,
          name,
          location,
          price: parseFloat(price) || 0,
          description: description || undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        reloadCandidates();
      } else {
        setFormError(data.error || 'Gagal menyimpan kandidat. Coba lagi.');
      }
    } catch {
      setFormError('Terjadi kendala koneksi saat menyimpan kandidat.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/photoboxes?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch {
      // Abaikan error jaringan saat hapus, data dimuat ulang
    }
    setDeleteTargetId(null);
    reloadCandidates();
  };

  return (
    <div>
      <Header
        title="Kandidat Photo Box"
        subtitle="Kelola daftar tempat / booth Photo Box yang akan diikutsertakan dalam perangkingan"
      />

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-semibold text-gray-500">
          Total Kandidat: <strong className="text-gray-900">{candidates.length}</strong>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-glow hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Tambah Kandidat Photo Box
        </button>
      </div>

      {candidates.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="Belum Ada Kandidat Photo Box"
          description="Tambahkan minimal satu kandidat Photo Box secara manual untuk dapat memulai proses penilaian (assessment)."
          actionText="Tambah Photo Box Pertama"
          onActionClick={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {candidates.map((box) => (
            <Card
              key={box.id}
              className="flex flex-col justify-between hover:border-brand-purple transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-purple flex items-center justify-center font-bold">
                    <Camera className="w-5 h-5" />
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(box)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-purple hover:bg-purple-50 transition-colors"
                      title="Edit Candidates"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(box.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus Candidate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-gray-900 leading-snug">
                    {box.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-pink" />
                    <span>{box.location}</span>
                  </div>
                </div>

                {box.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {box.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-purple-50 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 font-mono text-xs font-extrabold text-brand-purple">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Rp {box.price.toLocaleString('id-ID')}</span>
                </div>

                <Link
                  href="/assessment"
                  className="text-xs font-bold text-brand-pink hover:underline inline-flex items-center gap-1"
                >
                  Penilaian <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-purple-50 pb-4">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingCandidate ? 'Edit Kandidat Photo Box' : 'Tambah Photo Box Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Nama Photo Box *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Photomatics Grand Indonesia"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Lokasi & Aksesibilitas *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Lantai 3 East Mall GI, Jakarta"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Harga / Tarif (Rp) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="35000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-purple font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fasilitas cetak cepat dengan variasi bingkai kekinian."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Buka 10:00 - 22:00"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-purple-50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gradient-brand text-white font-extrabold text-xs shadow-glow hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? 'Menyimpan...' : editingCandidate ? 'Simpan Perubahan' : 'Tambah Candidate'}
                </button>
              </div>
            </form>
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
                Hapus Kandidat Photo Box?
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Penilaian (assessment) yang sudah diisi untuk Photo Box ini juga akan dihapus.
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
                Hapus Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
