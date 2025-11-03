"use client"

import { HelpCircle, MessageCircle, Sparkles, NotebookPen, Layers3, Lock, ChartBarStacked, History, Trash2 } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const helpSections = [
  {
    id: "notes",
    title: "Notes inbox",
    icon: NotebookPen,
    color: "var(--color-indigo)",
    points: ["Dump raw thoughts, photos, files - Klutr scoops them all up.", "AI auto-tags on save so your future self actually finds stuff.", "Swipe or tap Nope when you want it out of sight (but not gone forever)."],
  },
  {
    id: "mindstorm",
    title: "MindStorm",
    icon: Sparkles,
    color: "var(--color-coral)",
    points: ["Kick off brainstorm sessions to riff on a theme.", "Use re-cluster to remix ideas when you’re stuck.", "Past storms stay here so you can mine earlier genius."],
  },
  {
    id: "stacks",
    title: "Stacks",
    icon: Layers3,
    color: "var(--color-indigo)",
    points: ["Auto-built collections grouped by shared tags and topics.", "Pin the stacks you love; Klutr updates them as new notes land.", "Filter quickly to see just the voice memos, links, or action items."],
  },
  {
    id: "vault",
    title: "Vault",
    icon: Lock,
    color: "var(--color-lime)",
    points: ["Local-first encryption keeps long-term memories private.", "Unlock on the device when you need to stash something forever.", "Everything stored here is hidden from AI automations."],
  },
  {
    id: "insights",
    title: "Insights",
    icon: ChartBarStacked,
    color: "var(--color-coral)",
    points: ["Weekly synths highlight themes, mood, and momentum.", "Fire off a fresh summary any time you want a pulse check.", "Use the sentiment hints to course-correct before things drift."],
  },
  {
    id: "memory",
    title: "Memory Lane",
    icon: History,
    color: "var(--color-indigo)",
    points: ["Digest view resurfaces older notes right when they’re useful again.", "Tap into a week to relive everything the AI thinks you’ll care about.", "Dismiss anything that’s no longer relevant to keep the lane fresh."],
  },
  {
    id: "nope",
    title: "Nope Bin",
    icon: Trash2,
    color: "var(--color-lime)",
    points: ["A safety net - nothing is truly gone until you say so.", "Restore with one tap or deep-clean to delete permanently.", "Use Nope to experiment freely without cluttering your workspace."],
  },
]

export function HelpCenterLauncher() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" aria-label="Open help center">
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="space-y-1 px-6 pt-6 text-left">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="h-5 w-5 text-[var(--color-coral)]" aria-hidden="true" />
            Need a hand?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Quick primers, zero jargon. Pick a section to get a refresher or replay its walkthrough from the page summary.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] px-6 pb-6">
          <div className="grid gap-4 py-4">
            {helpSections.map((section) => {
              const Icon = section.icon
              return (
                <div key={section.id} className="rounded-lg border border-border/70 bg-muted/20 p-4 shadow-sm transition hover:border-border hover:bg-muted/40">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: section.color, color: "#fff" }}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">{section.title}</h3>
                      <p className="text-xs text-muted-foreground">Tap the summary on that page to replay its tour.</p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {section.points.map((point, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: section.color }} aria-hidden="true" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
