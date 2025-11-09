# Event tracking report

This document lists all PostHog events that have been automatically added to your Next.js application.

## Events by File

### app/(marketing)/login/page.tsx

- **login-succeeded**: Fires when a user successfully signs in using the login form.
- **login-failed**: Fires when a user's sign-in attempt fails.

### app/(app)/memory/page.tsx

- **memory_tour_started**: User clicked the 'Take tour' button on the Memory Lane page.
- **memory_week_revisited**: User clicked on a specific week in the timeline to revisit it.

### app/(app)/mindstorm/page.tsx

- **mindstorm-recluster-clicked**: Fired when the user clicks the 'Re-cluster now' button.
- **mindstorm-view-changed**: Fired when the user changes the view type for displaying clusters (e.g., grid, list).

### components/notes/QuickCaptureBar.tsx

- **quick_note_created**: Fired when a user saves a new note using the quick capture bar by clicking the save button or using the keyboard shortcut.

### components/layout/SidebarNav.tsx

- **sidebar_navigation_link_clicked**: Fired when a user clicks on a navigation link in the sidebar. Properties include the link's destination (target_href) and its label (target_label).

### components/onboarding/SectionTourDialog.tsx

- **tour-skipped**: User clicks the 'Skip tour' button in the section tour dialog.
- **tour-step-navigated**: User navigates to the next or previous step in the section tour.
- **tour-finished**: User clicks the 'Finish' button on the final step of the section tour.

### components/vault/VaultLockScreen.tsx

- **vault_unlock_attempted**: User clicked the 'Unlock' button on the vault lock screen.

### components/stacks/StackCard.tsx

- **stack_opened**: User clicked the 'Open Stack' button on a stack card.
- **stack_pin_toggled**: User clicked the pin/unpin button on a stack card.


## Events still awaiting implementation
- (human: you can fill these in)
---

## Next Steps

1. Review the changes made to your files
2. Test that events are being captured correctly
3. Create insights and dashboards in PostHog
4. Make a list of events we missed above. Knock them out yourself, or give this file to an agent.

Learn more about what to measure with PostHog and why: https://posthog.com/docs/new-to-posthog/getting-hogpilled
