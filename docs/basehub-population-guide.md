# BaseHub Content Population Guide

**Date:** 2025-01-11  
**Status:** Manual Population Required

## Overview

This guide documents the process for populating BaseHub with marketing page content from `app/basehub/basehub-seed.json`. Due to the complexity of BaseHub's instance creation API format, manual population via BaseHub Studio UI is recommended for initial setup.

## BaseHub Structure

### Existing Components

All required components have been created in BaseHub:

- ✅ `heroBlock` (HeroBlockComponent) - ID: `DczJhziYwBEYyDCe7OwVx`
- ✅ `featureBlock` (FeatureBlockComponent) - ID: `Bm3BzaAXK8uGTBFWekZOw`
- ✅ `featureGridBlock` (FeatureGridBlockComponent) - ID: `HLWTdmM1rUwL5qMLsFORQ`
- ✅ `testimonialBlock` (TestimonialBlockComponent) - ID: `O0GK3roj1BWmgYJTJsW3v`
- ✅ `stepBlock` (StepBlockComponent) - ID: `cJQauttMliI5hTP1AnkaU`
- ✅ `howItWorksBlock` (HowItWorksBlockComponent) - ID: `rMfS1sarTcsyhL7SQP85R`
- ✅ `aboutBlock` (AboutBlockComponent) - ID: `ejq7XlAcUFfYNQNFDWLj4`
- ✅ `ctaBlock` (CtaBlockComponent) - ID: `P7TGPD0DWFqjH4r6nKWsb`
- ✅ `questionBlock` (QuestionBlockComponent) - ID: `ymygJHGTtNtJEs9lR7HCB`
- ✅ `faqBlock` (FaqBlockComponent) - ID: `IqplgWCuDXhXqdp310uUq`
- ✅ `pricingBlock` (PricingBlockComponent) - ID: `qSPi9g1rGGSDIceKlKit8`
- ✅ `helpTopicBlock` (HelpTopicBlockComponent) - ID: `5oqczJ68itniSxj2JlHWQ`
- ✅ `onboardingIntroBlock` (OnboardingIntroBlockComponent) - ID: `1frcyFtSaRU2dKSei3J0B`
- ✅ `onboardingStepBlock` (OnboardingStepBlockComponent) - ID: `eTLXCi8X1TFiTAmbZ6JFY`
- ✅ `onboardingCompletionBlock` (OnboardingCompletionBlockComponent) - ID: `N6f8x0MOSN4w0BAuuTwQT`

### Existing Documents

- ✅ `HomePage` document created - ID: `cvR2moB0heiv46suvyX6m`

## Manual Population Process

### Step 1: Create Page Documents

For each marketing page, create a document block in BaseHub:

1. **Home Page** (`homePage`)

   - Title: "Home Page"
   - Slug: `home` (optional, for routing)

2. **About Page** (`aboutPage`)

   - Title: "About Klutr"
   - Slug: `about`

3. **Pricing Page** (`pricingPage`)

   - Title: "Pricing"
   - Slug: `pricing`

4. **FAQ Page** (`faqPage`)

   - Title: "FAQ"
   - Slug: `faq`

5. **Features Page** (`featuresPage`)

   - Title: "Features"
   - Slug: `features`

6. **Help Page** (`helpPage`)

   - Title: "Help Center"
   - Slug: `help`

7. **Onboarding Page** (`onboardingPage`)
   - Title: "Onboarding"
   - Slug: `onboarding`

### Step 2: Create Child Instances First

For blocks with nested arrays, create child instances first:

#### Home Page - Feature Blocks

Create 4 `featureBlock` instances:

1. "Chat-First Notes" - See seed data: `home.featureGridBlock.features[0]`
2. "Smart Clustering" - See seed data: `home.featureGridBlock.features[1]`
3. "Search That Thinks" - See seed data: `home.featureGridBlock.features[2]`
4. "Drop Anything" - See seed data: `home.featureGridBlock.features[3]`

#### Home Page - Step Blocks

Create 3 `stepBlock` instances:

1. "Drop Anything" - See seed data: `home.howItWorksBlock.steps[0]`
2. "Watch It Organize" - See seed data: `home.howItWorksBlock.steps[1]`
3. "Search & Share" - See seed data: `home.howItWorksBlock.steps[2]`

