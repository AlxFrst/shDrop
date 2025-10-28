import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// Configuration
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    // Créer le dossier uploads s'il n'existe pas
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop grand. Taille max: 100MB' },
        { status: 413 }
      );
    }

    // Générer un UUID pour le fichier
    const fileId = randomUUID();
    const fileExtension = path.extname(file.name);
    const fileName = `${fileId}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Convertir le fichier en buffer et l'écrire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Construire les URLs et commandes
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    const downloadUrl = `${baseUrl}/api/files/${fileId}`;
    const originalFileName = file.name;

    return NextResponse.json({
      success: true,
      file_id: fileId,
      filename: originalFileName,
      size: file.size,
      download_url: downloadUrl,
      wget: `wget "${downloadUrl}" -O "${originalFileName}"`,
      curl: `curl -o "${originalFileName}" "${downloadUrl}"`,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}

// Configuration pour autoriser les gros fichiers
export const config = {
  api: {
    bodyParser: false,
  },
};
