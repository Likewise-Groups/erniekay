/**
 * MTN MoMo Integration Test Script
 * ──────────────────────────────────
 * Tests all three MTN MoMo endpoints:
 *   1. Collections token   (POST {base}/collection/token/)
 *   2. Request-to-Pay      (POST /api/payments/mtn/request-to-pay)
 *   3. Payment Status      (GET  /api/payments/mtn/status/:referenceId)
 *
 * Usage:
 *   node --env-file=.env.local scripts/test-mtn-momo.mjs
 *
 * Requires the Next.js dev server to be running on localhost:3000
 *   npm run dev
 */

// ─── Config ────────────────────────────────────────────────────────────────
const BASE_URL         = "http://localhost:3000";
const TARGET_ENV       = process.env.MTN_MOMO_TARGET_ENVIRONMENT || "production";
// Mirrors the derivation in lib/mtnMomo.ts — keep the two in step.
const MTN_BASE         = process.env.MTN_MOMO_BASE_URL
  || (TARGET_ENV === "sandbox"
    ? "https://sandbox.momodeveloper.mtn.com"
    : "https://proxy.momoapi.mtn.com");
const CONSUMER_KEY     = process.env.MTN_MOMO_API_USER  || "";
const CONSUMER_SECRET  = process.env.MTN_MOMO_API_KEY   || "";
const SUBSCRIPTION_KEY = process.env.MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY || "";

if (!CONSUMER_KEY || !CONSUMER_SECRET) {
  console.error("Missing MTN_MOMO_API_USER / MTN_MOMO_API_KEY. Run with --env-file=.env.local");
  process.exit(1);
}

// ─── Test Payload ──────────────────────────────────────────────────────────
// No amount: the server prices this from lib/serviceCatalog. "Corn-rolls for
// wigging" is the cheapest catalogue entry (80), which keeps a live test small.
const TEST_PAYMENT = {
  phone: "233598592252",         // ← Change to a real MTN Ghana number for live test
  customerName: "Test Customer",
  serviceId: "custom-wigging",
  selectedServices: ["Corn-rolls for wigging"],
};

// ─── Helpers ───────────────────────────────────────────────────────────────
const RESET  = "\x1b[0m";
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const BOLD   = "\x1b[1m";

let passed = 0;
let failed = 0;

function log(label, msg, color = RESET) {
  console.log(`${color}${BOLD}[${label}]${RESET} ${msg}`);
}
function pass(test, detail = "") {
  passed++;
  log("PASS", `${test}${detail ? ` — ${detail}` : ""}`, GREEN);
}
function fail(test, detail = "") {
  failed++;
  log("FAIL", `${test}${detail ? ` — ${detail}` : ""}`, RED);
}
function info(msg) {
  console.log(`${CYAN}       ${msg}${RESET}`);
}
function section(title) {
  console.log(`\n${YELLOW}${BOLD}══════════════════════════════════════${RESET}`);
  console.log(`${YELLOW}${BOLD}  ${title}${RESET}`);
  console.log(`${YELLOW}${BOLD}══════════════════════════════════════${RESET}`);
}

