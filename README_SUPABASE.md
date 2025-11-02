# Klutr - AI-Powered Note Organization

> **Migration Complete!** This app now runs on Supabase. See `QUICK_START.md` to get started.

## What is Klutr?

Klutr (formerly MindStorm) is an AI-powered note organization system that helps you:
- **Capture** thoughts quickly with auto-classification
- **Organize** notes automatically using AI clustering
- **Discover** insights from your note-taking patterns
- **Secure** sensitive notes with client-side encryption

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (Postgres + Storage + Auth-ready)
- **AI**: OpenAI GPT-4o-mini for classification and insights
- **Vector DB**: pgvector for similarity search
- **Encryption**: Client-side AES-GCM for vault notes

## Getting Started

**Quick Setup (15 minutes)**:
```bash
# 1. Install dependencies
pnpm install

# 2. Set up Supabase (follow QUICK_START.md)

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start development server
pnpm dev
```

**Full Documentation**:
- 📖 [Quick Start Guide](QUICK_START.md) - Get running in 15 minutes
- 📖 [Supabase Setup](SUPABASE_SETUP.md) - Detailed configuration guide
- 📖 [Migration Details](MIGRATION_COMPLETE.md) - What changed in the Supabase migration
- 📖 [Deployment Guide](DEPLOYMENT_CHECKLIST.md) - Deploy to production

## Features

### Core Features
- ✅ **Quick Capture** - Fast note entry with keyboard shortcuts
- ✅ **AI Classification** - Auto-categorize notes (idea, task, link, etc.)
- ✅ **Smart Tags** - AI-generated tags for better organization
- ✅ **Vector Clustering** - Group similar notes automatically
- ✅ **Smart Stacks** - AI-generated note collections
- ✅ **Weekly Insights** - AI summaries of your note patterns
- ✅ **Memory Lane** - Timeline view of your notes
- ✅ **Vault** - Client-side encrypted private notes
- ✅ **Nope Workflow** - Archive notes that don't fit

### Coming Soon
- 🚧 **File Uploads** - Images, voice memos, documents
- 🚧 **Supabase Auth** - Multi-user support
- 🚧 **Real-time Sync** - Live updates across devices
- 🚧 **Collaborative Stacks** - Share note collections

## Architecture

```
Frontend (Next.js)
    ↓
API Routes (/app/api)
    ↓
Data Access Layer (/lib/supabaseDb.ts)
    ↓
Supabase Postgres (with pgvector)
    ↓
Row-Level Security (ready for auth)
```

**Key Files**:
- `/lib/supabase.ts` - Supabase client initialization
- `/lib/supabaseDb.ts` - Prisma-like data access layer
- `/lib/auth.ts` - Auth (currently demo mode, Supabase-ready)
- `/lib/ai/*` - AI classification, clustering, insights
- `/app/api/*` - Next.js API routes

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Deployment

**Recommended: Vercel**
1. Connect your GitHub repository to Vercel
2. Add environment variables (see `.env.example`)
3. Deploy

**See**: `DEPLOYMENT_CHECKLIST.md` for full deployment guide

## Environment Variables

Required variables (see `.env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
CRON_SECRET=your-cron-secret
```

## Migration Status

✅ **Completed** - Migrated from Neon/Prisma to Supabase
- All API routes updated
- Database schema migrated
- AI functions working
- Zero breaking changes
- Auth prepared but not enabled

See `MIGRATION_COMPLETE.md` for full details.

## Project Structure

```
klutr/
├── app/
│   ├── api/              # API routes (Next.js)
│   ├── app/              # App pages
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── layout/          # Layout components
│   ├── notes/           # Note-related components
│   ├── stacks/          # Stack components
│   ├── vault/           # Vault components
│   └── ui/              # shadcn/ui components
├── lib/
│   ├── ai/              # AI functions
│   ├── supabase.ts      # Supabase client
│   ├── supabaseDb.ts    # Data access layer
│   ├── auth.ts          # Authentication
│   └── utils.ts         # Utilities
├── supabase/
│   └── migrations/      # SQL migration scripts
├── docs/                # Documentation
├── QUICK_START.md       # 15-minute setup guide
├── SUPABASE_SETUP.md    # Detailed Supabase guide
├── MIGRATION_COMPLETE.md # Migration details
└── DEPLOYMENT_CHECKLIST.md # Production deployment
```

## Contributing

This is a personal project, but feel free to fork and adapt!

## License

MIT

## Support

- 📖 [Documentation](./docs)
- 💬 [Issues](issues)
- 📧 Email: support@klutr.app (replace with actual)

---

**Status**: ✅ Production Ready - MVP Demo

**Last Updated**: 2025-11-02

**Migration**: Supabase (Complete)
