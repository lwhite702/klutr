# BaseHub Content Updates for Stream Architecture

This document outlines the content updates needed in BaseHub to reflect the Stream-first architecture redesign.

## Home Page Updates

**Collection:** `marketingSite.pages`  
**Item:** `slug: "home"`

### Content to Update:

**Hero Headline:**
```
Organize Your Chaos
```

**Hero Subtext (rich-text):**
```
Klutr is a conversational workspace where all your input—text, voice, images, files—flows naturally through a Stream interface and gets automatically organized on the backend. Drop your thoughts like messages in a chat, and we'll handle the rest.
```

**Primary CTA:**
```
Try for Free
```

**Secondary CTA:**
```
View Features
```

**SEO Title:**
```
Klutr – Organize Your Chaos
```

**Meta Description:**
```
Chat-style AI note app that turns your mess of ideas into structured clarity. Capture everything, organize it effortlessly, and discover insights with AI.
```

## Features Collection Updates

**Collection:** `marketingSite.features`

### Update Existing Features or Add New:

#### 1. Stream
- **Name:** Stream
- **Slug:** stream
- **Tagline:** Chat-style interface where all your thoughts flow naturally
- **Description:** Stream replaces traditional note views with a conversational feed. Every entry you add—whether it's text, an image, a document, or a voice recording—is called a "drop." AI automatically tags and organizes your drops into Boards and Smart Tags in the background.
- **SEO Keywords:** stream, chat interface, conversational workspace, drops

#### 2. Boards
- **Name:** Boards
- **Slug:** boards
- **Tagline:** Auto-organized collections of related notes
- **Description:** Boards are automatically created as you add notes to your stream. Related drops are grouped together based on topics and themes. You don't need to manually categorize—just drop your thoughts and let Klutr handle the rest.
- **SEO Keywords:** boards, organization, auto-grouping, collections

#### 3. Muse
- **Name:** Muse
- **Slug:** muse
- **Tagline:** Weekly AI insights about your thinking patterns
- **Description:** Muse analyzes your stream over time and provides weekly insights. Discover recurring topics, idea patterns, and connections you didn't know existed. Turn your chaos into clarity.
- **SEO Keywords:** insights, patterns, analysis, weekly summary

#### 4. Vault
- **Name:** Vault
- **Slug:** vault
- **Tagline:** Encrypted notes that only you can read
- **Description:** Store sensitive notes in your Vault with client-side encryption. We never see your plaintext content—everything is encrypted on your device before being sent to our servers.
- **SEO Keywords:** encryption, privacy, secure notes, vault

#### 5. Search
- **Name:** Search
- **Slug:** search
- **Tagline:** Natural language search across your entire stream
- **Description:** Find notes, files, and ideas across your stream with natural language search. Search by content, filename, or tags. Debounced queries ensure fast, accurate results.
- **SEO Keywords:** search, find, discover, natural language

## How to Update

### Option 1: BaseHub Studio (Manual)
1. Go to BaseHub Studio
2. Navigate to `marketingSite` document
3. Update `pages` collection → find "home" page
4. Update fields as specified above
5. Update `features` collection with new/updated features
6. Commit changes

### Option 2: BaseHub SDK (Programmatic)
Use the BaseHub SDK mutation API to update content programmatically. See `/scripts/update-basehub-content.ts` for example implementation.

### Option 3: BaseHub MCP (If Available)
If MCP servers are working, use BaseHub MCP tools:
- `mcp_basehub_klutr_query_content` to fetch current content
- `mcp_basehub_klutr_update_blocks` to update content
- `mcp_basehub_klutr_commit` to commit changes

## Brand Voice Guidelines

All content should follow Klutr brand voice:
- **Friendly and conversational** - Use "you" and "your"
- **Irreverent and witty** - Acknowledge digital chaos with a wink
- **Transparent** - Explain clearly what happens to data
- **Supportive** - Encourage users without condescending

Avoid:
- Hype and buzzwords ("revolutionary", "game-changing")
- Anthropomorphizing AI ("AI thinks", "AI learns")
- Overly formal language
- Technical jargon without explanation

