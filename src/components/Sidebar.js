'use client';

import { usePathname } from 'next/navigation';

const navItems = [
  { id: 'dashboard',  href: '/',        icon: '◉', label: 'Dashboard' },
  { id: 'pipeline',   href: '/pipeline', icon: '▦', label: 'Pipeline' },
  { id: 'crm',        href: '/crm',      icon: '◎', label: 'CRM / Deals' },
  { id: 'finance',    href: '/finance',  icon: '₿', label: 'Finance' },
  { id: 'tasks',      href: '/tasks',    icon: '☰', label: 'Tasks' },
  { id: 'agents',     href: '/agents',   icon: '◆', label: 'Agents' },
  { id: 'settings',   href: '/settings', icon: '⚙', label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-56 shrink-0 h-screen bg-[#181825]/60 border-r border-[#2a2a3e]/50 flex flex-col sticky top-0">
      <div className="p-5 border-b border-[#2a2a3e]/40">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-blue-400">AI</span>·<span className="text-gray-300">BOS</span>
        </h1>
        <p className="text-[10px] text-[#606078] uppercase tracking-widest mt-0.5">Command Center v2</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const active = isActive(item.href);
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                active
                  ? 'bg-gradient-to-r from-blue-500/10 to-transparent text-blue-400 border-l-2 border-blue-500'
                  : 'text-[#707088] hover:text-white hover:bg-[#1e1e30]'
              }`}
            >
              <span className="w-5 text-center text-base">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2a2a3e]/40">
        <div className="flex items-center gap-1.5 text-xs text-[#606078]">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-glow"></span>
          System Online
        </div>
        <p className="text-[10px] text-[#505068] mt-1">v2.0.0 · prod</p>
      </div>
    </aside>
  );
}
