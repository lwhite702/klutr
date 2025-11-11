# BaseHub Content Migration Guide

Version: 1.0  
Last updated: 2025-01-24 (America/New_York)

## Overview

This document catalogs all hardcoded marketing content that needs to be migrated from static code to BaseHub CMS. The goal is to make all marketing, blog, and legal content editable through BaseHub without requiring code changes.

## Files Containing Hardcoded Content

- `app/(marketing)/page.tsx` - Main landing page with all marketing sections
- `app/(marketing)/layout.tsx` - SEO metadata and page configuration

## Content Inventory

### 1. Hero Section

**Location:** `app/(marketing)/page.tsx` lines 186-248

**Hardcoded Content:**
- **Headline (line 202-207):**
  - Main headline: "Clear the clutr."
  - Sub-headline: "Keep the spark."
  - Highlighted word: "Clear" (styled with coral color)
  
- **Subheadline (line 209-216):**
  - Text: "Klutr is the frictionless inbox for your brain. Dump text, images, or voice notes and we'll organize them into searchable piles so you can stay creative and clutter-free."

- **CTA Button (line 217-227):**
  - Button text: "Try for Free"
  - Link: `/login`
  - Aria label: "Try Klutr for free"

- **Hero Image Placeholder (line 235-244):**
  - Emoji: "📝"
  - Placeholder text: "App Mockup"

**BaseHub Schema Suggestion:**
```typescript
hero: {
  headline: string
  headlineHighlight: string // word to highlight
  subheadline: string
  ctaText: string
  ctaLink: string
  heroImage?: media
}
```

### 2. Navigation Header

**Location:** `app/(marketing)/page.tsx` lines 120-182

**Hardcoded Content:**
- **Navigation Links (lines 139-163):**
  - "Features" → `#features`
  - "Pricing" → `#pricing`
  - "Discover" → `#discover`
  - "About" → `#about`

- **Auth Buttons (lines 165-179):**
  - "Log in" → `/login`
  - "Sign Up" → `/login`

**BaseHub Schema Suggestion:**
```typescript
navigation: {
  links: array of {
    label: string
    href: string
  }
  authButtons: {
    loginText: string
    loginLink: string
    signUpText: string
    signUpLink: string
  }
}
```

### 3. Features Grid Section

**Location:** `app/(marketing)/page.tsx` lines 250-314

**Hardcoded Content:**
- **Section Heading (lines 265-275):**
  - Title: "Everything you need to clear the clutr"
  - Subtitle: "Capture anything. We organize it. You stay creative."

- **Features Array (lines 48-85):**
  1. **MindStorm**
     - Icon: Brain
     - Description: "AI clusters your notes into meaningful groups. Discover connections you didn't know existed—no manual filing required."
  
  2. **QuickCapture**
     - Icon: Zap
     - Description: "Dump text, images, or voice notes. No friction, no formatting. Just capture your thoughts and we'll handle the chaos."
  
  3. **Smart Stacks**
     - Icon: Layers
     - Description: "Intelligent collections that grow with your notes. AI builds stacks based on themes, projects, and patterns you didn't even notice."
  
  4. **Write Notes**
     - Icon: Pen
     - Description: "Write any notes you want. Capture thoughts, ideas, and insights effortlessly with our intuitive interface."
  
  5. **Plan your day**
     - Icon: Calendar
     - Description: "Make sure your day is well planned. Organize tasks, set reminders, and stay on top of your schedule."
  
  6. **Learn facts**
     - Icon: BookOpen
     - Description: "It keeps your mind sharp. Store and organize facts, research, and knowledge for easy retrieval."

- **Feature CTA (line 304):**
  - Text: "Try Now"
  - Link: `/login`

**BaseHub Schema Suggestion:**
```typescript
featuresSection: {
  title: string
  subtitle: string
  features: array of {
    title: string
    description: string
    icon: string // icon name from lucide-react
    ctaText: string
    ctaLink: string
  }
}
```

### 4. Notes from Class Section

**Location:** `app/(marketing)/page.tsx` lines 316-394

**Hardcoded Content:**
- **Section Heading (lines 331-344):**
  - Icon: GraduationCap
  - Title: "Notes from Class"
  - Subtitle: "Never forget what your teacher says"

