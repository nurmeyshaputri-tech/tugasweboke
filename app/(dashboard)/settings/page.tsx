'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { getAuthUser, clearAllData } from '@/lib/storage';
import {
  Settings,
  User,
  Database,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  FileCode,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  useEffect(() => {
    setUser(getAuthUser() || { email: 'owner@photobox.ai', name: 'Owner / Admin' });
  }, []);

  const handleResetData = () => {
    clearAllData();
    setShowConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div>
      <Header
        title="Pengaturan Sistem & Database"
        subtitle="Pengaturan akun Owner, status koneksi Supabase PostgreSQL, dan opsi reset database"
      />

      <div className="space-y-6 max-w-4xl">
        {resetSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Database berhasil dikosongkan! Mengalihkan ke Dashboard...</span>
          </div>
        )}

        {/* Profile Card */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-purple-50 pb-3">
            <User className="w-5 h-5 text-brand-purple" />
            <h3 className="font-extrabold text-base text-gray-900">Profil Pengguna Owner</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="text-xs text-gray-500 font-semibold mb-1">Nama Owner</div>
              <div className="font-bold text-gray-900">{user?.name || 'Owner / Admin'}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="text-xs text-gray-500 font-semibold mb-1">Email Pengguna</div>
              <div className="font-bold text-gray-900 font-mono">{user?.email || 'owner@photobox.ai'}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="text-xs text-gray-500 font-semibold mb-1">Hak Akses / Role</div>
              <div className="font-bold text-brand-purple flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> OWNER (Akses Penuh)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="text-xs text-gray-500 font-semibold mb-1">Platform Perangkingan</div>
              <div className="font-bold text-gray-900">PhotoBox Decision Support</div>
            </div>
          </div>
        </Card>

        {/* Supabase Status Card */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-purple-50 pb-3">
            <Database className="w-5 h-5 text-brand-blue" />
            <h3 className="font-extrabold text-base text-gray-900">Status Database & Vercel</h3>
          </div>

          <div className="space-y-3 text-xs text-gray-600">
            <div className="p-4 rounded-xl bg-white border border-purple-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900 text-sm">Supabase PostgreSQL Schema</div>
                <div className="text-gray-500 mt-0.5">File migration `supabase/schema.sql` telah disiapkan.</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                Ready
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-purple-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900 text-sm">Vercel Deployment Architecture</div>
                <div className="text-gray-500 mt-0.5">Next.js App Router & Environment Variables disiapkan.</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                Ready
              </span>
            </div>
          </div>
        </Card>

        {/* Clear Database Card */}
        <Card className="space-y-4 border-red-200 bg-red-50/20">
          <div className="flex items-center gap-2 border-b border-red-100 pb-3 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-extrabold text-base">Kosongkan Seluruh Data (Reset Database)</h3>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Gunakan fitur ini jika Anda ingin mengembalikan sistem ke kondisi <strong>Database Kosong (Zero Data)</strong> tanpa kuesioner atau kandidat Photo Box.
          </p>

          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-extrabold text-xs shadow-sm hover:bg-red-700 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Kosongkan Database Sekarang
          </button>
        </Card>
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">
                Kosongkan Seluruh Database?
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Seluruh data kuesioner, TOP 5 variabel terkonfirmasi, kandidat Photo Box, dan hasil perangkingan akan dihapus secara permanen.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-extrabold hover:bg-red-700 shadow-md"
              >
                Ya, Reset Kosong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