// ─── Test 1: Fetch OAuth2 Token Directly from MTN ──────────────────────────
async function testTokenFetch() {
  section("Test 1 — Collections Token Fetch (MoMo API direct)");

  const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const headers = { Authorization: `Basic ${credentials}` };
  if (SUBSCRIPTION_KEY) headers["Ocp-Apim-Subscription-Key"] = SUBSCRIPTION_KEY;

  try {
    // Basic-auth token call, not an OAuth2 client_credentials grant. The
    // /oauth/access_token form belongs to MTN's separate MADAPI product and
    // 400s against a MoMo Collections subscription.
    const res = await fetch(`${MTN_BASE}/collection/token/`, {
      method: "POST",
      headers,
    });

    info(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    info(`Response: ${JSON.stringify(data).slice(0, 200)}`);

    if (res.ok && data?.access_token) {
      pass("Token fetch", `access_token present (${data.access_token.slice(0, 20)}...)`);
      return data.access_token;
    } else {
      fail("Token fetch", `HTTP ${res.status} — ${JSON.stringify(data).slice(0, 150)}`);
      return null;
    }
  } catch (err) {
    fail("Token fetch", `Network error: ${err.message}`);
    return null;
  }
}

// ─── Test 2: POST /api/payments/mtn/request-to-pay ─────────────────────────
async function testRequestToPay() {
  section("Test 2 — Request-to-Pay (Next.js API route)");
  info(`Payload: ${JSON.stringify(TEST_PAYMENT)}`);

  try {
    const res = await fetch(`${BASE_URL}/api/payments/mtn/request-to-pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TEST_PAYMENT),
    });

    info(`Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    info(`Response: ${JSON.stringify(data)}`);

    // 202 = live MTN accepted, 200 = sandbox mock
    if (res.status === 202 || res.status === 200) {
      pass("Request-to-Pay accepted", `mode=${data.mode}, status=${data.status}`);

      if (data.referenceId) {
        pass("referenceId present", data.referenceId);
      } else {
        fail("referenceId missing");
      }

      if (data.mode === "live") {
        info("✅ LIVE MODE — a real MoMo prompt was sent to the phone!");
      } else {
        info("⚠️  SANDBOX MODE — no prompt sent, no money moved. Swap in production credentials to go live.");
      }

      return data.referenceId;
    } else {
      fail("Request-to-Pay", `Unexpected HTTP ${res.status}: ${JSON.stringify(data)}`);
      return null;
    }
  } catch (err) {
    fail("Request-to-Pay", `Error: ${err.message}`);
    return null;
  }
}

// ─── Test 3: GET /api/payments/mtn/status/:referenceId ────────────────────
async function testStatusCheck(referenceId) {
  section("Test 3 — Payment Status Check (Next.js API route)");

  if (!referenceId) {
    fail("Status Check", "Skipped — no referenceId from previous test");
    return;
  }

  info(`Checking status for referenceId: ${referenceId}`);

  try {
    const res = await fetch(`${BASE_URL}/api/payments/mtn/status/${referenceId}`);
    info(`Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    info(`Response: ${JSON.stringify(data)}`);

    if (res.ok && data?.status) {
      pass("Status endpoint reachable", `payment status = ${data.status}`);

      const validStatuses = ["PENDING", "SUCCESSFUL", "FAILED"];
      if (validStatuses.includes(data.status)) {
        pass("Status value valid", data.status);
      } else {
        fail("Unexpected status value", data.status);
      }
    } else {
      fail("Status Check", `HTTP ${res.status}: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    fail("Status Check", `Error: ${err.message}`);
  }
}

// ─── Test 4: GET /api/payments/mtn/callback (health check) ─────────────────
async function testCallbackEndpoint() {
  section("Test 4 — Callback Endpoint Health Check");

  try {
    const res = await fetch(`${BASE_URL}/api/payments/mtn/callback`);
    info(`Status: ${res.status} ${res.statusText}`);
    const data = await res.json();
    info(`Response: ${JSON.stringify(data)}`);

    if (res.ok && data?.message) {
      pass("Callback endpoint active", data.message);
    } else {
      fail("Callback endpoint", `HTTP ${res.status}`);
    }
  } catch (err) {
    fail("Callback endpoint", `Error: ${err.message}`);
  }
}

// ─── Test 5: Validation — Missing Fields ───────────────────────────────────
async function testValidation() {
  section("Test 5 — Input Validation (missing / bad fields)");

  const valid = { phone: "233551234567", customerName: "Test", serviceId: "nail-care", selectedServices: ["Artisan Manicure"] };

  const cases = [
    { label: "missing phone",        body: { ...valid, phone: undefined } },
    { label: "missing customerName", body: { ...valid, customerName: undefined } },
    { label: "unknown serviceId",    body: { ...valid, serviceId: "not-a-category" } },
    { label: "empty selection",      body: { ...valid, selectedServices: [] } },
    { label: "service not in category", body: { ...valid, selectedServices: ["Frontal Sew-In"] } },
  ];

  for (const tc of cases) {
    try {
      const res = await fetch(`${BASE_URL}/api/payments/mtn/request-to-pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tc.body),
      });

      const data = await res.json();

      if (res.status === 400 && data?.error) {
        pass(`Validation: ${tc.label}`, `→ 400 "${data.error}"`);
      } else {
        fail(`Validation: ${tc.label}`, `Expected 400, got ${res.status}`);
      }
    } catch (err) {
      fail(`Validation: ${tc.label}`, err.message);
    }
  }
}

// ─── Cleanup ───────────────────────────────────────────────────────────────
// request-to-pay now persists a Payment row, so this suite would otherwise
// leave a sandbox transaction in the real database on every run. Only removes
// the unlinked sandbox row it created itself.
async function cleanupTestPayment(referenceId) {
  const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!referenceId || !dbUrl) return;

  try {
    const { default: postgres } = await import("postgres");
    const sql = postgres(dbUrl, { ssl: "require", prepare: false, max: 1 });
    try {
      const deleted = await sql`
        DELETE FROM "Payment"
        WHERE "referenceId" = ${referenceId}
          AND mode = 'sandbox'
          AND "appointmentId" IS NULL
        RETURNING "referenceId"
      `;
      if (deleted.length) info(`Cleaned up sandbox Payment row ${referenceId}`);
    } finally {
      await sql.end();
    }
  } catch (err) {
    info(`Could not clean up Payment row ${referenceId}: ${err.message}`);
  }
}

// ─── Runner ────────────────────────────────────────────────────────────────
async function run() {
  console.log(`\n${BOLD}${CYAN}MTN MoMo Integration Tests${RESET}`);
  console.log(`${CYAN}Target : ${BASE_URL}${RESET}`);
  console.log(`${CYAN}MTN API: ${MTN_BASE}${RESET}`);
  console.log(`${CYAN}Consumer Key: ${CONSUMER_KEY.slice(0, 8)}...${RESET}`);

  const _token     = await testTokenFetch();
  const referenceId = await testRequestToPay();
  await testStatusCheck(referenceId);
  await testCallbackEndpoint();
  await testValidation();
  await cleanupTestPayment(referenceId);

  section("Results");
  console.log(`${GREEN}${BOLD}  PASSED: ${passed}${RESET}`);
  console.log(`${failed > 0 ? RED : GREEN}${BOLD}  FAILED: ${failed}${RESET}`);
  console.log(`${BOLD}  TOTAL:  ${passed + failed}${RESET}\n`);

  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
