import type { ReactNode } from 'react';
import { AccentProvider } from '@/components/AccentProvider';
import { Layout } from '@/components/Layout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AccentProvider>
      <Layout>{children}</Layout>
    </AccentProvider>
  );
}
