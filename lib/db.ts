// Hybrid database adapter: Supabase for migrated models, Prisma for new models
import { db as supabaseDb, isDatabaseAvailable } from "./supabase-db";
import { PrismaClient } from "@prisma/client";

// Real Prisma client for models not yet migrated to Supabase
const realPrisma = new PrismaClient();

// Hybrid prisma that uses Supabase adapter for most models, real Prisma for new ones
export const prisma = {
  ...supabaseDb,
  // Use real Prisma for new chat models (not yet in Supabase)
  message: realPrisma.message,
  conversationThread: realPrisma.conversationThread,
} as any;

export { isDatabaseAvailable };
