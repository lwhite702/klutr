"use client";

import { AppShell } from '@/components/layout/AppShell';
import { motion } from 'framer-motion';

export default function SparkPage() {
  return (
    <AppShell activeRoute="/app/spark">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[#FF6B6B] text-3xl font-display"
        >
          Spark
        </motion.div>
        <p className="text-slate-400 font-body mt-2 max-w-lg">
          Your contextual AI partner is warming up. Soon, Spark will analyze your
          thoughts and suggest meaningful connections.
        </p>
      </div>
    </AppShell>
  );
}

