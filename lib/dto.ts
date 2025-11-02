export type NoteDTO = {
  id: string
  content: string
  type: string
  archived: boolean
  createdAt: string
  tags: string[]
  cluster?: string | null
  clusterConfidence?: number | null
  clusterUpdatedAt?: string | null
}

/**
 * Convert a note from database format to DTO
 * Handles both Prisma (camelCase) and Supabase (snake_case) formats
 */
export function toNoteDTO(note: any): NoteDTO {
  // Handle both camelCase (Prisma) and snake_case (Supabase)
  const id = note.id
  const content = note.content
  const type = note.type
  const archived = note.archived
  const createdAt = note.createdAt || note.created_at
  const cluster = note.cluster ?? null
  const clusterConfidence = note.clusterConfidence || note.cluster_confidence ?? null
  const clusterUpdatedAt = note.clusterUpdatedAt || note.cluster_updated_at

  return {
    id,
    content,
    type,
    archived,
    createdAt: typeof createdAt === "string" ? createdAt : createdAt?.toISOString() || new Date().toISOString(),
    tags: note.tags?.map((t: any) => t.tag?.name || t.tags?.name || t) || [],
    cluster,
    clusterConfidence,
    clusterUpdatedAt: clusterUpdatedAt
      ? typeof clusterUpdatedAt === "string"
        ? clusterUpdatedAt
        : clusterUpdatedAt.toISOString()
      : null,
  }
}
