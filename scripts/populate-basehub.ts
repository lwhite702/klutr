#!/usr/bin/env tsx
/**
 * BaseHub Content Population Script
 * 
 * Populates BaseHub with all marketing page content from basehub-seed.json
 * Creates instances in bottom-up order: children first, then parents, then documents
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { teamsEnabled } from '../lib/runtimeFlags'

// Component IDs from BaseHub structure
const COMPONENT_IDS = {
  heroBlock: 'DczJhziYwBEYyDCe7OwVx',
  testimonialBlock: 'O0GK3roj1BWmgYJTJsW3v',
  stepBlock: 'cJQauttMliI5hTP1AnkaU',
  aboutBlock: 'ejq7XlAcUFfYNQNFDWLj4',
  ctaBlock: 'P7TGPD0DWFqjH4r6nKWsb',
  questionBlock: 'ymygJHGTtNtJEs9lR7HCB',
  featureBlock: 'Bm3BzaAXK8uGTBFWekZOw',
  pricingBlock: 'qSPi9g1rGGSDIceKlKit8',
  featureGridBlock: 'HLWTdmM1rUwL5qMLsFORQ',
  howItWorksBlock: 'rMfS1sarTcsyhL7SQP85R',
  faqBlock: 'IqplgWCuDXhXqdp310uUq',
  helpTopicBlock: '5oqczJ68itniSxj2JlHWQ',
  onboardingIntroBlock: '1frcyFtSaRU2dKSei3J0B',
  onboardingStepBlock: 'eTLXCi8X1TFiTAmbZ6JFY',
  onboardingCompletionBlock: 'N6f8x0MOSN4w0BAuuTwQT',
}

// Placeholder image URL
const PLACEHOLDER_IMAGE = {
  url: 'https://placehold.co/800x600/00C896/ffffff?text=Placeholder',
  fileName: 'placeholder.png',
  altText: 'Placeholder image',
}

interface InstanceMap {
  [key: string]: string // block key -> instance ID
}

/**
 * Convert media object to BaseHub format
 */
function formatMedia(media: { url: string; fileName: string; altText: string } | null) {
  if (!media) return null
  return {
    url: media.url.startsWith('http') ? media.url : PLACEHOLDER_IMAGE.url,
    fileName: media.fileName || 'placeholder.png',
    altText: media.altText || 'Placeholder image',
  }
}

/**
 * Convert RichText content to BaseHub format
 */
function formatRichText(content: string) {
  return {
    format: 'markdown' as const,
    value: content,
  }
}

/**
 * Convert array to comma-separated string for Text fields
 */
function arrayToString(arr: string[] | Array<{ text: string; url: string }>): string {
  if (arr.length === 0) return ''
  if (typeof arr[0] === 'string') {
    return (arr as string[]).join(', ')
  }
  return (arr as Array<{ text: string; url: string }>)
    .map(item => `${item.text || item.url}`)
    .join(', ')
}

