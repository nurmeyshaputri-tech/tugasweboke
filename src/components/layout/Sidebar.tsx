'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Database,
  BarChart3,
  Sparkles,
  CheckSquare,
  Trophy,
  Settings,
  Menu,
  X,
  Camera,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard Ringkasan', icon: LayoutDashboard },
  { href: '/questionnaire-data', label: 'Data Responden', icon: Database },
  { href: '/analysis', label: 'Analisis 10 Variabel', icon: BarChart3 },
  { href: '/top-variables', label: 'TOP 5 Prioritas', icon: Sparkles },
  { href: '/assessment', label: 'Rekap Nilai Photo Box', icon: CheckSquare },
  { href: '/ranking', label: 'Peringkat & Rekomendasi', icon: Trophy },
  { href: '/settings', label: 'Pengaturan & Reset', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white border border-purple-100 shadow-md text-gray-700 hover:text-brand-purple"
        aria-label="Toggle Navigation"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-purple-100 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-glow">
              <Camera className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-brand bg-clip-text text-transparent">
                PhotoBox AI
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Panel Admin Samarinda
              </p>
            </div>
          </div>
        </div>

        {/* Public Survey Shortcut */}
        <div className="px-4 pt-4">
          <Link
            href="/survey"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-purple-50 border border-purple-100 text-brand-purple hover:bg-purple-100 font-bold text-xs transition-all"
          >
            <span>Buka Form Kuesioner</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-brand text-white shadow-glow font-semibold'
                    : 'text-gray-600 hover:bg-purple-50/70 hover:text-brand-purple'
                }`}
              >
                <Icon
                  className={`w-5 h-5 stroke-[2] ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand-purple'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-purple-50 bg-gradient-subtle/50">
          <div className="text-[11px] text-center text-gray-500 font-semibold">
            PhotoBox Ranking System (Samarinda)
          </div>
        </div>
      </aside>
    </>
  );
}
