"use client"

import { useState } from "react"
import { HelpCircle, X, Book, Lightbulb, Shield, Zap, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

interface HelpTopic {
  id: string
  title: string
  content: string
  icon: React.ReactNode
  category: string
}

const helpTopics: HelpTopic[] = [
  {
    id: "notes-capture",
    title: "Quick Capture in Notes",
    content: "Your Notes inbox is where ideas land. Type, paste links, or drop files—we'll auto-tag them with AI. Swipe or tap 'Nope' to archive clutter you don't need.",
    icon: <Book className="h-4 w-4" />,
    category: "Notes"
  },
  {
    id: "ai-tagging",
    title: "AI Tagging & Organization",
    content: "Every note gets smart tags automatically. Our AI reads your content and suggests categories like 'ideas', 'tasks', or 'contacts'. You can always edit tags manually.",
    icon: <Zap className="h-4 w-4" />,
    category: "Features"
  },
  {
    id: "mindstorm",
    title: "MindStorm Sessions",
    content: "MindStorm groups related notes by theme automatically. Think of it as your brainstorming partner—it finds patterns in your thoughts you might have missed.",
    icon: <Lightbulb className="h-4 w-4" />,
    category: "MindStorm"
  },
  {
    id: "stacks",
    title: "Working with Stacks",
    content: "Stacks are collections of notes grouped by tags or topics. They're created automatically but you can star your favorites and browse them anytime.",
    icon: <Book className="h-4 w-4" />,
    category: "Stacks"
  },
  {
    id: "vault",
    title: "Vault Privacy Mode",
    content: "The Vault is your private archive with local-first encryption. Only you can unlock it. Perfect for sensitive notes you want to keep forever, safely.",
    icon: <Shield className="h-4 w-4" />,
    category: "Vault"
  },
  {
    id: "memory",
    title: "Memory Lane Resurfacing",
    content: "Memory Lane brings back older notes at the right time—like a gentle reminder of past ideas. Perfect for revisiting brainstorms or tracking patterns over time.",
    icon: <Lightbulb className="h-4 w-4" />,
    category: "Memory"
  },
  {
    id: "nope-bin",
    title: "The Nope Bin",
    content: "Nope'd something by mistake? No worries. The Nope Bin holds discarded items. You can restore them anytime or let them auto-delete after 30 days.",
    icon: <Book className="h-4 w-4" />,
    category: "Nope"
  },
]

export function HelpCenter() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTopics = helpTopics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-[var(--color-indigo)] text-[var(--color-indigo-foreground)] hover:bg-[var(--color-indigo)]/90 z-50"
          aria-label="Open help center"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[var(--color-indigo)]" />
            Help & Resources
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <ScrollArea className="h-[50vh]">
            <div className="space-y-3 pr-4">
              {filteredTopics.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No help topics found. Try a different search term.
                </p>
              ) : (
                filteredTopics.map((topic) => (
                  <Card key={topic.id} className="p-4 hover:border-[var(--color-indigo)]/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-[var(--color-indigo)]">{topic.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{topic.title}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {topic.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{topic.content}</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
