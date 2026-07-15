'use client';

import { useEffect, useState } from 'react';

export default function CrmPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    fetch('/api/deals').then(r => r.json()).then(d => { setDeals(d.deals || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const stageColors = { lead: '#6b7280', qualified: '#3b82f6', proposal: '#eab308', negotiation: '#f97316', closed: '#22c55e' };
  const totalValue = deals.reduce((s, d) => s + (d.value || 0), 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">CRM / Deals</h2>
          <p className="text-sm text-[#606078] mt-1">{deals.length} deals · ${totalValue.toLocaleString()} total value</p>
        </div>
        <button className="text-xs bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all font-medium">+ Add Deal</button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a3e]/30 text-left text-xs text-[#606078] uppercase tracking-wider">
              <th className="p-4 font-medium">Deal</th>
              <th className="p-4 font-medium">Company</th>
              <th className="p-4 font-medium">Value</th>
              <th className="p-4 font-medium">Stage</th>
              <th className="p-4 font-medium">Probability</th>
              <th className="p-4 font-medium">Owner</th>
              <th className="p-4 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {deals.map(d => (
              <tr key={d.id} className="border-b border-[#2a2a3e]/20 hover:bg-[#1e1e30]/50 transition-colors">
                <td className="p-4 font-medium">{d.name}</td>
                <td className="p-4 text-[#606078]">{d.company || '—'}</td>
                <td className="p-4 font-semibold">${d.value?.toLocaleString() || 0}</td>
                <td className="p-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: stageColors[d.stage] || '#6b7280' }}></span>
                    <span className="text-xs capitalize">{d.stage || 'lead'}</span>
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.probability || 0}%`, background: (d.probability || 0) > 60 ? '#22c55e' : (d.probability || 0) > 30 ? '#eab308' : '#6b7280' }}></div>
                    </div>
                    <span className="text-[10px] text-[#606078]">{d.probability || 0}%</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-[#9090a8]">{d.owner || '—'}</td>
                <td className="p-4 text-[10px] text-[#606078]">{d.lastUpdated ? new Date(d.lastUpdated).toLocaleDateString('en-ZA') : '—'}</td>
              </tr>
            ))}
            {deals.length === 0 && <tr><td colSpan="7" className="text-center py-8 text-sm text-gray-500">No deals yet. Add your first deal.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
