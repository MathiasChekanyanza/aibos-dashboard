/* =============================================================
   AI-BOS Mission Control Dashboard API
   File-based storage (JSON) — lightweight, portable
   =============================================================
   Run: node server.js
   Port: 3000
   ============================================================= */

const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '3000');
const DATA_DIR = path.join(__dirname, 'data');

// ─── File-based store ─────────────────────────────────────

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readStore(name) {
  ensureDataDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function writeStore(name, data) {
  ensureDataDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ─── Seed data if empty ───────────────────────────────────

function seed() {
  if (!readStore('tasks')) {
    writeStore('tasks', []);
  }
  if (!readStore('deals')) {
    writeStore('deals', []);
  }
  if (!readStore('invoices')) {
    writeStore('invoices', []);
  }
  if (!readStore('transactions')) {
    writeStore('transactions', []);
  }
}

seed();

// ─── Express ──────────────────────────────────────────────

const app = express();

// CORS headers — allow all origins (dev mode)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mount Nyasha AI4I landing page
const nyashaPath = path.join(__dirname, '..', 'ai4i', 'nyasha', 'public');
if (fs.existsSync(nyashaPath)) {
  app.use('/nyasha', express.static(nyashaPath, { index: 'index.html' }));
  // Explicit route for /nyasha/ root
  app.get('/nyasha/', (req, res) => {
    res.sendFile(path.join(nyashaPath, 'index.html'));
  });
  app.get('/nyasha', (req, res) => {
    res.redirect('/nyasha/');
  });
  console.log('  Nyasha landing page at /nyasha');
}

// ─── Helper: compute derived stats ────────────────────────

function getDashboard() {
  const tasks = readStore('tasks') || [];
  const deals = readStore('deals') || [];
  const invoices = readStore('invoices') || [];
  const transactions = readStore('transactions') || [];

  const now = new Date();

  const overdueTasks = tasks.filter(t => !t.done && t.priority >= 4);
  const activeDeals = deals.filter(d => d.status !== 'closed');
  const stalledDeals = activeDeals.filter(d => d.status === 'stalled');
  const overdueInvoices = invoices.filter(i => i.status === 'overdue');

  const monthlyRevenue = transactions
    .filter(t => t.type === 'income' && new Date(t.created_at) >= new Date(now.getFullYear(), now.getMonth(), 1))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return {
    tasks: { total: tasks.filter(t => !t.done).length, overdue: overdueTasks.length },
    deals: { total: activeDeals.length, stalled: stalledDeals.length },
    revenue: monthlyRevenue,
    overdue_invoices: overdueInvoices.length,
    system: { status: 'online', detail: 'AI-BOS Dashboard v1 (file-based)' },
  };
}

// ─── Root — HTML landing page ────────────────────────────



// ─── Health ───────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'live', storage: 'file-based' });
});

// ─── Dashboard Summary ────────────────────────────────────

app.get('/api/dashboard', (req, res) => {
  res.json(getDashboard());
});

// ─── Tasks CRUD ───────────────────────────────────────────

app.get('/api/tasks', (req, res) => {
  const tasks = readStore('tasks') || [];
  res.json({ tasks });
});

app.post('/api/tasks', (req, res) => {
  const tasks = readStore('tasks') || [];
  const task = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: req.body.title || 'Untitled',
    description: req.body.description || '',
    priority: req.body.priority || 0,
    done: false,
    due_date: req.body.due_date || null,
    created_at: new Date().toISOString(),
  };
  tasks.push(task);
  writeStore('tasks', tasks);
  res.status(201).json({ task });
});

app.put('/api/tasks/:id', (req, res) => {
  const tasks = readStore('tasks') || [];
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[idx] = { ...tasks[idx], ...req.body, id: tasks[idx].id };
  writeStore('tasks', tasks);
  res.json({ task: tasks[idx] });
});

app.delete('/api/tasks/:id', (req, res) => {
  let tasks = readStore('tasks') || [];
  const len = tasks.length;
  tasks = tasks.filter(t => t.id !== req.params.id);
  if (tasks.length === len) return res.status(404).json({ error: 'Task not found' });
  writeStore('tasks', tasks);
  res.json({ ok: true });
});

// ─── Deals CRUD ───────────────────────────────────────────

app.get('/api/deals', (req, res) => {
  const deals = readStore('deals') || [];
  res.json({ deals });
});

app.post('/api/deals', (req, res) => {
  const deals = readStore('deals') || [];
  const deal = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: req.body.title || 'Untitled',
    value: req.body.value || 0,
    status: req.body.status || 'new',
    client: req.body.client || '',
    created_at: new Date().toISOString(),
  };
  deals.push(deal);
  writeStore('deals', deals);
  res.status(201).json({ deal });
});

