import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Seed is deprecated — data lives in PostgreSQL now.
// The seed endpoint remains for backward compat but is a no-op.
export async function POST() {
  return NextResponse.json({ ok: true, message: 'PostgreSQL connected — no seed needed' });
}
