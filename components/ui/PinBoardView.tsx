"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ItemCard } from "./ItemCard";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  description?: string;
  tags?: { label: string; colorClassName?: string }[];
  pinned?: boolean;
  x?: number;
  y?: number;
}

interface Relationship {
  from: string;
  to: string;
  strength?: number; // 0-1, for line thickness/opacity
}

interface PinBoardViewProps {
  items: Note[];
  relationships?: Relationship[];
  onItemClick?: (id: string) => void;
  onItemFavorite?: (id: string) => void;
  className?: string;
}

export function PinBoardView({
  items,
  relationships = [],
  onItemClick,
  onItemFavorite,
  className,
}: PinBoardViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [isDragging, setIsDragging] = useState<string | null>(null);

  // Initialize positions randomly or based on relationships
  useEffect(() => {
    if (containerRef.current && items.length > 0) {
      const container = containerRef.current;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      const newPositions = new Map<string, { x: number; y: number }>();

      items.forEach((item, index) => {
        if (!item.x || !item.y) {
          // Random initial position with padding
          const padding = 200;
          newPositions.set(item.id, {
            x: padding + Math.random() * (width - padding * 2),
            y: padding + Math.random() * (height - padding * 2),
          });
        } else {
          newPositions.set(item.id, { x: item.x, y: item.y });
        }
      });

      setPositions(newPositions);
    }
  }, [items]);

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPositions((prev) => {
      const next = new Map(prev);
      const current = next.get(isDragging);
      if (current) {
        next.set(isDragging, { x, y });
      }
      return next;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const getRelatedItems = (id: string): string[] => {
    return relationships
      .filter((rel) => rel.from === id || rel.to === id)
      .map((rel) => (rel.from === id ? rel.to : rel.from));
  };

  const getLinePath = (fromId: string, toId: string): string | null => {
    const from = positions.get(fromId);
    const to = positions.get(toId);
    if (!from || !to) return null;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  };

  const visibleRelationships = selectedId
    ? relationships.filter((rel) => rel.from === selectedId || rel.to === selectedId)
    : relationships;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-[600px] md:h-[800px] overflow-hidden rounded-lg border border-[var(--klutr-outline)]/20 bg-background",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* SVG for relationship lines */}
      <svg
        className="absolute inset-0 pointer-events-none z-0"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill="var(--klutr-coral)"
              opacity="0.5"
            />
          </marker>
        </defs>
        {visibleRelationships.map((rel, index) => {
          const path = getLinePath(rel.from, rel.to);
          if (!path) return null;

          const isHighlighted = selectedId && (rel.from === selectedId || rel.to === selectedId);
          const strength = rel.strength || 0.5;

          return (
            <line
              key={`${rel.from}-${rel.to}-${index}`}
              x1={positions.get(rel.from)?.x || 0}
              y1={positions.get(rel.from)?.y || 0}
              x2={positions.get(rel.to)?.x || 0}
              y2={positions.get(rel.to)?.y || 0}
              stroke="var(--klutr-coral)"
              strokeWidth={isHighlighted ? 3 : 1 + strength}
              opacity={isHighlighted ? 0.8 : 0.3}
              strokeDasharray={rel.strength && rel.strength < 0.5 ? "5,5" : "0"}
            />
          );
        })}
      </svg>

      {/* Note cards positioned absolutely */}
      <AnimatePresence>
        {items.map((item) => {
          const pos = positions.get(item.id);
          if (!pos) return null;

          const relatedIds = getRelatedItems(item.id);
          const isSelected = selectedId === item.id;
          const isRelated = selectedId && relatedIds.includes(selectedId);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isSelected ? 1 : isRelated ? 0.9 : 0.7,
                scale: isSelected ? 1.05 : 1,
                x: pos.x,
                y: pos.y,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 w-64 z-10 cursor-move"
              style={{
                transform: `translate(-50%, -50%)`,
              }}
              onMouseDown={(e) => handleMouseDown(item.id, e)}
              onClick={() => {
                setSelectedId(isSelected ? null : item.id);
                onItemClick?.(item.id);
              }}
            >
              <div
                className={cn(
                  "transition-all",
                  isSelected && "ring-2 ring-[var(--klutr-coral)] ring-offset-2 rounded-lg",
                  isRelated && "ring-1 ring-[var(--klutr-mint)] ring-offset-1 rounded-lg"
                )}
              >
                <ItemCard
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                  pinned={item.pinned}
                  onClick={() => {
                    setSelectedId(isSelected ? null : item.id);
                    onItemClick?.(item.id);
                  }}
                  onFavorite={() => onItemFavorite?.(item.id)}
                  variant="grid"
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Instructions overlay */}
      {items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <p className="text-center">
            <span className="font-semibold">Pin Board View</span>
            <br />
            <span className="text-sm">
              Drag notes to organize them. Click to see connections.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

