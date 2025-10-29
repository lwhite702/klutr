"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { SortAndFilterStub } from "@/components/stacks/SortAndFilterStub";
import { mockStackItems } from "@/lib/mockData";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stackSlug = params.stack as string;

  // Map stack slug to mock data
  const stackNameMap: Record<string, string> = {
    "bbq-weekend": "BBQ Weekend",
    wishlist: "Wishlist",
    "listen-next": "Listen Next",
    "client-work": "Client Work",
  };

  const stackName = stackNameMap[stackSlug] || "BBQ Weekend";

  // Get items for this stack
  const stackItems =
    mockStackItems[stackSlug as keyof typeof mockStackItems] ||
    mockStackItems.bbq;

  const handleItemClick = (itemId: string) => {
    console.log("TODO: Open item", itemId);
  };

  const handleItemFavorite = (itemId: string) => {
    console.log("TODO: Toggle favorite for item", itemId);
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
              title={stackName}
              description="Curated items from this stack."
              actions={<SortAndFilterStub />}
            />
          </div>
        </div>

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
            <p>No items in this stack yet.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
