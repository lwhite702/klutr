"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface HelpArticle {
  id: string;
  section: string;
  title: string;
  content: string;
  tags: string[];
}

const helpArticles: HelpArticle[] = [
  {
    id: "notes-capture",
    section: "Notes",
    title: "Capture your thoughts",
    content:
      "Use the quick capture bar at the top of the Notes page to add notes, files, or voice recordings. Everything you add is automatically tagged and organized. Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to save quickly.",
    tags: ["capture", "notes", "quick"],
  },
  {
    id: "notes-tags",
    section: "Notes",
    title: "How tags work",
    content:
      "Tags are automatically added to your notes based on their content. You can also add your own tags manually. Tags help organize notes and create connections between related ideas.",
    tags: ["tags", "organization", "notes"],
  },
  {
    id: "notes-nope",
    section: "Notes",
    title: "Archive notes with Nope",
    content:
      "Swipe left or use the Nope action to archive notes that don't fit your current workflow. Nothing is permanently deleted—you can restore archived notes from the Nope Bin section at any time.",
    tags: ["archive", "nope", "notes"],
  },
  {
    id: "mindstorm-clusters",
    section: "MindStorm",
    title: "Understanding clusters",
    content:
      "MindStorm analyzes your notes and groups similar ideas into clusters. Related thoughts appear together, making it easier to see connections and patterns. Clusters improve automatically as you add more notes.",
    tags: ["clusters", "mindstorm", "ai"],
  },
  {
    id: "mindstorm-recluster",
    section: "MindStorm",
    title: "Refresh clusters",
    content:
      "Click 'Re-cluster now' in the top bar or on the MindStorm page to update groupings when you add new notes. This helps ensure recent notes are included in the most relevant clusters.",
    tags: ["recluster", "mindstorm", "update"],
  },
  {
    id: "beta-status",
    section: "Beta",
    title: "Why did Vault and Stacks move?",
    content:
      "During beta we’re focusing on Stream, MindStorm, and Search. Vault and Stacks are temporarily routed to Stream while we tighten security reviews and clustering quality.",
    tags: ["beta", "vault", "stacks"],
  },
  {
    id: "insights-overview",
    section: "Insights",
    title: "Weekly summaries",
    content:
      "Insights highlight patterns in your thinking. See trends, recurring themes, and activity across your notes. Weekly summaries are generated automatically, or you can create them on demand.",
    tags: ["insights", "summaries", "patterns"],
  },
  {
    id: "insights-generate",
    section: "Insights",
    title: "Generate insights",
    content:
      "Click 'Generate Summary' on the Insights page to create insights from your recent notes. Insights help you discover connections you might have missed and identify recurring themes.",
    tags: ["generate", "insights", "summaries"],
  },
  {
    id: "memory-timeline",
    section: "Memory",
    title: "Timeline view",
    content:
      "Memory Lane shows your notes organized by time. See what you were thinking across weeks and months. Browse past notes to rediscover ideas you've set aside.",
    tags: ["timeline", "memory", "history"],
  },
  {
    id: "memory-resurfacing",
    section: "Memory",
    title: "Rediscover old notes",
    content:
      "Temporal organization helps you find notes by when you captured them. Browse your timeline to resurface forgotten ideas and see patterns in your note-taking over time.",
    tags: ["memory", "resurfacing", "timeline"],
  },
  {
    id: "nope-archive",
    section: "Nope",
    title: "The Nope Bin",
    content:
      "Nope Bin holds notes you've set aside. Nothing is permanently deleted—your archived notes stay here until you restore them. Use this section to clean up your main notes without losing anything.",
    tags: ["archive", "nope", "deleted"],
  },
  {
    id: "nope-restore",
    section: "Nope",
    title: "Restore archived notes",
    content:
      "Click 'Restore' on any archived note to bring it back to your main notes. Your archived notes are always recoverable. Restoration moves the note back to your Notes section.",
    tags: ["restore", "nope", "recovery"],
  },
];

interface HelpCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpCenter({ open, onOpenChange }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = helpArticles.filter((article) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.section.toLowerCase().includes(query) ||
      article.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const articlesBySection = filteredArticles.reduce((acc, article) => {
    if (!acc[article.section]) {
      acc[article.section] = [];
    }
    acc[article.section].push(article);
    return acc;
  }, {} as Record<string, HelpArticle[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Help & Documentation</DialogTitle>
          <DialogDescription>
            Learn how to use each feature and get the most out of your notes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6 pr-4">
              {Object.entries(articlesBySection).map(([section, articles]) => (
                <div key={section}>
                  <h3 className="text-sm font-semibold mb-2">{section}</h3>
                  <div className="space-y-3">
                    {articles.map((article) => (
                      <div key={article.id} className="space-y-1">
                        <h4 className="text-sm font-medium">{article.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {article.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {filteredArticles.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No articles found. Try a different search term.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

