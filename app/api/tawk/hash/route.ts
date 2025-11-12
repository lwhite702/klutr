// app/api/tawk/hash/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { computeTawkHash } from '@/lib/helpers/tawkHash';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    // secret stored as Vercel / Doppler env
    const secret = process.env.TAWK_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: 'tawk secret not configured' },
        { status: 500 }
      );
    }

    const hash = computeTawkHash(String(user.id), secret);

    return NextResponse.json({
      id: String(user.id),
      name: user.email?.split('@')[0] || '',
      email: user.email || '',
      tawkHash: hash,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'unauthenticated' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

