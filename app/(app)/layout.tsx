"use client";

import { AppShell } from "@/components/layout/AppShell";
import dynamic from 'next/dynamic';

const TawkAuth = dynamic(() => import('./components/TawkAuth.client'), { ssr: false });

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      {children}
      <TawkAuth />
    </AppShell>
  );
}

