'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="bg-[#1a1a1a] border-2 border-[#00ff99] rounded-lg px-6 py-4 shadow-lg shadow-[#00ff99]/20 max-w-md">
            <div className="flex items-center gap-3">
              <span className="text-[#00ff99] font-mono text-sm">
                {message}
              </span>
              <button
                onClick={onClose}
                className="text-[#666666] hover:text-[#00ff99] transition-colors ml-2"
              >
                ✕
              </button>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              className="h-0.5 bg-[#00ff99] mt-3 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
