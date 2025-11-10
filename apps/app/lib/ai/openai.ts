import OpenAI from "openai";

let client: OpenAI | null = null;

/**
 * Lazy-initialize OpenAI client to avoid build-time errors
 */
function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

/**
 * Generate an embedding for message content using OpenAI's text-embedding-3-small model
 * @param content - The text content to generate an embedding for
 * @returns A promise that resolves to an array of numbers representing the embedding vector
 */
export async function generateEmbedding(content: string): Promise<number[]> {
  if (!content || content.trim().length === 0) {
    return [];
  }

  try {
    const res = await getClient().embeddings.create({
      model: "text-embedding-3-small",
      input: content,
    });

    return res.data[0].embedding;
  } catch (error) {
    console.error("[openai] Embedding generation failed:", error);
    throw new Error(
      `Failed to generate embedding: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Classify a message and extract topics, summary, and sentiment
 * @param content - The message content to classify
 * @returns A promise that resolves to classification metadata
 */
export async function classifyMessage(content: string): Promise<{
  topics: string[];
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
}> {
  if (!content || content.trim().length === 0) {
    return {
      topics: [],
      summary: "",
      sentiment: "neutral",
    };
  }

  try {
    const res = await getClient().chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are a message classifier. Extract relevant topics, a concise summary, and sentiment (positive, neutral, or negative). Respond in JSON format: {\"topics\": [\"topic1\", \"topic2\"], \"summary\": \"brief summary\", \"sentiment\": \"positive\"|\"neutral\"|\"negative\"}.",
        },
        { role: "user", content },
      ],
    });

    const responseContent = res.choices[0]?.message?.content;
    if (!responseContent) {
      return {
        topics: [],
        summary: "",
        sentiment: "neutral",
      };
    }

    try {
      const parsed = JSON.parse(responseContent);
      return {
        topics: Array.isArray(parsed.topics) ? parsed.topics.slice(0, 10) : [],
        summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 500) : "",
        sentiment:
          parsed.sentiment === "positive" || parsed.sentiment === "negative"
            ? parsed.sentiment
            : "neutral",
      };
    } catch (parseError) {
      console.error("[openai] Failed to parse classification response:", parseError);
      return {
        topics: [],
        summary: "",
        sentiment: "neutral",
      };
    }
  } catch (error) {
    console.error("[openai] Classification failed:", error);
    return {
      topics: [],
      summary: "",
      sentiment: "neutral",
    };
  }
}

