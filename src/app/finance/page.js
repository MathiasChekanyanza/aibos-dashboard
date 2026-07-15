'use client';

import { useEffect, useState } from 'react';

export default function FinancePage() {
  const [finance, setFinance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/finance').then(r => r.json()).then(d => { setFinance(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <PageShell><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div></PageShell>;

  const invoices = finance?.invoices || [];
  const summary = finance?.summary || {};
  const overdue = invoices.filter(i => i.status === 'overdue' || (i.status !== 'paid' && i.dueDate && new Date(i.dueDate) < new Date()));

  return (
    <PageShell>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Finance</h2>
          <p className="text-sm text-[#606078] mt-1">{invoices.length} invoices</p>
        </div>
        <div className="text-right text-sm"><span className="font-bold text-green-400">${summary.totalPaid?.toLocaleString()}</span><span className="text-[#606078]"> paid</span></div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass-card rounded-xl p-4">
          <p className="text-[10px] text-[#606078] uppercase tracking-wider">Total Billed</p>
          <p className="text-xl font-bold">${summary.totalBilled?.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-[10px] text-[#606078] uppercase tracking-wider">Total Paid</p>
          <p className="text-xl font-bold text-green-400">${summary.totalPaid?.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-[10px] text-[#606078] uppercase tracking-wider">Balance Due</p>
          <p className="text-xl font-bold text-yellow-400">${summary.totalDue?.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-[10px] text-[#606078] uppercase tracking-wider">Overdue</p>
          <p className={`text-xl font-bold ${overdue.length > 0 ? 'text-red-400' : 'text-green-400'}`}>${overdue.reduce((s, i) => s + (i.amount || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Invoices table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#2a2a3e]/50">
          <h3 className="text-sm font-semibold">Invoices</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a3e]/30 text-left text-xs text-[#606078] uppercase tracking-wider">
              <th className="p-4 font-medium">#</th>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Due</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(i => (
              <tr key={i.id} className="border-b border-[#2a2a3e]/20 hover:bg-[#1e1e30]/50 transition-colors">
                <td className="p-4 text-[#606078]">{i.number}</td>
                <td className="p-4 font-medium">{i.client}</td>
                <td className="p-4 text-[#9090a8]">{i.description}</td>
                <td className="p-4 font-semibold">${i.amount?.toLocaleString()}</td>
                <td className="p-4 text-[#606078] text-xs">{i.date || '—'}</td>
                <td className="p-4 text-[#606078] text-xs">{i.dueDate || '—'}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    i.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                    i.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                    i.status === 'cancelled' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>{i.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <p className="text-center py-8 text-sm text-gray-500">No invoices yet.</p>}
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
                item.id === 'finance' ? 'bg-gradient-to-r from-blue-500/10 to-transparent text-blue-400 border-l-2 border-blue-500'
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
