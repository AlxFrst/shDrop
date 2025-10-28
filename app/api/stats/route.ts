import { NextResponse } from 'next/server';
import { loadStats } from '@/lib/statistics';

export async function GET() {
  try {
    const stats = await loadStats();

    return NextResponse.json({
      success: true,
      stats,
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
