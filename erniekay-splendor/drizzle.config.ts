import type { Config } from "drizzle-kit";

// Introspection / studio only. The app itself never imports this file.
//
// Use `db:pull` and `db:studio`. Do NOT run `drizzle-kit generate` or
// `drizzle-kit migrate` against this project — the database was created by
// Prisma, and lib/schema.ts models only what the app queries, so a diff is not
// a real changeset. `generate` was tried on 2026-08-10 and produced a migration
// that would DISABLE ROW LEVEL SECURITY on all 12 tables, DROP the
// _prisma_migrations table CASCADE, and drop/recreate every foreign key with
// weaker ON UPDATE semantics — because lib/schema.ts declares no RLS, does not
// model _prisma_migrations, and uses drizzle's default constraint naming
// instead of Prisma's *_fkey.
//
// Schema changes go in scripts/migrations/*.sql, hand-applied — see
// scripts/apply-payment-migration.mjs for the pattern. Re-run `db:pull`
// afterwards to refresh the introspection output.
// DIRECT_URL is the session-mode pooler (5432) — pgbouncer transaction mode
// (6543) does not support the prepared statements drizzle-kit uses.
const url = new URL(process.env.DIRECT_URL || process.env.DATABASE_URL || "");
// Supabase terminates TLS on the pooler; the connection strings omit sslmode.
url.search = "";
url.searchParams.set("sslmode", "require");

export default {
  dialect: "postgresql",
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: url.toString() },
} satisfies Config;
