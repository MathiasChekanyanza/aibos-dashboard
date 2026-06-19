/**
 * Dashboard tunnel — exposes port 3000 via cloudflared
 * Gives Mathias a public URL for the Mission Control Dashboard
 */
const { spawn } = require('child_process');
const http = require('http');

const TARGET = 'http://localhost:3000';
const LOG = '/tmp/dashboard-tunnel.log';
const fs = require('fs');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG, line);
  console.log(msg);
}

let currentUrl = null;

function startTunnel() {
  log('Starting cloudflared tunnel for dashboard...');
  const proc = spawn('npx', ['cloudflared', 'tunnel', '--url', TARGET], {
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
    env: { ...process.env, HOME: '/tmp' }
  });

  proc.stdout.on('data', (data) => {
    const text = data.toString();
    const url = text.match(/https:\/\/[a-z-]+\.trycloudflare\.com/);
    if (url) {
      currentUrl = url[0];
      log(`✅ Dashboard tunnel URL: ${currentUrl}`);
      // Write URL to a known file for reference
      fs.writeFileSync('/tmp/dashboard-tunnel-url.txt', currentUrl);
      console.log(`\n🔗 DASHBOARD URL: ${currentUrl}/api/dashboard`);
      console.log(`🔗 HEALTH: ${currentUrl}/api/health`);
    }
  });

  proc.stderr.on('data', (data) => {
    const text = data.toString();
    if (text.includes('Failed to')) log(`⚠️ ${text.trim()}`);
  });

  proc.on('exit', (code, signal) => {
    log(`Tunnel exited (code=${code}, signal=${signal}). Restarting in 3s...`);
    currentUrl = null;
    setTimeout(startTunnel, 3000);
  });

  proc.on('error', (err) => {
    log(`Tunnel error: ${err.message}. Restarting in 5s...`);
    setTimeout(startTunnel, 5000);
  });

  return proc;
}

const proc = startTunnel();

process.on('SIGTERM', () => { proc.kill(); process.exit(0); });
process.on('SIGINT', () => { proc.kill(); process.exit(0); });
