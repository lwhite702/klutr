import { supabaseAdmin, getCurrentUserId } from './supabase'
import { Database } from './types/supabase'

// Type definitions for Supabase tables
type Note = Database['public']['Tables']['notes']['Row']
type Tag = Database['public']['Tables']['tags']['Row']
type NoteTag = Database['public']['Tables']['note_tags']['Row']
type SmartStack = Database['public']['Tables']['smart_stacks']['Row']
type WeeklyInsight = Database['public']['Tables']['weekly_insights']['Row']
type VaultNote = Database['public']['Tables']['vault_notes']['Row']

// Database adapter that mimics Prisma-style API for easier migration
export const db = {
  note: {
    async create(options: {
      data: {
        userId: string
        content: string
        type?: string
        archived?: boolean
      }
      include?: {
        tags?: {
          include?: {
            tag: boolean
          }
        }
      }
    }) {
      const data = options.data
      const { data: note, error } = await supabaseAdmin
        .from('notes')
        .insert({
          user_id: data.userId,
          content: data.content,
          type: data.type || 'unclassified',
          archived: data.archived || false,
        })
        .select()
        .single()

      if (error) throw error
      
      // Fetch tags if requested
      let tags: any[] = []
      if (options.include?.tags) {
        const { data: noteTags } = await supabaseAdmin
          .from('note_tags')
          .select('tag_id, tags(*)')
          .eq('note_id', note.id)
        tags = noteTags?.map((nt: any) => ({
          tagId: nt.tag_id,
          tag: nt.tags,
        })) || []
      }
      
      // Convert snake_case to camelCase for compatibility
      return {
        ...note,
        userId: note.user_id,
        createdAt: note.created_at,
        updatedAt: note.updated_at,
        clusterConfidence: note.cluster_confidence,
        clusterUpdatedAt: note.cluster_updated_at,
        tags,
      }
    },

    async findMany(options: {
      where?: {
        userId?: string
        type?: string
        cluster?: string | null
        archived?: boolean
        createdAt?: {
          gte?: Date
          lt?: Date
        }
        embedding?: null
        OR?: Array<{ type?: string } | { archived?: boolean }>
      }
      include?: {
        tags?: {
          include?: {
            tag: boolean
          }
        }
      }
      orderBy?: {
        createdAt?: 'asc' | 'desc'
      }
      take?: number
    }) {
      let query = supabaseAdmin.from('notes').select('*')

      if (options.where?.userId) {
        query = query.eq('user_id', options.where.userId)
      }
      if (options.where?.type) {
        query = query.eq('type', options.where.type)
      }
      if (options.where?.cluster !== undefined) {
        if (options.where.cluster === null) {
          query = query.is('cluster', null)
        } else {
          query = query.eq('cluster', options.where.cluster)
        }
      }
      if (options.where?.archived !== undefined) {
        query = query.eq('archived', options.where.archived)
      }
      if (options.where?.createdAt?.gte) {
        query = query.gte('created_at', options.where.createdAt.gte.toISOString())
      }
      if (options.where?.createdAt?.lt) {
        query = query.lt('created_at', options.where.createdAt.lt.toISOString())
      }
      if (options.where?.embedding === null) {
        query = query.is('embedding', null)
      }

      if (options.orderBy?.createdAt) {
        query = query.order('created_at', {
          ascending: options.orderBy.createdAt === 'asc',
        })
      }

      if (options.take) {
        query = query.limit(options.take)
      }

      const { data, error } = await query

      if (error) throw error

      // If tags are requested, fetch them
      if (options.include?.tags) {
        const notesWithTags = await Promise.all(
          (data || []).map(async (note) => {
            const { data: noteTags } = await supabaseAdmin
              .from('note_tags')
              .select('tag_id, tags(*)')
              .eq('note_id', note.id)

            return {
              ...note,
              userId: note.user_id,
              createdAt: note.created_at,
              updatedAt: note.updated_at,
              clusterConfidence: note.cluster_confidence,
              clusterUpdatedAt: note.cluster_updated_at,
              tags: noteTags?.map((nt: any) => ({
                tagId: nt.tag_id,
                tag: nt.tags,
              })) || [],
            }
          })
        )
        return notesWithTags
      }

      // Convert snake_case to camelCase
      return (data || []).map((note: any) => ({
        ...note,
        userId: note.user_id,
        createdAt: note.created_at,
        updatedAt: note.updated_at,
        clusterConfidence: note.cluster_confidence,
        clusterUpdatedAt: note.cluster_updated_at,
      }))
    },

    async findUnique(options: { 
      where: { id: string }
      select?: any
    }) {
      const { data, error } = await supabaseAdmin
        .from('notes')
        .select('*')
        .eq('id', options.where.id)
        .single()

      if (error) throw error
      return {
        ...data,
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        clusterConfidence: data.cluster_confidence,
        clusterUpdatedAt: data.cluster_updated_at,
      }
    },

    async findFirst(options: {
      where: {
        userId?: string
        cluster?: string
      }
    }) {
      let query = supabaseAdmin.from('notes').select('*').limit(1)

      if (options.where.userId) {
        query = query.eq('user_id', options.where.userId)
      }
      if (options.where.cluster) {
        query = query.eq('cluster', options.where.cluster)
      }

      const { data, error } = await query

      if (error) throw error
      return data?.[0] || null
    },

    async update(options: {
      where: { id: string }
      data: {
        type?: string
        archived?: boolean
        cluster?: string | null
        clusterConfidence?: number | null
        clusterUpdatedAt?: Date | null
        tags?: {
          create?: Array<{ tagId: string }>
        }
      }
      include?: {
        tags?: {
          include?: {
            tag: boolean
          }
        }
      }
    }) {
      const updateData: any = {}
      if (options.data.type !== undefined) updateData.type = options.data.type
      if (options.data.archived !== undefined) updateData.archived = options.data.archived
      if (options.data.cluster !== undefined) updateData.cluster = options.data.cluster
      if (options.data.clusterConfidence !== undefined) updateData.cluster_confidence = options.data.clusterConfidence
      if (options.data.clusterUpdatedAt !== undefined) {
        updateData.cluster_updated_at = options.data.clusterUpdatedAt?.toISOString()
      }

      const { data: updatedNote, error } = await supabaseAdmin
        .from('notes')
        .update(updateData)
        .eq('id', options.where.id)
        .select()
        .single()

      if (error) throw error

      // Handle tag creation
      if (options.data.tags?.create) {
        for (const tagRelation of options.data.tags.create) {
          await supabaseAdmin.from('note_tags').insert({
            note_id: options.where.id,
            tag_id: tagRelation.tagId,
          })
        }
      }

      // Fetch tags if requested
      let tags: any[] = []
      if (options.include?.tags) {
        const { data: noteTags } = await supabaseAdmin
          .from('note_tags')
          .select('tag_id, tags(*)')
          .eq('note_id', options.where.id)
        tags = noteTags?.map((nt: any) => ({
          tagId: nt.tag_id,
          tag: nt.tags,
        })) || []
      }

      return {
        ...updatedNote,
        userId: updatedNote.user_id,
        createdAt: updatedNote.created_at,
        updatedAt: updatedNote.updated_at,
        clusterConfidence: updatedNote.cluster_confidence,
        clusterUpdatedAt: updatedNote.cluster_updated_at,
        tags,
      }
    },

    async groupBy(options: {
      by: string[]
      where?: {
        userId?: string
        cluster?: { not: null } | null
        archived?: boolean
      }
      _count?: {
        id: boolean
      }
      orderBy?: {
        _count?: {
          id: 'asc' | 'desc'
        }
      }
    }) {
      // For groupBy, we'll use raw SQL through Supabase RPC or fetch and group manually
      // For now, implementing a simplified version
      const notes = await this.findMany({
        where: {
          userId: options.where?.userId,
          cluster: options.where?.cluster === null ? null : undefined,
          archived: options.where?.archived,
        },
      })

      const grouped = new Map<string, number>()
      for (const note of notes as any[]) {
        const key = note.cluster || 'null'
        grouped.set(key, (grouped.get(key) || 0) + 1)
      }

      return Array.from(grouped.entries()).map(([cluster, count]) => ({
        cluster: cluster === 'null' ? null : cluster,
        _count: { id: count },
      }))
    },

    // Raw SQL execution for embedding updates
    async $executeRaw(query: TemplateStringsArray, ...values: any[]) {
      // Parse the SQL to extract note ID and embedding
      // Expected format: UPDATE notes SET embedding = ${embedding}::vector WHERE id = ${noteId}
      const sql = query.join('?')
      if (sql.includes('UPDATE notes') && sql.includes('embedding')) {
        // Extract note ID (last value) and embedding (first value)
        const embeddingStr = values[0]
        const noteId = values[1] || values[values.length - 1]
        
        let embedding: number[]
        if (Array.isArray(embeddingStr)) {
          embedding = embeddingStr
        } else if (typeof embeddingStr === 'string') {
          try {
            embedding = JSON.parse(embeddingStr)
          } catch {
            // If it's already a string representation, try to parse it
            embedding = embeddingStr.split(',').map(Number)
          }
        } else {
          throw new Error('Invalid embedding format')
        }
        
        // Use RPC function to update embedding
        const { error } = await supabaseAdmin.rpc('update_note_embedding', {
          note_id_param: noteId,
          embedding_param: `[${embedding.join(',')}]`, // Convert to pgvector format
        })
        
        if (error) {
          console.error('RPC embedding update error:', error)
          // Fallback: direct update
          const { error: updateError } = await supabaseAdmin
            .from('notes')
            .update({ embedding })
            .eq('id', noteId)
          
          if (updateError) throw updateError
        }
        return Promise.resolve()
      }
      console.warn('Raw SQL execution not fully supported. Use RPC functions instead.')
      return Promise.resolve()
    },
  },

  tag: {
    async upsert(options: {
      where: { userId_name: { userId: string; name: string } }
      create: { userId: string; name: string }
      update: {}
    }) {
      // Check if tag exists
      const { data: existing } = await supabaseAdmin
        .from('tags')
        .select('id')
        .eq('user_id', options.where.userId_name.userId)
        .eq('name', options.where.userId_name.name)
        .single()

      if (existing) {
        return existing
      }

      // Create new tag
      const { data: tag, error } = await supabaseAdmin
        .from('tags')
        .insert({
          user_id: options.create.userId,
          name: options.create.name,
        })
        .select()
        .single()

      if (error) throw error
      return tag
    },
  },

  noteTag: {
    async deleteMany(options: { where: { noteId: string } }) {
      const { error } = await supabaseAdmin
        .from('note_tags')
        .delete()
        .eq('note_id', options.where.noteId)

      if (error) throw error
      return { count: 0 } // Simplified
    },
  },

  smartStack: {
    async findMany(options?: {
      where?: {
        userId?: string
      }
    }) {
      let query = supabaseAdmin.from('smart_stacks').select('*')
      
      if (options?.where?.userId) {
        query = query.eq('user_id', options.where.userId)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []).map((stack: any) => ({
        ...stack,
        userId: stack.user_id,
        noteCount: stack.note_count,
        createdAt: stack.created_at,
        updatedAt: stack.updated_at,
      }))
    },

    async findFirst(options: {
      where: {
        userId: string
        cluster: string
      }
    }) {
      const { data, error } = await supabaseAdmin
        .from('smart_stacks')
        .select('*')
        .eq('user_id', options.where.userId)
        .eq('cluster', options.where.cluster)
        .limit(1)
        .maybeSingle()

      if (error) throw error
      return data
    },

    async upsert(options: {
      where: { id: string } | { userId_name: { userId: string; name: string } }
      create: {
        userId: string
        name: string
        cluster: string
        noteCount: number
        summary: string
        pinned: boolean
      }
      update: {
        noteCount?: number
        summary?: string
        pinned?: boolean
      }
    }) {
      // Check if exists
      let existing: any = null
      if ('id' in options.where) {
        const { data } = await supabaseAdmin
          .from('smart_stacks')
          .select('*')
          .eq('id', options.where.id)
          .maybeSingle()
        existing = data
      } else if ('userId_name' in options.where) {
        const { data } = await supabaseAdmin
          .from('smart_stacks')
          .select('*')
          .eq('user_id', options.where.userId_name.userId)
          .eq('name', options.where.userId_name.name)
          .maybeSingle()
        existing = data
      }

      if (existing) {
        // Update
        const { data: stack, error } = await supabaseAdmin
          .from('smart_stacks')
          .update({
            note_count: options.update.noteCount,
            summary: options.update.summary,
          })
          .eq('id', options.where.id)
          .select()
          .single()

        if (error) throw error
        return {
          ...stack,
          userId: stack.user_id,
          noteCount: stack.note_count,
          createdAt: stack.created_at,
          updatedAt: stack.updated_at,
        }
      } else {
        // Create - need cluster from existing or create
        const cluster = existing?.cluster || options.create.cluster || 'Misc'
        const { data: stack, error } = await supabaseAdmin
          .from('smart_stacks')
          .insert({
            user_id: options.create.userId,
            name: options.create.name,
            cluster: cluster,
            note_count: options.create.noteCount || 0,
            summary: options.create.summary || '',
            pinned: options.create.pinned || false,
          })
          .select()
          .single()

        if (error) throw error
        return {
          ...stack,
          userId: stack.user_id,
          noteCount: stack.note_count,
          createdAt: stack.created_at,
          updatedAt: stack.updated_at,
        }
      }
    },
  },

  weeklyInsight: {
    async findMany(options?: {
      where?: {
        userId?: string
      }
    }) {
      let query = supabaseAdmin.from('weekly_insights').select('*')
      
      if (options?.where?.userId) {
        query = query.eq('user_id', options.where.userId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
  },

  vaultNote: {
    async create(options: {
      data: { userId: string; encryptedBlob: string }
    }) {
      const data = options.data
      const { data: vaultNote, error } = await supabaseAdmin
        .from('vault_notes')
        .insert({
          user_id: data.userId,
          encrypted_blob: data.encryptedBlob,
        })
        .select()
        .single()

      if (error) throw error
      return vaultNote
    },

    async findMany(options: {
      where: { userId: string }
      orderBy?: { createdAt: 'asc' | 'desc' }
    }) {
      let query = supabaseAdmin
        .from('vault_notes')
        .select('*')
        .eq('user_id', options.where.userId)

      if (options.orderBy?.createdAt) {
        query = query.order('created_at', {
          ascending: options.orderBy.createdAt === 'asc',
        })
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
  },

  weeklyInsight: {
    async findMany(options?: {
      where?: {
        userId?: string
      }
    }) {
      let query = supabaseAdmin.from('weekly_insights').select('*')
      
      if (options?.where?.userId) {
        query = query.eq('user_id', options.where.userId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },

    async findFirst(options: {
      where: {
        userId: string
        weekStart: Date
      }
    }) {
      const { data, error } = await supabaseAdmin
        .from('weekly_insights')
        .select('*')
        .eq('user_id', options.where.userId)
        .eq('week_start', options.where.weekStart.toISOString())
        .limit(1)
        .maybeSingle()

      if (error) throw error
      return data
    },

    async upsert(options: {
      where: {
        userId_weekStart: {
          userId: string
          weekStart: Date
        }
      }
      create: {
        userId: string
        weekStart: Date
        summary: string
        sentiment: string
        noteCount: number
      }
      update: {
        summary: string
        sentiment: string
        noteCount: number
      }
    }) {
      const { data: existing } = await supabaseAdmin
        .from('weekly_insights')
        .select('*')
        .eq('user_id', options.where.userId_weekStart.userId)
        .eq('week_start', options.where.userId_weekStart.weekStart.toISOString())
        .maybeSingle()

      if (existing) {
        const { data: insight, error } = await supabaseAdmin
          .from('weekly_insights')
          .update({
            summary: options.update.summary,
            sentiment: options.update.sentiment,
            note_count: options.update.noteCount,
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return insight
      } else {
        const { data: insight, error } = await supabaseAdmin
          .from('weekly_insights')
          .insert({
            user_id: options.create.userId,
            week_start: options.create.weekStart.toISOString(),
            summary: options.create.summary,
            sentiment: options.create.sentiment,
            note_count: options.create.noteCount,
          })
          .select()
          .single()

        if (error) throw error
        return insight
      }
    },
  },
}

// Add $queryRaw and $executeRaw at top level for compatibility
async function $queryRaw(query: TemplateStringsArray, ...values: any[]) {
  console.warn('$queryRaw not fully supported in Supabase adapter')
  return Promise.resolve([])
}

async function $executeRaw(query: TemplateStringsArray, ...values: any[]) {
  return db.note.$executeRaw(query, ...values)
}

// Legacy Prisma compatibility
export const prisma = {
  ...db,
  $queryRaw,
  $executeRaw,
} as any

export const isDatabaseAvailable = () => true
