import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'aibos',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'aibos2026',
});

export default pool;
