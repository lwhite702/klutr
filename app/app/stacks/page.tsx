"use client"

import { AppShell } from "@/components/layout/AppShell"
import { StackCard } from "@/components/stacks/StackCard"

// Mock data for stacks
const mockStacks = [
  {
    title: "React Best Practices",
    summary: "Collection of React patterns, hooks, and optimization techniques",
    count: 24,
    pinned: true
  },
  {
    title: "Meeting Notes Q1",
    summary: "All meeting notes and action items from Q1 2024",
    count: 18,
    pinned: true
  },
  {
    title: "Book Recommendations",
    summary: "Books I want to read and have read with notes",
    count: 12,
    pinned: false
  },
  {
    title: "Travel Ideas",
    summary: "Places to visit, travel tips, and itinerary ideas",
    count: 8,
    pinned: false
  },
  {
    title: "Side Project Ideas",
    summary: "Potential side projects and startup concepts",
    count: 15,
    pinned: false
  },
  {
    title: "Health & Fitness",
    summary: "Workout routines, nutrition tips, and health goals",
    count: 6,
    pinned: false
  },
  {
    title: "Learning Resources",
    summary: "Online courses, tutorials, and educational content",
    count: 21,
    pinned: false
  },
  {
    title: "Code Snippets",
    summary: "Useful code snippets and utility functions",
    count: 33,
    pinned: false
  },
  {
    title: "Design Inspiration",
    summary: "UI/UX inspiration, design patterns, and creative ideas",
    count: 14,
    pinned: false
  }
]

export default function StacksPage() {
  return (
    <AppShell activeRoute="/app/stacks">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Stacks</h1>
          <p className="text-muted-foreground">Organized collections of your notes</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Stacks</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockStacks.map((stack, index) => (
              <StackCard
                key={index}
                title={stack.title}
                summary={stack.summary}
                count={stack.count}
                pinned={stack.pinned}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}