#### FAQ Page - Question Blocks

Create 5 `questionBlock` instances:

1. "What makes Klutr different?" - See seed data: `faq.faqBlock.questions[0]`
2. "Can I import notes from other apps?" - See seed data: `faq.faqBlock.questions[1]`
3. "Is my data secure?" - See seed data: `faq.faqBlock.questions[2]`
4. "How does AI clustering work?" - See seed data: `faq.faqBlock.questions[3]`
5. "Can I use Klutr offline?" - See seed data: `faq.faqBlock.questions[4]`

#### Features Page - Feature Blocks

Create 4 `featureBlock` instances (same as home page features):

1. "Conversational Capture" - See seed data: `features.featureGridBlock.features[0]`
2. "Auto-Tagging & Clustering" - See seed data: `features.featureGridBlock.features[1]`
3. "Rich Media Support" - See seed data: `features.featureGridBlock.features[2]`
4. "Instant Retrieval" - See seed data: `features.featureGridBlock.features[3]`

#### Help Page - Help Topic Blocks

Create 6 `helpTopicBlock` instances:

1. "Getting Started" - See seed data: `help.helpTopicBlock[0]`
2. "Using AI Clustering" - See seed data: `help.helpTopicBlock[1]`
3. "Security & Privacy" - See seed data: `help.helpTopicBlock[2]`
4. "Capturing Notes" - See seed data: `help.helpTopicBlock[3]`
5. "Understanding Tags" - See seed data: `help.helpTopicBlock[4]`
6. "Using the Vault" - See seed data: `help.helpTopicBlock[5]`

#### Onboarding Page - Step Blocks

Create 3 `onboardingStepBlock` instances:

1. "Start a Conversation" - See seed data: `onboarding.onboardingStepBlock[0]`
2. "Let Klutr Work" - See seed data: `onboarding.onboardingStepBlock[1]`
3. "Find It Instantly" - See seed data: `onboarding.onboardingStepBlock[2]`

### Step 3: Create Parent Instances

After child instances are created, create parent instances that reference them:

#### Home Page

1. **heroBlock** instance

   - Title: "Organize Your Chaos."
   - Subtitle: "Klutr turns your thoughts, drops, and messages into structured knowledge — automatically."
   - CTA Text: "Try Klutr Free"
   - CTA Link: "/signup"
   - Image: Use placeholder URL: `https://placehold.co/800x600/00C896/ffffff?text=Placeholder`

2. **featureGridBlock** instance

   - Heading: "Why People Switch to Klutr"
   - Features: Reference the 4 featureBlock instances created in Step 2

3. **testimonialBlock** instance

   - Quote: "It's like having an assistant who knows exactly what I meant — not just what I said."
   - Author: "Jordan Lee"
   - Role: "UX Researcher"
   - Avatar: Use placeholder URL

4. **howItWorksBlock** instance

   - Heading: "How Klutr Works"
   - Steps: Reference the 3 stepBlock instances created in Step 2

5. **ctaBlock** instance
   - Headline: "Start Organizing Smarter"
   - CTA Text: "Get Early Access"
   - CTA Link: "/signup"

#### About Page

1. **aboutBlock** instance

   - Headline: "Our Story"
   - Story: "Klutr began as a messy collection of notes and screenshots..."
   - Image: Use placeholder URL

2. **testimonialBlock** instance

   - Quote: "Klutr doesn't just store information — it understands it."
   - Author: "Morgan Fields"
   - Role: "Product Designer"
   - Avatar: Use placeholder URL

3. **ctaBlock** instance
   - Headline: "Join the Beta, It's Free for Now"
   - CTA Text: "Sign Up"
   - CTA Link: "/signup"

#### Pricing Page

1. **pricingBlock** instances (3 tiers):

   - "Free Beta" - $0 - See seed data
   - "Pro" - $8/mo - See seed data
   - "Team" - $20/mo/user - See seed data

2. **ctaBlock** instance
   - Headline: "Get Started for Free"
   - CTA Text: "Sign Up"
   - CTA Link: "/signup"

#### FAQ Page

1. **faqBlock** instance
   - Questions: Reference the 5 questionBlock instances created in Step 2

