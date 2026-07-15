// AI-BOS Command Center v2 — Main Dashboard
'use client';

import { useEffect, useState } from 'react';

// ─── Components ──────────────────────────────────────────

function StatCard({ label, value, sub, subColor, icon }) {
  return (
    <div className="glass-card rounded-xl p-5 transition-all hover:border-blue-500/30">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-[#707088] uppercase tracking-wider font-medium">{label}</span>
        {icon && <span className="text-lg opacity-60">{icon}</span>}
      </div>
      <p className="text-3xl font-bold tracking-tight">{value ?? '—'}</p>
      {sub && <span className={`text-xs font-medium mt-1 inline-block ${subColor || 'text-green-400'}`}>{sub}</span>}
    </div>
  );
}

function AgentCard({ agent }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#1e1e30]/80 transition-all group">
      <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/20 flex items-center justify-center text-xs font-bold shrink-0">
        {agent.name?.charAt(0)}
        <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f0f1a] ${
          agent.status === 'active' ? 'bg-green-500' : agent.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-500'
        }`}></span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{agent.name}</p>
        <p className="text-xs text-[#606078] truncate">{agent.activity || agent.role || 'Idle'}</p>
      </div>
      <span className="text-[10px] text-[#505068] uppercase">{agent.status}</span>
    </div>
  );
}

function ActivityItem({ item }) {
  return (
    <div className="flex items-start gap-3 py-2 group">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 text-blue-400">
        {item.agent?.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">
          <span className="font-medium">{item.agent}</span>
          <span className="text-gray-400"> {item.action}</span>
        </p>
        {item.detail && <p className="text-xs text-[#606078] mt-0.5">{item.detail}</p>}
        <p className="text-[10px] text-[#505068] mt-0.5">
          {item.timestamp ? new Date(item.timestamp).toLocaleString('en-ZA', { hour: '2-digit', minute: '2-digit' }) : ''}
        </p>
      </div>
    </div>
  );
}

function TaskItem({ task }) {
  const colors = { high: 'bg-red-500', medium: 'bg-yellow-500', low: 'bg-blue-500' };
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#1e1e30]/80 transition-all">
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors[task.priority] || 'bg-gray-500'}`}></div>
      <p className="flex-1 text-sm truncate">{task.title}</p>
      {task.dueDate && (
        <span className={`text-[10px] shrink-0 ${new Date(task.dueDate) < new Date() ? 'text-red-400' : 'text-[#606078]'}`}>
          {new Date(task.dueDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
        </span>
      )}
      <span className="text-xs text-[#606078] shrink-0 w-14 text-right truncate">{task.assignee || ''}</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────

export default function DashboardPage() {
  const [dash, setDash] = useState(null);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [br, dr, tr, ar, actr] = await Promise.all([
          fetch('/api/dashboard').then(r => r.json()),
          fetch('/api/deals').then(r => r.json()),
          fetch('/api/tasks').then(r => r.json()),
          fetch('/api/agents').then(r => r.json()),
          fetch('/api/activity').then(r => r.json()),
        ]);
        setDash(br); setDeals(dr.deals || []); setTasks(tr.tasks || []);
        setAgents(ar.agents || []); setActivity(actr.activity || []);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    load();
  }, []);

  const today = new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[80vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[#606078]">Initializing Command Center...</p>
        </div>
      </div>
    );
  }

  const stages = dash?.pipeline?.stages || [];
  const stageColors = ['#6b7280', '#3b82f6', '#eab308', '#f97316', '#22c55e'];
  const stageTotal = stages.reduce((s, st) => s + st.count, 0) || 1;
  const openTasks = tasks.filter(t => t.status !== 'done');
  const recentActivity = activity.slice(0, 8);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mission Control</h2>
          <p className="text-sm text-[#606078] mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-[#606078]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-glow"></span>
            <span className="uppercase tracking-wider">Live</span>
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg shadow-blue-500/20">MC</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Active Deals" value={dash?.activeDeals ?? 0} sub={`$${dash?.pipeline?.totalValue?.toLocaleString() || 0} pipeline value`} icon="▦" />
        <StatCard label="Revenue (MTD)" value={dash?.mtdRevenue ? `$${dash.mtdRevenue.toLocaleString()}` : '$0'} sub={dash?.mtdRevenue > 0 ? 'Month to date' : 'Waiting on first payment'} subColor="text-blue-400" icon="₿" />
        <StatCard label="Open Tasks" value={dash?.openTasks ?? 0} sub={`${tasks.filter(t => t.status === 'done').length} completed`} subColor="text-cyan-400" icon="☰" />
        <StatCard label="Overdue" value={dash?.overdue ?? 0} sub={dash?.overdue > 0 ? 'Needs attention' : 'All clear'} subColor={dash?.overdue > 0 ? 'text-red-400' : 'text-green-400'} icon="⚠" />
      </div>

      {/* Pipeline + Recent Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
        {/* Pipeline Visual */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Pipeline Overview</h3>
            <a href="/pipeline" className="text-xs text-blue-400 hover:underline">View all</a>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden mb-4 bg-[#1a1a2e]">
            {stages.map((s, i) => s.count > 0 && (
              <div key={i} className="h-full" style={{ width: `${(s.count/stageTotal)*100}%`, background: stageColors[i], minWidth: '4px' }}></div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {stages.map((s, i) => (
              <div key={i}>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: stageColors[i] }}></div>
                  <span className="text-[10px] text-[#606078] uppercase">{s.label}</span>
                </div>
                <p className="text-sm font-bold">{s.count}</p>
                <p className="text-[10px] text-[#606078]">${s.value?.toLocaleString() || 0}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deal Velocity */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Deal Velocity</h3>
          <div className="grid grid-cols-2 gap-4">
            {stages.filter(s => s.count > 0).slice(0, 4).map((s, i) => (
              <div key={i}>
                <p className="text-[10px] text-[#606078] uppercase">{s.label}</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-lg font-bold">{s.count}</span>
                  <span className="text-xs text-[#606078] pb-0.5">{s.value > 0 ? `$${(s.value/s.count/1000).toFixed(0)}k avg` : ''}</span>
                </div>
                <div className="w-full h-1.5 bg-[#1a1a2e] rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.round((s.count/stageTotal)*100)}%`, background: stageColors[stages.indexOf(s)] }}></div>
                </div>
              </div>
            ))}
            {stages.filter(s => s.count > 0).length === 0 && (
              <p className="text-xs text-gray-500 col-span-2 text-center py-4">No deals in pipeline</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section: Tasks + Activity + Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tasks */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Open Tasks</h3>
            <span className="text-xs text-blue-400 cursor-pointer hover:underline">{openTasks.length}</span>
          </div>
          <div className="space-y-0.5 max-h-[320px] overflow-y-auto">
            {openTasks.slice(0, 8).map(t => <TaskItem key={t.id} task={t} />)}
            {openTasks.length === 0 && <p className="text-sm text-gray-500 text-center py-8">All tasks completed ✓</p>}
            {openTasks.length > 8 && <p className="text-xs text-center text-[#606078] pt-2">+{openTasks.length - 8} more tasks</p>}
          </div>
        </div>

        {/* Activity */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Activity Feed</h3>
            <span className="text-[10px] text-[#606078]">Live</span>
          </div>
          <div className="divide-y divide-[#2a2a3e]/30 max-h-[320px] overflow-y-auto">
            {recentActivity.map((a, i) => <ActivityItem key={a.id || i} item={a} />)}
            {recentActivity.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No activity yet</p>}
          </div>
        </div>

        {/* Agents */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Agent Status</h3>
            <span className="text-xs text-blue-400">Manage</span>
          </div>
          <div className="space-y-0.5 max-h-[320px] overflow-y-auto">
            {agents.map(a => <AgentCard key={a.id} agent={a} />)}
            {agents.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No agents configured</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
