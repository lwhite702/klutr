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

export function toNoteDTO(note: any): NoteDTO {
  // Handle both camelCase (Prisma) and snake_case (Supabase) formats
  const createdAt = note.createdAt || note.created_at
  const clusterUpdatedAt = note.clusterUpdatedAt || note.cluster_updated_at
  const clusterConfidence = note.clusterConfidence ?? note.cluster_confidence ?? null
  
  return {
    id: note.id,
    content: note.content,
    type: note.type,
    archived: note.archived,
    createdAt: typeof createdAt === "string" ? createdAt : createdAt?.toISOString() || new Date().toISOString(),
    tags: note.tags?.map((t: any) => t.tag?.name || t.name || t) || [],
    cluster: note.cluster ?? null,
    clusterConfidence: clusterConfidence,
    clusterUpdatedAt: clusterUpdatedAt
      ? typeof clusterUpdatedAt === "string"
        ? clusterUpdatedAt
        : clusterUpdatedAt.toISOString()
      : null,
  }
}
