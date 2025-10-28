import { openai } from "../openai"
import { retry, withTimeout } from "../utils"

export async function embedNoteContent(content: string): Promise<number[]> {
  try {
    const result = await retry(
      async () => {
        return await withTimeout(
          openai.embeddings.create({
            model: "text-embedding-3-small",
            input: content.slice(0, 8000), // Limit to 8k chars
          }),
          20000, // 20 second timeout
          "Embedding request timed out",
        )
      },
      { maxAttempts: 3, delayMs: 1000, backoff: true },
    )

    const embedding = result.data[0]?.embedding
    if (!embedding || !Array.isArray(embedding)) {
      throw new Error("Invalid embedding response from OpenAI")
    }

    return embedding
  } catch (error) {
    console.error("[v0] Embedding error:", error)
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
