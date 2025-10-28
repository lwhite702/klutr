"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface TourCalloutProps {
  title: string
  description: string
  position: "top" | "bottom" | "left" | "right"
  onNext: () => void
  onClose: () => void
  showNext?: boolean
}

export function TourCallout({ title, description, position, onNext, onClose, showNext = true }: TourCalloutProps) {
  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className={`absolute ${positionClasses[position]} z-50`}
    >
      <Card className="p-4 max-w-xs shadow-lg border-2 border-primary/20">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <div className="flex justify-end gap-2">
          {showNext && (
            <Button size="sm" onClick={onNext}>
              Next
            </Button>
          )}
          {!showNext && (
            <Button size="sm" onClick={onClose}>
              Done
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