- **Example Cards (lines 345-381):**
  1. **Math Card:**
     - Title: "Math"
     - Description: "Basic arithmetic and introduction to variables."
     - Code example: "x = 20 y = -4\n2x + 3y = ?"
  
  2. **Physics Card:**
     - Title: "Physics"
     - Description: "Inertia is the natural tendency of objects in motion to stay in motion."
     - Placeholder: "Physics illustration"

- **CTA Button (lines 382-392):**
  - Text: "Try Now"
  - Link: `/login`

**BaseHub Schema Suggestion:**
```typescript
notesFromClassSection: {
  title: string
  subtitle: string
  icon: string
  examples: array of {
    title: string
    description: string
    codeExample?: string
    image?: media
  }
  ctaText: string
  ctaLink: string
}
```

### 5. Trusted by Companies Section

**Location:** `app/(marketing)/page.tsx` lines 396-422

**Hardcoded Content:**
- **Section Heading (line 409-411):**
  - Title: "Trusted by Companies"

- **Logo Placeholders (lines 412-419):**
  - Currently 6 placeholder divs (no actual logos)
  - Should be replaced with actual company logos

**BaseHub Schema Suggestion:**
```typescript
trustedBySection: {
  title: string
  logos: array of media // company logos
}
```

### 6. Testimonials Section

**Location:** `app/(marketing)/page.tsx` lines 424-492

**Hardcoded Content:**
- **Section Heading (lines 439-443):**
  - Title: "What users say"

- **Testimonials Array (lines 87-109):**
  1. **Jason (@jasonbaldmen)**
     - Text: "The goal is to make the website easy to use for the user and drive the necessary growth."
     - Rating: 4/5
     - Date: "12 January 2015"
  
  2. **Morgan (@morganNotFreeMan)**
     - Text: "Klutr is a simple, intuitive note-taking app that keeps everything organized and easy to access. Perfect for boosting productivity!"
     - Rating: 3/5
     - Date: "12 January 2015"
  
  3. **Daniel (@Daniel3Oscar)**
     - Text: "Klutr is a sleek, user-friendly app that makes organizing notes effortless. It's perfect for staying on top of tasks and ideas!"
     - Rating: 5/5
     - Date: "12 January 2015"

**BaseHub Schema Suggestion:**
```typescript
testimonialsSection: {
  title: string
  testimonials: array of {
    name: string
    username: string
    text: string
    rating: number // 1-5
    date: string
    avatar?: media
  }
}
```

### 7. Large CTA Section

**Location:** `app/(marketing)/page.tsx` lines 494-530

**Hardcoded Content:**
- **Icon (lines 507-511):**
  - Icon: Code
  - Background gradient: coral to mint

- **Heading (line 512-514):**
  - Title: "Ready to take your notes to the next level?"

- **Description (line 515-518):**
  - Text: "Join thousands of users who are already clearing the clutr and keeping their spark alive."

- **CTA Button (lines 519-527):**
  - Text: "Try Now"
  - Link: `/login`

**BaseHub Schema Suggestion:**
```typescript
largeCtaSection: {
  icon: string
  title: string
  description: string
  ctaText: string
  ctaLink: string
}
```

### 8. Contact Form Section

**Location:** `app/(marketing)/page.tsx` lines 532-680

**Hardcoded Content:**
- **Section Label (line 549-551):**
  - Text: "/ get in touch /"

- **Heading (line 552-554):**
  - Title: "We are always ready to help you and answer your question"

- **Contact Information (lines 556-628):**
  - **Call Center:**
    - Phone 1: "000 987 654 321"
    - Phone 2: "+(123) 456-789-876"
  
  - **Email:**
    - Email: "hello@klutr.com"
  
  - **Social Networks:**
    - Twitter (icon only, no link)
    - GitHub (icon only, no link)
    - LinkedIn (icon only, no link)
    - YouTube (icon only, no link)
    - Discord/MessageCircle (icon only, no link)

- **Contact Form (lines 630-678):**
  - Form Title: "Get in Touch"
  - Label: "Tell us your goals and what note taking means to you"
  - Fields:
    - Name (placeholder: "Your name")
    - Email (placeholder: "your.email@example.com")
    - Message (placeholder: "Your message...")
  - Submit Button: "Submit"

**BaseHub Schema Suggestion:**
```typescript
contactSection: {
  label: string
  title: string
  contactInfo: {
    callCenter: {
      phones: array of string
    }
    email: string
    socialLinks: array of {
      platform: string // twitter, github, linkedin, youtube, discord
      url: string
      icon: string
    }
  }
  form: {
    title: string
    description: string
    submitText: string
  }
}
```

