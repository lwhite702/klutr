"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface ValueItem {
  title: string;
  description: string;
  iconName: string;
  color?: "coral" | "mint";
}

interface ValueGridProps {
  values: ValueItem[];
  columns?: 2 | 3 | 4;
}

export default function ValueGrid({
  values,
  columns = 4,
}: ValueGridProps) {
  const gridClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ staggerChildren: 0.1 }}
      className={cn("grid gap-6", gridClasses[columns])}
    >
      {values.map((value, index) => {
        const IconComponent = (LucideIcons as any)[value.iconName];
        const color = value.color || "coral";
        
        return (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full border-[var(--klutr-outline)]/20 hover:border-[var(--klutr-coral)]/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div
                  className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                    color === "coral"
                      ? "bg-[var(--klutr-coral)]/10"
                      : "bg-[var(--klutr-mint)]/10"
                  )}
                >
                  {IconComponent && (
                    <IconComponent
                      className={cn(
                        "w-6 h-6",
                        color === "coral"
                          ? "text-[var(--klutr-coral)]"
                          : "text-[var(--klutr-mint)]"
                      )}
                    />
                  )}
                </div>
                <CardTitle className="text-xl">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

