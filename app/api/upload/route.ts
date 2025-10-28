import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { saveMetadata, getTTL, cleanupExpiredFiles } from '@/lib/fileMetadata';
import { recordUpload } from '@/lib/statistics';

// Configuration
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

async function handleUpload(
  fileBuffer: Buffer,
  fileName: string,
  fileSize: number,
  request: NextRequest
) {
  // Créer le dossier uploads s'il n'existe pas
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  // Vérifier la taille du fichier
  if (fileSize > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'Fichier trop grand. Taille max: 100MB' },
      { status: 413 }
    );
  }

  // Générer un UUID pour le fichier
  const fileId = randomUUID();
  const fileExtension = path.extname(fileName);
  const finalFileName = `${fileId}${fileExtension}`;
  const filePath = path.join(UPLOAD_DIR, finalFileName);

  // Écrire le fichier
  await writeFile(filePath, fileBuffer);

  // Sauvegarder les métadonnées avec TTL
  const ttl = getTTL();
  await saveMetadata(fileId, fileName, fileSize, ttl);

  // Enregistrer les statistiques
  await recordUpload(fileSize);

  // Nettoyer les fichiers expirés (en arrière-plan)
  cleanupExpiredFiles().catch(err => console.error('Cleanup error:', err));

  // Construire les URLs et commandes
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
    `${request.nextUrl.protocol}//${request.nextUrl.host}`;

  const downloadUrl = `${baseUrl}/api/files/${fileId}`;
  const uploadUrl = `${baseUrl}/api/upload/${fileId}`;
  const expiresAt = Date.now() + ttl;

  return NextResponse.json({
    success: true,
    file_id: fileId,
    filename: fileName,
    size: fileSize,
    download_url: downloadUrl,
    expires_at: expiresAt,
    expires_in_hours: Math.round(ttl / (1000 * 60 * 60)),
    wget: `wget "${downloadUrl}" -O "${fileName}"`,
    curl: `curl -o "${fileName}" "${downloadUrl}"`,
    curl_upload: `curl -T "${fileName}" "${uploadUrl}"`,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return await handleUpload(buffer, file.name, file.size, request);

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}

// Support de curl -T (PUT upload)
export async function PUT(request: NextRequest) {
  try {
    // Obtenir le nom du fichier depuis l'URL ou les headers
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const fileNameFromUrl = pathSegments[pathSegments.length - 1];

    const fileName = fileNameFromUrl && fileNameFromUrl !== 'upload'
      ? fileNameFromUrl
      : request.headers.get('x-file-name') || 'uploaded-file';

    // Lire le corps de la requête
    const buffer = Buffer.from(await request.arrayBuffer());

    if (buffer.length === 0) {
      return NextResponse.json(
        { error: 'Aucun contenu fourni' },
        { status: 400 }
      );
    }

    return await handleUpload(buffer, fileName, buffer.length, request);

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}
