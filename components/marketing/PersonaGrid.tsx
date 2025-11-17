"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface Persona {
  title: string;
  description: string;
  iconName?: string;
}

interface PersonaGridProps {
  personas: Persona[];
  columns?: 2 | 3;
}

export default function PersonaGrid({
  personas,
  columns = 3,
}: PersonaGridProps) {
  const gridClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ staggerChildren: 0.1 }}
      className={cn("grid gap-6", gridClasses[columns])}
    >
      {personas.map((persona, index) => {
        const IconComponent = persona.iconName ? (LucideIcons as any)[persona.iconName] : null;
        
        return (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full border-[var(--klutr-outline)]/20 hover:border-[var(--klutr-mint)]/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                {IconComponent && (
                  <div className="w-12 h-12 rounded-lg bg-[var(--klutr-mint)]/10 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-[var(--klutr-mint)]" />
                  </div>
                )}
                <CardTitle className="text-xl">{persona.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {persona.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

