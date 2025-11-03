"use client"

import { cloneElement, isValidElement, useEffect, useState, type MouseEvent as ReactMouseEvent, type ReactElement, type ReactNode } from "react"
import { Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface HintProps {
  title?: string
  message: ReactNode
  trigger?: ReactNode
}

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)")
    const update = () => setIsTouch(mediaQuery.matches)
    update()
    mediaQuery.addEventListener("change", update)
    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  return isTouch
}

export function Hint({ title = "Hot tip", message, trigger }: HintProps) {
  const isTouch = useIsTouchDevice()
  const [open, setOpen] = useState(false)

  const defaultTrigger = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-7 w-7 rounded-full text-muted-foreground transition hover:text-foreground"
      aria-label={typeof title === "string" ? title : "Hint"}
    >
      <Info className="h-4 w-4" aria-hidden="true" />
    </Button>
  )

  const triggerNode = trigger ?? defaultTrigger

  if (isTouch) {
    const mobileTrigger = isValidElement(triggerNode)
      ? cloneElement(triggerNode as ReactElement, {
          onClick: (event: ReactMouseEvent) => {
            event.preventDefault()
            event.stopPropagation()
            setOpen(true)
          },
        })
      : (
          <span
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setOpen(true)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                setOpen(true)
              }
            }}
          >
            {triggerNode}
          </span>
        )

    return (
      <>
        {mobileTrigger}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--color-indigo)]" aria-hidden="true" />
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground/90">
                {message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" onClick={() => setOpen(false)}>
                Got it
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{triggerNode}</TooltipTrigger>
      <TooltipContent className="max-w-xs space-y-1 text-left">
        <p className="font-medium text-foreground">{title}</p>
        <div className="text-[13px] leading-relaxed text-muted-foreground/90">{message}</div>
      </TooltipContent>
    </Tooltip>
  )
}
