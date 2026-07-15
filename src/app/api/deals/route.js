import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

const stageLabels = { lead: 'Lead', qualified: 'Qualified', proposal: 'Proposal', negotiation: 'Negotiation', closed: 'Closed' };

export async function GET() {
  const deals = readStore('deals') || [];
  const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed'];
  const pipeline = stages.map(k => {
    const d = deals.filter(dl => (dl.stage || 'lead') === k);
    return { stage: k, label: stageLabels[k], count: d.length, value: d.reduce((a, b) => a + (b.value || 0), 0) };
  });
  return NextResponse.json({ deals, total: deals.length, pipeline });
}

export async function POST(req) {
  const body = await req.json();
  const deals = readStore('deals') || [];
  const deal = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    name: body.name,
    company: body.company || '',
    value: body.value || 0,
    stage: body.stage || 'lead',
    owner: body.owner || '',
    probability: body.probability || 10,
    notes: body.notes || '',
    createdAt: new Date().toISOString()
  };
  deals.push(deal);
  writeStore('deals', deals);
  return NextResponse.json(deal, { status: 201 });
}
