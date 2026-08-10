/**
 * MTN MoMo persistence + callback auth tests.
 *
 * Covers what test-mtn-momo.mjs cannot: that a Payment row is actually written,
 * that the callback rejects unauthenticated POSTs, and that an authenticated
 * callback moves both the payment and its linked appointment.
 *
 * Usage:
 *   node --env-file=.env --env-file=.env.local scripts/test-mtn-callback.mjs
 *
 * Requires `npm run dev` on localhost:3000.
 */
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

const createdRefs = [];
const createdEmails = [];

try {
  // ── 1. request-to-pay writes a Payment row ────────────────────────────────
  section("Payment row is persisted at request time");

  // "Artisan Manicure" is 150 in the catalogue. The forged `amount` below must
  // be ignored entirely — it used to be charged verbatim.
  const rtp = await fetch(`${BASE_URL}/api/payments/mtn/request-to-pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: 0.01,
      phone: "233598592252",
      customerName: "Persistence Test",
      serviceId: "nail-care",
      selectedServices: ["Artisan Manicure"],
    }),
  });
  const payment = await rtp.json();

  if (rtp.status !== 202) {
    fail("request-to-pay accepted", `HTTP ${rtp.status} ${JSON.stringify(payment)}`);
    throw new Error("cannot continue without a payment");
  }
  pass("request-to-pay accepted", `mode=${payment.mode} currency=${payment.currency}`);
  createdRefs.push(payment.referenceId);

  const [row] = await sql`SELECT * FROM "Payment" WHERE "referenceId" = ${payment.referenceId}`;
  if (row) {
    pass("Payment row written", `status=${row.status} amount=${row.amount} currency=${row.currency}`);
  } else {
    fail("Payment row written", "no row found");
  }

  if (row && Number(row.amount) === 150) {
    pass("client-supplied amount ignored", "charged catalogue 150, not the forged 0.01");
  } else {
    fail("client-supplied amount ignored", `charged ${row?.amount}, expected 150`);
  }

  if (row && row.mode === "sandbox") pass("mode recorded as sandbox", "sandbox txn cannot be mistaken for real");
  else fail("mode recorded as sandbox", `got ${row?.mode}`);

  if (row && row.currency === "EUR") pass("currency recorded as actually charged", "EUR, not the configured GHS");
  else fail("currency recorded as actually charged", `got ${row?.currency}`);

  if (row && row.appointment_id === null && row.appointmentId === null) {
    pass("appointmentId starts null", "booking does not exist yet");
  } else if (row && row.appointmentId === null) {
    pass("appointmentId starts null", "booking does not exist yet");
  } else {
    fail("appointmentId starts null", `got ${row?.appointmentId}`);
  }

  // ── 2. Callback auth ──────────────────────────────────────────────────────
  section("Callback rejects unauthenticated writes");

  const forgedBody = JSON.stringify({ externalId: payment.referenceId, status: "SUCCESSFUL" });

  const noToken = await fetch(`${BASE_URL}/api/payments/mtn/callback`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: forgedBody,
  });
  if (noToken.status === 404) pass("no token → 404", "endpoint does not admit it handles payments");
  else fail("no token → 404", `got ${noToken.status}`);

  const badToken = await fetch(`${BASE_URL}/api/payments/mtn/callback?token=guess`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: forgedBody,
  });
  if (badToken.status === 404) pass("wrong token → 404");
  else fail("wrong token → 404", `got ${badToken.status}`);

  const [afterForge] = await sql`SELECT status FROM "Payment" WHERE "referenceId" = ${payment.referenceId}`;
  if (afterForge.status === "PENDING") pass("forged callbacks did not change status", "still PENDING");
  else fail("forged callbacks did not change status", `status is now ${afterForge.status}`);

  // ── 3. Booking links the payment ──────────────────────────────────────────
  section("Booking links the payment to an appointment");

  const email = `mtn-test-${payment.referenceId.slice(0, 8)}@example.test`;
  createdEmails.push(email);

  const booking = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Persistence Test",
      email,
      phone: "233598592252",
      serviceId: "nail-care",
      serviceName: "Nail Care & Artistry",
      category: "Test",
      selectedServices: "Artisan Manicure",
      totalPrice: 999999,
      date: "2026-09-01",
      time: "10:00",
      paymentReferenceId: payment.referenceId,
    }),
  });
  const bookingData = await booking.json();

  if (booking.status === 201) pass("booking created", bookingData.booking?.id);
  else fail("booking created", `HTTP ${booking.status} ${JSON.stringify(bookingData)}`);

  const appointmentId = bookingData.booking?.id;
  const [linked] = await sql`SELECT "appointmentId" FROM "Payment" WHERE "referenceId" = ${payment.referenceId}`;

  if (linked?.appointmentId === appointmentId) {
    pass("payment linked to appointment", appointmentId);
  } else {
    fail("payment linked to appointment", `expected ${appointmentId}, got ${linked?.appointmentId}`);
  }

  // ── 3b. The catalogue is not writable through the booking endpoint ────────
  section("Booking cannot rewrite Service prices");

  const [svc] = await sql`SELECT price, name FROM "Service" WHERE id = 'nail-care'`;
  if (!svc) {
    fail("Service row exists after booking", "no nail-care row");
  } else if (Number(svc.price) === 999999) {
    fail("catalogue price protected", `client's 999999 was written to Service.price`);
  } else {
    pass("catalogue price protected", `Service.price=${svc.price}, client sent 999999`);
  }

  // Re-POST with a different price to prove an existing row is never updated.
  const priceBefore = svc ? Number(svc.price) : null;
  await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Tamper Test",
      email: `tamper-${payment.referenceId.slice(0, 8)}@example.test`,
      phone: "233598592252",
      serviceId: "nail-care",
      serviceName: "HACKED",
      category: "HACKED",
      selectedServices: "Artisan Manicure",
      totalPrice: 1,
      date: "2026-09-02",
      time: "11:00",
    }),
  });
  createdEmails.push(`tamper-${payment.referenceId.slice(0, 8)}@example.test`);

  const [svcAfter] = await sql`SELECT price, name FROM "Service" WHERE id = 'nail-care'`;
  if (Number(svcAfter?.price) === priceBefore && svcAfter?.name !== "HACKED") {
    pass("repeat booking did not mutate Service", `price=${svcAfter.price} name="${svcAfter.name}"`);
  } else {
    fail("repeat booking did not mutate Service", `price=${svcAfter?.price} name="${svcAfter?.name}"`);
  }

  // ── 4. Authenticated callback moves payment + appointment ─────────────────
  section("Authenticated callback applies the status");

  const good = await fetch(`${BASE_URL}/api/payments/mtn/callback?token=${encodeURIComponent(TOKEN)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      externalId: payment.referenceId,
      status: "SUCCESSFUL",
      amount: "12.50",
      currency: "EUR",
      financialTransactionId: "TEST-TXN-1",
      payer: { partyIdType: "MSISDN", partyId: "233598592252" },
    }),
  });
  if (good.status === 200) pass("valid token → 200");
  else fail("valid token → 200", `got ${good.status} ${await good.text()}`);

  const [paid] = await sql`SELECT status, "rawCallback" FROM "Payment" WHERE "referenceId" = ${payment.referenceId}`;
  if (paid?.status === "SUCCESSFUL") pass("payment status updated", "SUCCESSFUL");
  else fail("payment status updated", `got ${paid?.status}`);

  if (paid?.rawCallback?.includes("TEST-TXN-1")) pass("raw callback stored", "available for disputes");
  else fail("raw callback stored");

  const [appt] = await sql`SELECT status FROM "Appointment" WHERE id = ${appointmentId}`;
  if (appt?.status === "CONFIRMED") pass("appointment confirmed by payment", "CONFIRMED");
  else fail("appointment confirmed by payment", `got ${appt?.status}`);

  // ── 5. Idempotency — MTN retries until it gets a 200 ──────────────────────
  section("Replayed callback is idempotent");

  const replay = await fetch(`${BASE_URL}/api/payments/mtn/callback?token=${encodeURIComponent(TOKEN)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ externalId: payment.referenceId, status: "SUCCESSFUL" }),
  });
  const [count] = await sql`SELECT count(*)::int AS n FROM "Payment" WHERE "referenceId" = ${payment.referenceId}`;

  if (replay.status === 200 && count.n === 1) pass("replay left exactly one row", "no duplicate on retry");
  else fail("replay left exactly one row", `HTTP ${replay.status}, ${count.n} rows`);

  // ── 5b. Polling alone confirms a booking, with no callback at all ─────────
  // This is the path the booking modal uses. MTN's callback only fires against
  // a registered production URL, so without this a booking would sit PENDING
  // forever even after the customer paid.
  section("Status polling reconciles without a callback");

  const poll = await fetch(`${BASE_URL}/api/payments/mtn/request-to-pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: "233598592252",
      customerName: "Polling Test",
      serviceId: "spa-skin",
      selectedServices: ["Glow Facial"],
    }),
  });
  const pollPayment = await poll.json();
  createdRefs.push(pollPayment.referenceId);

  const pollEmail = `poll-${pollPayment.referenceId.slice(0, 8)}@example.test`;
  createdEmails.push(pollEmail);

  const pollBooking = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: "Polling Test",
      email: pollEmail,
      phone: "233598592252",
      serviceId: "spa-skin",
      serviceName: "SPA & Skin Rejuvenation",
      category: "Test",
      selectedServices: "Glow Facial",
      date: "2026-09-03",
      time: "12:00",
      paymentReferenceId: pollPayment.referenceId,
    }),
  });
  const pollApptId = (await pollBooking.json()).booking?.id;

  const [beforePoll] = await sql`SELECT status FROM "Payment" WHERE "referenceId" = ${pollPayment.referenceId}`;
  if (beforePoll?.status === "PENDING") pass("payment starts PENDING", "nothing has confirmed it yet");
  else fail("payment starts PENDING", `got ${beforePoll?.status}`);

  // Exactly what the browser does after the prompt is sent: poll until the
  // payment settles. MTN's sandbox briefly answers 404 RESOURCE_NOT_FOUND for a
  // reference it has just accepted, which surfaces as a 503 here — the client
  // loop keeps waiting rather than treating it as failure, so this does too.
  let statusBody = {};
  for (let attempt = 0; attempt < 10; attempt++) {
    const statusRes = await fetch(`${BASE_URL}/api/payments/mtn/status/${pollPayment.referenceId}`);
    if (statusRes.ok) {
      statusBody = await statusRes.json();
      if (statusBody.status === "SUCCESSFUL" || statusBody.status === "FAILED") break;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  const [afterPoll] = await sql`SELECT status FROM "Payment" WHERE "referenceId" = ${pollPayment.referenceId}`;
  const [afterAppt] = await sql`SELECT status FROM "Appointment" WHERE id = ${pollApptId}`;

  if (afterPoll?.status === statusBody.status && afterPoll?.status === "SUCCESSFUL") {
    pass("polling wrote status through to Payment", `PENDING -> ${afterPoll.status}`);
  } else {
    fail("polling wrote status through to Payment", `payment=${afterPoll?.status} api=${statusBody.status}`);
  }

  if (afterAppt?.status === "CONFIRMED") {
    pass("polling confirmed the appointment", "no callback was involved");
  } else {
    fail("polling confirmed the appointment", `got ${afterAppt?.status}`);
  }

  // ── 6. Unknown reference is acknowledged, not retried forever ─────────────
  section("Unknown reference is acknowledged");

  const unknown = await fetch(`${BASE_URL}/api/payments/mtn/callback?token=${encodeURIComponent(TOKEN)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ externalId: "not-a-real-reference", status: "SUCCESSFUL" }),
  });
  const unknownBody = await unknown.json();
  if (unknown.status === 200 && unknownBody.status === "ignored") {
    pass("unknown reference → 200 ignored", "MTN stops retrying an unusable payload");
  } else {
    fail("unknown reference → 200 ignored", `HTTP ${unknown.status} ${JSON.stringify(unknownBody)}`);
  }
} catch (err) {
  fail("suite aborted", err.message);
} finally {
  // Leave the database as we found it. Order matters: Appointment.userId and
  // .serviceId are ON DELETE restrict, so children go before parents.
  for (const ref of createdRefs) {
    await sql`DELETE FROM "Payment" WHERE "referenceId" = ${ref}`;
  }
  for (const email of createdEmails) {
    const [u] = await sql`SELECT id FROM "User" WHERE email = ${email}`;
    if (u) {
      await sql`DELETE FROM "Appointment" WHERE "userId" = ${u.id}`;
      await sql`DELETE FROM "User" WHERE id = ${u.id}`;
    }
  }
  // Only removable if no other appointment references it; ignore if in use.
  for (const serviceId of ["nail-care", "spa-skin"]) {
    try {
      await sql`DELETE FROM "Service" WHERE id = ${serviceId}`;
    } catch {
      console.log(`Left Service '${serviceId}' in place — referenced by other rows.`);
    }
  }
  console.log("\nCleaned up test rows.");

  console.log(`\n\x1b[32mPASSED: ${passed}\x1b[0m   ${failed ? "\x1b[31m" : "\x1b[32m"}FAILED: ${failed}\x1b[0m`);
  await sql.end();
  if (failed > 0) process.exit(1);
}
