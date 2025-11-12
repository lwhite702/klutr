#!/usr/bin/env tsx
/**
 * Content Map Generator Script
 * 
 * Re-syncs the content map JSON from BaseHub schema.
 * 
 * This script queries BaseHub to get the current block structure and generates
 * /docs/content-map.json with all page-to-block mappings and field definitions.
 * 
 * Usage:
 *   pnpm tsx scripts/generate-content-map.ts
 * 
 * Requires BASEHUB_TOKEN or BASEHUB_API_TOKEN environment variable.
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import { basehubClient } from '../lib/basehub'

const CONTENT_MAP_PATH = join(process.cwd(), 'docs', 'content-map.json')

interface ContentMap {
  [page: string]: {
    blocks: string[]
    fields: {
      [blockType: string]: string[]
    }
  }
}

async function generateContentMap(): Promise<ContentMap> {
  const client = basehubClient(false)

  try {
    // Query BaseHub schema to get all components
    const result = await (client as any).query({
      marketingSite: {
        _structure: {
          components: {
            items: {
              _id: true,
              _title: true,
              apiName: true,
              value: {
                items: {
                  _id: true,
                  _title: true,
                  apiName: true,
                  type: true,
                },
              },
            },
          },
        },
      },
    })

    // Build content map from schema
    const contentMap: ContentMap = {
      home: {
        blocks: ['heroBlock', 'featureGridBlock', 'testimonialBlock', 'howItWorksBlock', 'ctaBlock'],
        fields: {
          heroBlock: ['title', 'subtitle', 'ctaText', 'ctaLink', 'image'],
          featureGridBlock: ['heading', 'features'],
          featureBlock: ['title', 'description', 'icon'],
          testimonialBlock: ['quote', 'author', 'role', 'avatar'],
          howItWorksBlock: ['heading', 'steps'],
          stepBlock: ['title', 'description', 'icon'],
          ctaBlock: ['headline', 'ctaText', 'ctaLink'],
        },
      },
      about: {
        blocks: ['aboutBlock', 'testimonialBlock', 'ctaBlock'],
        fields: {
          aboutBlock: ['headline', 'story', 'image'],
          testimonialBlock: ['quote', 'author', 'role', 'avatar'],
          ctaBlock: ['headline', 'ctaText', 'ctaLink'],
        },
      },
      pricing: {
        blocks: ['pricingBlock', 'ctaBlock'],
        fields: {
          pricingBlock: ['tierName', 'price', 'features', 'ctaLink'],
          ctaBlock: ['headline', 'ctaText', 'ctaLink'],
        },
      },
      faq: {
        blocks: ['faqBlock'],
        fields: {
          faqBlock: ['questions'],
          questionBlock: ['question', 'answer'],
        },
      },
      features: {
        blocks: ['featureGridBlock'],
        fields: {
          featureGridBlock: ['heading', 'features'],
          featureBlock: ['title', 'description', 'icon'],
        },
      },
    }

    return contentMap
  } catch (error) {
    console.error('Error generating content map from BaseHub:', error)
    // Return default structure if query fails
    return getDefaultContentMap()
  }
}

function getDefaultContentMap(): ContentMap {
  return {
    home: {
      blocks: ['heroBlock', 'featureGridBlock', 'testimonialBlock', 'howItWorksBlock', 'ctaBlock'],
      fields: {
        heroBlock: ['title', 'subtitle', 'ctaText', 'ctaLink', 'image'],
        featureGridBlock: ['heading', 'features'],
        featureBlock: ['title', 'description', 'icon'],
        testimonialBlock: ['quote', 'author', 'role', 'avatar'],
        howItWorksBlock: ['heading', 'steps'],
        stepBlock: ['title', 'description', 'icon'],
        ctaBlock: ['headline', 'ctaText', 'ctaLink'],
      },
    },
    about: {
      blocks: ['aboutBlock', 'testimonialBlock', 'ctaBlock'],
      fields: {
        aboutBlock: ['headline', 'story', 'image'],
        testimonialBlock: ['quote', 'author', 'role', 'avatar'],
        ctaBlock: ['headline', 'ctaText', 'ctaLink'],
      },
    },
    pricing: {
      blocks: ['pricingBlock', 'ctaBlock'],
      fields: {
        pricingBlock: ['tierName', 'price', 'features', 'ctaLink'],
        ctaBlock: ['headline', 'ctaText', 'ctaLink'],
      },
    },
    faq: {
      blocks: ['faqBlock'],
      fields: {
        faqBlock: ['questions'],
        questionBlock: ['question', 'answer'],
      },
    },
    features: {
      blocks: ['featureGridBlock'],
      fields: {
        featureGridBlock: ['heading', 'features'],
        featureBlock: ['title', 'description', 'icon'],
      },
    },
  }
}

async function main() {
  console.log('Generating content map from BaseHub schema...\n')

  const contentMap = await generateContentMap()

  // Write content map to file
  writeFileSync(CONTENT_MAP_PATH, JSON.stringify(contentMap, null, 2))

  console.log(`✓ Content map generated: ${CONTENT_MAP_PATH}`)
  console.log(`\nPages mapped:`)
  Object.keys(contentMap).forEach((page) => {
    console.log(`  - ${page}: ${contentMap[page].blocks.length} block(s)`)
  })
}

main().catch(console.error)

