/**
 * Applies scripts/migrations/*.sql to Supabase, in filename order, once each.
 *
 * Hand-rolled rather than `drizzle-kit migrate`: the 0000 migration was produced
 * by `db:pull` from an already-live database and was never recorded in
 * __drizzle_migrations, so `migrate` would try to re-run it against tables that
 * already exist. See drizzle.config.ts — `drizzle-kit generate` is unsafe here
 * for unrelated reasons too.
 *
 * The SQL lives under scripts/ because /drizzle/ is gitignored as introspection
 * output; a migration left there would never reach the repo.
 *
 * Idempotent: each file is recorded in "_app_migrations" after it succeeds, and
 * every statement is written to be re-runnable (IF NOT EXISTS) as a second line
 * of defence.
 *
 * Usage: npm run db:migrate
 */
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import postgres from "postgres";

// Session-mode pooler (5432). DDL under pgbouncer transaction mode is unsafe.
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("DIRECT_URL is not set. Run with --env-file=.env");
  process.exit(1);
}

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations");
const sql = postgres(url, { ssl: "require", prepare: false, max: 1 });

try {
  await sql`
    CREATE TABLE IF NOT EXISTS "_app_migrations" (
      "name" text PRIMARY KEY,
      "appliedAt" timestamptz NOT NULL DEFAULT now()
    )
  `;

  // Baseline: 0001 was applied by hand before this ledger existed. Re-running it
  // would fail on CREATE TABLE "Payment", so record it as applied when the table
  // it creates is already there.
  const [{ exists: paymentExists }] = await sql`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'Payment'
    ) AS exists
  `;
  if (paymentExists) {
    const inserted = await sql`
      INSERT INTO "_app_migrations" (name) VALUES ('0001_add_payment_table.sql')
      ON CONFLICT (name) DO NOTHING
      RETURNING name
    `;
    if (inserted.length) console.log("baseline 0001_add_payment_table.sql (table already present)");
  }

  const applied = new Set(
    (await sql`SELECT name FROM "_app_migrations"`).map((row) => row.name),
  );

  const files = readdirSync(dir)
    .filter((name) => name.endsWith(".sql"))
    .sort();

  if (!files.length) {
    console.log("No migrations found.");
  }

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip    ${file} (already applied)`);
      continue;
    }

    const statements = readFileSync(path.join(dir, file), "utf8")
      .split("--> statement-breakpoint")
      .map((statement) => statement.trim())
      .filter(Boolean);

    // All or nothing. A half-applied migration is worse than none: the Payment
    // table without its unique index would let MTN's callback retries duplicate
    // rows, for instance.
    await sql.begin(async (tx) => {
      for (const statement of statements) {
        await tx.unsafe(statement);
      }
      await tx`INSERT INTO "_app_migrations" (name) VALUES (${file})`;
    });

    console.log(`applied ${file} (${statements.length} statements)`);
  }

  // Report the resulting shape so a run is self-verifying.
  for (const table of ["Appointment", "Payment"]) {
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${table}
      ORDER BY ordinal_position
    `;
    console.log(`\n${table}:`);
    for (const c of columns) {
      const def = c.column_default ? ` default ${String(c.column_default).slice(0, 24)}` : "";
      console.log(`  ${c.column_name.padEnd(17)} ${c.data_type.padEnd(26)} null=${c.is_nullable}${def}`);
    }
  }

  const indexes = await sql`
    SELECT tablename, indexname FROM pg_indexes
    WHERE schemaname = 'public' AND tablename IN ('Appointment','Payment')
    ORDER BY tablename, indexname
  `;
  console.log("\nIndexes:");
  for (const i of indexes) console.log(`  ${i.tablename}.${i.indexname}`);
} finally {
  await sql.end();
}
