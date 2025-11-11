# BaseHub Content Map

This document provides a comprehensive overview of all BaseHub blocks, pages, and fields used in the Klutr application. This serves as a reference for content management and as a schema for GPT-5 content generation.

## Overview

All marketing, help, and onboarding content is managed through BaseHub. Each page type has a defined set of blocks that can be composed to create the final page layout.

## Page Types

### Home Page (`/`)

**Blocks:**
- `heroBlock` - Main hero section with headline and CTA
- `featureGridBlock` - Grid of feature highlights
- `testimonialBlock` - User testimonials
- `howItWorksBlock` - Step-by-step explanation
- `ctaBlock` - Call-to-action section

**Block Fields:**

#### heroBlock
- `title` (string) - Main headline
- `subtitle` (string) - Supporting text
- `ctaText` (string) - Button text
- `ctaLink` (string) - Button destination URL
- `image` (media) - Hero image with url, fileName, altText

#### featureGridBlock
- `heading` (string) - Section heading
- `features` (array) - Array of featureBlock items

#### featureBlock
- `title` (string) - Feature name
- `description` (string) - Feature description
- `icon` (media) - Feature icon with url, fileName, altText

#### testimonialBlock
- `quote` (string) - Testimonial text
- `author` (string) - Author name
- `role` (string) - Author role/username
- `avatar` (media) - Author avatar with url, fileName, altText

#### howItWorksBlock
- `heading` (string) - Section heading
- `steps` (array) - Array of stepBlock items

#### stepBlock
- `title` (string) - Step title
- `description` (string) - Step description
- `icon` (media) - Step icon with url, fileName, altText

#### ctaBlock
- `headline` (string) - CTA headline
- `ctaText` (string) - Button text
- `ctaLink` (string) - Button destination URL

---

### About Page (`/about`)

**Blocks:**
- `aboutBlock` - Main about content
- `testimonialBlock` - User testimonials
- `ctaBlock` - Call-to-action section

**Block Fields:**

#### aboutBlock
- `headline` (string) - Page headline
- `story` (string) - About story/content (supports markdown)
- `image` (media) - About image with url, fileName, altText

---

### Pricing Page (`/pricing`)

**Blocks:**
- `pricingBlock` - Pricing tier information
- `ctaBlock` - Call-to-action section

**Block Fields:**

#### pricingBlock
- `tierName` (string) - Pricing tier name
- `price` (string) - Price display (e.g., "Free", "$9.99")
- `features` (array of strings) - List of included features
- `ctaLink` (string) - Sign-up link

---

### FAQ Page (`/faq`)

**Blocks:**
- `faqBlock` - FAQ content

**Block Fields:**

#### faqBlock
- `questions` (array) - Array of questionBlock items

#### questionBlock
- `question` (string) - FAQ question
- `answer` (string) - FAQ answer (supports markdown)

---

### Features Page (`/features`)

**Blocks:**
- `featureGridBlock` - Grid of all features

**Block Fields:**

See `featureGridBlock` and `featureBlock` under Home Page.

---

### Help Page (`/help`)

**Blocks:**
- `helpTopicBlock` - Individual help articles

**Block Fields:**

#### helpTopicBlock
- `title` (string) - Help article title
- `content` (string) - Help article content (supports markdown)
- `tags` (array of strings) - Tags for filtering/search
- `relatedLinks` (array) - Array of link objects
  - `text` (string) - Link text
  - `url` (string) - Link URL

---

### Onboarding Page (`/onboarding`)

**Blocks:**
- `onboardingIntroBlock` - Introduction section
- `onboardingStepBlock` - Individual onboarding steps
- `onboardingCompletionBlock` - Completion message

**Block Fields:**

#### onboardingIntroBlock
- `headline` (string) - Introduction headline
- `description` (string) - Introduction description
- `ctaText` (string) - Start button text

#### onboardingStepBlock
- `title` (string) - Step title
- `description` (string) - Step instructions
- `image` (media) - Step illustration with url, fileName, altText

#### onboardingCompletionBlock
- `message` (string) - Completion message
- `ctaText` (string) - Completion CTA button text
- `ctaLink` (string) - Completion CTA destination URL

---

## Usage Examples

### Fetching Content

```typescript
import { getHomeContent } from '@/lib/basehub/queries/pages'

const content = await getHomeContent()
// Returns: { heroBlock, featureGridBlock, testimonialBlock, howItWorksBlock, ctaBlock }
```

### Rendering Blocks

```typescript
import { HelpTopicBlock } from '@/app/components/blocks/HelpTopicBlock'

<HelpTopicBlock topic={helpTopic} />
```

## Content Management

All content is managed through BaseHub's CMS interface. Content editors can:

1. Create and edit blocks through the BaseHub dashboard
2. Preview changes using draft mode
3. Publish changes which are then cached via ISR (60 second revalidation)

## Schema File

The canonical schema is stored at `/app/basehub/schema.json` and matches this documentation.

## Notes

- All string fields support markdown formatting
- Media fields include `url`, `fileName`, and `altText` properties
- Arrays can be empty but should maintain consistent structure
- All blocks support graceful fallbacks if BaseHub is unavailable

