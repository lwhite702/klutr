import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma, isDatabaseAvailable } from "@/lib/db"
import { toNoteDTO } from "@/lib/dto"
import { classifyNoteContent } from "@/lib/ai/classifyNote"
import { embedNoteContent } from "@/lib/ai/embedNote"

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database not available. Please enable demo mode." }, { status: 503 })
    }

    const user = await getCurrentUser(req)
    const body = await req.json()
    const { content, tagIds } = body

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Create the note first
    const note = await prisma.note.create({
      data: {
        userId: user.id,
        content,
        type: "unclassified",
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // Classify and embed in background (fire-and-forget for better UX)
    Promise.all([
      (async () => {
        try {
          const classification = await classifyNoteContent(content)

          // Upsert tags
          const tagRecords = await Promise.all(
            classification.tags.map((tagName) =>
              prisma.tag.upsert({
                where: {
                  userId_name: {
                    userId: user.id,
                    name: tagName,
                  },
                },
                create: {
                  userId: user.id,
                  name: tagName,
                },
                update: {},
              }),
            ),
          )

          // Update note with classification and tags
          await prisma.note.update({
            where: { id: note.id },
            data: {
              type: classification.type,
              tags: {
                create: tagRecords.map((tag) => ({
                  tagId: tag.id,
                })),
              },
            },
          })
        } catch (error) {
          console.error("[v0] Classification failed:", error)
        }
      })(),
      (async () => {
        try {
          const embedding = await embedNoteContent(content)

          // Store embedding using raw SQL (pgvector)
          await prisma.$executeRaw`
            UPDATE notes
            SET embedding = ${JSON.stringify(embedding)}::vector
            WHERE id = ${note.id}
          `
        } catch (error) {
          console.error("[v0] Embedding failed:", error)
        }
      })(),
    ]).catch((err) => console.error("[v0] Background processing error:", err))

    // Return the note immediately
    return NextResponse.json(toNoteDTO(note))
  } catch (error) {
    console.error("[v0] Create note error:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}
