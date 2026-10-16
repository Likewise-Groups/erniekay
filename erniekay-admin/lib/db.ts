import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

export type Db = PostgresJsDatabase<typeof schema>;

/**
 * A client or a transaction.
 *
 * Anything that writes on behalf of a caller — recordAudit(), most obviously —
 * takes this rather than `Db`, so it can be enlisted in a caller's transaction
 * and roll back with it. Derived from `Db["transaction"]` instead of naming
 * drizzle's internal PgTransaction generic, which changes shape between minor
 * versions.
 */
export type DbOrTx = Db | Parameters<Parameters<Db["transaction"]>[0]>[0];

/**
 * The admin's database client.
 *
 * Deliberately simpler than erniekay-splendor/lib/db.ts. That one runs on
 * Cloudflare Workers and has to go through a Hyperdrive binding and build a
 * fresh client per request. This app runs on Node, where the server is one
 * long-lived process, so a single pooled client is both allowed and correct —
 * a per-request client would open a TCP connection per page view.
 *
 * Use the SESSION-mode pooler (port 5432). A request here typically runs a
 * couple of statements and sometimes a transaction; Supabase's transaction
 * pooler on 6543 cannot hold a session across those.
 */

// Survives HMR module reloads in dev so we don't leak a connection per edit.
const globalForDb = global as unknown as { adminDb?: Db };

/**
 * Splits a Postgres connection string into explicit fields.
 *
 * Kept in step with the public app: passing explicit options to postgres.js
 * stops it parsing the string itself, which also drops the query component —
 * `?pgbouncer=true` is a Prisma-only flag that postgres.js would otherwise
 * forward to the server as an unknown startup parameter.
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
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.",
    );
  }

  const client = postgres({
    ...parseConnectionString(connectionString),
    // Supabase connection strings omit sslmode but the connection does need TLS.
    ssl: "require",
    // Supavisor does not support prepared statements.
    prepare: false,
    // Small: a handful of staff, and Supabase's pooler counts every connection.
    max: 4,
    idle_timeout: 20,
  });

  return drizzle(client, { schema });
}

/**
 * Returns the shared database client.
 *
 * Created on first call rather than at module load: `next build` imports every
 * route to collect page data, and the build environment has no DATABASE_URL.
 */
export function getDb(): Db {
  globalForDb.adminDb ??= createDb();
  return globalForDb.adminDb;
}

export * from "./schema";
