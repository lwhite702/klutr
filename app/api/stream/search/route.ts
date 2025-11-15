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

    // Fetch notes and filter client-side (Supabase adapter doesn't support Prisma-style contains)
    const allNotes = await prisma.note.findMany({
      where: {
        userId: user.id,
        archived: false,
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
      take: 200, // Get more to filter
    });

    // Filter by content, fileName, or tag names containing search term (case-insensitive)
    const notes = allNotes.filter((note: any) => {
      const matchesContent = note.content?.toLowerCase().includes(searchTerm);
      const matchesFileName = note.fileName?.toLowerCase().includes(searchTerm) || 
                              note.file_name?.toLowerCase().includes(searchTerm);
      const matchesTags = note.tags?.some((nt: any) => 
        nt.tag?.name?.toLowerCase().includes(searchTerm) || 
        nt.tags?.name?.toLowerCase().includes(searchTerm)
      );
      return matchesContent || matchesFileName || matchesTags;
    }).slice(0, 100);

    return NextResponse.json(notes.map(toNoteDTO));
  } catch (error) {
    console.error("[v0] Search stream drops error:", error);
    return NextResponse.json([]);
  }
}

