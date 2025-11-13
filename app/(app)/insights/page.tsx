"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePanelState } from "@/lib/hooks/usePanelState";

/**
 * Legacy Insights route - redirects to stream and opens panel
 */
export default function InsightsRedirect() {
  const router = useRouter();
  const { openPanel } = usePanelState();
  
  useEffect(() => {
    router.replace('/app/stream');
    openPanel('insights');
  }, [router, openPanel]);

  return null;
}
