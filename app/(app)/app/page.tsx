"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Root /app route - redirects to /app/stream
 * Stream is now the central hub with panel overlays
 */
export default function AppRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/app/stream');
  }, [router]);

  return null;
}
