'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardGrid } from "@/components/ui/CardGrid"
import { ItemCard } from "@/components/ui/ItemCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PanelHeader } from "./PanelContainer"
import { toast } from "sonner"
import posthog from 'posthog-js'

interface Cluster {
  id: string
  name: string
  noteCount: number
  averageConfidence: number
  sampleNotes: Array<{
    id: string
    content: string
    type: string
    confidence: number | null
  }>
}

/**
 * MindStorm Panel - AI-clustered notes view
 * Extracted from /mindstorm page for hybrid architecture
 */
export function MindStormPanel() {
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load clusters from API
  useEffect(() => {
    loadClusters()
  }, [])

  async function loadClusters() {
    try {
      setIsLoading(true)
      const response = await fetch('/api/notes/clusters')
      if (!response.ok) throw new Error('Failed to load clusters')
      
      const data = await response.json()
      setClusters(data.clusters || [])
    } catch (error) {
      console.error('[MindStorm] Error loading clusters:', error)
      toast.error('Failed to load clusters')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecluster = async () => {
    posthog.capture('mindstorm-recluster-clicked', { source: 'panel' })
    
    try {
      setIsRefreshing(true)
      const response = await fetch('/api/notes/clusters/refresh', {
        method: 'POST',
      })
      
      if (!response.ok) throw new Error('Failed to trigger reclustering')
      
      toast.success('Clustering started. This may take a few minutes.')
      
      // Reload clusters after a delay
      setTimeout(() => {
        loadClusters()
      }, 5000)
    } catch (error) {
      console.error('[MindStorm] Recluster error:', error)
      toast.error('Failed to recluster notes')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleClusterClick = (clusterId: string) => {
    // Navigate to cluster view
    const cluster = clusters.find(c => c.id === clusterId)
    if (cluster) {
      window.location.href = `/stacks/${encodeURIComponent(cluster.name)}`
    }
  }

  // Convert clusters to display format
  const displayClusters = clusters.map((cluster) => ({
    id: cluster.id,
    title: cluster.name,
    description: `${cluster.noteCount} notes (${Math.round(cluster.averageConfidence * 100)}% confidence)`,
    tags: [{ label: `${cluster.noteCount} notes` }],
    pinned: false,
  }))

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="MindStorm"
        description="Your thoughts grouped by theme"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRecluster}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Clustering...' : 'Re-cluster'}
          </Button>
        }
      />
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Loading clusters...</p>
            </div>
          ) : displayClusters.length > 0 ? (
            <div className="space-y-3">
              {displayClusters.map((cluster) => (
                <ItemCard
                  key={cluster.id}
                  title={cluster.title}
                  description={cluster.description}
                  tags={cluster.tags}
                  pinned={cluster.pinned}
                  onClick={() => handleClusterClick(cluster.id)}
                  onFavorite={() => toast.info('Cluster pinning coming soon')}
                  variant="grid"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No clusters yet. Add some notes to see them grouped automatically.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
