import { NextResponse } from 'next/server';
import { readStore, computeDashboard } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dash = computeDashboard();
  return NextResponse.json(dash);
}
