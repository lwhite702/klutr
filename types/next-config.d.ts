/**
 * TypeScript type definitions for Next.js configuration
 * Provides type safety for redirect configuration
 */

import type { NextConfig } from "next";

declare module "next" {
  interface NextConfig {
    redirects?: () => Promise<Redirect[]>;
  }
}

export interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
}

