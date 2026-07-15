import { NextResponse } from 'next/server';
import { readStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const activity = readStore('activity') || [];
  return NextResponse.json({ activity, total: activity.length });
}
