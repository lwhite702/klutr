/**
 * Illustration Mapping Utility
 * 
 * Maps use cases to UX Colors illustration paths.
 * Illustrations are organized by set in public/illustrations/
 */

export type IllustrationUseCase =
  | 'stream-capture'
  | 'ai-clustering'
  | 'search'
  | 'mindstorm'
  | 'stacks-boards'
  | 'vault'
  | 'drop-step'
  | 'organize-step'
  | 'discover-step'
  | 'empty-notes'
  | 'empty-chat'
  | 'empty-files'
  | 'onboarding-intro'
  | 'onboarding-complete'
  | 'error-404'
  | 'error-fatal'
  | 'error-network'
  | 'note'
  | 'task'
  | 'checklist'
  | 'reminder'
  | 'folder'
  | 'tag'
  | 'archive'
  | 'arrow-flow'
  | 'list-flow'
  | 'process-arrow'
  | 'connection-arrow'
  | 'flow-diagram'

export type IllustrationStyle = 'ux-colors' | 'milano' | 'brooklyn' | 'barcelona' | 'london' | 'bruxelles' | 'notes-tasks' | 'arrow-flows'

/**
 * Map use cases to UX Colors illustration file names
 * Based on Figma frame names from the UX Colors set
 */
const UX_COLORS_MAPPING: Record<IllustrationUseCase, string | null> = {
  'stream-capture': 'Cloud-Connecting-1--Streamline-Ux',
  'ai-clustering': 'Chatting-With-Bot-2--Streamline-Ux',
  'search': 'Fast-Email--Streamline-Ux', // Using fast-email as search placeholder
  'mindstorm': 'Gears--Streamline-Ux',
  'stacks-boards': 'Folder-Not-Found--Streamline-Ux',
  'vault': 'Fingerprint-Passcode--Streamline-Ux',
  'drop-step': 'Cloud-Download-1--Streamline-Ux',
  'organize-step': 'Cloud-Data-Exchange--Streamline-Ux',
  'discover-step': 'Phone-Message--Streamline-Ux',
  'empty-notes': 'Empty-Wallet-2--Streamline-Ux',
  'empty-chat': 'Phone-Message--Streamline-Ux',
  'empty-files': 'Folder-Not-Found--Streamline-Ux',
  'onboarding-intro': 'Avatar-Neutral-Check--Streamline-Ux',
  'onboarding-complete': 'Paper-Plane--Streamline-Ux',
  'error-404': 'Phone-Error--Streamline-Ux',
  'error-fatal': 'Skull-2--Streamline-Ux',
  'error-network': 'Phone-Error--Streamline-Ux',
  // Notes/Tasks icons - use notes-tasks style instead
  'note': null,
  'task': null,
  'checklist': null,
  'reminder': null,
  'folder': null,
  'tag': null,
  'archive': null,
  // Arrow flows - use arrow-flows style instead
  'arrow-flow': null,
  'list-flow': null,
  'process-arrow': null,
  'connection-arrow': null,
  'flow-diagram': null,
}

/**
 * Map use cases to Notes/Tasks icon file names
 * Based on Figma frame names from the Notes/Tasks Icons set
 */
const NOTES_TASKS_MAPPING: Record<IllustrationUseCase, string | null> = {
  'stream-capture': null,
  'ai-clustering': null,
  'search': null,
  'mindstorm': null,
  'stacks-boards': 'folder',
  'vault': 'archive',
  'drop-step': null,
  'organize-step': null,
  'discover-step': null,
  'empty-notes': 'note',
  'empty-chat': 'note',
  'empty-files': 'folder',
  'onboarding-intro': null,
  'onboarding-complete': null,
  'error-404': null,
  'error-fatal': null,
  'error-network': null,
  'note': 'note',
  'task': 'task',
  'checklist': 'checklist',
  'reminder': 'reminder',
  'folder': 'folder',
  'tag': 'tag',
  'archive': 'archive',
  // Arrow flows - use arrow-flows style instead
  'arrow-flow': null,
  'list-flow': null,
  'process-arrow': null,
  'connection-arrow': null,
  'flow-diagram': null,
}

/**
 * Get illustration path for a use case
 * @param useCase - The use case identifier
 * @param style - Illustration style set (default: 'ux-colors')
 * @param format - File format (default: 'svg')
 * @returns Path to illustration file, or null if not available
 */
export function getIllustrationPath(
  useCase: IllustrationUseCase,
  style: IllustrationStyle = 'ux-colors',
  format: 'svg' | 'png' = 'svg'
): string | null {
  let fileName: string | null = null
  
  if (style === 'ux-colors') {
    fileName = UX_COLORS_MAPPING[useCase] || null
  } else if (style === 'notes-tasks') {
    fileName = NOTES_TASKS_MAPPING[useCase] || null
  } else if (style === 'arrow-flows') {
    // Arrow flows mapping - use case name directly as file name
    const arrowFlowUseCases: IllustrationUseCase[] = ['arrow-flow', 'list-flow', 'process-arrow', 'connection-arrow', 'flow-diagram']
    fileName = arrowFlowUseCases.includes(useCase) ? useCase : null
  } else {
    fileName = `${useCase}-${style}` // Fallback naming for other styles
  }
  
  if (!fileName) {
    return null
  }
  
  return `/illustrations/${style}/${fileName}.${format}`
}

