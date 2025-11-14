# Illustrations Directory

This directory contains illustrations and icons used throughout the Klutr application.

## Directory Structure

```
public/illustrations/
├── ux-colors/          # UX Colors illustration set (primary)
├── notes-tasks/        # Notes/Tasks icons set
├── arrow-flows/        # Notes/Lists/Arrow flows set
├── milano/             # Milano illustration set (future)
├── brooklyn/           # Brooklyn illustration set (future)
├── barcelona/          # Barcelona illustration set (future)
├── london/             # London illustration set (future)
└── bruxelles/          # Bruxelles illustration set (future)
```

## Current Sets

### UX Colors (Primary)

Tech-focused, professional illustrations from the Figma UX Colors set.

- Used for: Features, How It Works steps, empty states, error states
- Format: SVG (preferred) or PNG
- Source: [Figma UX Colors Set](https://www.figma.com/design/uViH44IXjqKIKrAlzTWoOs/120-UX-Illustrations)

### Notes/Tasks Icons

Note and task-specific icons from the Figma Notes/Tasks Icons set.

- Used for: Note-related features, task management, folders, tags
- Format: SVG (preferred)
- Source: [Figma Notes/Tasks Icons](https://www.figma.com/design/77CcfASAlXWaobCyAnBUyu/Notes---Tasks-Icons)

### Arrow Flows

Process flows, arrows, and list visualizations from the Figma Notes/Lists/Arrow flows set.

- Used for: Process flows, step connectors, list visualizations, flow diagrams
- Format: SVG (preferred)
- Source: [Figma Notes/Lists/Arrow flows](https://www.figma.com/design/mspuhquwcZ7ukkRyorySzD/Notes--Lists---Arrow-flows--Community-)

## Usage

Illustrations are accessed via the mapping utility in `lib/illustrations/mapping.ts`:

```typescript
import {
  getBestIllustrationPath,
  getIllustrationAltText,
} from "@/lib/illustrations/mapping";

const illustrationPath = getBestIllustrationPath("note");
const altText = getIllustrationAltText("note");
```

## Adding New Illustrations

1. Export from Figma as SVG (preferred) or PNG
2. Save to the appropriate directory (`ux-colors/` or `notes-tasks/`)
3. Use kebab-case naming matching Figma frame names
4. Update `lib/illustrations/mapping.ts` if adding new use cases

## File Naming Convention

- Use kebab-case matching Figma frame names
- Example: `cloud-connecting-1.svg`, `note.svg`, `folder.svg`
- Preserve set name in directory structure

## Optimization

- SVG files should be optimized (remove unnecessary metadata)
- PNG files should be compressed (use tools like `imagemin`)
- Consider 2x resolution for retina displays if using PNG

## Accessibility

All illustrations must have:

- Proper alt text via `getIllustrationAltText()`
- Appropriate sizing for context
- Color contrast considerations for dark mode
