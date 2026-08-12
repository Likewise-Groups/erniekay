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
// Payment now identifies a booking, not a selection: the server reads both the
// amount and the services from the appointment. So this suite creates a booking
// first. "Corn-rolls for wigging" is the cheapest catalogue entry (80), which
// keeps a live test small.
const TEST_BOOKING = {
  fullName: "Test Customer",
  email: `mtn-suite-${Date.now()}@example.test`,
  phone: "233598592252",         // ← Change to a real MTN Ghana number for live test
  serviceId: "custom-wigging",
  serviceName: "Custom Wigging",
  category: "Test",
  selectedServices: ["Corn-rolls for wigging"],
  date: "2026-09-01",
  time: "10:00",
};

// ─── Helpers ───────────────────────────────────────────────────────────────
const RESET  = "\x1b[0m";
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const BOLD   = "\x1b[1m";

let createdEmail = null;
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

  // The booking must exist first — it is what the payment is priced from.
  const bookingRes = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(TEST_BOOKING),
  });
  const bookingData = await bookingRes.json();

  if (bookingRes.status !== 201 || !bookingData.booking?.id) {
    fail("Booking created for payment", `HTTP ${bookingRes.status} ${JSON.stringify(bookingData)}`);
    return null;
  }
  pass("Booking created for payment", `${bookingData.booking.id} due ${bookingData.booking.amountDue}`);
  createdEmail = TEST_BOOKING.email;

  const payload = {
    appointmentId: bookingData.booking.id,
    phone: TEST_BOOKING.phone,
    customerName: TEST_BOOKING.fullName,
  };
  info(`Payload: ${JSON.stringify(payload)}`);

  try {
    const res = await fetch(`${BASE_URL}/api/payments/mtn/request-to-pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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

  const valid = { appointmentId: "00000000-0000-4000-8000-000000000000", phone: "233551234567" };

  const cases = [
    { label: "missing appointmentId", body: { ...valid, appointmentId: undefined }, expect: 400 },
    { label: "missing phone",         body: { ...valid, phone: undefined },         expect: 400 },
    { label: "non-Ghanaian phone",    body: { ...valid, phone: "447700900000" },    expect: 400 },
    { label: "malformed phone",       body: { ...valid, phone: "024123" },          expect: 400 },
    // Valid shape, but the booking does not exist — proves the amount can no
    // longer come from the request at all.
    { label: "unknown appointment",   body: valid,                                  expect: 404 },
  ];

  for (const tc of cases) {
    try {
      const res = await fetch(`${BASE_URL}/api/payments/mtn/request-to-pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tc.body),
      });

      const data = await res.json();

      if (res.status === tc.expect && data?.error) {
        pass(`Validation: ${tc.label}`, `→ ${tc.expect} "${data.error}"`);
      } else {
        fail(`Validation: ${tc.label}`, `Expected ${tc.expect}, got ${res.status}`);
      }
    } catch (err) {
      fail(`Validation: ${tc.label}`, err.message);
    }
  }
}

// ─── Cleanup ───────────────────────────────────────────────────────────────
// This suite now creates a booking as well as a payment, so it would otherwise
// leave a real appointment and client in the database on every run. Scoped to
// the single throwaway email it created.
async function cleanupTestData() {
  const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!createdEmail || !dbUrl) return;

  try {
    const { default: postgres } = await import("postgres");
    const sql = postgres(dbUrl, { ssl: "require", prepare: false, max: 1 });
    try {
      const [user] = await sql`SELECT id FROM "User" WHERE email = ${createdEmail}`;
      if (!user) return;

      // Children before parents — Appointment.userId is ON DELETE restrict.
      const appts = await sql`SELECT id FROM "Appointment" WHERE "userId" = ${user.id}`;
      for (const appt of appts) {
        await sql`DELETE FROM "Payment" WHERE "appointmentId" = ${appt.id}`;
      }
      await sql`DELETE FROM "Appointment" WHERE "userId" = ${user.id}`;
      await sql`DELETE FROM "User" WHERE id = ${user.id}`;
      info(`Cleaned up ${appts.length} test booking(s) and their payments`);
    } finally {
      await sql.end();
    }
  } catch (err) {
    info(`Could not clean up test data: ${err.message}`);
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
  await cleanupTestData();

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
