import { NextResponse } from 'next/server';
import { getCompany } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const company = await getCompany();
    return NextResponse.json(company);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
