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

  writeStore('agents', demoAgents);
  writeStore('activity', demoActivity);
  writeStore('transactions', []);
  writeStore('company', {name:'AI-BOS',plan:'pro',created:new Date().toISOString()});

  return NextResponse.json({ok:true,seeded:{agents:demoAgents.length,activity:demoActivity.length}});
}
