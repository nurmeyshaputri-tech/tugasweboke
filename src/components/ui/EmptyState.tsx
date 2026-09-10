import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-purple-100/60 shadow-card my-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-50 to-pink-50 text-brand-purple mb-5 shadow-inner border border-purple-100">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-brand-purple stroke-[1.5]" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-white font-semibold shadow-glow hover:opacity-95 transition-all transform hover:-translate-y-0.5"
          >
            {actionText}
          </Link>
        ) : onActionClick ? (
          <button
            onClick={onActionClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-white font-semibold shadow-glow hover:opacity-95 transition-all transform hover:-translate-y-0.5"
          >
            {actionText}
          </button>
        ) : null
      )}
    </div>
  );
}
