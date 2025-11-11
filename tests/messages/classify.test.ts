/**
 * Tests for classifyMessage function
 * 
 * Tests the OpenAI classification for messages
 */

import { classifyMessage } from "@/lib/ai/openai";

describe("classifyMessage", () => {
  it("returns structured metadata", async () => {
    // Skip test if no API key (graceful degradation)
    if (!process.env.OPENAI_API_KEY) {
      console.warn("Skipping classification test - OPENAI_API_KEY not set");
      return;
    }

    const result = await classifyMessage("I love this app, it's amazing!");
    
    expect(result).toHaveProperty("topics");
    expect(result).toHaveProperty("summary");
    expect(result).toHaveProperty("sentiment");
    expect(Array.isArray(result.topics)).toBe(true);
    expect(typeof result.summary).toBe("string");
    expect(["positive", "neutral", "negative"]).toContain(result.sentiment);
  });

  it("returns safe defaults for empty input", async () => {
    const result = await classifyMessage("");
    
    expect(result).toEqual({
      topics: [],
      summary: "",
      sentiment: "neutral",
    });
  });

  it("handles errors gracefully", async () => {
    // Test with invalid API key scenario
    const originalKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    
    try {
      const result = await classifyMessage("test message");
      // Should return safe defaults on error
      expect(result).toHaveProperty("topics");
      expect(result).toHaveProperty("summary");
      expect(result).toHaveProperty("sentiment");
    } finally {
      if (originalKey) {
        process.env.OPENAI_API_KEY = originalKey;
      }
    }
  });
});

