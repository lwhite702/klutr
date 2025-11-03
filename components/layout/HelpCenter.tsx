"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle, BookOpen, Lightbulb, Shield, BarChart3, Clock, Trash2, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const helpTopics = [
  {
    id: "notes",
    title: "Notes / Inbox",
    icon: FileText,
    description: "Your inbox where you dump notes and files. AI automatically tags and organizes them.",
    content: (
      <div className="space-y-3 text-sm">
        <p>
          <strong>Quick Capture:</strong> Type or paste anything into the capture bar. Press Cmd/Ctrl + Enter to save quickly.
        </p>
        <p>
          <strong>AI Tagging:</strong> When you save a note, our AI automatically analyzes it and adds relevant tags. These tags help organize your notes into stacks.
        </p>
        <p>
          <strong>Nope It:</strong> Swipe left on any note (or use the menu) to send it to the Nope Bin. Your Nope choices help train Klutr to recognize what you don't want to keep.
        </p>
      </div>
    ),
  },
  {
    id: "mindstorm",
    title: "MindStorm",
    icon: Lightbulb,
    description: "A brainstorming space where AI groups related ideas together.",
    content: (
      <div className="space-y-3 text-sm">
        <p>
          <strong>Starting a Session:</strong> MindStorm automatically clusters your notes by theme. Click "Re-cluster now" to refresh the groupings with your latest notes.
        </p>
        <p>
          <strong>Exploring Ideas:</strong> Click on any cluster to see related notes. This helps you discover connections between your scattered thoughts.
        </p>
        <p>
          <strong>Revisiting:</strong> Your brainstormed clusters persist, so you can come back to explore ideas anytime.
        </p>
      </div>
    ),
  },
  {
    id: "stacks",
    title: "Stacks",
    icon: BookOpen,
    description: "Collections of notes organized by tag or category.",
    content: (
      <div className="space-y-3 text-sm">
        <p>
          <strong>Creating Stacks:</strong> Stacks are automatically created when AI tags your notes. Each tag becomes a stack you can browse.
        </p>
        <p>
          <strong>Browsing:</strong> Click on any stack to see all notes with that tag. You can favorite stacks to keep them easily accessible.
        </p>
        <p>
          <strong>Organization:</strong> Stacks help you find related notes quickly. The more you use Klutr, the better the organization becomes.
        </p>
      </div>
    ),
  },
  {
    id: "vault",
    title: "Vault",
    icon: Shield,
    description: "A private archive for long-term storage with local-first encryption.",
    content: (
      <div className="space-y-3 text-sm">
        <p>
          <strong>Privacy Mode:</strong> The Vault uses local-first encryption. Your notes are encrypted on your device before any sync happens.
        </p>
        <p>
          <strong>Storing Items:</strong> Move notes to the Vault when you want to keep them permanently but out of your active workspace. Perfect for sensitive information or long-term archives.
        </p>
        <p>
          <strong>Unlocking:</strong> You'll need to unlock the Vault each time you want to access it. Only you can decrypt your vault notes.
        </p>
      </div>
    ),
  },
  {
    id: "insights",
    title: "Insights",
    icon: BarChart3,
    description: "Analytics and trends showing patterns in your notes.",
    content: (
      <div className="space-y-3 text-sm">
        <p>
          <strong>Viewing Patterns:</strong> Insights show you trends in your note-taking, including what topics you focus on most and when you're most active.
        </p>
        <p>
          <strong>Weekly Summaries:</strong> Click "Generate Summary" to create a weekly digest of your activity. This helps you see the bigger picture of your thoughts.
        </p>
        <p>
          <strong>Trends:</strong> Insights help you understand your own patterns and discover what matters most to you over time.
        </p>
      </div>
    ),
  },
  {
    id: "memory",
    title: "Memory Lane",
    icon: Clock,
    description: "Resurfacing view that brings older notes back when relevant.",
    content: (
      <div className="space-y-3 text-sm">
        <p>
          <strong>How It Works:</strong> Memory Lane resurface older notes based on relevance to your current activity. It's like your notes remembering themselves.
        </p>
        <p>
          <strong>Digest View:</strong> Notes appear in a timeline format, organized by when they were created. Click on any period to revisit those notes.
        </p>
        <p>
          <strong>Actions:</strong> When a note resurfaces, you can revisit it, edit it, or share it. Or simply acknowledge it and let it fade back into your archive.
        </p>
      </div>
    ),
  },
  {
    id: "nope",
    title: "Nope Bin",
    icon: Trash2,
    description: "Trash/archive section for items you've dismissed.",
    content: (
      <div className="space-y-3 text-sm">
        <p>
          <strong>Reviewing:</strong> All notes you've "Nope'd" end up here. You can review them to make sure nothing important was accidentally discarded.
        </p>
        <p>
          <strong>Restoring:</strong> Click "Restore" on any note to bring it back to your inbox. It'll reappear with its original tags intact.
        </p>
        <p>
          <strong>Permanent Delete:</strong> Items in the Nope Bin are kept for a while, but you can permanently delete them if you're sure. Deleted items can't be recovered.
        </p>
      </div>
    ),
  },
]

export function HelpCenter() {
  const [open, setOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const selectedTopicData = helpTopics.find((t) => t.id === selectedTopic)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help Center
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {helpTopics.map((topic) => {
              const Icon = topic.icon
              return (
                <Card
                  key={topic.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium text-sm">{topic.title}</h3>
                      <p className="text-xs text-muted-foreground">{topic.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {selectedTopicData && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-3 mb-3">
                {(() => {
                  const Icon = selectedTopicData.icon
                  return <Icon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                })()}
                <h3 className="font-semibold text-base">{selectedTopicData.title}</h3>
              </div>
              {selectedTopicData.content}
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => setSelectedTopic(null)}
              >
                Back to topics
              </Button>
            </div>
          )}
        </div>
        <div className="border-t pt-4 mt-4">
          <p className="text-xs text-muted-foreground text-center">
            Need more help?{" "}
            <Link href="/docs" className="underline hover:text-foreground">
              Visit our documentation
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
