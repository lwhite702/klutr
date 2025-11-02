// Migration to Supabase - maintaining backward compatibility
import { getDB, isDatabaseAvailable as checkSupabaseAvailable } from './db-supabase';

// Export Supabase database helper as the primary database interface
export const db = getDB();
export const isDatabaseAvailable = checkSupabaseAvailable;

// Legacy Prisma exports for gradual migration (will be removed)
// These now map to Supabase operations
let prismaInstance: any = null;

// Compatibility layer - maps old Prisma calls to Supabase
export const prisma = new Proxy({} as any, {
  get(target, prop) {
    if (!prismaInstance) {
      // Lazy initialization of compatibility layer
      prismaInstance = createPrismaCompatibilityLayer();
    }
    return prismaInstance[prop as string];
  }
});

function createPrismaCompatibilityLayer() {
  const supabaseDB = getDB();
  
  return {
    note: {
      create: async (args: any) => {
        const note = await supabaseDB.createNote({
          user_id: args.data.userId,
          content: args.data.content,
          type: args.data.type,
          archived: args.data.archived || false,
        });
        
        // Transform to Prisma-like format
        return transformSupabaseNoteToPrismaFormat(note);
      },
      findUnique: async (args: any) => {
        const note = await supabaseDB.getNoteById(args.where.id);
        if (!note) return null;
        return transformSupabaseNoteToPrismaFormat(note);
      },
      findMany: async (args: any) => {
        const options: any = {};
        if (args?.where?.userId) {
          options.userId = args.where.userId;
        }
        if (args?.where?.type) {
          options.type = args.where.type;
        }
        if (args?.where?.archived !== undefined) {
          options.archived = args.where.archived;
        }
        if (args?.where?.cluster) {
          options.cluster = args.where.cluster;
        }
        if (args?.take) {
          options.limit = args.take;
        }
        if (args?.skip) {
          options.offset = args.skip;
        }
        if (args?.orderBy) {
          options.orderBy = {
            field: args.orderBy.createdAt ? 'createdAt' : (args.orderBy.updatedAt ? 'updatedAt' : 'createdAt'),
            direction: args.orderBy.createdAt === 'desc' || args.orderBy.updatedAt === 'desc' ? 'desc' : 'asc'
          };
        }
        
        const notes = await supabaseDB.getNotesByUserId(args?.where?.userId || '', options);
        return notes.map(transformSupabaseNoteToPrismaFormat);
      },
      update: async (args: any) => {
        const updates: any = {};
        if (args.data.type !== undefined) updates.type = args.data.type;
        if (args.data.content !== undefined) updates.content = args.data.content;
        if (args.data.archived !== undefined) updates.archived = args.data.archived;
        if (args.data.cluster !== undefined) updates.cluster = args.data.cluster;
        if (args.data.clusterConfidence !== undefined) updates.cluster_confidence = args.data.clusterConfidence;
        if (args.data.clusterUpdatedAt !== undefined) {
          updates.cluster_updated_at = args.data.clusterUpdatedAt;
        }
        
        // Handle nested tag creation
        if (args.data.tags?.create) {
          const note = await supabaseDB.getNoteById(args.where.id);
          if (!note) throw new Error('Note not found');
          
          // Delete existing tags
          await supabaseDB.deleteNoteTags(args.where.id);
          
          // Create new tag links
          for (const tagLink of args.data.tags.create) {
            await supabaseDB.linkNoteToTag(args.where.id, tagLink.tagId);
          }
        }
        
        const updatedNote = await supabaseDB.updateNote(args.where.id, updates);
        return transformSupabaseNoteToPrismaFormat(updatedNote);
      },
      delete: async (args: any) => {
        await supabaseDB.deleteNote(args.where.id);
      },
      deleteMany: async (args: any) => {
        // Not implemented in compatibility layer
        return { count: 0 };
      },
    },
    tag: {
      upsert: async (args: any) => {
        const tag = await supabaseDB.upsertTag(args.where.userId_name.userId, args.where.userId_name.name);
        return transformSupabaseTagToPrismaFormat(tag);
      },
      findUnique: async (args: any) => {
        const tag = await supabaseDB.getTagByUserIdAndName(
          args.where.userId_name.userId,
          args.where.userId_name.name
        );
        if (!tag) return null;
        return transformSupabaseTagToPrismaFormat(tag);
      },
    },
      noteTag: {
        deleteMany: async (args: any) => {
          if (args.where.noteId) {
            await supabaseDB.deleteNoteTags(args.where.noteId);
          }
          return { count: 1 };
        },
      },
      user: {
        findMany: async () => {
          return await supabaseDB.getAllUsers();
        },
      },
    $queryRaw: async (args: any) => {
      // For raw SQL queries, we need to handle them differently
      // This is a simplified version - may need enhancement for complex queries
      console.warn('[Migration] Raw SQL query - may need manual migration');
      return [];
    },
    $executeRaw: async (template: TemplateStringsArray, ...values: any[]) => {
      // Handle embedding updates - parse the SQL template literal
      // Prisma template literals work like: prisma.$executeRaw`UPDATE ... SET embedding = ${val}::vector WHERE id = ${id}`
      const queryParts = template.raw || template;
      const queryStr = Array.isArray(queryParts) ? queryParts.join('?') : String(queryParts[0] || '');
      
      if (queryStr.includes('UPDATE notes') && queryStr.includes('embedding')) {
        // Extract note ID (last value, typically)
        // Extract embedding (could be JSON.stringify result or array)
        let noteId: string | undefined;
        let embedding: number[] | undefined;
        
        // The values array contains the interpolated values
        for (const val of values) {
          if (typeof val === 'string') {
            // Could be note ID or JSON string
            if (val.length > 20 && val.includes('[')) {
              // Likely JSON stringified embedding
              try {
                embedding = JSON.parse(val);
              } catch {
                // Not JSON, might be note ID
                if (val.length > 10 && val.length < 50) {
                  noteId = val;
                }
              }
            } else if (val.length > 10 && val.length < 50) {
              // Likely note ID
              noteId = val;
            }
          } else if (Array.isArray(val)) {
            // Direct array embedding
            embedding = val;
          }
        }
        
        // If we have both, update the embedding
        if (embedding && noteId) {
          await supabaseDB.updateNoteEmbedding(noteId, embedding);
          return 1;
        }
        
        // Fallback: try to parse the query string more carefully
        // The actual call pattern is: prisma.$executeRaw`UPDATE notes SET embedding = ${JSON.stringify(embedding)}::vector WHERE id = ${note.id}`
        // So values[0] is JSON.stringify(embedding) and values[1] is note.id (or vice versa)
        if (values.length >= 2) {
          const firstVal = values[0];
          const secondVal = values[1];
          
          if (typeof firstVal === 'string' && firstVal.startsWith('[')) {
            try {
              embedding = JSON.parse(firstVal);
              noteId = typeof secondVal === 'string' ? secondVal : String(secondVal);
            } catch {}
          } else if (typeof secondVal === 'string' && secondVal.startsWith('[')) {
            try {
              embedding = JSON.parse(secondVal);
              noteId = typeof firstVal === 'string' ? firstVal : String(firstVal);
            } catch {}
          } else if (Array.isArray(firstVal)) {
            embedding = firstVal;
            noteId = typeof secondVal === 'string' ? secondVal : String(secondVal);
          } else if (Array.isArray(secondVal)) {
            embedding = secondVal;
            noteId = typeof firstVal === 'string' ? firstVal : String(firstVal);
          }
          
          if (embedding && noteId) {
            await supabaseDB.updateNoteEmbedding(noteId, embedding);
            return 1;
          }
        }
      }
      
      console.warn('[Migration] Raw SQL execution - may need manual migration:', queryStr.substring(0, 100));
      return 1;
    },
  };
}

// Transform Supabase note format to Prisma-like format
function transformSupabaseNoteToPrismaFormat(note: any) {
  return {
    id: note.id,
    userId: note.user_id,
    content: note.content,
    type: note.type,
    archived: note.archived,
    embedding: note.embedding,
    cluster: note.cluster,
    clusterConfidence: note.cluster_confidence,
    clusterUpdatedAt: note.cluster_updated_at ? new Date(note.cluster_updated_at) : null,
    createdAt: new Date(note.created_at),
    updatedAt: new Date(note.updated_at),
    tags: note.note_tags?.map((nt: any) => ({
      tagId: nt.tag_id,
      noteId: nt.note_id,
      tag: transformSupabaseTagToPrismaFormat(nt.tag || {}),
    })) || [],
  };
}

// Transform Supabase tag format to Prisma-like format
function transformSupabaseTagToPrismaFormat(tag: any) {
  if (!tag || !tag.id) return tag;
  
  return {
    id: tag.id,
    userId: tag.user_id,
    name: tag.name,
    createdAt: new Date(tag.created_at),
  };
}
