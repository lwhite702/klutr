import { basehubClient } from '@/lib/basehub'
import { draftMode } from 'next/headers'

/**
 * BaseHub block query functions for marketing pages
 * 
 * These functions fetch block-based content from BaseHub for dynamic page composition.
 * All queries support draft mode for previewing unpublished content.
 */

export interface HeroBlock {
  title: string | null
  subtitle: string | null
  ctaText: string | null
  ctaLink: string | null
  image: {
    url: string
    fileName: string
    altText: string | null
  } | null
}

export interface FeatureBlock {
  title: string | null
  description: string | null
  icon: {
    url: string
    fileName: string
    altText: string | null
  } | null
}

export interface FeatureGridBlock {
  heading: string | null
  features: FeatureBlock[]
}

export interface TestimonialBlock {
  quote: string | null
  author: string | null
  role: string | null
  avatar: {
    url: string
    fileName: string
    altText: string | null
  } | null
}

export interface StepBlock {
  title: string | null
  description: string | null
  icon: {
    url: string
    fileName: string
    altText: string | null
  } | null
}

export interface HowItWorksBlock {
  heading: string | null
  steps: StepBlock[]
}

export interface AboutBlock {
  headline: string | null
  story: string | null
  image: {
    url: string
    fileName: string
    altText: string | null
  } | null
}

export interface CtaBlock {
  headline: string | null
  ctaText: string | null
  ctaLink: string | null
}

export interface PricingBlock {
  tierName: string | null
  price: string | null
  features: string[]
  ctaLink: string | null
}

export interface QuestionBlock {
  question: string | null
  answer: string | null
}

export interface FaqBlock {
  questions: QuestionBlock[]
}

export interface HelpTopicBlock {
  title: string | null
  content: string | null
  tags: string[]
  relatedLinks: Array<{
    text: string | null
    url: string | null
  }>
}

export interface OnboardingIntroBlock {
  headline: string | null
  description: string | null
  ctaText: string | null
}

export interface OnboardingStepBlock {
  title: string | null
  description: string | null
  image: {
    url: string
    fileName: string
    altText: string | null
  } | null
}

export interface OnboardingCompletionBlock {
  message: string | null
  ctaText: string | null
  ctaLink: string | null
}

/**
 * Fetch home page blocks from BaseHub
 * Returns blocks in order: heroBlock → featureGridBlock → testimonialBlock → howItWorksBlock → ctaBlock
 */
export async function getHomePageBlocks(): Promise<{
  heroBlock: HeroBlock | null
  featureGridBlock: FeatureGridBlock | null
  testimonialBlock: TestimonialBlock | null
  howItWorksBlock: HowItWorksBlock | null
  ctaBlock: CtaBlock | null
}> {
  try {
    const { isEnabled } = await draftMode()
    const client = basehubClient(isEnabled)

    // Query will be implemented once page structure is created in BaseHub
    // For now, return null values as placeholders
    return {
      heroBlock: null,
      featureGridBlock: null,
      testimonialBlock: null,
      howItWorksBlock: null,
      ctaBlock: null,
    }
  } catch (error) {
    console.error('Error fetching home page blocks from BaseHub:', error)
    return {
      heroBlock: null,
      featureGridBlock: null,
      testimonialBlock: null,
      howItWorksBlock: null,
      ctaBlock: null,
    }
  }
}

/**
 * Fetch about page blocks from BaseHub
 * Returns blocks in order: aboutBlock → testimonialBlock → ctaBlock
 */
export async function getAboutPageBlocks(): Promise<{
  aboutBlock: AboutBlock | null
  testimonialBlock: TestimonialBlock | null
  ctaBlock: CtaBlock | null
}> {
  try {
    const { isEnabled } = await draftMode()
    const client = basehubClient(isEnabled)

    // Query will be implemented once page structure is created in BaseHub
    return {
      aboutBlock: null,
      testimonialBlock: null,
      ctaBlock: null,
    }
  } catch (error) {
    console.error('Error fetching about page blocks from BaseHub:', error)
    return {
      aboutBlock: null,
      testimonialBlock: null,
      ctaBlock: null,
    }
  }
}

/**
 * Fetch pricing page blocks from BaseHub
 * Returns blocks in order: pricingBlock → ctaBlock
 */
export async function getPricingPageBlocks(): Promise<{
  pricingBlock: PricingBlock | null
  ctaBlock: CtaBlock | null
}> {
  try {
    const { isEnabled } = await draftMode()
    const client = basehubClient(isEnabled)

    // Query will be implemented once page structure is created in BaseHub
    return {
      pricingBlock: null,
      ctaBlock: null,
    }
  } catch (error) {
    console.error('Error fetching pricing page blocks from BaseHub:', error)
    return {
      pricingBlock: null,
      ctaBlock: null,
    }
  }
}

/**
 * Fetch FAQ page blocks from BaseHub
 * Returns: faqBlock
 */
export async function getFAQPageBlocks(): Promise<{
  faqBlock: FaqBlock | null
}> {
  try {
    const { isEnabled } = await draftMode()
    const client = basehubClient(isEnabled)

    // Query will be implemented once page structure is created in BaseHub
    return {
      faqBlock: null,
    }
  } catch (error) {
    console.error('Error fetching FAQ page blocks from BaseHub:', error)
    return {
      faqBlock: null,
    }
  }
}

/**
 * Fetch help topics from BaseHub
 * Supports filtering by tags
 * Returns array of helpTopicBlock instances
 */
export async function getHelpTopics(tagFilter?: string): Promise<HelpTopicBlock[]> {
  try {
    const { isEnabled } = await draftMode()
    const client = basehubClient(isEnabled)

    // Query will be implemented once help content structure is created in BaseHub
    // For now, return empty array as placeholder
    return []
  } catch (error) {
    console.error('Error fetching help topics from BaseHub:', error)
    return []
  }
}

/**
 * Fetch onboarding steps from BaseHub
 * Returns: introBlock, steps array, completionBlock
 */
export async function getOnboardingSteps(): Promise<{
  introBlock: OnboardingIntroBlock | null
  steps: OnboardingStepBlock[]
  completionBlock: OnboardingCompletionBlock | null
}> {
  try {
    const { isEnabled } = await draftMode()
    const client = basehubClient(isEnabled)

    // Query will be implemented once onboarding content structure is created in BaseHub
    return {
      introBlock: null,
      steps: [],
      completionBlock: null,
    }
  } catch (error) {
    console.error('Error fetching onboarding steps from BaseHub:', error)
    return {
      introBlock: null,
      steps: [],
      completionBlock: null,
    }
  }
}

