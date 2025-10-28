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
