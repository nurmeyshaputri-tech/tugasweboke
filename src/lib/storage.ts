// ============================================================
// PENYIMPANAN SESSI LOGIN (LOKAL DI BROWSER)
//
// CATATAN PENTING:
// Semua DATA aplikasi (kuesioner, variabel, TOP 5, kandidat
// Photo Box, assessment) TIDAK disimpan di sini, melainkan di
// database Supabase melalui API route (lihat src/lib/db.ts).
//
// File ini hanya menyimpan "siapa yang sedang login" di browser
// milik Owner/Admin, supaya halaman dashboard tetap terbuka
// tanpa perlu login ulang saat refresh.
// ============================================================

const AUTH_USER_KEY = 'photobox_auth_user';

export function getAuthUser(): { email: string; name: string } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setAuthUser(user: { email: string; name: string } | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}
