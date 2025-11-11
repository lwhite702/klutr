import { prisma } from "../db";
import { supabase } from "../supabase";
import { retry, withTimeout } from "@/lib/utils";

export type SmartStackDTO = {
  id: string;
  name: string;
  cluster: string;
  noteCount: number;
  summary: string;
  pinned: boolean;
};

export async function buildSmartStacks(
  userId: string
): Promise<SmartStackDTO[]> {
  try {
    // Get cluster distribution
    const clusterGroups = await prisma.note.groupBy({
      by: ["cluster"],
      where: {
        userId,
        cluster: { not: null },
        archived: false,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    const stacks: SmartStackDTO[] = [];

    for (const group of clusterGroups) {
      if (!group.cluster || group._count.id < 2) continue;

      // Get representative notes from this cluster
      const notes = await prisma.note.findMany({
        where: {
          userId,
          cluster: group.cluster,
          archived: false,
        },
        select: {
          content: true,
          type: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });

      // Generate summary using Supabase Edge Function
      const noteContents = notes
        .map((n: any) => n.content.slice(0, 200))
        .join("\n\n");

      // Use Edge Function for summary generation
      const { data: summaryData } = await supabase.functions.invoke(
        "build-stacks",
        {
          body: { userId, cluster: group.cluster, noteContents },
        }
      );

      const summary =
        summaryData?.summary ||
        (await generateStackSummary(group.cluster, noteContents));

      // Check if stack already exists
      const existingStack = await prisma.smartStack.findFirst({
        where: {
          userId,
          cluster: group.cluster,
        },
      });

      const stack = await prisma.smartStack.upsert({
        where: {
          id: existingStack?.id || "new",
        },
        create: {
          userId,
          name: group.cluster,
          cluster: group.cluster,
          noteCount: group._count.id,
          summary,
          pinned: false,
        },
        update: {
          noteCount: group._count.id,
          summary,
        },
      });

      stacks.push({
        id: stack.id,
        name: stack.name,
        cluster: stack.cluster,
        noteCount: stack.noteCount,
        summary: stack.summary,
        pinned: stack.pinned,
      });
    }

    console.log(`[v0] Built ${stacks.length} smart stacks`);
    return stacks;
  } catch (error) {
    console.error("[v0] Smart stacks error:", error);
    throw new Error(
      `Failed to build smart stacks: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async function generateStackSummary(
  clusterName: string,
  noteContents: string
): Promise<string> {
  try {
    // Use Supabase Edge Function or fallback to default
    return `Collection of ${clusterName.toLowerCase()} notes.`;
  } catch (error) {
    console.error("[v0] Stack summary error:", error);
    return `Collection of ${clusterName.toLowerCase()} notes.`;
  }
}
