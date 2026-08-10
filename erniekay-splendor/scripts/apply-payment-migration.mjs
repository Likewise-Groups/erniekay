/**
 * Applies scripts/migrations/0001_add_payment_table.sql to Supabase.
 *
 * Hand-applied rather than via `drizzle-kit migrate`: the 0000 migration was
 * produced by `db:pull` from an already-live database and was never recorded in
 * __drizzle_migrations, so `migrate` would try to re-run it and fail on tables
 * that already exist. drizzle.config.ts is introspection/studio only.
 *
 * The SQL lives under scripts/, not drizzle/, because /drizzle/ is gitignored
 * as introspection output — a migration left there would never reach the repo.
 *
 * Idempotent: running it again on a database that already has the table is a
 * no-op that just reprints the schema.
 *
 * Usage: npm run db:migrate:payment
 */
import { readFileSync } from "node:fs";
import postgres from "postgres";

// Session-mode pooler (5432) — DDL under pgbouncer transaction mode is unsafe.
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) {
  console.error("DIRECT_URL is not set. Run with --env-file=.env");
  process.exit(1);
}

const sql = postgres(url, { ssl: "require", prepare: false, max: 1 });

try {
  const [{ exists }] = await sql`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'Payment'
    ) AS exists
  `;

  if (exists) {
    console.log('Table "Payment" already exists — nothing to apply.');
  } else {
    const file = new URL("./migrations/0001_add_payment_table.sql", import.meta.url);
    const statements = readFileSync(file, "utf8")
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);

    // All or nothing: a half-created table with no unique index would let the
    // callback write duplicate rows on MTN's retries.
    await sql.begin(async (tx) => {
      for (const statement of statements) {
        console.log(`  ${statement.split("\n")[0].slice(0, 80)}`);
        await tx.unsafe(statement);
      }
    });

    console.log('\nApplied: table "Payment" created.');
  }

  const columns = await sql`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Payment'
    ORDER BY ordinal_position
  `;
  console.log("\nPayment columns:");
  for (const c of columns) {
    console.log(`  ${c.column_name.padEnd(15)} ${c.data_type.padEnd(28)} nullable=${c.is_nullable}`);
  }

  const indexes = await sql`
    SELECT indexname FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = 'Payment'
  `;
  console.log("\nIndexes:");
  for (const i of indexes) console.log(`  ${i.indexname}`);
} finally {
  await sql.end();
}
