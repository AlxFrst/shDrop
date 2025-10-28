'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-12 text-center transition-all
        ${isDragging ? 'border-[#33ccff] bg-[#33ccff]/10' : 'border-[#00ff99]/30 hover:border-[#00ff99]/60'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <input
        type="file"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        id="file-input"
      />

      <div className="space-y-4">
        <div className="text-4xl">📁</div>

        <div className="space-y-2">
          <p className="text-[#00ff99] text-lg">
            {isDragging ? (
              <span className="text-[#33ccff]">
                {'>'} Drop ton fichier ici
              </span>
            ) : (
              <>
                <span className="text-[#666666]">{'>'}</span> Glisse ton fichier ici
              </>
            )}
          </p>
          <p className="text-[#666666] text-sm">
            ou clique pour sélectionner
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-[#666666]">
          <span>Taille max: 100MB</span>
          <span>•</span>
          <span>Tous formats acceptés</span>
        </div>
      </div>

      {/* Curseur clignotant */}
      {!disabled && (
        <motion.span
          className="inline-block ml-1 cursor-blink text-[#00ff99]"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          █
        </motion.span>
      )}
    </motion.div>
  );
}
