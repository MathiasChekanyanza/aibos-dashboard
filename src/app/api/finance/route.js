import { NextResponse } from 'next/server';
import { readStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const invoices = readStore('invoices') || [];
  const transactions = readStore('transactions') || [];
  const totalBilled = invoices.reduce((s, i) => s + (i.amount || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0);
  const totalDue = totalBilled - totalPaid;
  const overdueInvoices = invoices.filter(i => i.status !== 'paid' && i.dueDate && new Date(i.dueDate) < new Date());
  return NextResponse.json({
    invoices, transactions,
    summary: { totalBilled, totalPaid, totalDue, balance: totalDue, overdueCount: overdueInvoices.length, overdueAmount: overdueInvoices.reduce((s, i) => s + (i.amount || 0), 0) }
  });
}
