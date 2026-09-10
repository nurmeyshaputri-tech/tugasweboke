'use client';

import React from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center p-4 bg-background font-sans">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Terjadi Kesalahan Sistem</h2>
          <p className="text-xs text-gray-500">{error?.message || 'Gagal memuat halaman.'}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
            >
              Coba Lagi
            </button>
            <Link
              href="/survey"
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold"
            >
              Ke Survey
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
