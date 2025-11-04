import type { OnboardingStep } from "./hooks/useSectionOnboarding";

export const onboardingSteps: Record<string, OnboardingStep[]> = {
  notes: [
    {
      title: "Capture your thoughts",
      description:
        "Use the quick capture bar to add notes, files, or voice recordings. Everything you add is automatically tagged and organized.",
      targetSelector: '[data-onboarding="quick-capture"]',
      position: "bottom",
    },
    {
      title: "Auto-tagging",
      description:
        "We analyze your notes and add relevant tags automatically. You can also add your own tags to organize your thoughts.",
      targetSelector: '[data-onboarding="tags"]',
      position: "bottom",
    },
    {
      title: "Archive what doesn't fit",
      description:
        "Swipe left or use the Nope action to archive notes that don't fit your current workflow. Nothing is permanently deleted—you can restore items later.",
      targetSelector: '[data-onboarding="nope-action"]',
      position: "top",
    },
  ],
  mindstorm: [
    {
      title: "Related ideas grouped together",
      description:
        "AI analyzes your notes and groups similar ideas into clusters. Related thoughts appear together, making connections easier to spot.",
      targetSelector: '[data-onboarding="clusters"]',
      position: "bottom",
    },
    {
      title: "Refresh clusters anytime",
      description:
        "Click 'Re-cluster now' to update groupings when you add new notes. Clusters improve as you add more content.",
      targetSelector: '[data-onboarding="recluster-button"]',
      position: "left",
    },
  ],
  stacks: [
    {
      title: "Collections of related notes",
      description:
        "Stacks are groups of notes organized by topic, project, or theme. Browse your collections to find what you need.",
      targetSelector: '[data-onboarding="stacks"]',
      position: "bottom",
    },
    {
      title: "Tags organize everything",
      description:
        "Notes are automatically grouped by tags and categories. Similar tags create related stacks you can browse.",
      targetSelector: '[data-onboarding="tags"]',
      position: "bottom",
    },
    {
      title: "Pin important stacks",
      description:
        "Pin stacks you use frequently for quick access. Pinned stacks appear at the top of your list.",
      targetSelector: '[data-onboarding="pin-button"]',
      position: "left",
    },
  ],
  vault: [
    {
      title: "Private, encrypted storage",
      description:
        "Your vault encrypts notes on your device before uploading. Only you can read them—we never see your plaintext content.",
      targetSelector: '[data-onboarding="vault-lock"]',
      position: "bottom",
    },
    {
      title: "Unlock with your password",
      description:
        "Enter your vault password to unlock and view your encrypted notes. Keys are derived from your password and never stored on our servers.",
      targetSelector: '[data-onboarding="unlock-button"]',
      position: "top",
    },
  ],
  insights: [
    {
      title: "Weekly summaries",
      description:
        "Insights highlight patterns in your thinking. See trends, recurring themes, and activity across your notes.",
      targetSelector: '[data-onboarding="insights"]',
      position: "bottom",
    },
    {
      title: "Generate insights anytime",
      description:
        "Click 'Generate Summary' to create insights from your recent notes. Insights help you discover connections you might have missed.",
      targetSelector: '[data-onboarding="generate-button"]',
      position: "left",
    },
  ],
  memory: [
    {
      title: "Your note-taking timeline",
      description:
        "Memory Lane shows your notes organized by time. See what you were thinking across weeks and months.",
      targetSelector: '[data-onboarding="timeline"]',
      position: "bottom",
    },
    {
      title: "Rediscover forgotten ideas",
      description:
        "Browse past notes to resurface ideas you've set aside. Temporal organization helps you find notes by when you captured them.",
      targetSelector: '[data-onboarding="memory-items"]',
      position: "bottom",
    },
  ],
  nope: [
    {
      title: "Archived notes",
      description:
        "Nope Bin holds notes you've set aside. Nothing is permanently deleted—your archived notes stay here until you restore them.",
      targetSelector: '[data-onboarding="nope-items"]',
      position: "bottom",
    },
    {
      title: "Restore anytime",
      description:
        "Click 'Restore' on any archived note to bring it back to your main notes. Your archived notes are always recoverable.",
      targetSelector: '[data-onboarding="restore-button"]',
      position: "left",
    },
  ],
};

export function getOnboardingSteps(section: string): OnboardingStep[] {
  return onboardingSteps[section] || [];
}
