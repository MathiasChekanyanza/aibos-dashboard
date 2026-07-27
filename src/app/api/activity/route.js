import { NextResponse } from 'next/server';
import { getRecentActivity } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const activity = await getRecentActivity(50);
    return NextResponse.json({ activity, total: activity.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
