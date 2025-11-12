import { openai } from "../openai"
import { retry, withTimeout } from "../utils"

export type NoteType = "idea" | "task" | "contact" | "link" | "image" | "voice" | "misc" | "nope" | "unclassified"

export type ClassificationResult = {
  type: NoteType
  tags: string[]
}

const CLASSIFICATION_PROMPT = `You are a note classification assistant. Analyze the given note content and classify it into one of these types:

- idea: Creative thoughts, business ideas, product concepts, brainstorming
- task: Action items, todos, reminders, things to do
- contact: Names, phone numbers, email addresses, people to reach out to
- link: URLs, web references, articles to read
- image: References to images, screenshots, visual content
- voice: Voice memo transcriptions, audio notes
- misc: General notes that don't fit other categories
- nope: Spam, junk, irrelevant content, things to ignore
- unclassified: Cannot determine type

Also extract 2-5 relevant tags (lowercase, single words or short phrases) that describe the content.

Respond with JSON in this exact format:
{
  "type": "idea",
  "tags": ["startup", "ai", "product"]
}`

export async function classifyNoteContent(content: string): Promise<ClassificationResult> {
  try {
    const result = await retry(
      async () => {
        return await withTimeout(
          openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: CLASSIFICATION_PROMPT },
              { role: "user", content: content.slice(0, 2000) },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
          }),
          15000, // 15 second timeout
          "Classification request timed out",
        )
      },
      { maxAttempts: 2, delayMs: 1000 },
    )

    const responseContent = result.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error("No response from OpenAI")
    }

    const parsed = JSON.parse(responseContent) as ClassificationResult

    // Validate the response
    const validTypes: NoteType[] = ["idea", "task", "contact", "link", "image", "voice", "misc", "nope", "unclassified"]
    if (!validTypes.includes(parsed.type)) {
      parsed.type = "unclassified"
    }

    // Ensure tags is an array
    if (!Array.isArray(parsed.tags)) {
      parsed.tags = []
    }

    // Limit to 5 tags and sanitize
    parsed.tags = parsed.tags
      .slice(0, 5)
      .map((tag) => String(tag).toLowerCase().trim())
      .filter((tag) => tag.length > 0 && tag.length < 50)

    return parsed
  } catch (error) {
    console.error("[v0] Classification error:", error)
    // Return safe defaults on error
    return {
      type: "unclassified",
      tags: [],
    }
  }
}
