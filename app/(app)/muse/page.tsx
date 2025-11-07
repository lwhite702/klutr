"use client";

import { AppShell } from '@/components/layout/AppShell';
import { motion } from 'framer-motion';

export default function MusePage() {
  return (
    <AppShell activeRoute="/app/muse">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="text-[#3EE0C5] text-3xl font-display"
        >
          Muse
        </motion.div>
        <p className="text-slate-400 font-body mt-2 max-w-lg">
          Muse will soon remix your ideas into creative sparks. For now, enjoy
          the motion of inspiration.
        </p>
      </div>
    </AppShell>
  );
}

