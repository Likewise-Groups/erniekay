import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;

// Module-level cache: one client per isolate.
let cached: Db | undefined;

// Dev only — survives HMR module reloads so we don't leak connections.
const globalForDb = global as unknown as { pgClient?: postgres.Sql; db?: Db };

/**
 * Connects lazily, on first query. Nothing here may run at module load: `next
 * build` imports every route to collect page data, and the build environment
 * has no DATABASE_URL. Cloudflare Workers also disallow I/O at global scope.
 */
function getDb(): Db {
  if (cached) return cached;

  if (globalForDb.db) {
    cached = globalForDb.db;
    return cached;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  // Strip query params (`?pgbouncer=true` is a Prisma-only flag; postgres.js
  // would forward unknown params to the server as startup options).
  const url = new URL(connectionString);
  url.search = "";

  const client = postgres(url.toString(), {
    // Supabase terminates TLS at the pooler; the connection string omits sslmode.
    ssl: "require",
    // Supabase's transaction-mode pooler (6543) cannot use prepared statements.
    prepare: false,
    // One connection per isolate — serverless/edge invocations are short-lived.
    max: 1,
  });

  cached = drizzle(client, { schema });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.pgClient = client;
    globalForDb.db = cached;
  }

  return cached;
}

export const db = new Proxy({} as Db, {
  get(_target, prop) {
    const instance = getDb();
    const value = Reflect.get(instance, prop);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export * from "./schema";
