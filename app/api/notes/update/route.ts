import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { toNoteDTO } from "@/lib/dto"
import { classifyNoteContent } from "@/lib/ai/classifyNote"
import { embedNoteContent } from "@/lib/ai/embedNote"

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    const body = await req.json()
    const { id, content, type, archived, tagIds } = body

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 })
    }

    // Verify note belongs to user
    const existingNote = await prisma.note.findUnique({
      where: { id },
      select: { userId: true, content: true },
    })

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    if (existingNote.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const contentChanged = content && content !== existingNote.content

    // Update the note
    const updateData: any = {}
    if (content !== undefined) updateData.content = content
    if (type !== undefined) updateData.type = type
    if (archived !== undefined) updateData.archived = archived

    const updatedNote = await prisma.note.update({
      where: { id },
      data: updateData,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // If content changed, re-classify and re-embed in background
    if (contentChanged) {
      Promise.all([
        (async () => {
          try {
            const classification = await classifyNoteContent(content)

            // Clear existing tags and add new ones
            await prisma.noteTag.deleteMany({
              where: { noteId: id },
            })

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

            await prisma.note.update({
              where: { id },
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
            console.error("[v0] Re-classification failed:", error)
          }
        })(),
        (async () => {
          try {
            const embedding = await embedNoteContent(content)
            await (prisma as any).$executeRaw`
              UPDATE notes
              SET embedding = ${JSON.stringify(embedding)}::vector
              WHERE id = ${id}
            `
          } catch (error) {
            console.error("[v0] Re-embedding failed:", error)
          }
        })(),
      ]).catch((err) => console.error("[v0] Background re-processing error:", err))
    }

    return NextResponse.json(toNoteDTO(updatedNote))
  } catch (error) {
    console.error("[v0] Update note error:", error)
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
  }
}
