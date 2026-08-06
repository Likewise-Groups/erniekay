import type { Config } from "drizzle-kit";

// Introspection / studio only. The app itself never imports this file.
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
