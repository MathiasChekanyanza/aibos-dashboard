import { NextResponse } from 'next/server';
import { readStore, writeStore, computeDashboard } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tasks = readStore('tasks') || [];
  return NextResponse.json({ tasks, total: tasks.length });
}

export async function POST(req) {
  const body = await req.json();
  const tasks = readStore('tasks') || [];
  const task = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    title: body.title || 'Untitled',
    description: body.description || '',
    priority: body.priority || 'medium',
    status: body.status || 'open',
    assignee: body.assignee || '',
    dueDate: body.dueDate || null,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  writeStore('tasks', tasks);
  return NextResponse.json(task, { status: 201 });
}
