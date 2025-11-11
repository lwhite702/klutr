# Klutr Brand Guidelines

Version: 1.0  
Last updated: 2025-01-XX (America/New_York)

## Brand Essence

**Klutr Identity:** Practical, clever, lightly humorous

Klutr is the supportive mentor who codes. We don't hype, we don't anthropomorphize AI, and we don't talk down to users. We write like we're explaining something to a smart colleague who's new to the project.

## Brand Voice

### Core Tone

- **Practical:** We solve real problems. No hype, no fluff. Just tools that work when you need them.
- **Clever:** Smart automation that learns from you. AI that actually helps, not just buzzwords.
- **Calm:** We reduce stress, not add to it. A calm interface that helps you think clearly.

### Voice Principles

- **Supportive mentor who codes:** We guide users without condescending
- **Calm confidence:** We know what we're doing, but we're not arrogant
- **Intelligent simplicity:** Complex concepts explained clearly
- **Direct action:** Short, clear instructions that get things done

### What We Avoid

- **Hype and buzzwords:** No "revolutionary," "game-changing," or "AI-powered magic"
- **Anthropomorphizing AI:** AI doesn't "think" or "feel" - it processes and analyzes
- **Overly casual language:** We're professional but not stuffy
- **Technical jargon:** We explain concepts in plain English
- **Exclamation points:** Use sparingly, only for genuine excitement

## Typography

### Font Stack

**Headings (Display):**

- Primary: Inter
- Fallback: Geist, sans-serif
- Usage: `font-display` class or `var(--font-display)`
- Weight: 600 (semibold) for headings

**Body Text:**

- Primary: Satoshi (if available)
- Fallback: Geist, Inter, sans-serif
- Usage: `font-body` class or `var(--font-body)`
- Weight: 400 (regular) for body text

**Note:** Satoshi font is not currently available via npm or Google Fonts. Geist is used as the primary body font with Inter as fallback.

### Typography Scale

- **Display 1:** 5xl-8xl (Hero headlines)
- **Display 2:** 4xl-5xl (Section headings)
- **Heading 1:** 3xl (Page titles)
- **Heading 2:** 2xl (Section titles)
- **Heading 3:** xl (Subsection titles)
- **Body Large:** xl-2xl (Hero subtext, important paragraphs)
- **Body:** base-lg (Default body text)
- **Body Small:** sm (Captions, metadata)

## Color Palette

### Primary Colors (Official Brand Palette)

- **Charcoal:** `#2B2E3F` - Primary Dark, used for text, outlines, and dark backgrounds
- **Mint Green:** `#00C896` - Primary Accent, used for CTAs, AI/system messages, and highlights
- **Coral Red:** `#FF6B6B` - Accent 2, used for user messages, secondary actions, and highlights
- **Accent:** `#FFE8E0` - Light coral tint for subtle backgrounds

### Neutral Colors

- **Background:** `#FAFAFA` - Main background color (light mode)
- **Charcoal:** `#2B2E3F` - Primary text color (light mode)
- **Slate:** `#6B7280` - Secondary text, muted content

### Dark Mode

- **Surface Dark (Base):** `#181A25` - Deepest layer, main dark mode background
- **Surface Dark (Middle):** `#202331` - Middle layer for cards and elevated surfaces
- **Surface Dark (Top):** `#2B2E3F` - Surface layer, borders, highest elevation
- **Text Primary Dark:** `#F4F7F9` - Primary text (dark mode)
- **Text Secondary Dark:** `#C8CCD2` - Secondary text (dark mode)
- **Coral:** `#FF6B6B` - Same value in dark mode (no adjustment needed)
- **Mint:** `#00C896` - Same value in dark mode (no adjustment needed)

### Usage Guidelines

- Use coral for primary actions, user-generated content, and important highlights
- Use mint for system messages, AI-generated content, and secondary accents
- Maintain sufficient contrast ratios (WCAG AA minimum)
- Test colors in both light and dark modes

## Spacing & Layout

### Border Radius

- **Primary:** `1rem` (2xl) - Cards, buttons, modals
- **Secondary:** `0.75rem` (xl) - Smaller cards, inputs
- **Tertiary:** `0.5rem` (md) - Small elements
- **Full:** `9999px` - Pills, chips, badges

### Shadows

- **xl:** `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` - Cards
- **2xl:** `0 25px 50px -12px rgb(0 0 0 / 0.25)` - Modals, elevated elements

### Spacing Scale

- Use Tailwind spacing scale (4px base unit)
- Common spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Maintain consistent spacing between related elements

## Lightbulb Logo

### Usage

- The lightbulb is Klutr's primary visual identifier
- Use lightbulb emoji (💡) or SVG logo variants
- Apply `lightbulb-glow` class for interactive states
- Maintain brand consistency across all touchpoints

### Animation

- Subtle pulsing animation for hero elements
- Scale and filter transitions on hover
- Coral glow for primary interactions
- Mint glow for secondary/system interactions

## Brand Voice Examples

### Good Examples

- "Organize your chaos."
- "Drop your thoughts like messages in a chat, and we'll handle the rest."
- "AI automatically tags your drops and groups them into Boards."
- "Free during Beta! No credit card required."

### Bad Examples

- "Revolutionary AI-powered note-taking experience!"
- "Your AI assistant thinks and learns from you!"
- "Amazing features that will change your life!"
- "Get ready for the future of productivity!"

## Implementation

### CSS Variables

All brand colors are available as CSS variables in `app/globals.css`:

```css
--klutr-coral: #ff7f73;
--klutr-mint: #a7f1d1;
--klutr-accent: #ffe8e0;
--klutr-background: #fafafa;
```

### Theme Configuration

Theme tokens are defined in `lib/ui/theme.ts` for programmatic access.

### Component Usage

- Use `font-display` for headings
- Use `font-body` for body text
- Use `rounded-2xl` for primary border radius
- Use `shadow-xl` for cards, `shadow-2xl` for modals
- Reference brand colors via CSS variables

## References

- **Brand Voice Guide:** `/BRAND_VOICE.md`
- **UI Components:** `/docs/ui-components.md`
- **Theme Configuration:** `/lib/ui/theme.ts`