### 9. Beta CTA Banner

**Location:** `app/(marketing)/page.tsx` lines 682-714

**Hardcoded Content:**
- **Heading (line 695-697):**
  - Title: "Free Beta now open"

- **Description (line 698-702):**
  - Text: "Join early users and help shape the future of note-taking. No credit card required. Just dump your thoughts and watch the magic."

- **CTA Button (lines 703-711):**
  - Text: "Get Started Free"
  - Link: `/login`

**BaseHub Schema Suggestion:**
```typescript
betaBanner: {
  title: string
  description: string
  ctaText: string
  ctaLink: string
}
```

### 10. Footer

**Location:** `app/(marketing)/page.tsx` lines 716-820

**Hardcoded Content:**
- **Brand Section (lines 720-737):**
  - Tagline: "Clear the clutr. Keep the spark."
  - Logo paths (handled via theme, not content)

- **Product Links (lines 738-760):**
  - "Features" → `#features`
  - "Pricing" → `#pricing`

- **Company Links (lines 761-783):**
  - "About" → `#about`
  - "Discover" → `#discover`

- **Legal Links (lines 784-806):**
  - "Privacy" → `/privacy`
  - "Terms" → `/terms`

- **Copyright (lines 808-811):**
  - Text: "© {year} Klutr. All rights reserved."
  - Privacy Policy Link: `/privacy`

**BaseHub Schema Suggestion:**
```typescript
footer: {
  tagline: string
  sections: {
    product: array of { label: string, href: string }
    company: array of { label: string, href: string }
    legal: array of { label: string, href: string }
  }
  copyright: string
  privacyLink: string
}
```

### 11. SEO Metadata

**Location:** `app/(marketing)/layout.tsx` lines 3-22

**Hardcoded Content:**
- **Page Title (line 4):**
  - Title: "Klutr | Free Beta"

- **Meta Description (lines 5-6):**
  - Description: "Capture notes, links, and lists — let AI organize your thoughts. Free beta now available."

- **OpenGraph (lines 7-12):**
  - Title: "Klutr | Free Beta"
  - Description: "Capture notes, links, and lists — let AI organize your thoughts. Free beta now available."
  - URL: "https://notesornope.com"
  - Images: ["/og-image.png"]

- **Icons (lines 13-21):**
  - Favicon 32x32: `/brand/favicon-32x32.png`
  - Favicon 192x192: `/brand/favicon-192x192.png`
  - Apple Touch Icon: `/brand/apple-touch-icon.png`

**BaseHub Schema Suggestion:**
```typescript
seoMetadata: {
  title: string
  description: string
  openGraph: {
    title: string
    description: string
    url: string
    images: array of string
  }
  icons: {
    favicon32: string
    favicon192: string
    appleTouchIcon: string
  }
}
```

## Migration Priority

### Phase 1: High-Impact Content (Immediate)
1. Hero section (headline, subheadline, CTA)
2. Features grid (all 6 features)
3. Beta CTA banner
4. SEO metadata

### Phase 2: User-Generated Content (High Priority)
1. Testimonials section
2. Trusted by Companies (logos)

### Phase 3: Supporting Content (Medium Priority)
1. Notes from Class section
2. Large CTA section
3. Contact form section
4. Footer links and content

### Phase 4: Navigation & Structure (Lower Priority)
1. Navigation header links
2. Footer structure

## Implementation Notes

- All content should be queryable via BaseHub GraphQL API
- Consider using BaseHub's rich text fields for longer descriptions
- Media fields should support images for logos, hero images, and testimonials
- Icon names should be stored as strings matching lucide-react icon names
- Dates should be stored as strings (ISO format recommended)
- Links can be relative (`/login`) or absolute (`https://...`)
- Consider using BaseHub's localization features if multi-language support is needed

## Next Steps

1. Create BaseHub schema matching the suggestions above
2. Seed BaseHub with current hardcoded content
3. Update `app/(marketing)/page.tsx` to query BaseHub instead of using hardcoded arrays
4. Update `app/(marketing)/layout.tsx` to fetch SEO metadata from BaseHub
5. Test content updates through BaseHub dashboard
6. Remove hardcoded content arrays once migration is complete

