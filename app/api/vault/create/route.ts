import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/supabaseDb";
import { validateEncryptedDataServerSide } from "@/lib/encryption/secure";
import {
  createSecureSuccessResponse,
  createSecureErrorResponse,
} from "@/lib/security/headers";
import {
  withValidationAndRateLimit,
  RATE_LIMITS,
} from "@/lib/validation/middleware";
import { CreateVaultNoteSchema } from "@/lib/validation/schemas";

async function createVaultNoteHandler(req: NextRequest, data: any) {
  try {
    const user = await getCurrentUser(req);
    const { encryptedBlob } = data;

    // Server-side validation of encrypted data structure
    const validation = validateEncryptedDataServerSide(encryptedBlob);
    if (!validation.isValid) {
      return createSecureErrorResponse(
        `Invalid encrypted data: ${validation.error}`,
        400,
        "INVALID_ENCRYPTED_DATA"
      );
    }

    // Additional validation: ensure encrypted data is not empty or suspiciously small
    if (encryptedBlob.encryptedData.length < 16) {
      return createSecureErrorResponse(
        "Encrypted data appears to be too short",
        400,
        "SUSPICIOUS_ENCRYPTED_DATA"
      );
    }

    // Additional validation: check for potential injection attempts in base64 data
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i,
    ];

    const allData = `${encryptedBlob.encryptedData}${encryptedBlob.iv}${encryptedBlob.salt}${encryptedBlob.authTag}`;
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(allData)) {
        return createSecureErrorResponse(
          "Suspicious content detected in encrypted data",
          400,
          "SUSPICIOUS_CONTENT"
        );
      }
    }

    const vaultNote = await db.vaultNote.create({
      userId: user.id,
      encryptedBlob: JSON.stringify(encryptedBlob), // Store as JSON string
    });

    return createSecureSuccessResponse({
      ok: true,
      id: vaultNote.id,
      createdAt: vaultNote.created_at.toISOString(),
    });
  } catch (error) {
    console.error("[klutr] Create vault note error:", error);
    return createSecureErrorResponse("Failed to create vault note", 500);
  }
}

export const POST = withValidationAndRateLimit(
  CreateVaultNoteSchema,
  RATE_LIMITS.VAULT_OPERATIONS,
  createVaultNoteHandler
);
