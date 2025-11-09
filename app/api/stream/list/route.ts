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
    const dropType = searchParams.get("dropType");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = (page - 1) * limit;

    const where: any = {
      userId: user.id,
      archived: false,
    };

    if (dropType && dropType !== "all") {
      where.dropType = dropType;
    }

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
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
        take: limit,
        skip: offset,
      }),
      prisma.note.count({ where }),
    ]);

    return NextResponse.json({
      drops: notes.map(toNoteDTO),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[v0] List stream drops error:", error);
    return NextResponse.json({ drops: [], pagination: null });
  }
}

