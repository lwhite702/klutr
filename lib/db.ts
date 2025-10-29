let prismaInstance: any = null;
let PrismaClientConstructor: any = null;

try {
  // Try to import Prisma, but don't fail if it's not available
  PrismaClientConstructor = require("@prisma/client").PrismaClient;

  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined;
  };

  if (process.env.NEON_NEON_DATABASE_URL || process.env.DATABASE_URL) {
    prismaInstance = globalForPrisma.prisma ?? new PrismaClientConstructor();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance;
    }
  }
} catch (error) {
  console.warn("[v0] Prisma client not available, running in demo mode");
}

export const prisma = prismaInstance;
export const isDatabaseAvailable = () => prismaInstance !== null;
