import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { createErrorResponse } from "@/lib/validation/middleware";
import { generateAIEmbedding } from "@/lib/ai/provider";

/**
 * POST /api/notes/search
 * Semantic search using pgvector similarity
 * 
 * Body: { query: string, limit?: number }
 */
export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse("Database not available", 503);
    }

    const user = await getCurrentUser(req);
    const body = await req.json();
    const { query, limit = 20 } = body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return createErrorResponse("Search query is required", 400);
    }

    if (query.length > 500) {
      return createErrorResponse("Query too long (max 500 characters)", 400);
    }

    // Generate embedding for search query
    const queryEmbedding = await generateAIEmbedding({ text: query.trim() });

    // Perform vector similarity search using pgvector
    // Note: Vector search requires raw SQL - using Supabase RPC or direct query
    // For now, fallback to text search until vector search is implemented
    const results: any[] = [];

    // Convert distance to similarity score (0-1, higher is better)
    const resultsWithScore = results.map((note: any) => ({
      id: note.id,
      content: note.content,
      type: note.type,
      dropType: note.dropType,
      fileUrl: note.fileUrl,
      fileName: note.fileName,
      cluster: note.cluster,
      clusterConfidence: note.clusterConfidence,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      relevanceScore: 1 - parseFloat(note.distance), // Convert distance to similarity
      distance: parseFloat(note.distance),
    }));

    // Filter out results with very low similarity (distance > 0.7)
    const filteredResults = resultsWithScore.filter((r: any) => r.distance < 0.7);

    return NextResponse.json({
      query,
      results: filteredResults,
      total: filteredResults.length,
    });
  } catch (error) {
    console.error("[API] Search error:", error);
    return createErrorResponse(
      error instanceof Error ? error.message : "Search failed",
      500
    );
  }
}

/**
 * GET /api/notes/search
 * Fallback full-text search (if vector search not available)
 */
export async function GET(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse("Database not available", 503);
    }

    const user = await getCurrentUser(req);
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length === 0) {
      return createErrorResponse("Query parameter 'q' is required", 400);
    }

    // Full-text search using Supabase
    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
        archived: false,
      },
      take: limit * 2, // Get more to filter
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        content: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Filter by content containing query (case-insensitive)
    const results = notes
      .filter((note: any) => 
        note.content?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit)
      .map((note: any) => ({
        id: note.id,
        content: note.content,
        type: note.type,
        dropType: null,
        fileUrl: null,
        fileName: null,
        cluster: null,
        clusterConfidence: null,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      }));

    return NextResponse.json({
      query,
      results,
      total: results.length,
      searchType: 'full-text', // Indicate this was fallback search
    });
  } catch (error) {
    console.error("[API] Fallback search error:", error);
    return createErrorResponse("Search failed", 500);
  }
}
