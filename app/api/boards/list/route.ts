import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { toBoardDTO } from "@/lib/dto";

export async function GET(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json([]);
    }

    const user = await getCurrentUser(req);

    const boards = await prisma.board.findMany({
      where: {
        userId: user.id,
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
      orderBy: [
        { pinned: "desc" },
        { updatedAt: "desc" },
      ],
    });

    return NextResponse.json(boards.map(toBoardDTO));
  } catch (error) {
    console.error("[v0] List boards error:", error);
    return NextResponse.json([]);
  }
}

