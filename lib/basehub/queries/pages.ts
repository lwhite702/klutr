import {
  getHomePageBlocks,
  getAboutPageBlocks,
  getPricingPageBlocks,
  getFAQPageBlocks,
  type HeroBlock,
  type FeatureGridBlock,
  type TestimonialBlock,
  type HowItWorksBlock,
  type CtaBlock,
  type AboutBlock,
  type PricingBlock,
  type FaqBlock,
} from './blocks'

/**
 * Page-specific query wrapper functions
 * These functions provide a clean API for fetching complete page content from BaseHub
 */

/**
 * Get complete home page content
 * Returns all blocks needed for the home page
 */
export async function getHomeContent(): Promise<{
  heroBlock: HeroBlock | null
  featureGridBlock: FeatureGridBlock | null
  testimonialBlock: TestimonialBlock | null
  howItWorksBlock: HowItWorksBlock | null
  ctaBlock: CtaBlock | null
}> {
  return await getHomePageBlocks()
}

/**
 * Get complete about page content
 * Returns all blocks needed for the about page
 */
export async function getAboutContent(): Promise<{
  aboutBlock: AboutBlock | null
  testimonialBlock: TestimonialBlock | null
  ctaBlock: CtaBlock | null
}> {
  return await getAboutPageBlocks()
}

/**
 * Get complete pricing page content
 * Returns all blocks needed for the pricing page
 */
export async function getPricingContent(): Promise<{
  pricingBlock: PricingBlock | null
  ctaBlock: CtaBlock | null
}> {
  return await getPricingPageBlocks()
}

/**
 * Get complete FAQ page content
 * Returns FAQ block with all questions
 */
export async function getFaqContent(): Promise<{
  faqBlock: FaqBlock | null
}> {
  return await getFAQPageBlocks()
}

/**
 * Get complete features page content
 * Returns feature grid block
 */
export async function getFeaturesContent(): Promise<{
  featureGridBlock: FeatureGridBlock | null
}> {
  // Reuse home page blocks query for feature grid
  const homeBlocks = await getHomePageBlocks()
  return {
    featureGridBlock: homeBlocks.featureGridBlock,
  }
}

