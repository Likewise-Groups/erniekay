// Smoke test for the Drizzle layer against Supabase. Every write happens inside
// a transaction that is rolled back, so this never persists anything.
//   node --env-file=.env node_modules/tsx/dist/cli.mjs scripts/db-check.mts
import { eq, sql } from "drizzle-orm";

import { db } from "../lib/db";
import {
  admissionsApplications,
  appointments,
  bridalInquiries,
  courses,
  receipts,
  services,
  users,
} from "../lib/schema";

const ok = (label: string, value: unknown) => console.log(`  OK ${label}:`, value);

console.log("Row counts (read-only):");
for (const [name, table] of [
  ["User", users],
  ["Service", services],
  ["Appointment", appointments],
  ["Receipt", receipts],
] as const) {
  const [row] = await db.select({ n: sql<number>`count(*)::int` }).from(table);
  console.log(`  ${name}: ${row.n}`);
}

console.log("\nWrite paths (rolled back):");
try {
  await db.transaction(async (tx) => {
    // app/api/bookings/route.ts - service upsert
    const serviceId = "smoke-test-service";
    await tx
      .insert(services)
      .values({
        id: serviceId,
        name: "Smoke Test",
        category: "Booking Flow",
        durationMinutes: 60,
        price: 120.5,
      })
      .onConflictDoUpdate({
        target: services.id,
        set: { name: "Smoke Test 2", price: 130.5, updatedAt: new Date() },
      });
    const [service] = await tx.select().from(services).where(eq(services.id, serviceId));
    ok("service upsert (createdAt/updatedAt filled)", {
      createdAt: service.createdAt instanceof Date,
      updatedAt: service.updatedAt instanceof Date,
    });

    // app/api/bookings/route.ts - connectOrCreate user
    const email = "smoke-test@example.com";
    const [created] = await tx
      .insert(users)
      .values({ email, firstName: "Smoke", lastName: "Test", phone: "233000000000" })
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id, role: users.role });
    ok("user insert (uuid generated, role default)", created);

    // Re-running must not duplicate - proves the connectOrCreate fallback path.
    const [dupe] = await tx
      .insert(users)
      .values({ email, firstName: "Smoke", lastName: "Test", phone: "233000000000" })
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id });
    const [found] = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    ok("duplicate email falls back to existing row", {
      insertedAgain: dupe ?? null,
      resolvedId: found.id === created!.id,
    });

    // app/api/bookings/route.ts - appointment insert
    const [booking] = await tx
      .insert(appointments)
      .values({
        appointmentDate: new Date("2026-09-01T10:30:00"),
        notes: "smoke test",
        userId: created!.id,
        serviceId,
      })
      .returning();
    ok("appointment insert (status default, date round-trip)", {
      status: booking.status,
      date: booking.appointmentDate.toISOString(),
    });

    // app/admin/actions.ts - updateAppointmentStatus ($onUpdate bumps updatedAt)
    const [updated] = await tx
      .update(appointments)
      .set({ status: "CONFIRMED" })
      .where(eq(appointments.id, booking.id))
      .returning({ status: appointments.status, updatedAt: appointments.updatedAt });
    ok("status update ($onUpdate bumped updatedAt)", {
      status: updated.status,
      bumped: updated.updatedAt > booking.updatedAt,
    });

    // app/admin/actions.ts - issueReceipt join + insert
    const [joined] = await tx
      .select({
        serviceName: services.name,
        servicePrice: services.price,
        existingReceiptId: receipts.id,
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .leftJoin(receipts, eq(receipts.appointmentId, appointments.id))
      .where(eq(appointments.id, booking.id))
      .limit(1);
    ok("issueReceipt join", joined);

    const [receipt] = await tx
      .insert(receipts)
      .values({
        receiptNumber: "EK-SMOKE-0001",
        appointmentId: booking.id,
        amount: joined.servicePrice,
        currency: "USD",
        notes: `Receipt for ${joined.serviceName}`,
      })
      .returning({ id: receipts.id, status: receipts.status, issuedAt: receipts.issuedAt });
    ok("receipt insert (status/issuedAt defaults)", receipt);

    // app/actions/bridal.ts
    const [inquiry] = await tx
      .insert(bridalInquiries)
      .values({
        fullName: "Smoke Test",
        email,
        phone: "233000000000",
        weddingDate: "2026-12-12",
        venue: "Accra",
        selectedServices: JSON.stringify(["Bridal Makeup"]),
        package: "Signature",
        groomService: true,
      })
      .returning({ id: bridalInquiries.id, package: bridalInquiries.package });
    ok("bridal inquiry insert (reserved-word column)", inquiry);

    // app/actions/admissions.ts - needs a Course to satisfy the FK
    const [course] = await tx
      .insert(courses)
      .values({
        title: "Smoke Course",
        slug: `smoke-course-${Math.random().toString(36).slice(2, 8)}`,
        price: 500,
        durationWeeks: 8,
      })
      .returning({ id: courses.id });
    const [application] = await tx
      .insert(admissionsApplications)
      .values({
        programId: course.id,
        firstName: "Smoke",
        lastName: "Test",
        email,
        phone: "233000000000",
        status: "Submitted",
      })
      .returning({ id: admissionsApplications.id, status: admissionsApplications.status });
    ok("admissions insert", application);

    tx.rollback();
  });
} catch (error) {
  if (!(error instanceof Error) || error.constructor.name !== "TransactionRollbackError") {
    throw error;
  }
  console.log("  -> transaction rolled back");
}

const [after] = await db.select({ n: sql<number>`count(*)::int` }).from(users);
console.log(`\nUser rows after rollback: ${after.n} (expected 0)`);

process.exit(0);
