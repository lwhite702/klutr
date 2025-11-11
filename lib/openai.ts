import OpenAI from "openai"

let openaiInstance: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required")
    }
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiInstance
}

// Lazy initialization - only create client when actually used
export const openai = new Proxy({} as OpenAI, {
  get(_, prop) {
    const client = getOpenAIClient()
    const value = client[prop as keyof OpenAI]
    return typeof value === 'function' ? value.bind(client) : value
  }
})

/**
 * Generate an embedding for the given text using OpenAI's text-embedding-3-small model
 * @param input - The text to generate an embedding for
 * @returns A promise that resolves to an array of 1536 numbers representing the embedding
 */
export async function getEmbedding(input: string): Promise<number[]> {
  const client = getOpenAIClient()
  const res = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input,
  })
  return res.data[0].embedding
}
