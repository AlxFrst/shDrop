import { readFile, writeFile, unlink, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const METADATA_DIR = path.join(process.cwd(), 'public', 'uploads', '.metadata');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// TTL par défaut : 24 heures (en millisecondes)
const DEFAULT_TTL = 24 * 60 * 60 * 1000;

export interface FileMetadata {
  fileId: string;
  originalName: string;
  size: number;
  uploadedAt: number;
  expiresAt: number;
  downloads: number;
}

/**
 * Créer le dossier de métadonnées s'il n'existe pas
 */
async function ensureMetadataDir() {
  const { mkdir } = await import('fs/promises');
  if (!existsSync(METADATA_DIR)) {
    await mkdir(METADATA_DIR, { recursive: true });
  }
}

/**
 * Sauvegarder les métadonnées d'un fichier
 */
export async function saveMetadata(
  fileId: string,
  originalName: string,
  size: number,
  ttlMs?: number
): Promise<FileMetadata> {
  await ensureMetadataDir();

  const now = Date.now();
  const ttl = ttlMs || DEFAULT_TTL;

  const metadata: FileMetadata = {
    fileId,
    originalName,
    size,
    uploadedAt: now,
    expiresAt: now + ttl,
    downloads: 0,
  };

  const metadataPath = path.join(METADATA_DIR, `${fileId}.json`);
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

  return metadata;
}

/**
 * Récupérer les métadonnées d'un fichier
 */
export async function getMetadata(fileId: string): Promise<FileMetadata | null> {
  const metadataPath = path.join(METADATA_DIR, `${fileId}.json`);

  if (!existsSync(metadataPath)) {
    return null;
  }

  try {
    const data = await readFile(metadataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading metadata:', error);
    return null;
  }
}

/**
 * Incrémenter le compteur de téléchargements
 */
export async function incrementDownloads(fileId: string): Promise<void> {
  const metadata = await getMetadata(fileId);
  if (!metadata) return;

  metadata.downloads++;

  const metadataPath = path.join(METADATA_DIR, `${fileId}.json`);
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Vérifier si un fichier est expiré
 */
export async function isExpired(fileId: string): Promise<boolean> {
  const metadata = await getMetadata(fileId);
  if (!metadata) return true;

  return Date.now() > metadata.expiresAt;
}

/**
 * Supprimer un fichier et ses métadonnées
 */
export async function deleteFile(fileId: string): Promise<void> {
  // Trouver le fichier qui correspond à l'ID
  const files = await readdir(UPLOADS_DIR);
  const matchingFile = files.find(file => file.startsWith(fileId) && file !== '.metadata' && file !== '.gitkeep');

  if (matchingFile) {
    const filePath = path.join(UPLOADS_DIR, matchingFile);
    try {
      await unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  // Supprimer les métadonnées
  const metadataPath = path.join(METADATA_DIR, `${fileId}.json`);
  if (existsSync(metadataPath)) {
    try {
      await unlink(metadataPath);
    } catch (error) {
      console.error('Error deleting metadata:', error);
    }
  }
}

/**
 * Nettoyer tous les fichiers expirés
 */
export async function cleanupExpiredFiles(): Promise<number> {
  await ensureMetadataDir();

  if (!existsSync(METADATA_DIR)) {
    return 0;
  }

  const metadataFiles = await readdir(METADATA_DIR);
  let deletedCount = 0;

  for (const metadataFile of metadataFiles) {
    if (!metadataFile.endsWith('.json')) continue;

    const fileId = metadataFile.replace('.json', '');
    const expired = await isExpired(fileId);

    if (expired) {
      await deleteFile(fileId);
      deletedCount++;
    }
  }

  return deletedCount;
}

/**
 * Obtenir le TTL configuré (depuis les variables d'environnement)
 */
export function getTTL(): number {
  const ttlHours = process.env.FILE_TTL_HOURS;
  if (ttlHours) {
    const hours = parseInt(ttlHours, 10);
    if (!isNaN(hours) && hours > 0) {
      return hours * 60 * 60 * 1000;
    }
  }
  return DEFAULT_TTL;
}
