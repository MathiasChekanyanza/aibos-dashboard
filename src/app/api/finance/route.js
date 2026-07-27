import { NextResponse } from 'next/server';
import { getAllInvoices, createInvoice } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const invoices = await getAllInvoices();
    const totalBilled = invoices.reduce((s, i) => s + (i.amount || 0), 0);
    const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0);
    const totalDue = totalBilled - totalPaid;
    const overdueInvoices = invoices.filter(i => i.status !== 'paid' && i.due_date && new Date(i.due_date) < new Date());
    return NextResponse.json({
      invoices,
      transactions: [],
      summary: {
        totalBilled,
        totalPaid,
        totalDue,
        balance: totalDue,
        overdueCount: overdueInvoices.length,
        overdueAmount: overdueInvoices.reduce((s, i) => s + (i.amount || 0), 0),
      }
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const invoice = await createInvoice(body);
    return NextResponse.json(invoice, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
