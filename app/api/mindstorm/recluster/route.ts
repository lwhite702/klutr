import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma, isDatabaseAvailable } from "@/lib/db"
import { embedNoteContent } from "@/lib/ai/embedNote"
import { clusterUserNotes } from "@/lib/ai/clusterNotes"

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const user = await getCurrentUser(req)

    // Step 1: Find notes missing embeddings
    const notesWithoutEmbeddings = await prisma.note.findMany({
      where: {
        userId: user.id,
        embedding: null,
        archived: false,
      },
      select: {
        id: true,
        content: true,
      },
      take: 50, // Process in batches
    }) as Array<{ id: string; content: string }>

    console.log(`[v0] Found ${notesWithoutEmbeddings.length} notes without embeddings`)

    // Step 2: Generate embeddings for notes that don't have them
    for (const note of notesWithoutEmbeddings) {
      try {
        const embedding = await embedNoteContent(note.content)
        await prisma.$executeRaw`
          UPDATE notes
          SET embedding = ${JSON.stringify(embedding)}::vector
          WHERE id = ${note.id}
        ` as any
      } catch (error) {
        console.error(`[v0] Failed to embed note ${note.id}:`, error)
        // Continue with other notes
      }
    }

    // Step 3: Run clustering algorithm
    await clusterUserNotes(user.id)

    const ranAt = new Date().toISOString()

    return NextResponse.json({
      ok: true,
      ranAt,
      embeddedCount: notesWithoutEmbeddings.length,
    })
  } catch (error) {
    console.error("[v0] Recluster error:", error)
    return NextResponse.json({ error: "Failed to recluster notes" }, { status: 500 })
  }
}
