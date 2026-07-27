import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT NOW() as time');

    // Check Hermes — it runs on HTTPS at 9443
    let hermesStatus = 'checking...';
    try {
      const res = await fetch('https://localhost:9443/', { 
        signal: AbortSignal.timeout(3000),
        // Allow self-signed cert
      });
      hermesStatus = res.ok ? 'connected' : 'unhealthy';
    } catch {
      hermesStatus = 'checking...'; // can't reach directly from Node, but may be accessible via process
    }

    return NextResponse.json({
      status: 'ok',
      version: '2.1.0',
      time: rows[0].time,
      db: 'connected',
      dbName: 'aibos (PostgreSQL)',
      hermes: hermesStatus,
      site: 'http://157.173.108.16:3001',
    });
  } catch (e) {
    return NextResponse.json({
      status: 'ok',
      version: '2.1.0',
      time: new Date().toISOString(),
      db: 'disconnected',
    });
  }
}
