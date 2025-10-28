import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const STATS_FILE = path.join(process.cwd(), 'public', 'uploads', '.metadata', 'stats.json');

export interface Statistics {
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

const DEFAULT_STATS: Statistics = {
  totalUploads: 0,
  totalDownloads: 0,
  totalBytesUploaded: 0,
  totalBytesDownloaded: 0,
  lastUploadAt: null,
  lastDownloadAt: null,
  uploadsToday: 0,
  downloadsToday: 0,
  lastResetDate: new Date().toISOString().split('T')[0],
};

/**
 * Charger les statistiques
 */
export async function loadStats(): Promise<Statistics> {
  if (!existsSync(STATS_FILE)) {
    return { ...DEFAULT_STATS };
  }

  try {
    const data = await readFile(STATS_FILE, 'utf-8');
    const stats = JSON.parse(data);

    // Réinitialiser les compteurs quotidiens si on change de jour
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastResetDate !== today) {
      stats.uploadsToday = 0;
      stats.downloadsToday = 0;
      stats.lastResetDate = today;
    }

    return stats;
  } catch (error) {
    console.error('Error loading stats:', error);
    return { ...DEFAULT_STATS };
  }
}

/**
 * Sauvegarder les statistiques
 */
async function saveStats(stats: Statistics): Promise<void> {
  const { mkdir } = await import('fs/promises');
  const dir = path.dirname(STATS_FILE);

  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  await writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
}

/**
 * Enregistrer un upload
 */
export async function recordUpload(bytes: number): Promise<void> {
  const stats = await loadStats();

  stats.totalUploads++;
  stats.totalBytesUploaded += bytes;
  stats.lastUploadAt = Date.now();
  stats.uploadsToday++;

  await saveStats(stats);
}

/**
 * Enregistrer un download
 */
export async function recordDownload(bytes: number): Promise<void> {
  const stats = await loadStats();

  stats.totalDownloads++;
  stats.totalBytesDownloaded += bytes;
  stats.lastDownloadAt = Date.now();
  stats.downloadsToday++;

  await saveStats(stats);
}

/**
 * Formater les octets en format lisible
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Formater une date relative
 */
export function formatRelativeTime(timestamp: number | null): string {
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
