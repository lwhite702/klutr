import { generateAIEmbedding } from './provider'

/**
 * Generate embeddings for note content using Vercel AI SDK
 * Uses cost-efficient embedding model (text-embedding-3-small)
 */
export async function embedNoteContent(content: string): Promise<number[]> {
  try {
    if (!content || content.trim().length === 0) {
      throw new Error('Content is required for embedding generation')
    }

    // Use Vercel AI SDK provider for embeddings
    const embedding = await generateAIEmbedding({ text: content })

    if (!embedding || !Array.isArray(embedding) || embedding.length !== 1536) {
      throw new Error('Invalid embedding response - expected 1536-dimensional vector')
    }

    return embedding
  } catch (error) {
    console.error('[Embedding] Error generating embedding:', error)
    throw new Error(
      `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
