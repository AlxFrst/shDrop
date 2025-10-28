import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getMetadata, isExpired, deleteFile, incrementDownloads } from '@/lib/fileMetadata';
import { recordDownload } from '@/lib/statistics';

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

    // Vérifier si le fichier existe et n'est pas expiré
    const metadata = await getMetadata(id);

    if (!metadata) {
      return NextResponse.json(
        { error: 'Fichier non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier l'expiration
    const expired = await isExpired(id);
    if (expired) {
      // Supprimer le fichier expiré
      await deleteFile(id);
      return NextResponse.json(
        { error: 'Ce fichier a expiré et n\'est plus disponible' },
        { status: 410 }
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
    const matchingFile = files.find(file => file.startsWith(id) && file !== '.metadata' && file !== '.gitkeep');

    if (!matchingFile) {
      return NextResponse.json(
        { error: 'Fichier non trouvé' },
        { status: 404 }
      );
    }

    const filePath = path.join(UPLOAD_DIR, matchingFile);

    // Lire le fichier
    const fileBuffer = await readFile(filePath);

    // Utiliser le nom original depuis les métadonnées
    const fileName = metadata.originalName;

    // Incrémenter le compteur de téléchargements
    await incrementDownloads(id);

    // Enregistrer les statistiques
    await recordDownload(fileBuffer.length);

    // Retourner le fichier avec les bons headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'X-File-Downloads': metadata.downloads.toString(),
        'X-File-Expires': new Date(metadata.expiresAt).toISOString(),
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
