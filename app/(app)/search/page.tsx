"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePanelState } from "@/lib/hooks/usePanelState";

/**
 * Legacy Search route - redirects to stream and opens panel
 */
export default function SearchRedirect() {
  const router = useRouter();
  const { openPanel } = usePanelState();
  
  useEffect(() => {
    router.replace('/app/stream');
    openPanel('search');
  }, [router, openPanel]);

  return null;
}
