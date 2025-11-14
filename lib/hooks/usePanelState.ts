import { create } from 'zustand'

export type PanelType = 'mindstorm' | 'insights' | 'memory' | 'search' | null

interface PanelState {
  activePanel: PanelType
  isOpen: boolean
  openPanel: (panel: PanelType) => void
  closePanel: () => void
  togglePanel: (panel: PanelType) => void
}

/**
 * Global panel state management for hybrid stream-first architecture
 * 
 * Usage:
 * ```typescript
 * const { activePanel, openPanel, closePanel } = usePanelState()
 * 
 * // Open a panel
 * openPanel('mindstorm')
 * 
 * // Close current panel
 * closePanel()
 * 
 * // Toggle panel
 * togglePanel('insights')
 * ```
 */
export const usePanelState = create<PanelState>((set) => ({
  activePanel: null,
  isOpen: false,
  
  openPanel: (panel: PanelType) => set({ 
    activePanel: panel, 
    isOpen: panel !== null 
  }),
  
  closePanel: () => set({ 
    activePanel: null, 
    isOpen: false 
  }),
  
  togglePanel: (panel: PanelType) => set((state) => ({
    activePanel: state.activePanel === panel ? null : panel,
    isOpen: state.activePanel !== panel,
  })),
}))
