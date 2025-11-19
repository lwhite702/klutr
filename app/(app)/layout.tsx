"use client";

import { PanelContainer } from "@/components/panels/PanelContainer";
import { MindStormPanel } from "@/components/panels/MindStormPanel";
import { InsightsPanel } from "@/components/panels/InsightsPanel";
import { MemoryPanel } from "@/components/panels/MemoryPanel";
import { SearchPanel } from "@/components/panels/SearchPanel";
import { usePanelState } from "@/lib/hooks/usePanelState";
import dynamic from "next/dynamic";

const TawkAuth = dynamic(() => import("./components/TawkAuth.client"), {
  ssr: false,
});

/**
 * App Layout - Provides panels and global functionality for authenticated pages
 *
 * Panels are rendered here so they work on all authenticated pages,
 * not just /app/stream. This enables panel triggers from any page.
 *
 * Note: AppShell is now rendered per-page for flexibility.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { activePanel, closePanel } = usePanelState();

  return (
    <>
      {children}
      <TawkAuth />

      {/* Panel Overlays - Available on all authenticated pages */}
      <PanelContainer
        isOpen={activePanel === "mindstorm"}
        onClose={closePanel}
        width="lg"
      >
        <MindStormPanel />
      </PanelContainer>

      <PanelContainer
        isOpen={activePanel === "insights"}
        onClose={closePanel}
        width="lg"
      >
        <InsightsPanel />
      </PanelContainer>

      <PanelContainer
        isOpen={activePanel === "memory"}
        onClose={closePanel}
        width="lg"
      >
        <MemoryPanel />
      </PanelContainer>

      {/* Search uses special modal design */}
      <SearchPanel isOpen={activePanel === "search"} onClose={closePanel} />
    </>
  );
}
