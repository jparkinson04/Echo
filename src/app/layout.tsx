import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Echo. Listen. Understand. Share.',
  description:
    'Echo gives MATs and schools a monthly pulse on staff wellbeing, AI-powered insights, and beautiful newsletters to share their culture.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
