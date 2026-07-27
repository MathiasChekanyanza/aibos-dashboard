import pool from './db';

// ── Dashboard ──
export async function computeDashboard() {
  const { rows: deals } = await pool.query(`SELECT stage, value FROM deals`);
  const { rows: tasks } = await pool.query(`SELECT status, priority FROM tasks`);
  const { rows: invoices } = await pool.query(`SELECT amount, status, due_date FROM invoices`);

  const stages = ['lead','qualified','proposal','negotiation','won','lost'];
  const stageCounts = {};
  for (const s of stages) {
    const filtered = deals.filter(d => d.stage === s);
    stageCounts[s] = {
      count: filtered.length,
      value: filtered.reduce((sum, d) => sum + Number(d.value), 0),
    };
  }

  const totalPipeline = deals.reduce((sum, d) => sum + Number(d.value), 0);
  const openTasks = tasks.filter(t => t.status !== 'done').length;
  const overdue = invoices.filter(i => i.status !== 'paid' && new Date(i.due_date) < new Date()).length;

  return {
    activeDeals: deals.length,
    mtdRevenue: 0, // can be computed from paid invoices in current month
    openTasks,
    overdue,
    pipeline: {
      totalValue: totalPipeline,
      stages: stages.map(s => ({
        key: s,
        label: s.charAt(0).toUpperCase() + s.slice(1),
        count: stageCounts[s]?.count || 0,
        value: stageCounts[s]?.value || 0,
        pct: totalPipeline ? Math.round((stageCounts[s]?.value || 0) / totalPipeline * 10000) / 100 : 0,
      })),
    },
  };
}

// ── Deals ──
export async function getAllDeals() {
  const { rows } = await pool.query(`
    SELECT d.*, c.name as client_name, c.company as client_company
    FROM deals d LEFT JOIN clients c ON d.client_id = c.id
    ORDER BY d.updated_at DESC
  `);
  return rows.map(d => ({ ...d, value: Number(d.value), probability: Number(d.probability) }));
}

export async function createDeal(data) {
  const { title, value, stage, probability, expected_close, notes, client_id } = data;
  const { rows } = await pool.query(
    `INSERT INTO deals (title, value, stage, probability, expected_close, notes, client_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [title, value || 0, stage || 'lead', probability || 10, expected_close || null, notes || null, client_id || null]
  );
  await addActivity('system', `Created deal "${title}"`, 'deal', rows[0].id);
  return rows[0];
}

export async function moveDeal(id, stage) {
  const { rows } = await pool.query(
    `UPDATE deals SET stage=$1, updated_at=now() WHERE id=$2 RETURNING *`,
    [stage, id]
  );
  if (rows[0]) await addActivity('system', `Moved deal "${rows[0].title}" to ${stage}`, 'deal', id);
  return rows[0];
}

// ── Tasks ──
export async function getAllTasks() {
  const { rows } = await pool.query(`
    SELECT t.*, c.name as client_name, d.title as deal_title
    FROM tasks t
    LEFT JOIN clients c ON t.client_id = c.id
    LEFT JOIN deals d ON t.deal_id = d.id
    ORDER BY CASE t.priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 ELSE 3 END, t.due_date ASC NULLS LAST
  `);
  return rows;
}

export async function createTask(data) {
  const { title, description, priority, status, assignee, due_date, deal_id, client_id } = data;
  const { rows } = await pool.query(
    `INSERT INTO tasks (title, description, priority, status, assignee, due_date, deal_id, client_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [title, description || null, priority || 'medium', status || 'todo', assignee || null, due_date || null, deal_id || null, client_id || null]
  );
  await addActivity('system', `Created task "${title}"`, 'task', rows[0].id);
  return rows[0];
}

export async function updateTaskStatus(id, status) {
  const { rows } = await pool.query(
    `UPDATE tasks SET status=$1, updated_at=now() WHERE id=$2 RETURNING *`,
    [status, id]
  );
  if (rows[0]) await addActivity('system', `Updated task "${rows[0].title}" to ${status}`, 'task', id);
  return rows[0];
}

// ── Clients ──
export async function getAllClients() {
  const { rows } = await pool.query(`SELECT * FROM clients ORDER BY name`);
  return rows;
}

// ── Invoices ──
export async function getAllInvoices() {
  const { rows } = await pool.query(`
    SELECT i.*, c.name as client_name, c.company as client_company
    FROM invoices i LEFT JOIN clients c ON i.client_id = c.id
    ORDER BY i.due_date DESC
  `);
  return rows.map(i => ({ ...i, amount: Number(i.amount) }));
}

export async function createInvoice(data) {
  const { client_id, deal_id, amount, status, due_date } = data;
  const { rows } = await pool.query(
    `INSERT INTO invoices (client_id, deal_id, amount, status, due_date)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [client_id || null, deal_id || null, amount, status || 'draft', due_date || null]
  );
  await addActivity('system', `Created invoice #${rows[0].id} for $${amount}`, 'invoice', rows[0].id);
  return rows[0];
}

// ── Activities ──
export async function getRecentActivity(limit = 20) {
  const { rows } = await pool.query(
    `SELECT * FROM activities ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return rows;
}

export async function addActivity(agent, action, entityType = null, entityId = null, metadata = null) {
  await pool.query(
    `INSERT INTO activities (agent, action, entity_type, entity_id, metadata) VALUES ($1,$2,$3,$4,$5)`,
    [agent, action, entityType, entityId, metadata ? JSON.stringify(metadata) : null]
  );
}

// ── Company ──
export async function getCompany() {
  return { name: 'AI-BOS', plan: 'pro', created: '2026-07-15' };
}
