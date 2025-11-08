# BaseHub Schema Documentation

## Overview

BaseHub schema created via MCP tools for the Klutr marketing site. All schema definitions and content seeding were done programmatically using BaseHub's Mutation API.

**Date Created:** 2025-11-08  
**Schema Version:** 1.0  
**Method:** MCP Tools (basehub_klutr)

## Root Structure

```
marketingSite (Document)
├── pages (Collection)
├── features (Collection)
├── blog (Collection)
└── legal (Collection)
```

## Components

### 1. PageComponent
**API Name:** `page`  
**Purpose:** Template for marketing pages (home, about, etc.)

**Fields:**
- `slug` (text, required) - URL slug for the page
- `title` (text) - Page title
- `seoTitle` (text) - SEO-optimized title for meta tags
- `metaDescription` (text) - Meta description for SEO
- `heroHeadline` (text) - Main hero section headline
- `heroSubtext` (rich-text) - Hero section subheading/description
- `primaryCTA` (text) - Primary call-to-action button text
- `secondaryCTA` (text) - Secondary call-to-action button text

**Usage:**  
Used in the `pages` collection. Currently contains home page content.

---

### 2. FeatureComponent
**API Name:** `feature`  
**Purpose:** Template for product features

**Fields:**
- `name` (text, required) - Feature name
- `slug` (text, required) - URL-friendly slug
- `tagline` (text, required) - Short tagline (1-2 sentences)
- `description` (rich-text) - Detailed feature description
- `illustrationUrl` (media) - Feature illustration or icon
- `seoKeywords` (text) - SEO keywords for the feature

**Usage:**  
Used in the `features` collection. Currently contains 6 features:
1. MindStorm
2. QuickCapture
3. Smart Stacks
4. Write Notes
5. Plan your day
6. Learn facts

---

### 3. BlogPostComponent
**API Name:** `blogPost`  
**Purpose:** Template for blog articles

**Fields:**
- `title` (text, required) - Post title
- `slug` (text, required) - URL slug
- `category` (select) - Post category (Guide, Tutorial, News, Product)
- `content` (rich-text) - Full post content
- `excerpt` (text) - Short excerpt/summary
- `seoTitle` (text) - SEO title
- `metaDescription` (text) - Meta description
- `brandTag` (text) - Brand-specific tag
- `publishedAt` (date) - Publication date

**Usage:**  
Used in the `blog` collection. Currently empty, ready for posts.

---

### 4. LegalDocumentComponent
**API Name:** `legalDocument`  
**Purpose:** Template for legal documents (privacy policy, terms, etc.)

**Fields:**
- `title` (text, required) - Document title
- `slug` (text, required) - URL slug
- `content` (rich-text) - Full legal document content
- `lastUpdated` (date) - Last update date

**Usage:**  
Used in the `legal` collection. Currently empty, ready for legal documents.

---

## Collections

### pages
**Template:** PageComponent  
**Location:** `marketingSite.pages`  
**Current Entries:** 1 (home page)

**Home Page Content:**
- Slug: `home`
- SEO Title: "Klutr | Free Beta"
- Meta Description: "Capture notes, links, and lists — let AI organize your thoughts. Free beta now available."
- Hero Headline: "Clear the clutr. Keep the spark."
- Hero Subtext: "Klutr is the frictionless inbox for your brain..."
- Primary CTA: "Try for Free"
- Secondary CTA: "Log in"

---

### features
**Template:** FeatureComponent  
**Location:** `marketingSite.features`  
**Current Entries:** 6

**Seeded Features:**

1. **MindStorm**
   - Slug: `mindstorm`
   - Tagline: "AI clusters your notes into meaningful groups"
   - Description: Full feature description with benefits

2. **QuickCapture**
   - Slug: `quickcapture`
   - Tagline: "Dump text, images, or voice notes"
   - Description: Frictionless capture explanation

3. **Smart Stacks**
   - Slug: `stacks`
   - Tagline: "Intelligent collections that grow with your notes"
   - Description: AI-powered organization

4. **Write Notes**
   - Slug: `notes`
   - Tagline: "Write any notes you want"
   - Description: Note-taking interface

5. **Plan your day**
   - Slug: `planning`
   - Tagline: "Make sure your day is well planned"
   - Description: Task and schedule management

6. **Learn facts**
   - Slug: `learning`
   - Tagline: "It keeps your mind sharp"
   - Description: Knowledge storage and retrieval

---

### blog
**Template:** BlogPostComponent  
**Location:** `marketingSite.blog`  
**Current Entries:** 0 (ready for content)

---

### legal
**Template:** LegalDocumentComponent  
**Location:** `marketingSite.legal`  
**Current Entries:** 0 (ready for content)

---

## Querying Content

### Example: Get All Pages

```graphql
query GetPages {
  marketingSite {
    pages {
      items {
        _id
        _title
        slug
        title
        seoTitle
        metaDescription
        heroHeadline
        heroSubtext {
          plainText
        }
        primaryCTA
        secondaryCTA
      }
    }
  }
}
```

### Example: Get All Features

```graphql
query GetFeatures {
  marketingSite {
    features {
      items {
        _id
        _title
        name
        slug
        tagline
        description {
          plainText
        }
        illustrationUrl {
          url
          fileName
          altText
        }
        seoKeywords
      }
    }
  }
}
```

### Example: Get Home Page Content

```graphql
query GetHomePage {
  marketingSite {
    pages(filter: { slug: { eq: "home" } }) {
      items {
        _id
        heroHeadline
        heroSubtext {
          plainText
        }
        primaryCTA
        secondaryCTA
      }
    }
  }
}
```

---

## Next Steps

1. **Unhardcode Marketing Pages**
   - Replace static content in `app/(marketing)/page.tsx` with BaseHub queries
   - Use `basehubClient()` from `/lib/basehub.ts`
   - Fetch pages and features collections

2. **Add More Content**
   - Create additional pages (about, pricing, etc.)
   - Add blog posts
   - Add legal documents (privacy policy, terms of service)

3. **Add Media Assets**
   - Upload feature illustrations
   - Add blog post images
   - Add OG images for SEO

4. **Enable Preview Mode**
   - Set up preview URLs in BaseHub
   - Add preview mode to Next.js pages

---

## Technical Notes

- All components are marked as `hidden: true` to skip validation on empty template fields
- Components serve as reusable templates for collections
- Collections use the `rows` field to store instances of their template component
- Rich-text fields use markdown format for easy editing
- All content created via MCP tools, no manual BaseHub UI interaction required

---

## Schema Creation Method

This schema was created programmatically using BaseHub's MCP tools:

1. Created components using `create_blocks` with type `component`
2. Created document structure using `create_blocks` with type `document`
3. Created collections using `create_blocks` with type `collection` and `template` referencing component IDs
4. Seeded initial content by including `rows` in collection creation
5. Updated components to be hidden using `update_blocks`
6. Committed all changes using the `commit` tool

This approach ensures:
- Version-controlled schema definitions
- Reproducible schema setup
- Automated content seeding
- No manual UI interactions required

