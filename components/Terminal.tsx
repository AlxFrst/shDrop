'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TerminalProps {
  children: ReactNode;
}

export default function Terminal({ children }: TerminalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#0d0d0d] text-[#00ff99] font-mono p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header terminal-style */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="text-[#666666]">[</span>
            <span className="text-[#33ccff]">shDrop</span>
            <span className="text-[#666666]">]</span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
