# Basehub Content Population Guide

**Date:** 2025-11-14  
**Status:** Ready for Manual Population

## Overview

This guide provides step-by-step instructions for populating Basehub with production-ready content for pricing, FAQ, and testimonials. The content structure exists in Basehub, and seed data is available in `app/basehub/basehub-seed.json`.

## Content Ready for Population

### 1. Pricing Page Content

**Document ID:** `jCYY3PW3cTrw4xffplQd5`  
**Component:** `PricingBlockComponent` (ID: `qSPi9g1rGGSDIceKlKit8`)

**Three pricing tiers to create:**

#### Free Beta Tier
- **tierName:** "Free Beta"
- **price:** "$0"
- **ctaLink:** "/signup"

#### Pro Tier
- **tierName:** "Pro"
- **price:** "$8/mo"
- **ctaLink:** "/signup"

#### Team Tier
- **tierName:** "Team"
- **price:** "$20/mo/user"
- **ctaLink:** "/signup"

**CTA Block:**
- **headline:** "Get Started for Free"
- **ctaText:** "Sign Up"
- **ctaLink:** "/signup"

**Source:** `app/basehub/basehub-seed.json` lines 129-169

### 2. FAQ Page Content

**Document ID:** `hL1bIWwVLVN5sE4gZhcC0`  
**Component:** `FaqBlockComponent` (ID: `IqplgWCuDXhXqdp310uUq`)  
**Question Component:** `QuestionBlockComponent` (ID: `ymygJHGTtNtJEs9lR7HCB`)

**Five questions to create:**

1. **Question:** "What makes Klutr different?"  
   **Answer:** "Klutr organizes your data in real time — no folders, no effort, just structure that emerges naturally."

2. **Question:** "Can I import notes from other apps?"  
   **Answer:** "Yes! You can drop PDFs, screenshots, text files, and even voice recordings directly into the chat."

3. **Question:** "Is my data secure?"  
   **Answer:** "Absolutely. Klutr uses end-to-end encryption and Supabase RLS to keep your data safe and private."

4. **Question:** "How does AI clustering work?"  
   **Answer:** "Klutr uses embeddings to understand the meaning of your content, then groups similar ideas together automatically. You can always reorganize manually if needed."

5. **Question:** "Can I use Klutr offline?"  
   **Answer:** "Klutr syncs when you're online, but you can view and add notes offline. Changes sync automatically when you reconnect."

**Source:** `app/basehub/basehub-seed.json` lines 171-195

### 3. Testimonials Content

**Home Page Testimonial:**
- **Document:** `homePage` (ID: `cvR2moB0heiv46suvyX6m`)
- **Component:** `TestimonialBlockComponent` (ID: `O0GK3roj1BWmgYJTJsW3v`)

**Content:**
- **quote:** "It's like having an assistant who knows exactly what I meant — not just what I said."
- **author:** "Jordan Lee"
- **role:** "UX Researcher"
- **avatar:** `/images/testimonial-jordan.jpg` (needs to be uploaded to Basehub media)

**About Page Testimonial:**
- **Document:** `aboutPage` (needs verification)
- **Component:** `TestimonialBlockComponent` (ID: `O0GK3roj1BWmgYJTJsW3v`)

**Content:**
- **quote:** "Klutr doesn't just store information — it understands it."
- **author:** "Morgan Fields"
- **role:** "Product Designer"
- **avatar:** `/images/testimonial-morgan.jpg` (needs to be uploaded to Basehub media)

**Source:** `app/basehub/basehub-seed.json` lines 55-64 and 113-122

## Population Steps

### Option 1: Via Basehub Studio UI (Recommended)

1. **Login to Basehub Studio**
   - Navigate to your Basehub project
   - Open the document you want to edit

2. **For Pricing Page:**
   - Open `Pricing` document (ID: `jCYY3PW3cTrw4xffplQd5`)
   - Create 3 `PricingBlockComponent` instances
   - Fill in tierName, price, and ctaLink for each
   - Create 1 `CtaBlockComponent` instance with headline, ctaText, ctaLink

3. **For FAQ Page:**
   - Open `Faq` document (ID: `hL1bIWwVLVN5sE4gZhcC0`)
   - Create 1 `FaqBlockComponent` instance
   - Add 5 `QuestionBlockComponent` instances as children
   - Fill in question and answer (RichText) for each

4. **For Testimonials:**
   - Open `homePage` document (ID: `cvR2moB0heiv46suvyX6m`)
   - Create 1 `TestimonialBlockComponent` instance
   - Fill in quote (RichText), author, role
   - Upload avatar image to Basehub media and link
   - Repeat for `aboutPage` document

5. **Publish Changes**
   - Change document status from "Draft" to "Published"
   - Verify content renders on live pages

### Option 2: Via Basehub MCP API

The Basehub MCP API can be used programmatically, but requires careful formatting of nested instances. See `docs/basehub-population-guide.md` for detailed API usage.

**Note:** The MCP API has complexity with:
- Nested instance blocks (FAQ questions, pricing tiers)
- RichText fields (FAQ answers, testimonial quotes)
- Media uploads (testimonial avatars)

Manual population via UI is recommended for initial setup.

## Verification

After population, verify:

1. **Pricing Page** (`/pricing`)
   - Three pricing tiers display correctly
   - Prices and CTA links work
   - CTA block at bottom displays

2. **FAQ Page** (`/faq`)
   - All 5 questions display
   - Answers are formatted correctly
   - Accordion/collapse functionality works

3. **Testimonials**
   - Home page testimonial displays
   - About page testimonial displays
   - Avatar images load correctly

## Content Source

All content is available in:
- **File:** `app/basehub/basehub-seed.json`
- **Format:** JSON with complete content structure
- **Brand Voice:** Matches Klutr brand guidelines
- **Status:** Production-ready copy

## Next Steps

1. ✅ Content structure exists in Basehub
2. ✅ Seed data prepared in `basehub-seed.json`
3. ⏳ Manual population via Basehub Studio UI
4. ⏳ Upload testimonial avatar images
5. ⏳ Publish documents
6. ⏳ Verify on live pages

## Related Documentation

- `docs/basehub-population-guide.md` - Detailed API usage
- `docs/BASEHUB_CONTENT_STATUS.md` - Current content status
- `app/basehub/basehub-seed.json` - Source of truth for content


