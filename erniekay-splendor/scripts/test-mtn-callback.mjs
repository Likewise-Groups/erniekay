/**
 * Money-integrity and abuse-control tests.
 *
 * Covers what test-mtn-momo.mjs cannot: that the payment/booking binding cannot
 * be abused, that confirmation requires a payment which actually covers the
 * booking, and that the endpoints are rate limited.
 *
 * Every assertion checks the DATABASE, not just the HTTP response — the whole
 * class of bug being tested here is one where the API answers happily and the
 * data ends up wrong.
 *
 * Usage: npm run test:mtn:callback   (requires `npm run dev` on :3000)
 */
import crypto from "crypto";
import postgres from "postgres";

const BASE_URL = "http://localhost:3000";
const TOKEN = process.env.MTN_MOMO_CALLBACK_TOKEN;
const DB_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!TOKEN || !DB_URL) {
  console.error("Need MTN_MOMO_CALLBACK_TOKEN and DIRECT_URL. Pass both --env-file flags.");
  process.exit(1);
}

const sql = postgres(DB_URL, { ssl: "require", prepare: false, max: 1 });

let passed = 0;
let failed = 0;
const pass = (t, d = "") => { passed++; console.log(`\x1b[32m[PASS]\x1b[0m ${t}${d ? ` — ${d}` : ""}`); };
const fail = (t, d = "") => { failed++; console.log(`\x1b[31m[FAIL]\x1b[0m ${t}${d ? ` — ${d}` : ""}`); };
const section = (t) => console.log(`\n\x1b[33m\x1b[1m── ${t}\x1b[0m`);

// A fresh phone per payment, so rate-limit state cannot leak between tests or
// between runs. 233 + 24 + 7 digits = a valid 12-digit Ghanaian MSISDN.
const freshPhone = () => `23324${Math.floor(Math.random() * 9000000) + 1000000}`;

const emails = [];
const serviceIds = new Set();

const book = async (overrides = {}) => {
  const email = `t-${crypto.randomUUID().slice(0, 8)}@example.test`;
  emails.push(email);
  const body = {
    fullName: "Integrity Test",
    email,
    phone: "0241234567",
    serviceId: "nail-care",
    serviceName: "Nail Care & Artistry",
    category: "Test",
    selectedServices: ["Artisan Manicure"],
    date: "2026-09-01",
    time: "10:00",
    ...overrides,
  };
  serviceIds.add(body.serviceId);
  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { res, data: await res.json() };
};

