/**
 * Thread Similarity Matching using pgvector
 *
 * Finds similar threads/messages based on embedding cosine similarity
 */

import { supabaseAdmin } from "@/lib/supabase";
import { generateEmbedding } from "@/lib/ai/openai";

const SIMILARITY_THRESHOLD = 0.3; // Cosine distance threshold (lower = more similar)

/**
 * Calculate cosine distance between two embeddings
 */
function cosineDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) return 1.0; // Different dimensions = maximum distance

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return 1 - similarity; // Convert similarity to distance
}

/**
 * Find similar thread for a message based on content similarity
 *
 * @param userId - User ID
 * @param content - Message content to match
 * @returns Thread ID if similar thread found, null otherwise
 */
export async function findSimilarThread(
  userId: string,
  content: string
): Promise<string | null> {
  try {
    if (!content || content.trim().length === 0) {
      return null;
    }

    // Generate embedding for the new message content
    const queryEmbedding = await generateEmbedding(content.trim());

    if (!queryEmbedding || queryEmbedding.length === 0) {
      return null;
    }

    // Query recent messages with embeddings for this user
    // Get last 50 messages to check for similarity
    const { data: messagesData, error: messagesError } = await supabaseAdmin
      .from("messages")
      .select("id, thread_id, embedding, content, transcription")
      .eq("user_id", userId)
      .not("embedding", "is", null)
      .order("created_at", { ascending: false })
      .limit(50);

    if (messagesError || !messagesData || messagesData.length === 0) {
      return null;
    }

    // Calculate similarity for each message
    let bestMatch: { threadId: string; distance: number } | null = null;

    for (const message of messagesData) {
      if (!message.thread_id) continue;

      // Parse embedding from vector format
      let messageEmbedding: number[] = [];
      if (message.embedding) {
        if (Array.isArray(message.embedding)) {
          messageEmbedding = message.embedding;
        } else if (typeof message.embedding === "string") {
          const cleaned = message.embedding.replace(/^\[|\]$/g, "");
          messageEmbedding = cleaned
            .split(",")
            .map(Number)
            .filter((n) => !isNaN(n));
        }
      }

      if (
        messageEmbedding.length === 0 ||
        messageEmbedding.length !== queryEmbedding.length
      ) {
        continue;
      }

      // Calculate cosine distance
      const distance = cosineDistance(queryEmbedding, messageEmbedding);

      // Check if this is the best match so far
      if (!bestMatch || distance < bestMatch.distance) {
        bestMatch = {
          threadId: message.thread_id,
          distance,
        };
      }
    }

    // Return thread ID if similarity is above threshold
    if (bestMatch && bestMatch.distance < SIMILARITY_THRESHOLD) {
      return bestMatch.threadId;
    }

    return null;
  } catch (error) {
    console.error("[findSimilarThread] Error:", error);
    return null; // Fail gracefully - create new thread
  }
}
