// Supabase database adapter - complete migration from Prisma
import { db as supabaseDb, isDatabaseAvailable } from "./supabase-db";

// Export Supabase adapter as prisma for compatibility with existing code
export const prisma = supabaseDb;

export { isDatabaseAvailable };