#### Features Page

1. **featureGridBlock** instance
   - Heading: "Everything Klutr Can Do"
   - Features: Reference the 4 featureBlock instances created in Step 2

#### Help Page

- All 6 helpTopicBlock instances created in Step 2 (no parent block needed)

#### Onboarding Page

1. **onboardingIntroBlock** instance

   - Headline: "Welcome to Klutr"
   - Description: "Klutr helps you capture, organize, and rediscover your ideas effortlessly..."
   - CTA Text: "Let's Go"

2. **onboardingStepBlock** instances (3) - Already created in Step 2

3. **onboardingCompletionBlock** instance
   - Message: "You're ready to organize your chaos."
   - CTA Text: "Go to Dashboard"
   - CTA Link: "/app"

### Step 4: Link Blocks to Page Documents

After all instances are created:

1. Open each page document in BaseHub Studio
2. Add instance blocks as children in the correct order:
   - **Home Page:** heroBlock → featureGridBlock → testimonialBlock → howItWorksBlock → ctaBlock
   - **About Page:** aboutBlock → testimonialBlock → ctaBlock
   - **Pricing Page:** pricingBlock (3 instances) → ctaBlock
   - **FAQ Page:** faqBlock
   - **Features Page:** featureGridBlock
   - **Help Page:** helpTopicBlock (6 instances)
   - **Onboarding Page:** onboardingIntroBlock → onboardingStepBlock (3) → onboardingCompletionBlock

### Step 5: Commit Changes

Once all content is populated:

1. Review all blocks in BaseHub Studio
2. Verify all required fields are populated
3. Use BaseHub's commit feature to publish changes
4. Commit message: "feat(basehub): populate marketing pages and block instances for Klutr"

## Field Formatting Notes

### RichText Fields

For RichText fields (description, story, quote, answer, content), use markdown format:

- Plain text: Just type the text
- Bold: `**text**`
- Italic: `*text*`
- Links: `[text](url)`

### Media Fields

For Media fields (image, icon, avatar), use placeholder URLs initially:

- URL: `https://placehold.co/800x600/00C896/ffffff?text=Placeholder`
- File Name: `placeholder.png`
- Alt Text: Descriptive text for accessibility

### Text Fields with Arrays

For fields like `tags` and `relatedLinks` in `helpTopicBlock`:

- **Tags:** Enter as comma-separated values: `onboarding, basics, getting-started`
- **Related Links:** Enter as comma-separated text: `Onboarding Guide, FAQ`

## Reference: Seed Data Structure

All content values are available in `app/basehub/basehub-seed.json`. Use this file as the source of truth for:

- Text content
- Field values
- Block relationships
- Media placeholders

## Troubleshooting

### Instance Creation Issues

If you encounter errors creating instances:

1. Verify the component exists in BaseHub
2. Check that all required fields are provided
3. Ensure RichText fields use markdown format
4. Verify media URLs are accessible

### Nested Instance References

When creating parent blocks that reference child instances:

1. Create all child instances first
2. Note the instance IDs
3. When creating the parent, use BaseHub's UI to select child instances from the dropdown
4. Do not try to reference instances by ID manually

### Commit Issues

If commit fails:

1. Check for validation errors in BaseHub Studio
2. Ensure all required fields are filled
3. Verify no circular references exist
4. Check that all media URLs are valid

## Next Steps After Population

1. **Update Query Functions:** Once content is populated, update the query functions in `lib/basehub/queries/blocks.ts` and `lib/basehub/queries/pages.ts` to fetch actual BaseHub content instead of returning null placeholders.

2. **Test Pages:** Verify all marketing pages render correctly with BaseHub content.

3. **Replace Placeholder Media:** Upload actual images and replace placeholder URLs.

4. **Content Review:** Review all content for brand voice compliance and accuracy.

5. **Accessibility Audit:** Run accessibility tests to ensure all content meets WCAG 2.1 AA standards.

## Automated Population (Future)

A future enhancement could create a more robust script that:

- Handles BaseHub API format complexity
- Includes retry logic for timeouts
- Validates content before creation
- Provides detailed error reporting

For now, manual population via BaseHub Studio UI is the most reliable approach.
