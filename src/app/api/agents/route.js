import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const agents = [
  { id: 'main', name: 'Elon', role: 'CEO', status: 'active', activity: 'Orchestrating AI-BOS' },
  { id: 'rd', name: 'Tesla', role: 'R&D', status: 'active', activity: 'Market intelligence' },
  { id: 'dev', name: 'Linus', role: 'Dev', status: 'active', activity: 'Systems & code' },
  { id: 'finance', name: 'Buffett', role: 'Finance', status: 'active', activity: 'Financial analysis' },
  { id: 'crm', name: 'Ogilvy', role: 'CRM', status: 'active', activity: 'Client relationships' },
  { id: 'tasks', name: 'David Allen', role: 'Tasks', status: 'active', activity: 'GTD workflow' },
  { id: 'ops', name: 'Ford', role: 'Ops', status: 'active', activity: 'Process monitoring' },
  { id: 'docs', name: 'Hemingway', role: 'Docs', status: 'idle', activity: 'Document drafting' },
  { id: 'strategy', name: 'Sun Tzu', role: 'Strategy', status: 'idle', activity: 'Strategic planning' },
  { id: 'hacker', name: 'Mitnick', role: 'Security', status: 'idle', activity: 'Security auditing' },
];

export async function GET() {
  return NextResponse.json({ agents, total: agents.length });
}
