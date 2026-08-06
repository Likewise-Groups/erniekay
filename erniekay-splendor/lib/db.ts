import { getCloudflareContext } from "@opennextjs/cloudflare";
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

/**
 * Resolves the connection string for the current runtime.
 *
 * On Cloudflare Workers this must go through the Hyperdrive binding: a Worker
 * cannot open a direct TCP connection to Supabase (both the transaction pooler
 * on 6543 and the session pooler on 5432 fail with CONNECT_TIMEOUT). Hyperdrive
 * proxies the connection and pools it on Cloudflare's side, which also keeps
 * per-request clients from exhausting Supabase's connection limit.
 *
 * Everywhere else (next dev, scripts) falls back to DATABASE_URL.
 */
function resolveConnection(): { connectionString: string; viaHyperdrive: boolean } {
  try {
    // Throws when there is no Cloudflare request context (dev, tsx scripts).
    const env = getCloudflareContext().env as unknown as {
      HYPERDRIVE?: { connectionString?: string };
    };

    if (env?.HYPERDRIVE?.connectionString) {
      return { connectionString: env.HYPERDRIVE.connectionString, viaHyperdrive: true };
    }
  } catch {
    // Not running on Workers — fall through to DATABASE_URL.
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  return { connectionString, viaHyperdrive: false };
}

function createDb(): Db {
  const { connectionString, viaHyperdrive } = resolveConnection();

  const client = postgres({
    ...parseConnectionString(connectionString),
    // Hyperdrive is a local proxy inside the Worker — no TLS on that hop, and
    // it terminates TLS to Supabase itself. Connecting directly (dev, scripts)
    // does need TLS, since Supabase's connection strings omit sslmode.
    ssl: viaHyperdrive ? false : "require",
    // Avoids an extra round trip Hyperdrive does not support.
    fetch_types: !viaHyperdrive,
    // Supavisor does not support prepared statements.
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
