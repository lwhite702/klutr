# Illustrations Integration Guide

## Overview

Klutr uses illustrations from two Figma sources:
1. **UX Colors Set** - Professional, tech-focused illustrations for features and processes
2. **Notes/Tasks Icons** - Note and task-specific icons for note-related features

## Implementation Status

✅ **Completed:**
- Illustration mapping utility (`lib/illustrations/mapping.ts`)
- Directory structure (`public/illustrations/`)
- FeatureGrid component updated to support illustrations
- HowItWorks component updated to use step illustrations
- EmptyState component created with illustration support
- BaseHub seed data updated with illustration paths

⏳ **Pending:**
- Export actual SVG files from Figma (rate limit encountered)
- Add illustrations to BaseHub media fields
- Test illustration loading and fallback behavior

## File Structure

```
public/illustrations/
├── ux-colors/          # UX Colors illustrations (primary set)
├── notes-tasks/        # Notes/Tasks icons
├── arrow-flows/        # Arrow flows and process connectors
└── README.md           # Documentation

lib/illustrations/
└── mapping.ts          # Mapping utility for use cases → illustration paths
```

## Usage

### In Components

```typescript
import { getBestIllustrationPath, getIllustrationAltText } from '@/lib/illustrations/mapping'
import Image from 'next/image'

const illustrationPath = getBestIllustrationPath('note')
const altText = getIllustrationAltText('note')

{illustrationPath && (
  <Image
    src={illustrationPath}
    alt={altText}
    width={64}
    height={64}
  />
)}
```

### Feature Mapping

Features automatically map to illustrations via `getFeatureIllustration()`:

- `MindStorm` → `mindstorm` (UX Colors: gears)
- `QuickCapture` → `stream-capture` (UX Colors: cloud-connecting-1)
- `Write Notes` → `note` (Notes/Tasks: note)
- `Smart Stacks` → `stacks-boards` (UX Colors: folder-not-found) + `folder` (Notes/Tasks)
- `Vault` → `vault` (UX Colors: fingerprint-passcode) + `archive` (Notes/Tasks)

## Illustration Use Cases

### UX Colors Set

- `stream-capture` → `cloud-connecting-1.svg`
- `ai-clustering` → `chatting-with-bot-2.svg`
- `search` → `fast-email.svg`
- `mindstorm` → `gears.svg`
- `stacks-boards` → `folder-not-found.svg`
- `vault` → `fingerprint-passcode.svg`
- `drop-step` → `cloud-download-1.svg`
- `organize-step` → `cloud-data-exchange.svg`
- `discover-step` → `phone-message.svg`
- `empty-notes` → `empty-wallet-2.svg`
- `error-404` → `phone-error.svg`

### Notes/Tasks Icons Set

- `note` → `note.svg`
- `task` → `task.svg`
- `checklist` → `checklist.svg`
- `reminder` → `reminder.svg`
- `folder` → `folder.svg`
- `tag` → `tag.svg`
- `archive` → `archive.svg`

### Arrow Flows Set

- `arrow-flow` → `arrow-flow.svg` (start arrows)
- `list-flow` → `list-flow.svg` (list visualizations)
- `process-arrow` → `process-arrow.svg` (middle step connectors)
- `connection-arrow` → `connection-arrow.svg` (end connectors)
- `flow-diagram` → `flow-diagram.svg` (complete flow diagrams)

## Next Steps

1. **Export Illustrations from Figma**
   - Use Figma MCP tools or manual export
   - Export as SVG (preferred) or PNG
   - Save to appropriate directories:
     - UX Colors → `public/illustrations/ux-colors/`
     - Notes/Tasks → `public/illustrations/notes-tasks/`
     - Arrow Flows → `public/illustrations/arrow-flows/`

2. **Add to BaseHub**
   - Upload illustrations to BaseHub media fields
   - Update feature blocks with illustration URLs
   - Update step blocks in howItWorksBlock

3. **Test Fallback Behavior**
   - Verify icons display when illustrations missing
   - Test in both light and dark modes
   - Check accessibility (alt text, contrast)

4. **Optimize**
   - Compress SVG files
   - Optimize PNG files if used
   - Test loading performance

## Fallback Strategy

Components use a graceful fallback:
1. Try illustration from mapping (`getBestIllustrationPath()`)
2. Fall back to BaseHub media field if available
3. Fall back to icon component (Lucide React) if no illustration

This ensures the UI always displays something, even if illustrations aren't exported yet.

