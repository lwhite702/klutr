"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePanelState } from "@/lib/hooks/usePanelState";

/**
 * Legacy MindStorm route - redirects to stream and opens panel
 */
export default function MindStormRedirect() {
  const router = useRouter();
  const { openPanel } = usePanelState();
  
  useEffect(() => {
    router.replace('/app/stream');
    openPanel('mindstorm');
  }, [router, openPanel]);

  return null;
}
