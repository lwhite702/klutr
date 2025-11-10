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

export type MessageDTO = {
  id: string
  type: "text" | "audio" | "image" | "file" | "link"
  content: string | null
  fileUrl: string | null
  transcription: string | null
  metadata: Record<string, any> | null
  threadId: string
  userId: string
  createdAt: string
}

export type ConversationThreadDTO = {
  id: string
  title: string | null
  system_tags: string[]
  userId: string
  createdAt: string
  messageCount?: number
}

export function toMessageDTO(message: any): MessageDTO {
  const createdAt = message.createdAt || message.created_at
  
  return {
    id: message.id,
    type: message.type,
    content: message.content ?? null,
    fileUrl: message.fileUrl ?? message.file_url ?? null,
    transcription: message.transcription ?? null,
    metadata: message.metadata ?? null,
    threadId: message.threadId || message.thread_id,
    userId: message.userId || message.user_id,
    createdAt: typeof createdAt === "string" ? createdAt : createdAt?.toISOString() || new Date().toISOString(),
  }
}

export function toConversationThreadDTO(thread: any): ConversationThreadDTO {
  const createdAt = thread.createdAt || thread.created_at
  
  return {
    id: thread.id,
    title: thread.title ?? null,
    system_tags: thread.system_tags || thread.systemTags || [],
    userId: thread.userId || thread.user_id,
    createdAt: typeof createdAt === "string" ? createdAt : createdAt?.toISOString() || new Date().toISOString(),
    messageCount: thread.messages?.length || thread.messageCount,
  }
}
