import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Strip query params (`?pgbouncer=true` is a Prisma-only flag; postgres.js would
// forward unknown params to the server as startup options).
const url = new URL(connectionString);
url.search = "";

const globalForDb = global as unknown as { pgClient?: postgres.Sql };

const client =
  globalForDb.pgClient ||
  postgres(url.toString(), {
    // Supabase terminates TLS at the pooler; the connection string omits sslmode.
    ssl: "require",
    // Supabase's transaction-mode pooler (6543) cannot use prepared statements.
    prepare: false,
    // One connection per isolate — serverless/edge invocations are short-lived.
    max: 1,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pgClient = client;

export const db = drizzle(client, { schema });

export * from "./schema";
