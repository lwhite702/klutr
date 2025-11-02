import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/supabaseDb";
import {
  createSecureSuccessResponse,
  createSecureErrorResponse,
} from "@/lib/security/headers";
import { withRateLimit, RATE_LIMITS } from "@/lib/validation/middleware";

async function listVaultNotesHandler(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    const vaultNotes = await db.vaultNote.findMany(user.id);

    return createSecureSuccessResponse(
      vaultNotes.map((note: any) => ({
        id: note.id,
        createdAt: note.created_at,
      }))
    );
  } catch (error) {
    console.error("[klutr] List vault notes error:", error);
    return createSecureErrorResponse("Failed to list vault notes", 500);
  }
}

export const GET = withRateLimit(
  RATE_LIMITS.VAULT_OPERATIONS,
  listVaultNotesHandler
);
