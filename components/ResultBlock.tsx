'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ResultBlockProps {
  downloadUrl: string;
  wgetCommand: string;
  curlCommand: string;
  onShowToast: (message: string) => void;
}

export default function ResultBlock({
  downloadUrl,
  wgetCommand,
  curlCommand,
  onShowToast,
}: ResultBlockProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(label);
      onShowToast(`✔ ${label} copié dans le presse-papiers`);

      setTimeout(() => {
        setCopiedItem(null);
      }, 2000);
    } catch (err) {
      onShowToast('✖ Erreur lors de la copie');
    }
  };

  const CommandLine = ({
    label,
    command,
    copyLabel
  }: {
    label: string;
    command: string;
    copyLabel: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#666666]">{'>'}</span>
        <span className="text-[#33ccff]">{label}</span>
      </div>
      <div className="group relative">
        <div className="bg-[#1a1a1a] border border-[#00ff99]/20 rounded p-3 pr-12 overflow-x-auto">
          <code className="text-[#00ff99] text-sm break-all">
            {command}
          </code>
        </div>
        <button
          onClick={() => copyToClipboard(command, copyLabel)}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#00ff99]/10 hover:bg-[#00ff99]/20 border border-[#00ff99]/30 rounded text-[#00ff99] text-xs transition-all"
        >
          {copiedItem === copyLabel ? '✓' : '📋'}
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 text-[#00ff99]"
      >
        <span className="text-xl">✔</span>
        <span className="font-semibold">Fichier reçu !</span>
      </motion.div>

      {/* Download URL */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#666666]">{'>'}</span>
          <span className="text-[#00ff99]">Ton fichier est disponible ici :</span>
        </div>
        <div className="group relative">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#1a1a1a] border border-[#33ccff]/30 rounded p-3 pr-12 overflow-x-auto hover:border-[#33ccff]/60 transition-colors"
          >
            <code className="text-[#33ccff] text-sm break-all underline">
              {downloadUrl}
            </code>
          </a>
          <button
            onClick={() => copyToClipboard(downloadUrl, 'URL')}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#33ccff]/10 hover:bg-[#33ccff]/20 border border-[#33ccff]/30 rounded text-[#33ccff] text-xs transition-all"
          >
            {copiedItem === 'URL' ? '✓' : '📋'}
          </button>
        </div>
      </div>

      {/* Commands */}
      <div className="space-y-4 pt-4 border-t border-[#00ff99]/10">
        <CommandLine
          label="wget"
          command={wgetCommand}
          copyLabel="wget"
        />
        <CommandLine
          label="curl"
          command={curlCommand}
          copyLabel="curl"
        />
      </div>

      {/* New upload button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="pt-4"
      >
        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-3 bg-[#00ff99]/10 hover:bg-[#00ff99]/20 border border-[#00ff99]/30 rounded text-[#00ff99] transition-all flex items-center justify-center gap-2"
        >
          <span>{'>'}</span>
          <span>Uploader un autre fichier</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
