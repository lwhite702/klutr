import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  createSecureSuccessResponse,
  createSecureErrorResponse,
} from "@/lib/security/headers";
import { withRateLimit, RATE_LIMITS } from "@/lib/validation/middleware";

async function listVaultNotesHandler(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    const vaultNotes = await prisma.vaultNote.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        createdAt: true,
        // Never return encryptedBlob - client will decrypt locally
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return createSecureSuccessResponse(
      vaultNotes.map((note: any) => ({
        id: note.id,
        createdAt: note.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error("[v0] List vault notes error:", error);
    return createSecureErrorResponse("Failed to list vault notes", 500);
  }
}

export const GET = withRateLimit(
  RATE_LIMITS.VAULT_OPERATIONS,
  listVaultNotesHandler
);
