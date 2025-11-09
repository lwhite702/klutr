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
import { UpdateBoardSchema, BoardDTOSchema } from "@/lib/validation/schemas";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    const user = await getCurrentUser(req);
    const { id } = await params;

    const board = await prisma.board.findUnique({
      where: { id },
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
          orderBy: {
            addedAt: "desc",
          },
        },
      },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    if (board.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(toBoardDTO(board));
  } catch (error) {
    console.error("[v0] Get board error:", error);
    return NextResponse.json(
      { error: "Failed to get board" },
      { status: 500 }
    );
  }
}

async function updateBoardHandler(
  req: NextRequest,
  data: any,
  boardId: string
) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse(
        "Database not available. Please enable demo mode.",
        503
      );
    }

    const user = await getCurrentUser(req);

    // Verify board belongs to user
    const existingBoard = await prisma.board.findUnique({
      where: { id: boardId },
      select: { userId: true },
    });

    if (!existingBoard) {
      return createErrorResponse("Board not found", 404);
    }

    if (existingBoard.userId !== user.id) {
      return createErrorResponse("Unauthorized", 403);
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.pinned !== undefined) updateData.pinned = data.pinned;

    const board = await prisma.board.update({
      where: { id: boardId },
      data: updateData,
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
    console.error("[v0] Update board error:", error);
    return createErrorResponse("Failed to update board", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const data = { ...body, id };
    
    // Validate request
    const validation = UpdateBoardSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error },
        { status: 400 }
      );
    }

    return await updateBoardHandler(req, validation.data, id);
  } catch (error) {
    console.error("[v0] PATCH board error:", error);
    return NextResponse.json(
      { error: "Failed to update board" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    const user = await getCurrentUser(req);
    const { id } = await params;

    // Verify board belongs to user
    const board = await prisma.board.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    if (board.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the board (cascade will handle boardNotes)
    await prisma.board.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Delete board error:", error);
    return NextResponse.json(
      { error: "Failed to delete board" },
      { status: 500 }
    );
  }
}

