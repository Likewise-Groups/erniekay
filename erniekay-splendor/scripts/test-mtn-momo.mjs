/**
 * MTN MoMo Integration Test Script
 * ──────────────────────────────────
 * Tests all three MTN MoMo endpoints:
 *   1. OAuth2 token fetch  (/oauth/access_token)
 *   2. Request-to-Pay      (POST /api/payments/mtn/request-to-pay)
 *   3. Payment Status      (GET  /api/payments/mtn/status/:referenceId)
 *
 * Usage:
 *   node scripts/test-mtn-momo.mjs
 *
 * Requires the Next.js dev server to be running on localhost:3000
 *   npm run dev
 */

// ─── Config ────────────────────────────────────────────────────────────────
const BASE_URL        = "http://localhost:3000";
const MTN_BASE        = process.env.MTN_MOMO_BASE_URL  || "https://api.mtn.com/v1";
const CONSUMER_KEY    = process.env.MTN_MOMO_API_USER  || "fModCxOSRqCBAmGF6cCEJWQdzfb1ItXq";
const CONSUMER_SECRET = process.env.MTN_MOMO_API_KEY   || "YPHdhG1vWGMnzAZI";
const SUBSCRIPTION_KEY = process.env.MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY || "";

// ─── Test Payload ──────────────────────────────────────────────────────────
const TEST_PAYMENT = {
  amount: 1,                     // GHS 1 — keep small for live testing
  phone: "233598592252",         // ← Change to a real MTN Ghana number for live test
  customerName: "Test Customer",
  serviceName:  "Test Booking",
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
  section("Test 1 — OAuth2 Token Fetch (MTN API direct)");

  const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const headers = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (SUBSCRIPTION_KEY) headers["Ocp-Apim-Subscription-Key"] = SUBSCRIPTION_KEY;

  try {
    const res = await fetch(`${MTN_BASE}/oauth/access_token`, {
      method: "POST",
      headers,
      body: "grant_type=client_credentials",
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
        info("⚠️  SANDBOX/MOCK MODE — no real prompt sent. Add credentials + merchant number to .env.local");
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

  const cases = [
    { label: "missing amount",       body: { phone: "233551234567", customerName: "Test" } },
    { label: "missing phone",        body: { amount: 10, customerName: "Test" } },
    { label: "missing customerName", body: { amount: 10, phone: "233551234567" } },
    { label: "amount = 0",           body: { amount: 0, phone: "233551234567", customerName: "Test" } },
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
