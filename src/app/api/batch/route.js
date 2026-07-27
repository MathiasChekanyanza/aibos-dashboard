import { NextResponse } from 'next/server';
import { computeDashboard, getAllDeals, getAllTasks, getAllInvoices, getRecentActivity, getAllClients } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [dash, deals, tasks, invoices, activity, clients] = await Promise.all([
      computeDashboard(),
      getAllDeals(),
      getAllTasks(),
      getAllInvoices(),
      getRecentActivity(10),
      getAllClients(),
    ]);
    return NextResponse.json({ dash, deals, tasks, invoices, activity, clients });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
