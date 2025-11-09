"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import { brandColors } from "@klutr/brand";

interface DropZoneProps {
  onDrop: (files: File[]) => void;
  accept?: string;
  children?: React.ReactNode;
}

export function DropZone({ onDrop, accept, children }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onDrop(files);
      }
    },
    [onDrop]
  );

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative"
      >
        {children}
      </div>
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            style={{
              backgroundColor: `${brandColors.offWhite}CC`,
            }}
          >
            <div className="flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed bg-[var(--klutr-background)]/90 backdrop-blur-md shadow-2xl"
              style={{
                borderColor: "var(--klutr-coral)",
              }}
            >
              <Upload
                className="h-12 w-12 text-[var(--klutr-coral)]"
              />
              <p className="text-lg font-display font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Drop files here to add to your stream
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

