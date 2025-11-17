"use client";

import { motion } from "framer-motion";

interface ProblemStatementProps {
  children: React.ReactNode;
}

export default function ProblemStatement({ children }: ProblemStatementProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-6 py-20"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/80 dark:text-[var(--klutr-text-primary-dark)]/80 leading-relaxed">
          {children}
        </p>
      </div>
    </motion.section>
  );
}

