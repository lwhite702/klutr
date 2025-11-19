"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { SortAndFilterStub } from "@/components/stacks/SortAndFilterStub";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiGet } from "@/lib/clientApi";
import type { NoteDTO } from "@/lib/dto";

interface StackItem {
  id: string;
  title: string;
  description: string;
  tags: Array<{ label: string }>;
  pinned?: boolean;
}

export default function StackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stackSlug = decodeURIComponent(params.stack as string);

  const [stackItems, setStackItems] = useState<StackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes for this cluster
  useEffect(() => {
    loadStackNotes();
  }, [stackSlug]);

  async function loadStackNotes() {
    try {
      setIsLoading(true);
      // Query notes with this cluster name
      const response = await apiGet<NoteDTO[]>(`/api/notes/list?cluster=${encodeURIComponent(stackSlug)}`);
      
      const items: StackItem[] = response.map(note => ({
        id: note.id,
        title: note.content.slice(0, 50) + (note.content.length > 50 ? '...' : ''),
        description: note.content,
        tags: note.tags.map(t => ({ label: t })),
        pinned: false,
      }));
      
      setStackItems(items);
    } catch (error) {
      console.error('[Stack] Load notes error:', error);
      toast.error('Failed to load stack notes');
    } finally {
      setIsLoading(false);
    }
  }

  const handleItemClick = (itemId: string) => {
    toast.info('Note details coming soon');
  };

  const handleItemFavorite = (itemId: string) => {
    toast.info('Favorites coming soon');
  };

  return (
    <AppShell activeRoute="/app/stacks">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <PageHeader
              title={stackSlug}
              description="Notes clustered together by theme."
              actions={<SortAndFilterStub />}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading stack...</p>
          </div>
        ) : (
          <>
            <CardGrid>
              {stackItems.map((item) => (
                <ItemCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                  pinned={item.pinned}
                  onClick={() => handleItemClick(item.id)}
                  onFavorite={() => handleItemFavorite(item.id)}
                />
              ))}
            </CardGrid>

            {stackItems.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No notes in this cluster yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
