import { NextResponse } from 'next/server';
import { readStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const agents = readStore('agents') || [];
  return NextResponse.json({ agents, total: agents.length });
}
