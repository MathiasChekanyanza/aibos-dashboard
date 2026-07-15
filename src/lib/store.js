// AI-BOS Data Store — file-backed JSON store, server-side only
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readStore(name) {
  ensureDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch { return null; }
}

export function writeStore(name, data) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

export function computeDashboard() {
  const tasks = readStore('tasks') || [];
  const deals = readStore('deals') || [];
  const invoices = readStore('invoices') || [];
  const agents = readStore('agents') || [];
  const activity = readStore('activity') || [];

  const activeDeals = deals.filter(d => d.stage !== 'closed').length;
  const mtdRevenue = invoices
    .filter(i => {
      const d = new Date(i.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && i.status === 'paid';
    })
    .reduce((s, i) => s + (i.amount || 0), 0);
  const openTasks = tasks.filter(t => t.status !== 'done').length;
  const overdue = tasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < new Date()).length;

  const stageKeys = ['lead', 'qualified', 'proposal', 'negotiation', 'closed'];
  const stageLabels = { lead: 'Lead', qualified: 'Qualified', proposal: 'Proposal', negotiation: 'Negotiation', closed: 'Closed' };
  const stageData = stageKeys.map(k => {
    const s = deals.filter(d => (d.stage || 'lead') === k);
    return { key: k, label: stageLabels[k], count: s.length, value: s.reduce((a, d) => a + (d.value || 0), 0) };
  });
  const totalDealValue = stageData.reduce((s, d) => s + d.value, 0);
  const withPct = stageData.map(d => ({ ...d, pct: totalDealValue ? Math.round((d.value / totalDealValue) * 10000) / 100 : 0 }));

  return {
    activeDeals, mtdRevenue, openTasks, overdue,
    pipeline: { stages: withPct, totalValue: totalDealValue },
    agents, activity: activity.slice(0, 50),
    company: readStore('company') || { name: 'AI-BOS' },
    lastSync: new Date().toISOString()
  };
}
