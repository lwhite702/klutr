/**
 * Supabase Database Access Layer
 * This module provides a Prisma-like interface for Supabase operations
 */

import { getServerSupabase } from './supabase'

// Types matching our database schema
export type User = {
  id: string
  email: string
  created_at: Date
  updated_at: Date
}

export type Note = {
  id: string
  user_id: string
  content: string
  type: string
  archived: boolean
  embedding?: number[]
  cluster?: string | null
  cluster_confidence?: number | null
  cluster_updated_at?: Date | null
  created_at: Date
  updated_at: Date
}

export type Tag = {
  id: string
  user_id: string
  name: string
  created_at: Date
}

export type NoteTag = {
  note_id: string
  tag_id: string
}

export type SmartStack = {
  id: string
  user_id: string
  name: string
  cluster: string
  note_count: number
  summary: string
  pinned: boolean
  created_at: Date
  updated_at: Date
}

export type WeeklyInsight = {
  id: string
  user_id: string
  week_start: Date
  summary: string
  sentiment: string
  note_count: number
  created_at: Date
}

export type VaultNote = {
  id: string
  user_id: string
  encrypted_blob: string
  created_at: Date
}

// Helper to get Supabase client
function getDB() {
  return getServerSupabase()
}

/**
 * Notes operations
 */
export const notes = {
  /**
   * Create a new note
   */
  async create(data: {
    userId: string
    content: string
    type?: string
  }) {
    const supabase = getDB()
    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        user_id: data.userId,
        content: data.content,
        type: data.type || 'misc',
        archived: false,
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create note: ${error.message}`)
    return note
  },

  /**
   * Find many notes with filters
   */
  async findMany(options: {
    where?: {
      userId?: string
      type?: string
      cluster?: string
      archived?: boolean
    }
    orderBy?: {
      createdAt?: 'asc' | 'desc'
    }
    take?: number
    includeTags?: boolean
  }) {
    const supabase = getDB()
    let query = supabase.from('notes').select('*')

    if (options.where) {
      if (options.where.userId) {
        query = query.eq('user_id', options.where.userId)
      }
      if (options.where.type) {
        query = query.eq('type', options.where.type)
      }
      if (options.where.cluster) {
        query = query.eq('cluster', options.where.cluster)
      }
      if (options.where.archived !== undefined) {
        query = query.eq('archived', options.where.archived)
      }
    }

    if (options.orderBy?.createdAt) {
      query = query.order('created_at', { ascending: options.orderBy.createdAt === 'asc' })
    }

    if (options.take) {
      query = query.limit(options.take)
    }

    const { data: notes, error } = await query

    if (error) throw new Error(`Failed to find notes: ${error.message}`)

    // If includeTags is true, fetch tags for each note
    if (options.includeTags && notes) {
      const notesWithTags = await Promise.all(
        notes.map(async (note) => {
          const { data: noteTags } = await supabase
            .from('note_tags')
            .select('tag_id, tags(name)')
            .eq('note_id', note.id)

          return {
            ...note,
            tags: noteTags?.map((nt: any) => ({ tag: { name: nt.tags.name } })) || [],
          }
        })
      )
      return notesWithTags
    }

    return notes || []
  },

  /**
   * Find a single note by ID
   */
  async findUnique(options: {
    where: { id: string }
    includeTags?: boolean
  }) {
    const supabase = getDB()
    const { data: note, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', options.where.id)
      .single()

    if (error) throw new Error(`Failed to find note: ${error.message}`)

    if (options.includeTags) {
      const { data: noteTags } = await supabase
        .from('note_tags')
        .select('tag_id, tags(name)')
        .eq('note_id', note.id)

      return {
        ...note,
        tags: noteTags?.map((nt: any) => ({ tag: { name: nt.tags.name } })) || [],
      }
    }

    return note
  },

  /**
   * Update a note
   */
  async update(options: {
    where: { id: string }
    data: Partial<{
      content: string
      type: string
      archived: boolean
      cluster: string | null
      cluster_confidence: number | null
      cluster_updated_at: Date | null
    }>
  }) {
    const supabase = getDB()
    const updateData: any = {}

    if (options.data.content !== undefined) updateData.content = options.data.content
    if (options.data.type !== undefined) updateData.type = options.data.type
    if (options.data.archived !== undefined) updateData.archived = options.data.archived
    if (options.data.cluster !== undefined) updateData.cluster = options.data.cluster
    if (options.data.cluster_confidence !== undefined) updateData.cluster_confidence = options.data.cluster_confidence
    if (options.data.cluster_updated_at !== undefined) updateData.cluster_updated_at = options.data.cluster_updated_at

    const { data: note, error } = await supabase
      .from('notes')
      .update(updateData)
      .eq('id', options.where.id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update note: ${error.message}`)
    return note
  },

  /**
   * Update note embedding (using raw SQL for pgvector)
   */
  async updateEmbedding(noteId: string, embedding: number[]) {
    const supabase = getDB()
    const { error } = await supabase.rpc('update_note_embedding', {
      note_id: noteId,
      embedding_vector: JSON.stringify(embedding),
    })

    if (error) {
      // Fallback to raw SQL if function doesn't exist
      console.warn('update_note_embedding function not found, using raw update')
      const { error: updateError } = await supabase
        .from('notes')
        .update({ embedding: embedding as any })
        .eq('id', noteId)
      
      if (updateError) throw new Error(`Failed to update embedding: ${updateError.message}`)
    }
  },

  /**
   * Group notes by cluster
   */
  async groupByCluster(userId: string) {
    const supabase = getDB()
    const { data, error } = await supabase
      .from('notes')
      .select('cluster, id')
      .eq('user_id', userId)
      .not('cluster', 'is', null)
      .eq('archived', false)

    if (error) throw new Error(`Failed to group notes: ${error.message}`)

    // Group by cluster manually
    const groups = (data || []).reduce((acc: any, note: any) => {
      const cluster = note.cluster
      if (!acc[cluster]) {
        acc[cluster] = { cluster, count: 0 }
      }
      acc[cluster].count++
      return acc
    }, {})

    return Object.values(groups).sort((a: any, b: any) => b.count - a.count)
  },
}

