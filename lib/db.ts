import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __ofLedgerPool: Pool | undefined;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!global.__ofLedgerPool) {
    global.__ofLedgerPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30_000
    });
  }

  return global.__ofLedgerPool;
}
