import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { toNoteDTO } from "@/lib/dto";

export async function GET(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json([]);
    }

    const user = await getCurrentUser(req);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    const searchTerm = query.trim().toLowerCase();

    // Search in content, fileName, and tags
    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
        archived: false,
        OR: [
          {
            content: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            fileName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            tags: {
              some: {
                tag: {
                  name: {
                    contains: searchTerm,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json(notes.map(toNoteDTO));
  } catch (error) {
    console.error("[v0] Search stream drops error:", error);
    return NextResponse.json([]);
  }
}

