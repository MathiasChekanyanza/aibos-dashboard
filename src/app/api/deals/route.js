import { NextResponse } from 'next/server';
import { getAllDeals, createDeal, moveDeal } from '@/lib/store';

export const dynamic = 'force-dynamic';

const stageLabels = { lead: 'Lead', qualified: 'Qualified', proposal: 'Proposal', negotiation: 'Negotiation', won: 'Won', lost: 'Lost' };

export async function GET() {
  try {
    const deals = await getAllDeals();
    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
    const pipeline = stages.map(k => {
      const d = deals.filter(dl => dl.stage === k);
      return { stage: k, label: stageLabels[k], count: d.length, value: d.reduce((a, b) => a + (b.value || 0), 0) };
    });
    return NextResponse.json({ deals, total: deals.length, pipeline });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const deal = await createDeal(body);
    return NextResponse.json(deal, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
