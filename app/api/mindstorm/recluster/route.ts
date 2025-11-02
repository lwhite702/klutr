import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db, isDatabaseAvailable } from "@/lib/supabaseDb"
import { embedNoteContent } from "@/lib/ai/embedNote"
import { clusterUserNotes } from "@/lib/ai/clusterNotes"
import { getServerSupabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database not available" }, { status: 503 })
    }

    const user = await getCurrentUser(req)

    // Step 1: Find notes missing embeddings
    const supabase = getServerSupabase()
    const { data: notesWithoutEmbeddings, error } = await supabase
      .from('notes')
      .select('id, content')
      .eq('user_id', user.id)
      .eq('archived', false)
      .is('embedding', null)
      .limit(50)

    if (error) throw error

    console.log(`[klutr] Found ${notesWithoutEmbeddings?.length || 0} notes without embeddings`)

    // Step 2: Generate embeddings for notes that don't have them
    if (notesWithoutEmbeddings) {
      for (const note of notesWithoutEmbeddings) {
        try {
          const embedding = await embedNoteContent(note.content)
          await db.note.updateEmbedding(note.id, embedding)
        } catch (error) {
          console.error(`[klutr] Failed to embed note ${note.id}:`, error)
          // Continue with other notes
        }
      }
    }

    // Step 3: Run clustering algorithm
    await clusterUserNotes(user.id)

    const ranAt = new Date().toISOString()

    return NextResponse.json({
      ok: true,
      ranAt,
      embeddedCount: notesWithoutEmbeddings?.length || 0,
    })
  } catch (error) {
    console.error("[klutr] Recluster error:", error)
    return NextResponse.json({ error: "Failed to recluster notes" }, { status: 500 })
  }
}
