import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PhotoBox Ranking System - Decision Support Platform',
  description: 'Sistem analisis kuesioner dan perangkingan kandidat Photo Box berbasis Weighted Average',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-background text-gray-900 antialiased selection:bg-purple-100 selection:text-brand-purple">
        {children}
      </body>
    </html>
  );
}
