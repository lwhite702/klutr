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
  // Stream architecture fields
  dropType?: string | null
  fileUrl?: string | null
  fileName?: string | null
  fileType?: string | null
}

export type BoardDTO = {
  id: string
  name: string
  description?: string | null
  pinned: boolean
  noteCount: number
  createdAt: string
  updatedAt: string
  tags: string[]
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
    // Stream architecture fields
    dropType: note.dropType ?? note.drop_type ?? null,
    fileUrl: note.fileUrl ?? note.file_url ?? null,
    fileName: note.fileName ?? note.file_name ?? null,
    fileType: note.fileType ?? note.file_type ?? null,
  }
}

export function toBoardDTO(board: any): BoardDTO {
  const createdAt = board.createdAt || board.created_at
  const updatedAt = board.updatedAt || board.updated_at
  
  // Count notes from boardNotes relation
  const noteCount = board.boardNotes?.length || board.noteCount || 0
  
  // Extract tags from board notes
  const tags = new Set<string>()
  if (board.boardNotes) {
    board.boardNotes.forEach((bn: any) => {
      if (bn.note?.tags) {
        bn.note.tags.forEach((nt: any) => {
          const tagName = nt.tag?.name || nt.name
          if (tagName) tags.add(tagName)
        })
      }
    })
  }
  
  return {
    id: board.id,
    name: board.name,
    description: board.description ?? null,
    pinned: board.pinned ?? false,
    noteCount,
    createdAt: typeof createdAt === "string" ? createdAt : createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: typeof updatedAt === "string" ? updatedAt : updatedAt?.toISOString() || new Date().toISOString(),
    tags: Array.from(tags),
  }
}
