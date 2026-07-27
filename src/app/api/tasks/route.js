import { NextResponse } from 'next/server';
import { getAllTasks, createTask, updateTaskStatus } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tasks = await getAllTasks();
    return NextResponse.json({ tasks, total: tasks.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const task = await createTask(body);
    return NextResponse.json(task, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, status } = await req.json();
    const task = await updateTaskStatus(id, status);
    return NextResponse.json(task);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