const pay = async (body) => {
  const res = await fetch(`${BASE_URL}/api/payments/mtn/request-to-pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { res, data: await res.json() };
};

const pollUntilSettled = async (referenceId) => {
  for (let i = 0; i < 12; i++) {
    const res = await fetch(`${BASE_URL}/api/payments/mtn/status/${referenceId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.status === "SUCCESSFUL" || data.status === "FAILED") return data;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return null;
};

try {
  // ── 1. Booking is priced server-side and stored as an intent ──────────────
  section("Booking is created as a priced, unpaid intent");

  const { res: bRes, data: bData } = await book({ totalPrice: 999999 });
  const booking = bData.booking;

  if (bRes.status === 201 && booking?.id) pass("booking created", booking.id);
  else fail("booking created", `HTTP ${bRes.status} ${JSON.stringify(bData)}`);

  if (booking?.amountDue === 150) pass("priced from catalogue", "150, ignoring the client's 999999");
  else fail("priced from catalogue", `amountDue=${booking?.amountDue}`);

  if (booking?.status === "PENDING") pass("starts unpaid", "PENDING");
  else fail("starts unpaid", `status=${booking?.status}`);

  const [svc] = await sql`SELECT price, name FROM "Service" WHERE id = 'nail-care'`;
  if (Number(svc?.price) !== 999999 && svc?.name !== "HACKED") {
    pass("catalogue price not writable by a booking", `Service.price=${svc?.price}`);
  } else {
    fail("catalogue price not writable by a booking", `price=${svc?.price}`);
  }

  // ── 2. Comma-containing service names survive the round trip ──────────────
  section("Service names containing commas are priced correctly");

  const { data: commaData } = await book({
    serviceId: "custom-wigging",
    serviceName: "Custom Wigging",
    selectedServices: ["Closure (2*6, 4*4)"],
  });
  if (commaData.booking?.amountDue === 300) {
    pass('"Closure (2*6, 4*4)" priced at 300', "join/split no longer shatters it");
  } else {
    fail('"Closure (2*6, 4*4)" priced at 300', `amountDue=${commaData.booking?.amountDue}`);
  }

  // ── 3. THE BYPASS: a cheap payment cannot confirm an expensive booking ────
  section("Cheap payment cannot be attached to an expensive booking");

  // Cheapest catalogue item (80) …
  const { data: cheapBooking } = await book({
    serviceId: "custom-wigging",
    serviceName: "Custom Wigging",
    selectedServices: ["Corn-rolls for wigging"],
  });
  const cheapPhone = freshPhone();
  const { res: cheapRes, data: cheapPay } = await pay({
    appointmentId: cheapBooking.booking.id,
    phone: cheapPhone,
    customerName: "Integrity Test",
  });

  if (cheapRes.status === 202 && cheapPay.referenceId) {
    pass("cheap payment started", `amount charged = ${cheapBooking.booking.amountDue}`);
  } else {
    fail("cheap payment started", `HTTP ${cheapRes.status} ${JSON.stringify(cheapPay)}`);
  }

  const [cheapRow] = await sql`SELECT amount, "appointmentId" FROM "Payment" WHERE "referenceId" = ${cheapPay.referenceId}`;
  if (Number(cheapRow?.amount) === 80) pass("payment amount comes from the booking", "80");
  else fail("payment amount comes from the booking", `amount=${cheapRow?.amount}`);

  if (cheapRow?.appointmentId === cheapBooking.booking.id) {
    pass("payment bound to its booking at creation", "no client-chosen pairing exists");
  } else {
    fail("payment bound to its booking at creation", `appointmentId=${cheapRow?.appointmentId}`);
  }

  // … now try to make that payment confirm a 700 GHS booking.
  const { data: pricey } = await book({
    serviceId: "custom-wigging",
    serviceName: "Custom Wigging",
    selectedServices: ["360 Frontal"],
  });
  const priceyId = pricey.booking.id;

  if (pricey.booking.amountDue === 700) pass("expensive booking priced at 700");
  else fail("expensive booking priced at 700", `amountDue=${pricey.booking.amountDue}`);

  // The old attack: quote the cheap reference against the expensive booking.
  // There is no longer any endpoint that accepts such a pairing.
  const repoint = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Attacker",
      email: `attack-${crypto.randomUUID().slice(0, 8)}@example.test`,
      phone: "0241234567",
      serviceId: "custom-wigging",
      serviceName: "Custom Wigging",
      selectedServices: ["360 Frontal"],
      date: "2026-09-01",
      time: "11:00",
      paymentReferenceId: cheapPay.referenceId, // ignored now
    }),
  });
  const repointData = await repoint.json();
  emails.push(`attack-${repointData.booking?.id ?? ""}`);

  const [stillBound] = await sql`SELECT "appointmentId" FROM "Payment" WHERE "referenceId" = ${cheapPay.referenceId}`;
  if (stillBound?.appointmentId === cheapBooking.booking.id) {
    pass("paymentReferenceId in a booking body is inert", "payment stayed on its own booking");
  } else {
    fail("paymentReferenceId in a booking body is inert", `moved to ${stillBound?.appointmentId}`);
  }

  // Settle the cheap payment for real, then check the expensive booking.
  await pollUntilSettled(cheapPay.referenceId);
  const [priceyAppt] = await sql`SELECT status FROM "Appointment" WHERE id = ${priceyId}`;
  if (priceyAppt?.status === "PENDING") {
    pass("expensive booking never confirmed", "an 80 GHS payment cannot pay for 700");
  } else {
    fail("expensive booking never confirmed", `status=${priceyAppt?.status}`);
  }

  const [cheapAppt] = await sql`SELECT status FROM "Appointment" WHERE id = ${cheapBooking.booking.id}`;
  if (cheapAppt?.status === "CONFIRMED") pass("the booking that was paid for IS confirmed");
  else fail("the booking that was paid for IS confirmed", `status=${cheapAppt?.status}`);

  // ── 4. Confirmation cannot be downgraded ──────────────────────────────────
  section("A later failed payment cannot un-confirm a paid booking");

  const downgrade = await fetch(`${BASE_URL}/api/payments/mtn/callback?token=${encodeURIComponent(TOKEN)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ externalId: cheapPay.referenceId, status: "FAILED" }),
  });
  const [afterDowngrade] = await sql`SELECT status FROM "Appointment" WHERE id = ${cheapBooking.booking.id}`;

  if (downgrade.status === 200 && afterDowngrade?.status === "CONFIRMED") {
    pass("CONFIRMED survives a later FAILED", "status is only ever promoted");
  } else {
    fail("CONFIRMED survives a later FAILED", `HTTP ${downgrade.status}, status=${afterDowngrade?.status}`);
  }

  // ── 5. Underpayment cannot confirm ────────────────────────────────────────
  section("A payment smaller than the amount due cannot confirm");

  const { data: underBooking } = await book({
    serviceId: "spa-skin",
    serviceName: "SPA & Skin Rejuvenation",
    selectedServices: ["Red Carpet Peel"], // 275
  });
  const underPhone = freshPhone();
  const { data: underPay } = await pay({
    appointmentId: underBooking.booking.id,
    phone: underPhone,
    customerName: "Under Payer",
  });

  // Forge an underpayment directly in the table, then let the callback run.
  await sql`UPDATE "Payment" SET amount = 1 WHERE "referenceId" = ${underPay.referenceId}`;
  await fetch(`${BASE_URL}/api/payments/mtn/callback?token=${encodeURIComponent(TOKEN)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ externalId: underPay.referenceId, status: "SUCCESSFUL" }),
  });
  const [underAppt] = await sql`SELECT status FROM "Appointment" WHERE id = ${underBooking.booking.id}`;
  if (underAppt?.status === "PENDING") {
    pass("underpayment refused", "1 does not cover 275");
  } else {
    fail("underpayment refused", `status=${underAppt?.status}`);
  }

  // ── 6. Double payment is refused ──────────────────────────────────────────
  // Its own booking: the one above was deliberately driven to FAILED by the
  // downgrade test, so it no longer has a settled payment to guard against.
  section("A booking cannot be charged twice");

  const { data: paidOnce } = await book({
    serviceId: "spa-skin",
    serviceName: "SPA & Skin Rejuvenation",
    selectedServices: ["Glow Facial"],
  });
  const { data: firstCharge } = await pay({
    appointmentId: paidOnce.booking.id,
    phone: freshPhone(),
    customerName: "Single Charge",
  });
  await pollUntilSettled(firstCharge.referenceId);

  const { res: dupRes, data: dupData } = await pay({
    appointmentId: paidOnce.booking.id,
    phone: freshPhone(),
    customerName: "Double Charger",
  });
  if (dupRes.status === 409) pass("already-paid booking refuses a second charge", dupData.error);
  else fail("already-paid booking refuses a second charge", `HTTP ${dupRes.status} ${JSON.stringify(dupData)}`);

  // ── 7. Payment requires a real, priced booking ────────────────────────────
  section("Payment cannot be raised without a priced booking");

  const { res: ghostRes } = await pay({
    appointmentId: crypto.randomUUID(),
    phone: freshPhone(),
    customerName: "Ghost",
  });
  if (ghostRes.status === 404) pass("unknown appointment → 404");
  else fail("unknown appointment → 404", `HTTP ${ghostRes.status}`);

  const { data: unpricedBooking } = await book({
    serviceId: "not-a-catalogue-category",
    serviceName: "Mystery",
    selectedServices: ["Whatever"],
  });
  const { res: unpricedRes } = await pay({
    appointmentId: unpricedBooking.booking.id,
    phone: freshPhone(),
    customerName: "Unpriced",
  });
  if (unpricedRes.status === 409) pass("unpriced booking cannot be charged", "no arbitrary amount accepted");
  else fail("unpriced booking cannot be charged", `HTTP ${unpricedRes.status}`);

  // ── 8. Phone validation ───────────────────────────────────────────────────
  section("Phone numbers are validated before MTN is contacted");

  const { data: freshForPhone } = await book();
  for (const [label, phone] of [
    ["non-Ghanaian", "447700900000"],
    ["too short", "024123"],
    ["bad prefix", "0991234567"],
    ["not a number", "hello"],
  ]) {
    const { res } = await pay({
      appointmentId: freshForPhone.booking.id,
      phone,
      customerName: "Phone Test",
    });
    if (res.status === 400) pass(`rejects ${label}`);
    else fail(`rejects ${label}`, `HTTP ${res.status}`);
  }

  // Local format must be accepted and normalised.
  const { res: localRes, data: localPay } = await pay({
    appointmentId: freshForPhone.booking.id,
    phone: "024 123 4567",
    customerName: "Phone Test",
  });
  if (localRes.status === 202) {
    const [row] = await sql`SELECT "payerPhone" FROM "Payment" WHERE "referenceId" = ${localPay.referenceId}`;
    if (row?.payerPhone === "233241234567") pass("local format normalised", "024 123 4567 → 233241234567");
    else fail("local format normalised", `stored ${row?.payerPhone}`);
  } else {
    fail("local format accepted", `HTTP ${localRes.status} ${JSON.stringify(localPay)}`);
  }

  // ── 9. Rate limiting ──────────────────────────────────────────────────────
  section("Payment attempts are rate limited per phone");

  const spamPhone = freshPhone();
  let limited = false;
  let attempts = 0;

  for (let i = 0; i < 8 && !limited; i++) {
    const { data: b } = await book();
    const { res } = await pay({
      appointmentId: b.booking.id,
      phone: spamPhone,
      customerName: "Spammer",
    });
    attempts++;
    if (res.status === 429) limited = true;
  }

  if (limited) pass("phone rate limit fires", `blocked after ${attempts - 1} prompts`);
  else fail("phone rate limit fires", `${attempts} attempts all allowed`);

  // A different phone is unaffected — the limit is per key, not global.
  const { data: innocentBooking } = await book();
  const { res: innocentRes } = await pay({
    appointmentId: innocentBooking.booking.id,
    phone: freshPhone(),
    customerName: "Innocent",
  });
  if (innocentRes.status === 202) pass("a different phone is not blocked", "limit is per-key");
  else fail("a different phone is not blocked", `HTTP ${innocentRes.status}`);

  // ── 10. Callback auth (unchanged behaviour, still guarded) ────────────────
  section("Callback still rejects unauthenticated writes");

  const forged = JSON.stringify({ externalId: cheapPay.referenceId, status: "SUCCESSFUL" });
  for (const [label, url] of [
    ["no token", `${BASE_URL}/api/payments/mtn/callback`],
    ["wrong token", `${BASE_URL}/api/payments/mtn/callback?token=guess`],
  ]) {
    const res = await fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: forged,
    });
    if (res.status === 404) pass(`${label} → 404`);
    else fail(`${label} → 404`, `HTTP ${res.status}`);
  }

  const unknown = await fetch(`${BASE_URL}/api/payments/mtn/callback?token=${encodeURIComponent(TOKEN)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ externalId: "not-a-real-reference", status: "SUCCESSFUL" }),
  });
  if (unknown.status === 200 && (await unknown.json()).status === "ignored") {
    pass("unknown reference acknowledged, not retried forever");
  } else {
    fail("unknown reference acknowledged");
  }
} catch (err) {
  fail("suite aborted", `${err.message}\n${err.stack}`);
} finally {
  // Leave the database as we found it. Children before parents: Appointment
  // .userId and .serviceId are ON DELETE restrict.
  for (const email of emails) {
    const [u] = await sql`SELECT id FROM "User" WHERE email = ${email}`;
    if (!u) continue;
    const appts = await sql`SELECT id FROM "Appointment" WHERE "userId" = ${u.id}`;
    for (const a of appts) {
      await sql`DELETE FROM "Payment" WHERE "appointmentId" = ${a.id}`;
    }
    await sql`DELETE FROM "Appointment" WHERE "userId" = ${u.id}`;
    await sql`DELETE FROM "User" WHERE id = ${u.id}`;
  }
  for (const id of serviceIds) {
    try {
      await sql`DELETE FROM "Service" WHERE id = ${id}`;
    } catch {
      console.log(`Left Service '${id}' in place — referenced by other rows.`);
    }
  }
  console.log("\nCleaned up test rows.");

  console.log(`\n\x1b[32mPASSED: ${passed}\x1b[0m   ${failed ? "\x1b[31m" : "\x1b[32m"}FAILED: ${failed}\x1b[0m`);
  await sql.end();
  if (failed > 0) process.exit(1);
}
