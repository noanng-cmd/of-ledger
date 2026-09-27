import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not configured");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  max: 1
});

const migrations = [
  "sql/001_init.sql",
  "sql/002_listing_images.sql"
];

try {
  for (const relativePath of migrations) {
    const absolutePath = path.join(process.cwd(), relativePath);
    const sql = await fs.readFile(absolutePath, "utf8");
    console.log(`Running migration: ${relativePath}`);
    await pool.query(sql);
  }

  console.log("OF Ledger database migrations completed.");
} catch (error) {
  console.error("Migration failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
