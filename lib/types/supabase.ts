// Supabase database types (simplified - will be generated from Supabase CLI)
export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          user_id: string
          content: string
          type: string
          archived: boolean
          embedding: number[] | null
          cluster: string | null
          cluster_confidence: number | null
          cluster_updated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          type?: string
          archived?: boolean
          embedding?: number[] | null
          cluster?: string | null
          cluster_confidence?: number | null
          cluster_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          type?: string
          archived?: boolean
          embedding?: number[] | null
          cluster?: string | null
          cluster_confidence?: number | null
          cluster_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
      }
      note_tags: {
        Row: {
          note_id: string
          tag_id: string
        }
        Insert: {
          note_id: string
          tag_id: string
        }
        Update: {
          note_id?: string
          tag_id?: string
        }
      }
      smart_stacks: {
        Row: {
          id: string
          user_id: string
          name: string
          cluster: string
          note_count: number
          summary: string
          pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          cluster: string
          note_count?: number
          summary: string
          pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          cluster?: string
          note_count?: number
          summary?: string
          pinned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      weekly_insights: {
        Row: {
          id: string
          user_id: string
          week_start: string
          summary: string
          sentiment: string
          note_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start: string
          summary: string
          sentiment: string
          note_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start?: string
          summary?: string
          sentiment?: string
          note_count?: number
          created_at?: string
        }
      }
      vault_notes: {
        Row: {
          id: string
          user_id: string
          encrypted_blob: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          encrypted_blob: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          encrypted_blob?: string
          created_at?: string
        }
      }
    }
  }
}
