'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Terminal from '@/components/Terminal';
import Link from 'next/link';

interface Statistics {
  totalUploads: number;
  totalDownloads: number;
  totalBytesUploaded: number;
  totalBytesDownloaded: number;
  lastUploadAt: number | null;
  lastDownloadAt: number | null;
  uploadsToday: number;
  downloadsToday: number;
  lastResetDate: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatRelativeTime(timestamp: number | null): string {
  if (!timestamp) return 'Jamais';

  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `Il y a ${seconds} seconde${seconds > 1 ? 's' : ''}`;
}

export default function Stats() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des statistiques');
        }
        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

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
          className="text-[#666666] hover:text-[#00ff99] transition-colors"
        >
          [About]
        </Link>
        <Link
          href="/stats"
          className="text-[#00ff99] hover:text-[#33ccff] transition-colors"
        >
          [Stats]
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
            Statistiques
          </h1>
        </div>

        {loading && (
          <div className="text-[#666666]">
            <span className="cursor-blink">Chargement</span>...
          </div>
        )}

        {error && (
          <div className="text-red-400">
            ✖ {error}
          </div>
        )}

        {stats && (
          <div className="space-y-8">
            {/* Statistiques d'aujourd'hui */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-[#33ccff] flex items-center gap-2">
                <span className="text-[#666666]">▸</span>
                Aujourd'hui
              </h2>
              <div className="grid grid-cols-2 gap-4 pl-6">
                <StatItem
                  label="Uploads"
                  value={stats.uploadsToday.toString()}
                />
                <StatItem
                  label="Downloads"
                  value={stats.downloadsToday.toString()}
                />
              </div>
            </motion.div>

            {/* Statistiques totales */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-[#33ccff] flex items-center gap-2">
                <span className="text-[#666666]">▸</span>
                Total
              </h2>
              <div className="grid grid-cols-2 gap-4 pl-6">
                <StatItem
                  label="Uploads"
                  value={stats.totalUploads.toString()}
                />
                <StatItem
                  label="Downloads"
                  value={stats.totalDownloads.toString()}
                />
                <StatItem
                  label="Données uploadées"
                  value={formatBytes(stats.totalBytesUploaded)}
                />
                <StatItem
                  label="Données téléchargées"
                  value={formatBytes(stats.totalBytesDownloaded)}
                />
              </div>
            </motion.div>

            {/* Dernière activité */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-[#33ccff] flex items-center gap-2">
                <span className="text-[#666666]">▸</span>
                Dernière activité
              </h2>
              <div className="space-y-2 pl-6">
                <StatItem
                  label="Dernier upload"
                  value={formatRelativeTime(stats.lastUploadAt)}
                />
                <StatItem
                  label="Dernier download"
                  value={formatRelativeTime(stats.lastDownloadAt)}
                />
              </div>
            </motion.div>

            {/* Rafraîchissement automatique */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-[#666666] pt-4 border-t border-[#00ff99]/10"
            >
              <p>Mise à jour automatique toutes les 30 secondes</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </Terminal>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-[#666666]">{label}:</span>
      <span className="text-[#00ff99] font-semibold">{value}</span>
    </div>
  );
}
