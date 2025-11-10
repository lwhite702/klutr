/**
 * Tests for generateEmbedding function
 * 
 * Tests the OpenAI embedding generation for messages
 */

import { generateEmbedding } from "@/lib/ai/openai";

describe("generateEmbedding", () => {
  it("returns an embedding array for text input", async () => {
    // Skip test if no API key (graceful degradation)
    if (!process.env.OPENAI_API_KEY) {
      console.warn("Skipping embedding test - OPENAI_API_KEY not set");
      return;
    }

    const embedding = await generateEmbedding("Hello world");
    
    expect(Array.isArray(embedding)).toBe(true);
    expect(embedding.length).toBeGreaterThan(0);
    expect(embedding.length).toBe(1536); // text-embedding-3-small produces 1536-dim vectors
  });

  it("returns empty array for empty input", async () => {
    const embedding = await generateEmbedding("");
    expect(embedding).toEqual([]);
  });

  it("handles errors gracefully", async () => {
    // Test with invalid API key scenario
    const originalKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    
    try {
      await expect(generateEmbedding("test")).rejects.toThrow();
    } finally {
      if (originalKey) {
        process.env.OPENAI_API_KEY = originalKey;
      }
    }
  });
});

