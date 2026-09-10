'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser, setAuthUser } from '@/lib/storage';
import { User, LogOut, ShieldCheck, Database } from 'lucide-react';

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const auth = getAuthUser();
    setUser(auth || { email: 'owner@photobox.ai', name: 'Owner / Admin' });
  }, []);

  const handleLogout = () => {
    setAuthUser(null);
    router.push('/login');
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-purple-100/60">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1 font-medium leading-normal">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 self-end md:self-auto">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
          <Database className="w-3.5 h-3.5" />
          <span>Real Database</span>
        </div>

        <div className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl bg-white border border-purple-100 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-brand-purple flex items-center justify-center font-bold text-sm">
            <User className="w-4 h-4" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-gray-800">
                {user?.name || 'Owner'}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-brand-purple">
                <ShieldCheck className="w-3 h-3 mr-0.5" />
                OWNER
              </span>
            </div>
            <div className="text-[11px] text-gray-400 font-mono">
              {user?.email || 'owner@photobox.ai'}
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Keluar dari sistem"
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors ml-1"
          >
            <LogOut className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </header>
  );
}
