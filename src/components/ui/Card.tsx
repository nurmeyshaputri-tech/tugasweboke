import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function Card({ children, className = '', gradient = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-purple-100/60 bg-white p-6 shadow-card transition-all ${
        gradient ? 'bg-gradient-card' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