app.put('/api/deals/:id', (req, res) => {
  const deals = readStore('deals') || [];
  const idx = deals.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Deal not found' });
  deals[idx] = { ...deals[idx], ...req.body, id: deals[idx].id };
  writeStore('deals', deals);
  res.json({ deal: deals[idx] });
});

// ─── Invoices ─────────────────────────────────────────────

app.get('/api/invoices', (req, res) => {
  const invoices = readStore('invoices') || [];
  res.json({ invoices });
});

app.post('/api/invoices', (req, res) => {
  const invoices = readStore('invoices') || [];
  const inv = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    client: req.body.client || '',
    amount: req.body.amount || 0,
    status: req.body.status || 'pending',
    due_date: req.body.due_date || null,
    created_at: new Date().toISOString(),
  };
  invoices.push(inv);
  writeStore('invoices', invoices);
  res.status(201).json({ invoice: inv });
});

app.put('/api/invoices/:id', (req, res) => {
  const invoices = readStore('invoices') || [];
  const idx = invoices.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Invoice not found' });
  invoices[idx] = { ...invoices[idx], ...req.body, id: invoices[idx].id };
  writeStore('invoices', invoices);
  res.json({ invoice: invoices[idx] });
});

// ─── Transactions ─────────────────────────────────────────

app.get('/api/transactions', (req, res) => {
  const transactions = readStore('transactions') || [];
  res.json({ transactions });
});

app.post('/api/transactions', (req, res) => {
  const transactions = readStore('transactions') || [];
  const tx = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    type: req.body.type || 'expense',
    amount: req.body.amount || 0,
    description: req.body.description || '',
    category: req.body.category || '',
    created_at: new Date().toISOString(),
  };
  transactions.push(tx);
  writeStore('transactions', transactions);
  res.status(201).json({ transaction: tx });
});

// ─── Chat (echo + lookup) ─────────────────────────────────

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  const lower = message.toLowerCase();
  const dash = getDashboard();
  let reply;

  if (lower.includes('task')) {
    reply = `📋 You have ${dash.tasks.total} open tasks (${dash.tasks.overdue} high priority).`;
  } else if (lower.includes('deal') || lower.includes('pipeline')) {
    reply = `🤝 Pipeline has ${dash.deals.total} active deals (${dash.deals.stalled} stalled).`;
  } else if (lower.includes('revenue') || lower.includes('money')) {
    reply = `💰 Revenue this month: $${dash.revenue.toLocaleString()}.`;
  } else if (lower.includes('invoice')) {
    reply = `🧾 ${dash.overdue_invoices} overdue invoices.`;
  } else if (lower.includes('system') || lower.includes('status')) {
    reply = `⚙️ AI-BOS online. File-based storage. Gateway operational.`;
  } else {
    reply = `🤖 I can answer about tasks, deals, revenue, invoices, or system status.`;
  }

  res.json({ reply });
});

// ─── Reminders ────────────────────────────────────────────

app.get('/api/reminders', (req, res) => {
  const tasks = readStore('tasks') || [];
  const upcoming = tasks
    .filter(t => !t.done)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0)).reverse()
    .slice(0, 10)
    .map(t => ({ id: t.id, text: t.title, due: t.due_date, done: t.done }));
  res.json({ reminders: upcoming });
});

// ─── Nyasha Math Solver API ──────────────────────────────

function solveMathProblem(message) {
  const q = message.toLowerCase().trim();
  
  if (/^(hi|hello|hey)/i.test(q)) {
    return 'Hi! 👋 I\'m Nyasha, your AI maths tutor.\n\nSend me a ZIMSEC maths problem and I\'ll solve it step-by-step.\n\nExample: *solve 2x + 5 = 13*';
  }
  
  // Linear: solve ax + b = c
  const lm = q.match(/solve\s+(\d*\.?\d*)\s*x\s*\+\s*(\d*\.?\d*)\s*=\s*(\d*\.?\d+)/);
  if (lm) {
    const a = parseFloat(lm[1])||1, b = parseFloat(lm[2])||0, c = parseFloat(lm[3]);
    const x = (c-b)/a;
    return `📝 *Solving:* ${a}x + ${b} = ${c}\n\nStep 1: Subtract ${b} from both sides\n   ${a}x = ${c} − ${b} = ${c-b}\n\nStep 2: Divide by ${a}\n   x = ${x}\n\n✅ *Answer: x = ${x}*`;
  }
  
  // Percentage: X% of Y
  const pm = q.match(/(\d+)\s*%\s*of\s*(\d+)/);
  if (pm) {
    const p=parseFloat(pm[1]), v=parseFloat(pm[2]), r=p/100*v;
    return `📝 ${p}% of ${v}\n\nStep 1: ${p} ÷ 100 = ${p/100}\nStep 2: ${p/100} × ${v} = ${r}\n\n✅ *Answer: ${r}*`;
  }
  
  // Area of circle
  const ac = q.match(/area.*circle.*radius\s*(\d+)/i);
  if (ac) {
    const r=parseFloat(ac[1]), a=Math.PI*r*r;
    return `📝 Area of circle (r=${r}cm)\n\nA = πr²\nA = π × ${r}²\nA = ${a.toFixed(2)} cm²\n\n✅ *Answer: ${a.toFixed(2)} cm²*`;
  }
  
  return '🤔 I haven\'t learned that type yet.\n\nTry: *solve 2x + 5 = 13*';
}

