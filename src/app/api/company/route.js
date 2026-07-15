import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(readStore('company') || { name: 'AI-BOS' });
}

export async function PUT(req) {
  const body = await req.json();
  writeStore('company', { ...body, updatedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
