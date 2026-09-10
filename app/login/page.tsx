'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setAuthUser } from '@/lib/storage';
import {
  Camera,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('owner@photobox.ai');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Owner Admin');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegister && !name)) {
      setError('Harap isi semua kolom login.');
      return;
    }

    const userData = {
      email,
      name: name || email.split('@')[0] || 'Owner Admin',
    };

    setAuthUser(userData);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-purple-100 shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-brand opacity-10 blur-2xl pointer-events-none" />

        {/* Public Survey Shortcut for Responden */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-subtle border border-purple-100/80 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-purple">
            <ClipboardList className="w-4 h-4" />
            <span>Apakah Anda Responden / Pengisi Kuesioner?</span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium">
            Responden <strong>tidak perlu login</strong> untuk mengisi kuesioner.
          </p>
          <Link
            href="/survey"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-brand text-white font-black text-xs shadow-glow hover:opacity-95 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Isi Kuesioner Sekarang (Publik)
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
            Atau Panel Masuk Admin
          </span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* Brand Header */}
        <div className="text-center my-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100 text-brand-purple mb-2">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
            Panel Admin PhotoBox
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            {isRegister ? 'Registrasi Akun Admin Baru' : 'Kelola Data Responden, Analisis & Ranking'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Nama Lengkap Admin
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required={isRegister}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Admin PhotoBox"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
              Email Admin
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@photobox.ai"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-brand-dark hover:bg-gray-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>{isRegister ? 'Daftar Akun Admin' : 'Masuk ke Panel Admin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 text-center pt-3 border-t border-purple-50">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-[11px] text-brand-purple hover:underline font-semibold"
          >
            {isRegister
              ? 'Sudah punya akun? Masuk di sini'
              : 'Belum punya akun Admin? Registrasi sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}
