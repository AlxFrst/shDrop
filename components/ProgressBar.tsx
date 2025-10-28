'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  progress: number;
  filename?: string;
}

export default function ProgressBar({ progress, filename }: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    setDisplayProgress(progress);
  }, [progress]);

  const barLength = 30;
  const filledLength = Math.round((displayProgress / 100) * barLength);
  const emptyLength = barLength - filledLength;

  const progressBar = '[' + '#'.repeat(filledLength) + '-'.repeat(emptyLength) + ']';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2">
        <span className="text-[#666666]">{'>'}</span>
        <span className="text-[#00ff99]">Uploading</span>
        {filename && (
          <span className="text-[#33ccff]">{filename}</span>
        )}
        <motion.span
          className="cursor-blink text-[#00ff99]"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          ...
        </motion.span>
      </div>

      <div className="flex items-center gap-3 font-mono text-sm">
        <span className="text-[#00ff99]">{progressBar}</span>
        <span className="text-[#33ccff] font-bold min-w-[3ch] text-right">
          {Math.round(displayProgress)}%
        </span>
      </div>

      {displayProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-[#00ff99]"
        >
          <span>✔</span>
          <span>Upload complete!</span>
        </motion.div>
      )}
    </motion.div>
  );
}
