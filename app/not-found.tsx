import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background font-sans">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">404 - Halaman Tidak Ditemukan</h2>
        <p className="text-xs text-gray-500">Halaman yang Anda cari tidak tersedia.</p>
        <div className="flex gap-2 justify-center">
          <Link
            href="/survey"
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
          >
            Ke Form Kuesioner
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold"
          >
            Ke Login Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
