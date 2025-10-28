'use client';

import { motion } from 'framer-motion';
import Terminal from '@/components/Terminal';
import Link from 'next/link';

export default function About() {
  return (
    <Terminal>
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 flex items-center gap-4 text-sm"
      >
        <Link
          href="/"
          className="text-[#666666] hover:text-[#00ff99] transition-colors"
        >
          [Home]
        </Link>
        <Link
          href="/about"
          className="text-[#00ff99] hover:text-[#33ccff] transition-colors"
        >
          [About]
        </Link>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6 max-w-2xl"
      >
        <div>
          <h1 className="text-2xl text-[#00ff99] mb-4 flex items-center gap-2">
            <span className="text-[#666666]">{'>'}</span>
            shDrop
          </h1>
          <p className="text-[#666666] leading-relaxed">
            Un outil minimaliste pour transférer des fichiers via le terminal.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 pl-6 border-l-2 border-[#00ff99]/20"
        >
          <div>
            <p className="text-[#00ff99] mb-2">
              <span className="text-[#33ccff] mr-2">▸</span>
              Upload depuis ton navigateur
            </p>
          </div>
          <div>
            <p className="text-[#00ff99] mb-2">
              <span className="text-[#33ccff] mr-2">▸</span>
              Télécharge avec wget ou curl
            </p>
          </div>
          <div>
            <p className="text-[#00ff99] mb-2">
              <span className="text-[#33ccff] mr-2">▸</span>
              Aucun compte, aucune pub, juste du shell et de la vitesse
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-6 border-t border-[#00ff99]/10"
        >
          <p className="text-[#00ff99] text-lg font-semibold">
            Upload. Fetch. Done.
          </p>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="pt-6 space-y-3"
        >
          <p className="text-[#666666] text-sm">
            <span className="text-[#33ccff]">Stack:</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-[#00ff99]">
              <span className="text-[#666666] mr-2">→</span>
              Next.js 14+
            </div>
            <div className="text-[#00ff99]">
              <span className="text-[#666666] mr-2">→</span>
              TypeScript
            </div>
            <div className="text-[#00ff99]">
              <span className="text-[#666666] mr-2">→</span>
              TailwindCSS
            </div>
            <div className="text-[#00ff99]">
              <span className="text-[#666666] mr-2">→</span>
              Framer Motion
            </div>
          </div>
        </motion.div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="pt-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff99]/10 hover:bg-[#00ff99]/20 border border-[#00ff99]/30 rounded text-[#00ff99] transition-all"
          >
            <span>←</span>
            <span>Retour à l'accueil</span>
          </Link>
        </motion.div>
      </motion.div>
    </Terminal>
  );
}
