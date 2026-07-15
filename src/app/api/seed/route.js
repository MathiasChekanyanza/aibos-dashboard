import { NextResponse } from 'next/server';
import { writeStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST() {
  const demoAgents = [
    {id:'a1',name:'Tesla',role:'R&D',status:'active',activity:'Market research'},
    {id:'a2',name:'Linus',role:'Dev',status:'active',activity:'Building dashboard'},
    {id:'a3',name:'Buffett',role:'Finance',status:'idle',activity:'Awaiting data'},
    {id:'a4',name:'Ogilvy',role:'CRM',status:'active',activity:'Client follow-up'},
    {id:'a5',name:'Allen',role:'Tasks',status:'active',activity:'Grooming backlog'},
    {id:'a6',name:'Ford',role:'Ops',status:'active',activity:'Monitoring systems'},
    {id:'a7',name:'Elon',role:'CEO',status:'active',activity:'Orchestrating'},
    {id:'a8',name:'Hemingway',role:'Docs',status:'idle',activity:'Drafting'},
    {id:'a9',name:'Sun Tzu',role:'Strategy',status:'idle',activity:'Planning'},
    {id:'a10',name:'Mitnick',role:'Security',status:'idle',activity:'Auditing'}
  ];
  const demoActivity = [
    {id:'ac1',agent:'Tesla',action:'Researched competitors',detail:'Market analysis done',timestamp:new Date(Date.now()-120000).toISOString()},
    {id:'ac2',agent:'Ogilvy',action:'Updated deal: Divida Capital',detail:'To proposal stage',timestamp:new Date(Date.now()-900000).toISOString()},
    {id:'ac3',agent:'Buffett',action:'Generated finance report',detail:'MTD summary ready',timestamp:new Date(Date.now()-3600000).toISOString()},
    {id:'ac4',agent:'Ford',action:'Health check passed',detail:'All systems nominal',timestamp:new Date(Date.now()-7200000).toISOString()},
    {id:'ac5',agent:'Allen',action:'Completed 3 tasks',detail:'Backlog reduced',timestamp:new Date(Date.now()-10800000).toISOString()}
  ];
  const demoDeals = [
    {id:'d1',name:'Divida Capital',value:50000,stage:'proposal',probability:60,owner:'Ogilvy',lastUpdated:new Date(Date.now()-86400000).toISOString()},
    {id:'d2',name:'ExpressMart ZW',value:35000,stage:'negotiation',probability:80,owner:'Ogilvy',lastUpdated:new Date(Date.now()-172800000).toISOString()},
    {id:'d3',name:'Nyaradzo Group',value:120000,stage:'lead',probability:20,owner:'Tesla',lastUpdated:new Date(Date.now()-259200000).toISOString()},
    {id:'d4',name:'Old Mutual Zim',value:95000,stage:'qualified',probability:40,owner:'Ogilvy',lastUpdated:new Date(Date.now()-43200000).toISOString()},
    {id:'d5',name:'Econet Wireless',value:25000,stage:'closed',probability:100,owner:'Ogilvy',lastUpdated:new Date(Date.now()-604800000).toISOString(),status:'won'},
    {id:'d6',name:'Zimbabwe Energy',value:75000,stage:'qualified',probability:35,owner:'Tesla',lastUpdated:new Date(Date.now()-345600000).toISOString()},
    {id:'d7',name:'CBZ Holdings',value:180000,stage:'lead',probability:15,owner:'Ogilvy',lastUpdated:new Date(Date.now()-432000000).toISOString()}
  ];
  const demoTasks = [
    {id:'t1',title:'Research competitor pricing',priority:'high',status:'pending',due:new Date(Date.now()+86400000).toISOString().split('T')[0]},
    {id:'t2',title:'Deploy AI-BOS Command Center',priority:'high',status:'in_progress',due:new Date(Date.now()+172800000).toISOString().split('T')[0]},
    {id:'t3',title:'Client follow-up: Divida Capital',priority:'medium',status:'pending',due:new Date(Date.now()+259200000).toISOString().split('T')[0]},
    {id:'t4',title:'Draft Q3 strategy',priority:'medium',status:'done',due:new Date(Date.now()-86400000).toISOString().split('T')[0]},
    {id:'t5',title:'Review monthly finance report',priority:'low',status:'done',due:new Date(Date.now()-172800000).toISOString().split('T')[0]},
    {id:'t6',title:'Update agent SOPs',priority:'low',status:'pending',due:new Date(Date.now()+604800000).toISOString().split('T')[0]},
    {id:'t7',title:'Fix SSH key for Contabo',priority:'high',status:'done',due:new Date(Date.now()-43200000).toISOString().split('T')[0]}
  ];
  const demoInvoices = [
    {id:'inv1',number:'INV-001',client:'Divida Capital',description:'AI-BOS Starter',amount:15000,date:'2026-06-01',dueDate:'2026-06-30',status:'paid'},
    {id:'inv2',number:'INV-002',client:'ExpressMart ZW',description:'AI-BOS Growth',amount:25000,date:'2026-06-15',dueDate:'2026-07-15',status:'pending'},
    {id:'inv3',number:'INV-003',client:'Nyaradzo Group',description:'Consulting',amount:8000,date:'2026-05-20',dueDate:'2026-06-19',status:'overdue'},
    {id:'inv4',number:'INV-004',client:'Old Mutual Zim',description:'AI-BOS Premium',amount:45000,date:'2026-07-01',dueDate:'2026-07-31',status:'pending'},
    {id:'inv5',number:'INV-005',client:'Econet Wireless',description:'AI-BOS Growth',amount:25000,date:'2026-05-01',dueDate:'2026-05-31',status:'paid'},
    {id:'inv6',number:'INV-006',client:'Zimbabwe Energy',description:'AI-BOS Starter',amount:15000,date:'2026-06-10',dueDate:'2026-07-10',status:'overdue'}
  ];

  writeStore('agents', demoAgents);
  writeStore('activity', demoActivity);
  writeStore('transactions', []);
  writeStore('company', {name:'AI-BOS',plan:'pro',created:new Date().toISOString()});
  writeStore('deals', demoDeals);
  writeStore('tasks', demoTasks);
  writeStore('invoices', demoInvoices);

  return NextResponse.json({ok:true,seeded:{
    agents:demoAgents.length,
    activity:demoActivity.length,
    deals:demoDeals.length,
    tasks:demoTasks.length,
    invoices:demoInvoices.length
  }});
}
