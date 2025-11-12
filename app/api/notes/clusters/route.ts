import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma, isDatabaseAvailable } from "@/lib/db";
import { createErrorResponse } from "@/lib/validation/middleware";

/**
 * GET /api/notes/clusters
 * Get user's clustered notes grouped by cluster name
 * 
 * Returns clusters with note counts and sample notes
 */
export async function GET(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse("Database not available", 503);
    }

    const user = await getCurrentUser(req);

    // Get all clusters with their note counts
    const clusterGroups = await prisma.note.groupBy({
      by: ['cluster'],
      where: {
        userId: user.id,
        cluster: { not: null },
        archived: false,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Get sample notes for each cluster
    const clustersWithNotes = await Promise.all(
      clusterGroups.map(async (group) => {
        if (!group.cluster) return null;

        // Get sample notes from this cluster
        const notes = await prisma.note.findMany({
          where: {
            userId: user.id,
            cluster: group.cluster,
            archived: false,
          },
          take: 5,
          orderBy: {
            clusterConfidence: 'desc',
          },
          select: {
            id: true,
            content: true,
            type: true,
            clusterConfidence: true,
            createdAt: true,
          },
        });

        // Calculate average confidence
        const avgConfidence = notes.reduce((sum, note) => 
          sum + (note.clusterConfidence || 0), 0) / notes.length;

        return {
          id: `cluster-${group.cluster.toLowerCase().replace(/\s+/g, '-')}`,
          name: group.cluster,
          noteCount: group._count.id,
          averageConfidence: avgConfidence,
          sampleNotes: notes.map(note => ({
            id: note.id,
            content: note.content.slice(0, 150),
            type: note.type,
            confidence: note.clusterConfidence,
          })),
        };
      })
    );

    // Filter out nulls
    const validClusters = clustersWithNotes.filter((c): c is NonNullable<typeof c> => c !== null);

    return NextResponse.json({
      clusters: validClusters,
      total: validClusters.length,
    });
  } catch (error) {
    console.error("[API] Get clusters error:", error);
    return createErrorResponse("Failed to fetch clusters", 500);
  }
}

/**
 * POST /api/notes/clusters/refresh
 * Trigger re-clustering for user's notes
 */
export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return createErrorResponse("Database not available", 503);
    }

    const user = await getCurrentUser(req);

    // Import clustering function
    const { clusterUserNotes } = await import("@/lib/ai/clusterNotes");

    // Trigger clustering (async operation)
    clusterUserNotes(user.id).catch((err) =>
      console.error("[API] Clustering error:", err)
    );

    return NextResponse.json({
      message: "Clustering started. This may take a few minutes.",
      status: "processing",
    });
  } catch (error) {
    console.error("[API] Trigger clustering error:", error);
    return createErrorResponse("Failed to start clustering", 500);
  }
}
