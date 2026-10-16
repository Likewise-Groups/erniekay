/**
 * Creates a staff account, or resets the password on one that exists.
 *
 * The application has no sign-up screen and never will: accounts are granted,
 * not requested. This script is how the first one comes into being and how a
 * forgotten password is dealt with.
 *
 *   npm run admin:create -- --email ama@erniekay.com --name "Ama Mensah"
 *   npm run admin:create -- --email ama@erniekay.com --password '…' --role STAFF
 *
 * With no --password it prompts (input is not echoed); with neither it can
 * generate one with --generate and print it once.
 *
 * ── The hashing here must match lib/password.ts ─────────────────────────────
 * It is PBKDF2-SHA256, 210,000 iterations, 32-byte key, stored as
 * `pbkdf2$sha256$<iterations>$<salt>$<hash>` with both parts base64url. This is
 * a second implementation of that format, in Node's crypto rather than Web
 * Crypto, because the app is TypeScript and this script has no build step. The
 * script verifies its own output before writing, so a divergence fails here
 * rather than at someone's first sign-in.
 */
import { pbkdf2Sync, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { createInterface } from "node:readline";
import postgres from "postgres";

const ITERATIONS = 210_000;
const KEY_BYTES = 32;
const MIN_LENGTH = 12;
const ROLES = ["ADMIN", "STAFF"];

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log(
    [
      "Usage: npm run admin:create -- --email <address> [options]",
      "",
      "  --email <address>    Required. Matched case-insensitively against existing users.",
      "  --password <value>   Skips the prompt. Beware shell history.",
      "  --generate           Generate a password and print it once.",
      "  --name  <full name>  Split on the first space into first/last name.",
      "  --role  <ADMIN|STAFF>  Defaults to ADMIN.",
      "  --phone <number>",
    ].join("\n"),
  );
  process.exit(0);
}

const email = String(args.email ?? "").trim().toLowerCase();
if (!email || !email.includes("@")) {
  fail("--email is required and must look like an email address.");
}

const role = String(args.role ?? "ADMIN").toUpperCase();
if (!ROLES.includes(role)) {
  fail(`--role must be one of: ${ROLES.join(", ")}`);
}

const url = process.env.DATABASE_URL;
if (!url) {
  fail("DATABASE_URL is not set. Run through npm so --env-file=.env.local is applied.");
}

let password = args.password ? String(args.password) : "";
let generated = false;

if (!password && args.generate) {
  password = randomBytes(18).toString("base64url");
  generated = true;
}

if (!password) {
  password = await promptHidden(`Password for ${email}: `);
  const again = await promptHidden("Confirm: ");
  if (password !== again) fail("Passwords did not match.");
}

if (password.length < MIN_LENGTH) {
  fail(`Password must be at least ${MIN_LENGTH} characters (this one is ${password.length}).`);
}

const passwordHash = hashPassword(password);

// Round-trips the hash before it reaches the database. If this file and
// lib/password.ts ever disagree, the account would be created and then be
// impossible to sign in to — a failure with no obvious cause at the far end.
if (!verifyPassword(password, passwordHash)) {
  fail("Internal error: the hash this script produced does not verify against itself.");
}

const [firstName, ...restOfName] = String(args.name ?? "").trim().split(/\s+/).filter(Boolean);
const lastName = restOfName.join(" ") || null;

const sql = postgres(url, { ssl: "require", prepare: false, max: 1 });

try {
  const [existing] = await sql`
    SELECT "id", "email", "role" FROM "User" WHERE lower("email") = ${email} LIMIT 1
  `;

  if (existing) {
    await sql`
      UPDATE "User"
      SET "passwordHash" = ${passwordHash},
          "role"         = ${role},
          "firstName"    = COALESCE(${firstName ?? null}, "firstName"),
          "lastName"     = COALESCE(${lastName}, "lastName"),
          "phone"        = COALESCE(${args.phone ?? null}, "phone"),
          "updatedAt"    = now()
      WHERE "id" = ${existing.id}
    `;

    console.log(
      `Updated ${existing.email}: password reset, role ${existing.role} -> ${role}.`,
    );
  } else {
    const id = randomUUID();
    await sql`
      INSERT INTO "User" ("id", "email", "passwordHash", "role", "firstName", "lastName", "phone", "updatedAt")
      VALUES (${id}, ${email}, ${passwordHash}, ${role}, ${firstName ?? null}, ${lastName}, ${
        args.phone ?? null
      }, now())
    `;

    console.log(`Created ${email} with role ${role}.`);
  }

  // Recorded like any other change: an account being granted is exactly the
  // kind of event the audit trail exists for.
  await sql`
    INSERT INTO "AdminAudit" ("id", "actorId", "actorEmail", "entity", "entityId", "action", "detail")
    VALUES (${randomUUID()}, ${null}, ${"scripts/create-admin"}, ${"auth"}, ${email},
            ${existing ? "account updated" : "account created"}, ${`role ${role}`})
  `;

  if (generated) {
    console.log(`\nGenerated password (shown once): ${password}`);
  }
} finally {
  await sql.end();
}

// ── helpers ─────────────────────────────────────────────────────────────────

function hashPassword(plain) {
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(plain, salt, ITERATIONS, KEY_BYTES, "sha256");
  return ["pbkdf2", "sha256", ITERATIONS, base64url(salt), base64url(hash)].join("$");
}

function verifyPassword(plain, stored) {
  const [algorithm, digest, iterations, salt, hash] = stored.split("$");
  if (algorithm !== "pbkdf2" || digest !== "sha256") return false;

  const expected = Buffer.from(hash, "base64url");
  const actual = pbkdf2Sync(
    plain,
    Buffer.from(salt, "base64url"),
    Number(iterations),
    expected.length,
    "sha256",
  );

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// A function declaration, not a const: the top-level code above runs before
// this line is reached, and a const would still be in its temporal dead zone.
function base64url(buffer) {
  return buffer.toString("base64url");
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

/** Reads a line without echoing it, so a password does not stay on screen. */
function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });

    // readline writes the prompt through this hook; suppress everything after it.
    let promptShown = false;
    const write = rl._writeToOutput?.bind(rl);
    rl._writeToOutput = () => {
      if (!promptShown) {
        promptShown = true;
        write?.(question);
      }
    };

    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
