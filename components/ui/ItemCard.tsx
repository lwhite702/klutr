import React from "react";
import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/notes/TagChip";
import { cn } from "@/lib/utils";
import { Hint } from "@/components/ui/hint";

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
          "rounded-[var(--radius-card)] cursor-pointer border border-border/70 transition-shadow hover:shadow-md",
          onClick && "hover:bg-accent/40",
          pinned && "border-[var(--color-lime)]/60"
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
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold leading-tight text-foreground">{title}</h3>
            {pinned && <span className="rounded-full bg-[var(--color-lime)]/20 px-2 py-0.5 text-xs font-medium text-[var(--color-lime)]">Pinned</span>}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </CardHeader>

        {tags.length > 0 && (
          <CardContent className="pt-0 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <TagChip
                    key={index}
                    label={tag.label}
                    colorClassName={tag.colorClassName}
                  />
                ))}
              </div>
              <Hint
                title="AI tags"
                message="These labels come from the classifier ? they keep stacks fresh and make resurfacing smarter."
              />
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

          <div className="flex items-center gap-2">
            {actionsRight ? (
              actionsRight
            ) : (
              <>
                <div className="flex items-center gap-1">
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
                    className="h-8 w-8 p-0 text-[var(--color-coral)] hover:bg-[var(--color-coral)]/10"
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        pinned
                          ? "fill-[var(--color-coral)] text-[var(--color-coral)]"
                          : "text-[var(--color-coral)]/60"
                      )}
                    />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick?.();
                    }}
                    aria-label="Open item"
                    className="h-8 w-8 p-0 text-[var(--color-indigo)] hover:bg-[var(--color-indigo)]/10"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <Hint
                  title="Need-to-know"
                  message="Star to bubble it up in favorites. Open jumps into the full note with AI summaries intact."
                />
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
