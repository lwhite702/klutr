# Klutr - AI-Powered Note Organization

_Automatically synced with your [v0.app](https://v0.app) deployments_

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/wrelik/v0-next-js-app-with-shadcn-ui)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/N7neKvBLs6q)

## Overview

Klutr is a Next.js 16 app with AI-powered note organization features including clustering, smart stacks, weekly insights, and a secure vault. It uses PostgreSQL (Neon) with pgvector extension for embeddings.

## Environment Setup

This project uses [Doppler](https://doppler.com) for environment variable management. See [DOPPLER.md](./DOPPLER.md) for setup instructions.

Required environment variables:

- `NEON_NEON_DATABASE_URL` - PostgreSQL connection string from Neon
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `CRON_SECRET` - Secret key for authenticating cron job endpoints

## Development

1. **Setup Doppler** (see [DOPPLER.md](./DOPPLER.md))
2. **Install dependencies**: `pnpm install`
3. **Start development server**: `pnpm dev`

## Deployment

Your project is live at:

**[https://vercel.com/wrelik/v0-next-js-app-with-shadcn-ui](https://vercel.com/wrelik/v0-next-js-app-with-shadcn-ui)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/N7neKvBLs6q](https://v0.app/chat/projects/N7neKvBLs6q)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
