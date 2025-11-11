import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { toBoardDTO } from "@/lib/dto";
import {
  withValidationAndRateLimit,
  createErrorResponse,
  createSuccessResponse,
  RATE_LIMITS,
} from "@/lib/validation/middleware";
import { CreateBoardSchema, BoardDTOSchema } from "@/lib/validation/schemas";

async function createBoardHandler(req: NextRequest, data: any) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse(
        "Database not available. Please enable demo mode.",
        503
      );
    }

    const user = await getCurrentUser(req);
    const { name, description, pinned } = data;

    const board = await prisma.board.create({
      data: {
        userId: user.id,
        name,
        description: description || null,
        pinned: pinned || false,
      },
      include: {
        boardNotes: {
          include: {
            note: {
              include: {
                tags: {
                  include: {
                    tag: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const boardDTO = toBoardDTO(board);
    const validation = BoardDTOSchema.safeParse(boardDTO);

    if (!validation.success) {
      console.error("Response validation failed:", validation.error);
      return createErrorResponse("Invalid response format", 500);
    }

    return createSuccessResponse(validation.data, BoardDTOSchema);
  } catch (error) {
    console.error("[v0] Create board error:", error);
    return createErrorResponse("Failed to create board", 500);
  }
}

export const POST = withValidationAndRateLimit(
  CreateBoardSchema,
  RATE_LIMITS.CREATE_NOTE, // Reuse same rate limit
  createBoardHandler
);

