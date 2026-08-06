import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

export type Db = PostgresJsDatabase<typeof schema>;

// Dev only — survives HMR module reloads so we don't leak connections.
const globalForDb = global as unknown as { db?: Db };

/**
 * Splits a Postgres connection string into explicit fields.
 *
 * Deliberately avoids `new URL()`: workerd's URL implementation rejects
 * `postgresql://` connection strings that Node's WHATWG parser accepts,
 * throwing "Invalid URL string." Passing explicit options to postgres.js also
 * keeps it from parsing the string itself, and drops the query component —
 * `?pgbouncer=true` is a Prisma-only flag that postgres.js would otherwise
 * forward to the server as a startup parameter.
 */
export function parseConnectionString(raw: string) {
  const value = raw.trim().replace(/^\uFEFF/, "").trim();
  const match =
    /^postgres(?:ql)?:\/\/(?:([^:@/]+)(?::([^@]*))?@)?([^:/?]+)(?::(\d+))?(?:\/([^?]*))?/.exec(value);

  if (!match) {
    throw new Error("DATABASE_URL is not a valid Postgres connection string");
  }

  const [, username, password, host, port, database] = match;

  return {
    host,
    port: port ? Number(port) : 5432,
    database: database ? decodeURIComponent(database) : "postgres",
    username: username ? decodeURIComponent(username) : undefined,
    password: password ? decodeURIComponent(password) : undefined,
  };
}

function createDb(): Db {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = postgres({
    ...parseConnectionString(connectionString),
    // Supabase terminates TLS at the pooler; the connection string omits sslmode.
    ssl: "require",
    // Supabase's transaction-mode pooler (6543) cannot use prepared statements.
    prepare: false,
    // One connection per request — Workers invocations are short-lived.
    max: 1,
  });

  return drizzle(client, { schema });
}

/**
 * Returns a database client scoped to the current request.
 *
 * Call this once per request handler and reuse the result for every query in
 * that handler. Do NOT hoist the result to module scope: Cloudflare Workers
 * forbid using an I/O object (the TCP socket) across request contexts, so a
 * cached client throws "Cannot perform I/O on behalf of a different request"
 * on the second and later requests served by the same isolate.
 *
 * Connecting here rather than at module load also matters for builds: `next
 * build` imports every route to collect page data, and the build environment
 * has no DATABASE_URL. Workers likewise disallow I/O at global scope.
 */
export function getDb(): Db {
  // In dev the server is a single long-lived Node process with no such
  // restriction, so reuse one client instead of churning connections.
  if (process.env.NODE_ENV !== "production") {
    globalForDb.db ??= createDb();
    return globalForDb.db;
  }

  return createDb();
}

export * from "./schema";