/**
 * Get the best available illustration path for a use case
 * Tries notes-tasks first for note/task-related use cases, then falls back to ux-colors
 * @param useCase - The use case identifier
 * @param format - File format (default: 'svg')
 * @returns Path to illustration file, or null if not available
 */
export function getBestIllustrationPath(
  useCase: IllustrationUseCase,
  format: 'svg' | 'png' = 'svg'
): string | null {
  // Try notes-tasks first for note/task-specific use cases
  const notesTasksUseCases: IllustrationUseCase[] = ['note', 'task', 'checklist', 'reminder', 'folder', 'tag', 'archive', 'empty-notes']
  if (notesTasksUseCases.includes(useCase)) {
    const notesPath = getIllustrationPath(useCase, 'notes-tasks', format)
    if (notesPath) return notesPath
  }
  
  // Fallback to ux-colors
  return getIllustrationPath(useCase, 'ux-colors', format)
}

/**
 * Get illustration alt text for a use case
 * @param useCase - The use case identifier
 * @returns Alt text for accessibility
 */
export function getIllustrationAltText(useCase: IllustrationUseCase): string {
  const altTextMap: Record<IllustrationUseCase, string> = {
    'stream-capture': 'Stream capture illustration',
    'ai-clustering': 'AI clustering illustration',
    'search': 'Search feature illustration',
    'mindstorm': 'MindStorm feature illustration',
    'stacks-boards': 'Stacks and boards illustration',
    'vault': 'Vault security illustration',
    'drop-step': 'Drop step illustration',
    'organize-step': 'Organize step illustration',
    'discover-step': 'Discover step illustration',
    'empty-notes': 'Empty notes state illustration',
    'empty-chat': 'Empty chat state illustration',
    'empty-files': 'Empty files state illustration',
    'onboarding-intro': 'Onboarding introduction illustration',
    'onboarding-complete': 'Onboarding completion illustration',
    'error-404': '404 error illustration',
    'error-fatal': 'Fatal error illustration',
    'error-network': 'Network error illustration',
    'note': 'Note icon',
    'task': 'Task icon',
    'checklist': 'Checklist icon',
    'reminder': 'Reminder icon',
    'folder': 'Folder icon',
    'tag': 'Tag icon',
    'archive': 'Archive icon',
    'arrow-flow': 'Arrow flow illustration',
    'list-flow': 'List flow illustration',
    'process-arrow': 'Process arrow illustration',
    'connection-arrow': 'Connection arrow illustration',
    'flow-diagram': 'Flow diagram illustration',
  }
  
  return altTextMap[useCase] || 'Illustration'
}

/**
 * Map feature names to illustration use cases
 * Returns both UX Colors and Notes/Tasks options when applicable
 */
export function getFeatureIllustration(featureName: string): {
  primary: IllustrationUseCase | null
  secondary?: IllustrationUseCase | null
  style?: IllustrationStyle
} {
  const featureMap: Record<string, { primary: IllustrationUseCase; secondary?: IllustrationUseCase; style?: IllustrationStyle }> = {
    'MindStorm': { primary: 'mindstorm' },
    'QuickCapture': { primary: 'stream-capture' },
    'Smart Stacks': { primary: 'stacks-boards', secondary: 'folder', style: 'notes-tasks' },
    'Stacks': { primary: 'stacks-boards', secondary: 'folder', style: 'notes-tasks' },
    'Write Notes': { primary: 'note', style: 'notes-tasks' },
    'Notes': { primary: 'note', style: 'notes-tasks' },
    'Search': { primary: 'search' },
    'Vault': { primary: 'vault', secondary: 'archive', style: 'notes-tasks' },
    'Stream': { primary: 'stream-capture' },
    'Boards': { primary: 'stacks-boards', secondary: 'folder', style: 'notes-tasks' },
    'Conversational Capture': { primary: 'stream-capture' },
    'Auto-Tagging & Clustering': { primary: 'ai-clustering', secondary: 'tag', style: 'notes-tasks' },
    'Rich Media Support': { primary: 'stream-capture' },
    'Instant Retrieval': { primary: 'search' },
  }
  
  const mapping = featureMap[featureName]
  if (!mapping) {
    return { primary: null }
  }
  
  return {
    primary: mapping.primary,
    secondary: mapping.secondary,
    style: mapping.style || 'ux-colors',
  }
}

/**
 * Get arrow flow illustration for process steps
 * Useful for How It Works sections and process flows
 */
export function getArrowFlowIllustration(stepIndex: number, totalSteps: number): {
  path: string | null
  alt: string
} {
  // Use different arrow types based on position
  let useCase: IllustrationUseCase = 'process-arrow'
  
  if (stepIndex === 0) {
    useCase = 'arrow-flow' // Start arrow
  } else if (stepIndex === totalSteps - 1) {
    useCase = 'connection-arrow' // End arrow
  } else {
    useCase = 'process-arrow' // Middle arrows
  }
  
  const path = getIllustrationPath(useCase, 'arrow-flows')
  const alt = getIllustrationAltText(useCase)
  
  return { path, alt }
}

/**
 * Get list flow illustration for list-based features
 */
export function getListFlowIllustration(): {
  path: string | null
  alt: string
} {
  const path = getIllustrationPath('list-flow', 'arrow-flows')
  const alt = getIllustrationAltText('list-flow')
  
  return { path, alt }
}

