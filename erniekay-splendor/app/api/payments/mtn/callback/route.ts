import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { appointments, getDb, payments } from "@/lib/db";

/**
 * MTN MoMo webhook callback endpoint.
 *
 * MoMo does not sign its callbacks, so the only thing separating a real MTN
 * request from anyone on the internet is a secret in the URL. The token lives
 * in MTN_MOMO_CALLBACK_TOKEN and must appear as ?token=... on the callback URL
 * registered with MTN (MTN_MOMO_CALLBACK_URL).
 */

/** Length-independent comparison, so a wrong token leaks no timing signal. */
function secretsMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const VALID_STATUSES = new Set(["PENDING", "SUCCESSFUL", "FAILED"]);

export async function POST(req: Request) {
  // Read per call, never at module scope — on Cloudflare Workers process.env is
  // populated per request, so a module-level read runs before the secret exists.
  const expectedToken = process.env.MTN_MOMO_CALLBACK_TOKEN;

  if (!expectedToken) {
    // Refuse rather than fall open. An unauthenticated callback lets anyone
    // mark any booking paid.
    console.error("MTN callback rejected: MTN_MOMO_CALLBACK_TOKEN is not set.");
    return NextResponse.json({ error: "Callback not configured" }, { status: 503 });
  }

  const suppliedToken = new URL(req.url).searchParams.get("token") || "";

  if (!secretsMatch(suppliedToken, expectedToken)) {
    console.warn("MTN callback rejected: bad or missing token.");
    // 404 rather than 401 — an unauthenticated caller learns nothing about
    // whether this path handles payments.
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await req.json();

    // MTN's requesttopay callback mirrors the status response: externalId is
    // the reference we generated, and the field is `status`. `transactionStatus`
    // and `referenceId` are accepted too, since MoMo's docs and portal samples
    // disagree on the spelling across products.
    const referenceId: string | undefined = body.externalId || body.referenceId;
    const rawStatus: string | undefined = body.status || body.transactionStatus;
    const status = String(rawStatus || "").toUpperCase();

    if (!referenceId) {
      console.error("MTN callback missing externalId/referenceId:", JSON.stringify(body));
      // 200 on purpose: the payload is unusable, and MTN retrying it forever
      // changes nothing.
      return NextResponse.json({ status: "ignored", reason: "missing reference" }, { status: 200 });
    }

    if (!VALID_STATUSES.has(status)) {
      console.error(`MTN callback unknown status "${rawStatus}" for ${referenceId}`);
      return NextResponse.json({ status: "ignored", reason: "unknown status" }, { status: 200 });
    }

    const db = getDb();

    // Idempotent by construction: MTN retries until it gets a 200, and replaying
    // the same terminal status just rewrites the same row.
    const [updated] = await db
      .update(payments)
      .set({ status, rawCallback: JSON.stringify(body), updatedAt: new Date() })
      .where(eq(payments.referenceId, referenceId))
      .returning({ id: payments.id, appointmentId: payments.appointmentId });

    if (!updated) {
      // The row is written when request-to-pay is accepted, so a miss means
      // either that insert failed or this is a reference we never issued.
      console.error(`MTN callback for unknown referenceId ${referenceId}`);
      return NextResponse.json({ status: "ignored", reason: "unknown reference" }, { status: 200 });
    }

    // The booking is only confirmed once the money is actually collected.
    if (updated.appointmentId) {
      await db
        .update(appointments)
        .set({
          status: status === "SUCCESSFUL" ? "CONFIRMED" : "PENDING",
          updatedAt: new Date(),
        })
        .where(eq(appointments.id, updated.appointmentId));
    }

    console.log(`MTN callback applied: ${referenceId} -> ${status}`);

    // Acknowledge so MTN stops retrying.
    return NextResponse.json({ status: "received", externalId: referenceId }, { status: 200 });
  } catch (error) {
    console.error(
      "MTN callback error:",
      error instanceof Error ? `${error.name}: ${error.message}\n${error.stack}` : error,
    );

    // 500 so MTN retries — the payment state is genuinely unresolved here.
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
  }
}

/** Unauthenticated liveness probe. Reveals nothing and touches no data. */
export async function GET() {
  return NextResponse.json({
    message: "MTN MoMo callback endpoint is active",
    endpoint: "/api/payments/mtn/callback",
  });
}
