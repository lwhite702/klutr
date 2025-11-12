"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import dynamic from 'next/dynamic';

const TawkAuth = dynamic(() => import('./components/TawkAuth.client'), { ssr: false });

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <AppShell activeRoute={pathname}>
      {children}
      <TawkAuth />
    </AppShell>
  );
}

