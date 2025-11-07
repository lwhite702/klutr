"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/notes/TagChip";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  thumbnailUrl?: string;
  title: string;
  description?: string;
  tags?: { label: string; colorClassName?: string }[];
  pinned?: boolean;
  onClick?: () => void;
  onFavorite?: () => void;
  actionsRight?: React.ReactNode;
  variant?: "grid" | "list" | "collage" | "pinboard";
}

export function ItemCard({
  thumbnailUrl,
  title,
  description,
  tags = [],
  pinned = false,
  onClick,
  onFavorite,
  actionsRight,
  variant = "grid",
}: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isList = variant === "list";
  const isCollage = variant === "collage";
  // Pinboard uses grid layout for individual cards
  const effectiveVariant = variant === "pinboard" ? "grid" : variant;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(isList && "w-full")}
    >
      <Card
        className={cn(
          "rounded-[var(--radius-card)] cursor-pointer transition-all duration-200",
          "hover:shadow-lg hover:shadow-[var(--klutr-coral)]/10 dark:hover:shadow-[var(--klutr-coral)]/20",
          "border-[var(--klutr-outline)]/20 hover:border-[var(--klutr-coral)]/30",
          onClick && "hover:bg-accent/50",
          isList && "flex flex-row gap-4",
          isCollage && "h-full"
        )}
        onClick={onClick}
      >
        {thumbnailUrl && (
          <div
            className={cn(
              "overflow-hidden bg-muted",
              isList
                ? "w-32 h-24 rounded-lg flex-shrink-0"
                : "aspect-video rounded-t-[var(--radius-card)]",
              isCollage && "aspect-video"
            )}
          >
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}

        <div className={cn("flex-1", isList && "flex flex-col justify-between")}>
          <CardHeader className={cn("pb-3", isList && "pb-2 pt-4")}>
            <h3
              className={cn(
                "font-semibold leading-tight text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]",
                isList ? "text-base" : "text-lg",
                isCollage && "text-xl"
              )}
            >
              {title}
            </h3>
            {description && (
              <p
                className={cn(
                  "text-muted-foreground",
                  isList ? "text-sm line-clamp-1" : "text-sm line-clamp-2",
                  isCollage && "line-clamp-3"
                )}
              >
                {description}
              </p>
            )}
          </CardHeader>

          {tags.length > 0 && (
            <CardContent className={cn("pt-0 pb-3", isList && "pb-2")}>
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, isList ? 2 : isCollage ? 4 : 3).map((tag, index) => (
                  <TagChip
                    key={index}
                    label={tag.label}
                    colorClassName={tag.colorClassName}
                  />
                ))}
                {tags.length > (isList ? 2 : isCollage ? 4 : 3) && (
                  <span className="text-xs text-muted-foreground px-1.5 py-0.5">
                    +{tags.length - (isList ? 2 : isCollage ? 4 : 3)}
                  </span>
                )}
              </div>
            </CardContent>
          )}

          <CardFooter
            className={cn(
              "pt-0 flex items-center justify-between",
              isList && "pb-4"
            )}
          >
            <div className="flex items-center gap-1">
              {tags.length > 0 && !isList && (
                <span className="text-xs text-muted-foreground">
                  {tags.length} tag{tags.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div
              className={cn(
                "flex items-center gap-1",
                isHovered && "opacity-100",
                !isHovered && !isList && "opacity-0 transition-opacity"
              )}
            >
              {actionsRight ? (
                actionsRight
              ) : (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFavorite?.();
                          }}
                          aria-label={
                            pinned ? "Remove from favorites" : "Add to favorites"
                          }
                          className={cn(
                            "h-8 w-8 p-0",
                            pinned &&
                              "text-[var(--klutr-coral)] hover:text-[var(--klutr-coral)]/80"
                          )}
                          data-onboarding="pin-button"
                        >
                          <Star
                            className={cn(
                              "h-4 w-4 transition-all",
                              pinned
                                ? "fill-[var(--klutr-coral)] text-[var(--klutr-coral)]"
                                : "text-muted-foreground dark:text-foreground/70"
                            )}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          {pinned
                            ? "Unpin this item to remove it from favorites"
                            : "Pin this item to mark it as a favorite"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick?.();
                    }}
                    aria-label="Open item"
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground dark:text-foreground/70" />
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}
