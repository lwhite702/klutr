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
  return {
    id: note.id,
    content: note.content,
    type: note.type,
    archived: note.archived,
    createdAt: typeof note.createdAt === "string" ? note.createdAt : note.createdAt.toISOString(),
    tags: note.tags?.map((t: any) => t.tag?.name || t) || [],
    cluster: note.cluster ?? null,
    clusterConfidence: note.clusterConfidence ?? null,
    clusterUpdatedAt: note.clusterUpdatedAt
      ? typeof note.clusterUpdatedAt === "string"
        ? note.clusterUpdatedAt
        : note.clusterUpdatedAt.toISOString()
      : null,
  }
}
