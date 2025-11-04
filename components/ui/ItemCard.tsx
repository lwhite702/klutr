"use client";

import React from "react";
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
}: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "rounded-[var(--radius-card)] cursor-pointer hover:shadow-md transition-shadow",
          onClick && "hover:bg-accent/50"
        )}
        onClick={onClick}
      >
        {thumbnailUrl && (
          <div className="aspect-video overflow-hidden rounded-t-[var(--radius-card)]">
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </CardHeader>

        {tags.length > 0 && (
          <CardContent className="pt-0 pb-3">
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <TagChip
                  key={index}
                  label={tag.label}
                  colorClassName={tag.colorClassName}
                />
              ))}
            </div>
          </CardContent>
        )}

        <CardFooter className="pt-0 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {tags.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {tags.length} tag{tags.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
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
                        className="h-8 w-8 p-0"
                        data-onboarding="pin-button"
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            pinned
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
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
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