/**
 * Tags operations
 */
export const tags = {
  /**
   * Upsert a tag (create if not exists, otherwise return existing)
   */
  async upsert(data: {
    userId: string
    name: string
  }) {
    const supabase = getDB()
    
    // Try to find existing tag
    const { data: existing } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', data.userId)
      .eq('name', data.name)
      .single()

    if (existing) return existing

    // Create new tag
    const { data: tag, error } = await supabase
      .from('tags')
      .insert({
        user_id: data.userId,
        name: data.name,
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to upsert tag: ${error.message}`)
    return tag
  },

  /**
   * Find all tags for a user
   */
  async findMany(userId: string) {
    const supabase = getDB()
    const { data: userTags, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) throw new Error(`Failed to find tags: ${error.message}`)
    return userTags || []
  },
}

/**
 * Note-Tag junction operations
 */
export const noteTags = {
  /**
   * Link a note to a tag
   */
  async create(noteId: string, tagId: string) {
    const supabase = getDB()
    const { error } = await supabase
      .from('note_tags')
      .insert({
        note_id: noteId,
        tag_id: tagId,
      })

    if (error && !error.message.includes('duplicate')) {
      throw new Error(`Failed to create note-tag link: ${error.message}`)
    }
  },

  /**
   * Remove all tags from a note
   */
  async deleteForNote(noteId: string) {
    const supabase = getDB()
    const { error } = await supabase
      .from('note_tags')
      .delete()
      .eq('note_id', noteId)

    if (error) throw new Error(`Failed to delete note tags: ${error.message}`)
  },
}

/**
 * Smart Stacks operations
 */
export const smartStacks = {
  /**
   * Find first stack matching criteria
   */
  async findFirst(options: {
    where: {
      userId: string
      cluster: string
    }
  }) {
    const supabase = getDB()
    const { data, error } = await supabase
      .from('smart_stacks')
      .select('*')
      .eq('user_id', options.where.userId)
      .eq('cluster', options.where.cluster)
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to find stack: ${error.message}`)
    }

    return data
  },

  /**
   * Upsert a smart stack
   */
  async upsert(options: {
    where: { id: string }
    create: {
      userId: string
      name: string
      cluster: string
      noteCount: number
      summary: string
      pinned: boolean
    }
    update: {
      noteCount: number
      summary: string
    }
  }) {
    const supabase = getDB()

    if (options.where.id === 'new') {
      // Create new stack
      const { data, error } = await supabase
        .from('smart_stacks')
        .insert({
          user_id: options.create.userId,
          name: options.create.name,
          cluster: options.create.cluster,
          note_count: options.create.noteCount,
          summary: options.create.summary,
          pinned: options.create.pinned,
        })
        .select()
        .single()

      if (error) throw new Error(`Failed to create stack: ${error.message}`)
      return data
    } else {
      // Update existing stack
      const { data, error } = await supabase
        .from('smart_stacks')
        .update({
          note_count: options.update.noteCount,
          summary: options.update.summary,
        })
        .eq('id', options.where.id)
        .select()
        .single()

      if (error) throw new Error(`Failed to update stack: ${error.message}`)
      return data
    }
  },

  /**
   * Find all stacks for a user
   */
  async findMany(userId: string) {
    const supabase = getDB()
    const { data: stacks, error } = await supabase
      .from('smart_stacks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to find stacks: ${error.message}`)
    return stacks || []
  },

  /**
   * Update stack pinned status
   */
  async updatePinned(stackId: string, pinned: boolean) {
    const supabase = getDB()
    const { error } = await supabase
      .from('smart_stacks')
      .update({ pinned })
      .eq('id', stackId)

    if (error) throw new Error(`Failed to update stack: ${error.message}`)
  },
}

/**
 * Weekly Insights operations
 */
export const weeklyInsights = {
  /**
   * Create or update a weekly insight
   */
  async upsert(data: {
    userId: string
    weekStart: Date
    summary: string
    sentiment: string
    noteCount: number
  }) {
    const supabase = getDB()
    
    // Try to find existing insight
    const { data: existing } = await supabase
      .from('weekly_insights')
      .select('*')
      .eq('user_id', data.userId)
      .eq('week_start', data.weekStart.toISOString())
      .single()

    if (existing) {
      // Update existing
      const { data: insight, error } = await supabase
        .from('weekly_insights')
        .update({
          summary: data.summary,
          sentiment: data.sentiment,
          note_count: data.noteCount,
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw new Error(`Failed to update insight: ${error.message}`)
      return insight
    } else {
      // Create new
      const { data: insight, error } = await supabase
        .from('weekly_insights')
        .insert({
          user_id: data.userId,
          week_start: data.weekStart.toISOString(),
          summary: data.summary,
          sentiment: data.sentiment,
          note_count: data.noteCount,
        })
        .select()
        .single()

      if (error) throw new Error(`Failed to create insight: ${error.message}`)
      return insight
    }
  },

  /**
   * Find all insights for a user
   */
  async findMany(userId: string) {
    const supabase = getDB()
    const { data: insights, error } = await supabase
      .from('weekly_insights')
      .select('*')
      .eq('user_id', userId)
      .order('week_start', { ascending: false })

    if (error) throw new Error(`Failed to find insights: ${error.message}`)
    return insights || []
  },
}

/**
 * Vault Notes operations
 */
export const vaultNotes = {
  /**
   * Create a vault note
   */
  async create(data: {
    userId: string
    encryptedBlob: string
  }) {
    const supabase = getDB()
    const { data: vaultNote, error } = await supabase
      .from('vault_notes')
      .insert({
        user_id: data.userId,
        encrypted_blob: data.encryptedBlob,
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create vault note: ${error.message}`)
    return vaultNote
  },

  /**
   * Find all vault notes for a user
   */
  async findMany(userId: string) {
    const supabase = getDB()
    const { data: vaultNotesList, error } = await supabase
      .from('vault_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to find vault notes: ${error.message}`)
    return vaultNotesList || []
  },
}

/**
 * Users operations
 */
export const users = {
  /**
   * Find or create a user
   */
  async findOrCreate(email: string) {
    const supabase = getDB()
    
    // Try to find existing user
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (existing) return existing

    // Create new user
    const { data: user, error } = await supabase
      .from('users')
      .insert({ email })
      .select()
      .single()

    if (error) throw new Error(`Failed to create user: ${error.message}`)
    return user
  },

  /**
   * Find user by ID
   */
  async findById(id: string) {
    const supabase = getDB()
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw new Error(`Failed to find user: ${error.message}`)
    return user
  },
}

// Export a combined db object similar to Prisma
export const db = {
  note: notes,
  tag: tags,
  noteTag: noteTags,
  smartStack: smartStacks,
  weeklyInsight: weeklyInsights,
  vaultNote: vaultNotes,
  user: users,
}

// Helper to check if database is available
export function isDatabaseAvailable() {
  try {
    getDB()
    return true
  } catch {
    return false
  }
}
