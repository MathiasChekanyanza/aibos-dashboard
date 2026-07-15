'use client';

import { useEffect, useState } from 'react';

export default function CrmPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/deals').then(r => r.json()).then(d => { setDeals(d.deals); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <PageShell><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div></PageShell>;

  const sorted = [...deals].sort((a, b) => (b.value || 0) - (a.value || 0));

  return (
    <PageShell>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">CRM / Deals</h2>
          <p className="text-sm text-[#606078] mt-1">{deals.length} deals in pipeline</p>
        </div>
        <div className="text-sm">
          <span className="font-bold">${deals.reduce((s, d) => s + (d.value || 0), 0).toLocaleString()}</span>
          <span className="text-[#606078]"> total</span>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a3e]/50 text-left text-xs text-[#606078] uppercase tracking-wider">
              <th className="p-4 font-medium">Deal</th>
              <th className="p-4 font-medium">Company</th>
              <th className="p-4 font-medium">Value</th>
              <th className="p-4 font-medium">Stage</th>
              <th className="p-4 font-medium">Owner</th>
              <th className="p-4 font-medium">Prob.</th>
              <th className="p-4 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(d => (
              <tr key={d.id} className="border-b border-[#2a2a3e]/20 hover:bg-[#1e1e30]/50 transition-colors">
                <td className="p-4 font-medium">{d.name}</td>
                <td className="p-4 text-[#9090a8]">{d.company}</td>
                <td className="p-4 font-semibold">${d.value?.toLocaleString() || 0}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    d.stage === 'closed' ? 'bg-green-500/20 text-green-400' :
                    d.stage === 'negotiation' ? 'bg-orange-500/20 text-orange-400' :
                    d.stage === 'proposal' ? 'bg-yellow-500/20 text-yellow-400' :
                    d.stage === 'qualified' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{d.stage || 'lead'}</span>
                </td>
                <td className="p-4 text-[#9090a8]">{d.owner || '—'}</td>
                <td className="p-4 text-[#9090a8]">{d.probability || 0}%</td>
                <td className="p-4 text-[#606078] text-xs">{d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-ZA') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {deals.length === 0 && <p className="text-center py-8 text-sm text-gray-500">No deals yet. Seed demo data or create your first deal.</p>}
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
                item.id === 'crm' ? 'bg-gradient-to-r from-blue-500/10 to-transparent text-blue-400 border-l-2 border-blue-500'
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
