"use client"

import { AppShell } from "@/components/layout/AppShell"
import { StackCard } from "@/components/stacks/StackCard"
import { Button } from "@/components/ui/button"

// Mock data for clusters
const mockClusters = [
  {
    name: "Web Development",
    summary: "Notes about React, TypeScript, and modern web development practices",
    count: 12
  },
  {
    name: "Work & Productivity",
    summary: "Meeting notes, project ideas, and work-related thoughts",
    count: 8
  },
  {
    name: "Learning & Growth",
    summary: "Educational content, book recommendations, and skill development",
    count: 15
  },
  {
    name: "Personal Life",
    summary: "Personal thoughts, recommendations, and life experiences",
    count: 6
  },
  {
    name: "Creative Ideas",
    summary: "Brainstorming sessions, creative projects, and innovative concepts",
    count: 9
  },
  {
    name: "Health & Wellness",
    summary: "Fitness tips, health insights, and wellness practices",
    count: 4
  }
]

export default function MindStormPage() {
  const handleRecluster = () => {
    console.log("Re-cluster now clicked from MindStorm page")
  }

  return (
    <AppShell activeRoute="/app/mindstorm">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">MindStorm</h1>
            <p className="text-muted-foreground">AI-powered clusters of your thoughts</p>
          </div>
          <Button onClick={handleRecluster} variant="outline">
            Re-cluster now
          </Button>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Clusters</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockClusters.map((cluster, index) => (
              <StackCard
                key={index}
                title={cluster.name}
                summary={cluster.summary}
                count={cluster.count}
                pinned={index < 2} // First two clusters are pinned
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}