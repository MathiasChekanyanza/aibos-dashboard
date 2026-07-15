'use client';

import { useEffect, useState } from 'react';

const stageColors = { lead: '#6b7280', qualified: '#3b82f6', proposal: '#eab308', negotiation: '#f97316', closed: '#22c55e' };
const stageOrder = ['lead', 'qualified', 'proposal', 'negotiation', 'closed'];
const stageLabels = { lead: 'Lead', qualified: 'Qualified', proposal: 'Proposal', negotiation: 'Negotiation', closed: 'Closed' };

export default function PipelinePage() {
  const [deals, setDeals] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/deals').then(r => r.json()).then(d => {
      setDeals(d.deals);
      setPipeline(d.pipeline);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <PageShell><LoadingScreen /></PageShell>;

  const totalValue = pipeline.reduce((s, p) => s + p.value, 0);
  const maxCount = Math.max(...pipeline.map(p => p.count), 1);

  return (
    <PageShell>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Pipeline</h2>
          <p className="text-sm text-[#606078] mt-1">Stage-by-stage deal tracking</p>
        </div>
        <div className="text-sm"><span className="font-bold">${totalValue.toLocaleString()}</span> <span className="text-[#606078]">total</span></div>
      </div>

      {/* Pipeline Kanban-style */}
      <div className="grid grid-cols-5 gap-4">
        {pipeline.map((stage) => (
          <div key={stage.stage} className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: stageColors[stage.stage] }}></div>
              <h3 className="text-xs font-semibold uppercase tracking-wider">{stage.label}</h3>
              <span className="text-xs text-[#606078] ml-auto">{stage.count}</span>
            </div>
            <div className="space-y-2">
              {deals.filter(d => (d.stage || 'lead') === stage.stage).map(d => (
                <div key={d.id} className="bg-[#1a1a2e]/60 rounded-lg p-3 border border-[#2a2a3e]/30 hover:border-[#3b82f6]/40 transition-all">
                  <p className="text-sm font-medium truncate">{d.name}</p>
                  <p className="text-xs text-[#606078] truncate mt-0.5">{d.company}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-semibold">${d.value?.toLocaleString() || 0}</span>
                    <span className="text-[10px] text-[#606078]">{d.owner || ''}</span>
                  </div>
                </div>
              ))}
              {stage.count === 0 && <p className="text-xs text-[#505068] text-center py-6">No deals in {stage.label}</p>}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function PageShell({ children }) {
  return (
    <div className="flex h-screen bg-[#0f0f1a] overflow-hidden">
      <aside className="w-56 bg-[#181825]/60 border-r border-[#2a2a3e]/50 flex flex-col">
        <div className="p-5 border-b border-[#2a2a3e]/40">
          <h1 className="text-lg font-bold"><span className="text-blue-400">AI</span>·<span className="text-gray-300">BOS</span></h1>
          <p className="text-[10px] text-[#606078] uppercase tracking-widest mt-0.5">Command Center v2</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[{id:'dashboard',icon:'◉',label:'Dashboard'},{id:'pipeline',icon:'▦',label:'Pipeline'},{id:'crm',icon:'◎',label:'CRM / Deals'},
            {id:'finance',icon:'₿',label:'Finance'},{id:'tasks',icon:'☰',label:'Tasks'},{id:'agents',icon:'◆',label:'Agents'},{id:'settings',icon:'⚙',label:'Settings'}].map(item => (
            <a key={item.id} href={item.id === 'dashboard' ? '/' : `/${item.id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                item.id === 'pipeline' ? 'bg-gradient-to-r from-blue-500/10 to-transparent text-blue-400 border-l-2 border-blue-500'
                : 'text-[#707088] hover:text-white hover:bg-[#1e1e30]'
              }`}><span className="w-5 text-center text-base">{item.icon}</span><span>{item.label}</span></a>
          ))}
        </nav>
        <div className="p-4 border-t border-[#2a2a3e]/40">
          <span className="flex items-center gap-1.5 text-xs text-[#606078]"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>System Online v2.0.0</span>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
function LoadingScreen() {
  return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
}
