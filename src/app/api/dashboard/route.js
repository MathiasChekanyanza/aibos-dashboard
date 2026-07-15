import { NextResponse } from 'next/server';
import { computeDashboard } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = computeDashboard();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
