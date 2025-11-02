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