console.log('  REGISTERING /nyasha/api/solve route...');
app.post('/nyasha/api/solve', (req, res) => {
  console.log('SOLVER HIT:', req.body && req.body.message);
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  const response = solveMathProblem(message);
  res.json({ response });
});
console.log('  Route registered');

// ─── Agent API ────────────────────────────────────────────

/// Registered agents store
function readAgents() { return readStore('agents') || []; }
function writeAgents(agents) { writeStore('agents', agents); }

/// Register or update an agent device
app.post('/api/agents/register', (req, res) => {
  const { device_id, device_name, token, capabilities, platform, arch, version } = req.body;
  if (!device_id) return res.status(400).json({ error: 'device_id required' });
  
  const agents = readAgents();
  const existing = agents.find(a => a.device_id === device_id);
  const agent = {
    device_id,
    device_name: device_name || 'Unknown',
    token: token || '',
    capabilities: capabilities || [],
    platform: platform || 'unknown',
    arch: arch || 'unknown',
    version: version || '0.0.0',
    last_seen: new Date().toISOString(),
    registered_at: existing ? existing.registered_at : new Date().toISOString(),
    pending_tasks: existing ? existing.pending_tasks : [],
    completed_tasks: existing ? existing.completed_tasks : 0,
  };

  if (existing) {
    Object.assign(existing, agent);
  } else {
    agents.push(agent);
  }
  
  writeAgents(agents);
  console.log(`✅ Agent registered: ${device_name} (${device_id}) on ${platform}/${arch}`);
  res.json({ ok: true, agent });
});

/// Poll for pending tasks
app.get('/api/agents/:id/tasks', (req, res) => {
  const agents = readAgents();
  const agent = agents.find(a => a.device_id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  
  // Update last seen
  agent.last_seen = new Date().toISOString();
  writeAgents(agents);
  
  const pending = agent.pending_tasks || [];
  // Return pending tasks and clear them
  const tasks = pending.slice(0);
  agent.pending_tasks = [];
  writeAgents(agents);
  
  res.json({ tasks });
});

/// Submit task result
app.post('/api/agents/:id/tasks/:taskId/result', (req, res) => {
  const agents = readAgents();
  const agent = agents.find(a => a.device_id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  
  agent.completed_tasks = (agent.completed_tasks || 0) + 1;
  agent.last_seen = new Date().toISOString();
  writeAgents(agents);
  
  console.log(`📨 Task ${req.params.taskId} completed on ${agent.device_name}`);
  res.json({ ok: true });
});

/// Get all registered agents (for dashboard)
app.get('/api/agents', (req, res) => {
  const agents = readAgents();
  res.json({ agents });
});

// ─── Start ────────────────────────────────────────────────

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🖥️  AI-BOS Mission Control Dashboard running on http://0.0.0.0:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   GET  /api/health      — Health check`);
  console.log(`   GET  /api/dashboard   — Dashboard summary`);
  console.log(`   GET  /api/tasks       — List tasks`);
  console.log(`   POST /api/tasks       — Create task`);
  console.log(`   GET  /api/deals       — List deals`);
  console.log(`   POST /api/deals       — Create deal`);
  console.log(`   GET  /api/invoices    — List invoices`);
  console.log(`   POST /api/invoices    — Create invoice`);
  console.log(`   GET  /api/transactions — List transactions`);
  console.log(`   POST /api/transactions — Create transaction`);
  console.log(`   GET  /api/reminders   — Upcoming reminders`);
  console.log(`   POST /api/chat        — Chat with AI-BOS`);
  console.log(`   POST /api/agents/register — Register agent`);
  console.log(`   GET  /api/agents/:id/tasks  — Poll agent tasks`);
  console.log(`   POST /api/agents/:id/tasks/:taskId/result — Submit result`);
  console.log(`   Storage: JSON files in ${DATA_DIR}/`);
});
