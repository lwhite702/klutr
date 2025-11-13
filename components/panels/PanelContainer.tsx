'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export type PanelWidth = 'sm' | 'md' | 'lg' | 'xl'
export type PanelPosition = 'right' | 'left'

interface PanelContainerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  width?: PanelWidth
  position?: PanelPosition
  className?: string
}

const widthClasses = {
  sm: 'w-[300px]',
  md: 'w-[400px]',
  lg: 'w-[500px]',
  xl: 'w-[600px]',
}

const panelVariants = {
  closed: { x: '100%', opacity: 0 },
  open: { x: 0, opacity: 1 },
}

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
}

/**
 * Panel container for hybrid stream-first architecture
 * 
 * Desktop: Slide-in panel from right (or left)
 * Mobile: Full-screen sheet from bottom
 * 
 * Features:
 * - Smooth animations (300ms spring)
 * - Backdrop click to close
 * - Escape key to close
 * - Mobile responsive (full-screen sheet)
 * - Customizable width and position
 */
export function PanelContainer({
  isOpen,
  onClose,
  children,
  width = 'lg',
  position = 'right',
  className,
}: PanelContainerProps) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Mobile: Use Sheet component for full-screen drawer
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent 
          side="bottom" 
          className={cn("h-[90vh] p-0", className)}
        >
          {children}
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Slide-in panel
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={panelVariants}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200,
              duration: 0.3 
            }}
            className={cn(
              "fixed top-0 bottom-0 z-50 bg-background border-l shadow-xl",
              position === 'right' ? 'right-0' : 'left-0',
              widthClasses[width],
              className
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Standard panel header component
 * Used inside PanelContainer for consistent headers
 */
interface PanelHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  onClose?: () => void
}

export function PanelHeader({ title, description, action, onClose }: PanelHeaderProps) {
  return (
    <div className="border-b px-6 py-4 flex items-start justify-between bg-background sticky top-0 z-10">
      <div className="flex-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {action}
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
