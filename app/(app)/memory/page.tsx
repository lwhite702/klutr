"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePanelState } from "@/lib/hooks/usePanelState";

/**
 * Legacy Memory route - redirects to stream and opens panel
 */
export default function MemoryRedirect() {
  const router = useRouter();
  const { openPanel } = usePanelState();
  
  useEffect(() => {
    router.replace('/app/stream');
    openPanel('memory');
  }, [router, openPanel]);

  return null;
}
