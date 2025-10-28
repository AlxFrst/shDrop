import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de fichier manquant' },
        { status: 400 }
      );
    }

    // Lister tous les fichiers dans le dossier uploads
    if (!existsSync(UPLOAD_DIR)) {
      return NextResponse.json(
        { error: 'Fichier non trouvé' },
        { status: 404 }
      );
    }

    const files = await readdir(UPLOAD_DIR);

    // Trouver le fichier qui commence par l'ID
    const matchingFile = files.find(file => file.startsWith(id));

    if (!matchingFile) {
      return NextResponse.json(
        { error: 'Fichier non trouvé' },
        { status: 404 }
      );
    }

    const filePath = path.join(UPLOAD_DIR, matchingFile);

    // Lire le fichier
    const fileBuffer = await readFile(filePath);

    // Extraire le nom de fichier original (si disponible)
    // Pour l'instant, on utilise simplement le nom du fichier stocké
    const fileName = matchingFile;

    // Retourner le fichier avec les bons headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du fichier' },
      { status: 500 }
    );
  }
}