async function main() {
  // Load seed data
  const seedPath = join(process.cwd(), 'app', 'basehub', 'basehub-seed.json')
  const seedData = JSON.parse(readFileSync(seedPath, 'utf-8'))
  
  const instanceMap: InstanceMap = {}
  
  console.log('Starting BaseHub content population...')
  console.log('This script will create instances via BaseHub MCP calls')
  console.log('Note: Actual MCP calls need to be made manually or via a BaseHub client')
  
  // Track what needs to be created
  const creationPlan = {
    childInstances: [] as any[],
    parentInstances: [] as any[],
    simpleInstances: [] as any[],
    pageDocuments: [] as any[],
  }
  
  // ===== HOME PAGE =====
  console.log('\n=== HOME PAGE ===')
  
  // 1. Create 4 featureBlock instances
  const homeFeatures = seedData.home.featureGridBlock.features
  for (let i = 0; i < homeFeatures.length; i++) {
    const feature = homeFeatures[i]
    creationPlan.childInstances.push({
      type: 'instance',
      mainComponentId: COMPONENT_IDS.featureBlock,
      title: feature.title,
      value: {
        title: feature.title,
        description: formatRichText(feature.description),
        icon: formatMedia(feature.icon),
      },
      key: `home-feature-${i}`,
    })
  }
  
  // 2. Create 3 stepBlock instances
  const homeSteps = seedData.home.howItWorksBlock.steps
  for (let i = 0; i < homeSteps.length; i++) {
    const step = homeSteps[i]
    creationPlan.childInstances.push({
      type: 'instance',
      mainComponentId: COMPONENT_IDS.stepBlock,
      title: step.title,
      value: {
        title: step.title,
        description: formatRichText(step.description),
        icon: formatMedia(step.icon),
      },
      key: `home-step-${i}`,
    })
  }
  
  // 3. Create simple instances
  creationPlan.simpleInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.heroBlock,
    title: 'Home Hero',
    value: {
      title: seedData.home.heroBlock.title,
      subtitle: seedData.home.heroBlock.subtitle,
      ctaText: seedData.home.heroBlock.ctaText,
      ctaLink: seedData.home.heroBlock.ctaLink,
      image: formatMedia(seedData.home.heroBlock.image),
    },
    key: 'home-hero',
  })
  
  creationPlan.simpleInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.testimonialBlock,
    title: 'Home Testimonial',
    value: {
      quote: formatRichText(seedData.home.testimonialBlock.quote),
      author: seedData.home.testimonialBlock.author,
      role: seedData.home.testimonialBlock.role,
      avatar: formatMedia(seedData.home.testimonialBlock.avatar),
    },
    key: 'home-testimonial',
  })
  
  creationPlan.simpleInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.ctaBlock,
    title: 'Home CTA',
    value: {
      headline: seedData.home.ctaBlock.headline,
      ctaText: seedData.home.ctaBlock.ctaText,
      ctaLink: seedData.home.ctaBlock.ctaLink,
    },
    key: 'home-cta',
  })
  
  // 4. Create parent instances (will reference child IDs after creation)
  creationPlan.parentInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.featureGridBlock,
    title: 'Home Feature Grid',
    value: {
      heading: seedData.home.featureGridBlock.heading,
      features: ['home-feature-0', 'home-feature-1', 'home-feature-2', 'home-feature-3'], // Placeholder keys
    },
    key: 'home-feature-grid',
  })
  
  creationPlan.parentInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.howItWorksBlock,
    title: 'Home How It Works',
    value: {
      heading: seedData.home.howItWorksBlock.heading,
      steps: ['home-step-0', 'home-step-1', 'home-step-2'], // Placeholder keys
    },
    key: 'home-how-it-works',
  })
  
  // ===== ABOUT PAGE =====
  console.log('\n=== ABOUT PAGE ===')
  
  creationPlan.simpleInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.aboutBlock,
    title: 'About Block',
    value: {
      headline: seedData.about.aboutBlock.headline,
      story: formatRichText(seedData.about.aboutBlock.story),
      image: formatMedia(seedData.about.aboutBlock.image),
    },
    key: 'about-block',
  })
  
  creationPlan.simpleInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.testimonialBlock,
    title: 'About Testimonial',
    value: {
      quote: formatRichText(seedData.about.testimonialBlock.quote),
      author: seedData.about.testimonialBlock.author,
      role: seedData.about.testimonialBlock.role,
      avatar: formatMedia(seedData.about.testimonialBlock.avatar),
    },
    key: 'about-testimonial',
  })
  
  creationPlan.simpleInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.ctaBlock,
    title: 'About CTA',
    value: {
      headline: seedData.about.ctaBlock.headline,
      ctaText: seedData.about.ctaBlock.ctaText,
      ctaLink: seedData.about.ctaBlock.ctaLink,
    },
    key: 'about-cta',
  })
  
  // ===== PRICING PAGE =====
  console.log('\n=== PRICING PAGE ===')
  
  const pricingTiers = seedData.pricing.pricingBlock.filter(
    (tier: { tierName: string; disabled?: boolean }) =>
      !tier.disabled && (teamsEnabled || tier.tierName !== 'Team')
  )
  for (let i = 0; i < pricingTiers.length; i++) {
    const tier = pricingTiers[i]
    creationPlan.simpleInstances.push({
      type: 'instance',
      mainComponentId: COMPONENT_IDS.pricingBlock,
      title: tier.tierName,
      value: {
        tierName: tier.tierName,
        price: tier.price,
        ctaLink: tier.ctaLink,
      },
      key: `pricing-tier-${i}`,
    })
  }
  
  creationPlan.simpleInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.ctaBlock,
    title: 'Pricing CTA',
    value: {
      headline: seedData.pricing.ctaBlock.headline,
      ctaText: seedData.pricing.ctaBlock.ctaText,
      ctaLink: seedData.pricing.ctaBlock.ctaLink,
    },
    key: 'pricing-cta',
  })
  
  // ===== FAQ PAGE =====
  console.log('\n=== FAQ PAGE ===')
  
  const faqQuestions = seedData.faq.faqBlock.questions
  for (let i = 0; i < faqQuestions.length; i++) {
    const q = faqQuestions[i]
    creationPlan.childInstances.push({
      type: 'instance',
      mainComponentId: COMPONENT_IDS.questionBlock,
      title: q.question,
      value: {
        question: q.question,
        answer: formatRichText(q.answer),
      },
      key: `faq-question-${i}`,
    })
  }
  
  creationPlan.parentInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.faqBlock,
    title: 'FAQ Block',
    value: {
      questions: ['faq-question-0', 'faq-question-1', 'faq-question-2', 'faq-question-3', 'faq-question-4'], // Placeholder keys
    },
    key: 'faq-block',
  })
  
  // ===== FEATURES PAGE =====
  console.log('\n=== FEATURES PAGE ===')
  
  const featuresFeatures = seedData.features.featureGridBlock.features
  for (let i = 0; i < featuresFeatures.length; i++) {
    const feature = featuresFeatures[i]
    creationPlan.childInstances.push({
      type: 'instance',
      mainComponentId: COMPONENT_IDS.featureBlock,
      title: feature.title,
      value: {
        title: feature.title,
        description: formatRichText(feature.description),
        icon: formatMedia(feature.icon),
      },
      key: `features-feature-${i}`,
    })
  }
  
  creationPlan.parentInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.featureGridBlock,
    title: 'Features Feature Grid',
    value: {
      heading: seedData.features.featureGridBlock.heading,
      features: ['features-feature-0', 'features-feature-1', 'features-feature-2', 'features-feature-3'], // Placeholder keys
    },
    key: 'features-feature-grid',
  })
  
  // ===== HELP PAGE =====
  console.log('\n=== HELP PAGE ===')
  
  const helpTopics = seedData.help.helpTopicBlock
  for (let i = 0; i < helpTopics.length; i++) {
    const topic = helpTopics[i]
    creationPlan.simpleInstances.push({
      type: 'instance',
      mainComponentId: COMPONENT_IDS.helpTopicBlock,
      title: topic.title,
      value: {
        title: topic.title,
        content: formatRichText(topic.content),
        tags: arrayToString(topic.tags),
        relatedLinks: arrayToString(topic.relatedLinks),
      },
      key: `help-topic-${i}`,
    })
  }
  
  // ===== ONBOARDING PAGE =====
  console.log('\n=== ONBOARDING PAGE ===')
  
  creationPlan.simpleInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.onboardingIntroBlock,
    title: 'Onboarding Intro',
    value: {
      headline: seedData.onboarding.onboardingIntroBlock.headline,
      description: formatRichText(seedData.onboarding.onboardingIntroBlock.description),
      ctaText: seedData.onboarding.onboardingIntroBlock.ctaText,
    },
    key: 'onboarding-intro',
  })
  
  const onboardingSteps = seedData.onboarding.onboardingStepBlock
  for (let i = 0; i < onboardingSteps.length; i++) {
    const step = onboardingSteps[i]
    creationPlan.simpleInstances.push({
      type: 'instance',
      mainComponentId: COMPONENT_IDS.onboardingStepBlock,
      title: step.title,
      value: {
        title: step.title,
        description: formatRichText(step.description),
        image: formatMedia(step.image),
      },
      key: `onboarding-step-${i}`,
    })
  }
  
  creationPlan.simpleInstances.push({
    type: 'instance',
    mainComponentId: COMPONENT_IDS.onboardingCompletionBlock,
    title: 'Onboarding Completion',
    value: {
      message: seedData.onboarding.onboardingCompletionBlock.message,
      ctaText: seedData.onboarding.onboardingCompletionBlock.ctaText,
      ctaLink: seedData.onboarding.onboardingCompletionBlock.ctaLink,
    },
    key: 'onboarding-completion',
  })
  
  // ===== PAGE DOCUMENTS =====
  creationPlan.pageDocuments.push({
    type: 'document',
    title: 'Home Page',
    slug: 'home',
    key: 'home-page',
  })
  
  creationPlan.pageDocuments.push({
    type: 'document',
    title: 'About Klutr',
    slug: 'about',
    key: 'about-page',
  })
  
  creationPlan.pageDocuments.push({
    type: 'document',
    title: 'Pricing',
    slug: 'pricing',
    key: 'pricing-page',
  })
  
  creationPlan.pageDocuments.push({
    type: 'document',
    title: 'FAQ',
    slug: 'faq',
    key: 'faq-page',
  })
  
  creationPlan.pageDocuments.push({
    type: 'document',
    title: 'Features',
    slug: 'features',
    key: 'features-page',
  })
  
  creationPlan.pageDocuments.push({
    type: 'document',
    title: 'Help Center',
    slug: 'help',
    key: 'help-page',
  })
  
  creationPlan.pageDocuments.push({
    type: 'document',
    title: 'Onboarding',
    slug: 'onboarding',
    key: 'onboarding-page',
  })
  
  // Output creation plan
  console.log('\n=== CREATION PLAN SUMMARY ===')
  console.log(`Child Instances: ${creationPlan.childInstances.length}`)
  console.log(`Parent Instances: ${creationPlan.parentInstances.length}`)
  console.log(`Simple Instances: ${creationPlan.simpleInstances.length}`)
  console.log(`Page Documents: ${creationPlan.pageDocuments.length}`)
  console.log(`Total: ${creationPlan.childInstances.length + creationPlan.parentInstances.length + creationPlan.simpleInstances.length + creationPlan.pageDocuments.length}`)
  
  // Write plan to file for reference
  const planPath = join(process.cwd(), 'docs', 'basehub-creation-plan.json')
  require('fs').writeFileSync(planPath, JSON.stringify(creationPlan, null, 2))
  console.log(`\nCreation plan written to: ${planPath}`)
  console.log('\nNote: This script generates the plan. Actual BaseHub MCP calls need to be made separately.')
}

main().catch(console.error)

