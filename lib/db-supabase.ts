import { getSupabaseServerClient } from './supabase'
import type { Database } from './database.types'

// Type-safe database operations using Supabase
export class SupabaseDB {
  private supabase: NonNullable<ReturnType<typeof getSupabaseServerClient>>

  constructor() {
    const client = getSupabaseServerClient()
    if (!client) {
      throw new Error('Supabase client not initialized. Check environment variables.')
    }
    this.supabase = client
  }

  // Users
  async getUserById(id: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async createUser(id: string, email: string) {
    const { data, error } = await this.supabase
      .from('users')
      .insert({ id, email })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Notes
  async getNoteById(id: string) {
    const { data, error } = await this.supabase
      .from('notes')
      .select(`
        *,
        note_tags (
          tag:tags (*)
        )
      `)
      .eq('id', id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async getNotesByUserId(userId: string, options?: {
    type?: string
    archived?: boolean
    cluster?: string
    limit?: number
    offset?: number
    orderBy?: { field: string; direction: 'asc' | 'desc' }
  }) {
    let query = this.supabase
      .from('notes')
      .select(`
        *,
        note_tags (
          tag_id,
          note_id,
          tag:tags (*)
        )
      `)
      .eq('user_id', userId)
    
    if (options?.type) {
      query = query.eq('type', options.type)
    }
    
    if (options?.archived !== undefined) {
      query = query.eq('archived', options.archived)
    }
    
    if (options?.cluster) {
      query = query.eq('cluster', options.cluster)
    }
    
    if (options?.orderBy) {
      // Map camelCase to snake_case for database fields
      const dbField = options.orderBy.field === 'createdAt' ? 'created_at' : options.orderBy.field
      query = query.order(dbField, { ascending: options.orderBy.direction === 'asc' })
    } else {
      query = query.order('created_at', { ascending: false })
    }
    
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    if (options?.offset !== undefined) {
      const endOffset = (options.offset || 0) + (options.limit || 50) - 1
      query = query.range(options.offset, endOffset)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  async createNote(note: {
    user_id: string
    content: string
    type?: string
    archived?: boolean
  }) {
    const { data, error } = await this.supabase
      .from('notes')
      .insert({
        user_id: note.user_id,
        content: note.content,
        type: note.type || 'unclassified',
        archived: note.archived || false,
      })
      .select(`
        *,
        note_tags (
          tag:tags (*)
        )
      `)
      .single()
    
    if (error) throw error
    return data
  }

  async updateNote(id: string, updates: {
    content?: string
    type?: string
    archived?: boolean
    cluster?: string | null
    cluster_confidence?: number | null
    cluster_updated_at?: Date | null
  }) {
    const updateData: any = {}
    if (updates.content !== undefined) updateData.content = updates.content
    if (updates.type !== undefined) updateData.type = updates.type
    if (updates.archived !== undefined) updateData.archived = updates.archived
    if (updates.cluster !== undefined) updateData.cluster = updates.cluster
    if (updates.cluster_confidence !== undefined) updateData.cluster_confidence = updates.cluster_confidence
    if (updates.cluster_updated_at !== undefined) updateData.cluster_updated_at = updates.cluster_updated_at

    const { data, error } = await this.supabase
      .from('notes')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        note_tags (
          tag:tags (*)
        )
      `)
      .single()
    
    if (error) throw error
    return data
  }

  async updateNoteEmbedding(id: string, embedding: number[]) {
    // Convert embedding array to pgvector format string
    // pgvector expects format: [0.1,0.2,0.3,...]
    const embeddingStr = `[${embedding.join(',')}]`
    
    // Use RPC if available, otherwise use direct SQL via PostgREST
    // Since we need to cast to vector type, we'll use a direct update
    // Note: Supabase PostgREST doesn't support vector casting directly
    // So we need to create an RPC function or use raw SQL
    try {
      // Try RPC first
      const { error: rpcError } = await this.supabase.rpc('update_note_embedding', {
        note_id: id,
        embedding_vec: embeddingStr
      })
      
      if (!rpcError) return
      
      // If RPC doesn't exist, we need to use the service role client
      // with raw SQL execution (requires service role key)
      // For now, we'll store as text and create a migration SQL function
      const { error: updateError } = await this.supabase
        .from('notes')
        .update({ 
          // Store as JSON string temporarily - migration script will convert
          embedding: embeddingStr as any
        })
        .eq('id', id)
      
      if (updateError) {
        // Last resort: log and continue (embedding will be updated via migration)
        console.warn('[Supabase] Could not update embedding directly:', updateError.message)
        console.warn('[Supabase] Note ID:', id, '- Embedding length:', embedding.length)
        // Embedding will need to be set via SQL migration script
      }
    } catch (error) {
      console.error('[Supabase] Error updating embedding:', error)
      // Don't throw - embedding update is non-critical
    }
  }

  async deleteNote(id: string) {
    const { error } = await this.supabase
      .from('notes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Tags
  async getTagsByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name')
    
    if (error) throw error
    return data || []
  }

  async getTagByUserIdAndName(userId: string, name: string) {
    const { data, error } = await this.supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .eq('name', name)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async upsertTag(userId: string, name: string) {
    // Try to get existing tag first
    const existing = await this.getTagByUserIdAndName(userId, name)
    
    if (existing) {
      return existing
    }
    
    // Create new tag
    const { data, error } = await this.supabase
      .from('tags')
      .insert({ user_id: userId, name })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async linkNoteToTag(noteId: string, tagId: string) {
    const { data, error } = await this.supabase
      .from('note_tags')
      .insert({ note_id: noteId, tag_id: tagId })
      .select()
      .single()
    
    // Ignore duplicate key errors
    if (error && error.code !== '23505') throw error
    return data
  }

  async unlinkNoteFromTag(noteId: string, tagId: string) {
    const { error } = await this.supabase
      .from('note_tags')
      .delete()
      .eq('note_id', noteId)
      .eq('tag_id', tagId)
    
    if (error) throw error
  }

  async deleteNoteTags(noteId: string) {
    const { error } = await this.supabase
      .from('note_tags')
      .delete()
      .eq('note_id', noteId)
    
    if (error) throw error
  }

  // Smart Stacks
  async getSmartStacksByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from('smart_stacks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async createSmartStack(stack: {
    user_id: string
    name: string
    cluster: string
    note_count: number
    summary: string
    pinned?: boolean
  }) {
    const { data, error } = await this.supabase
      .from('smart_stacks')
      .insert({
        user_id: stack.user_id,
        name: stack.name,
        cluster: stack.cluster,
        note_count: stack.note_count,
        summary: stack.summary,
        pinned: stack.pinned || false,
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Weekly Insights
  async getWeeklyInsightsByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from('weekly_insights')
      .select('*')
      .eq('user_id', userId)
      .order('week_start', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async upsertWeeklyInsight(insight: {
    user_id: string
    week_start: Date
    summary: string
    sentiment: string
    note_count: number
  }) {
    const { data, error } = await this.supabase
      .from('weekly_insights')
      .upsert({
        user_id: insight.user_id,
        week_start: insight.week_start.toISOString(),
        summary: insight.summary,
        sentiment: insight.sentiment,
        note_count: insight.note_count,
      }, {
        onConflict: 'user_id,week_start'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Vault Notes
  async getVaultNotesByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from('vault_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async createVaultNote(vaultNote: {
    user_id: string
    encrypted_blob: string
  }) {
    const { data, error } = await this.supabase
      .from('vault_notes')
      .insert({
        user_id: vaultNote.user_id,
        encrypted_blob: vaultNote.encrypted_blob,
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Raw queries for complex operations
  async getNotesWithEmbeddings(userId: string) {
    const { data, error } = await this.supabase
      .from('notes')
      .select('id, type, embedding')
      .eq('user_id', userId)
      .not('embedding', 'is', null)
    
    if (error) throw error
    return data || []
  }

  async getNotesWithoutEmbeddings(userId: string, limit: number = 100) {
    const { data, error } = await this.supabase
      .from('notes')
      .select('id, content')
      .eq('user_id', userId)
      .eq('archived', false)
      .is('embedding', null)
      .limit(limit)
    
    if (error) throw error
    return data || []
  }

  async getAllUsers() {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, email')
    
    if (error) throw error
    return data || []
  }
}

// Singleton instance
let dbInstance: SupabaseDB | null = null

export function getDB() {
  if (!dbInstance) {
    dbInstance = new SupabaseDB()
  }
  return dbInstance
}

export function isDatabaseAvailable() {
  try {
    const client = getSupabaseServerClient()
    return client !== null
  } catch {
    return false
  }
}
