import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";

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

    // Verify note belongs to user
    const note = await prisma.note.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the note (cascade will handle related records)
    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[v0] Delete stream drop error:", error);
    return NextResponse.json(
      { error: "Failed to delete stream drop" },
      { status: 500 }
    );
  }
}

