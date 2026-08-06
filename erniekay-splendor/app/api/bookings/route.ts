import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { appointments, services, users } from "@/lib/schema";

// TEMPORARY: `?debug=<DEBUG_TOKEN>` echoes the failure cause so the Worker's
// error can be read without dashboard access. Remove once the cause is known.
const DEBUG_TOKEN = "dz-9f3a7c";

/** Error summary with any connection-string credentials stripped out. */
function describeError(error: unknown) {
  const redact = (text: string) => text.replace(/postgres(ql)?:\/\/[^\s"']*/gi, "postgres://[redacted]");
  if (!(error instanceof Error)) return { value: redact(String(error)) };
  return {
    name: error.name,
    message: redact(error.message),
    cause: error.cause instanceof Error ? redact(error.cause.message) : undefined,
    stack: redact(error.stack ?? "").split("\n").slice(0, 6).join("\n"),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    databaseUrlHost: process.env.DATABASE_URL
      ? (() => {
          try {
            const u = new URL(process.env.DATABASE_URL!);
            return `${u.hostname}:${u.port}`;
          } catch {
            return "unparseable";
          }
        })()
      : null,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      address,
      notes,
      serviceId,
      serviceName,
      category,
      selectedServices,
      totalPrice,
      date,
      time,
    } = body;

    if (!email || !fullName || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Split full name
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // Format notes to include address if it's a home service
    const finalNotes = [
      address ? `Home Service Address: ${address}` : "",
      selectedServices ? `Requested Services: ${selectedServices}` : "",
      `Client Notes: ${notes || "None"}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    // For the appointment date, create a basic Date object.
    // In a real app, you would parse the specific timezone, but this works for local demo.
    const appointmentDate = new Date(`${date}T${time}`);
    const fallbackAppointmentDate = new Date(`${date} ${time}`);
    const normalizedDate = !isNaN(appointmentDate.getTime())
      ? appointmentDate
      : !isNaN(fallbackAppointmentDate.getTime())
        ? fallbackAppointmentDate
        : new Date();
    const normalizedServiceId = serviceId || "custom-service";
    const normalizedPrice = Number.isFinite(Number(totalPrice)) ? Number(totalPrice) : 0;
    const normalizedServiceName = serviceName || selectedServices || normalizedServiceId;
    const normalizedCategory = category || "Booking Flow";

    // One connection for this request; see getDb().
    const db = getDb();

    await db
      .insert(services)
      .values({
        id: normalizedServiceId,
        name: normalizedServiceName,
        category: normalizedCategory,
        durationMinutes: 60,
        price: normalizedPrice,
      })
      .onConflictDoUpdate({
        target: services.id,
        set: {
          name: normalizedServiceName,
          category: normalizedCategory,
          price: normalizedPrice,
          updatedAt: new Date(),
        },
      });

    // Equivalent of Prisma's connectOrCreate: reuse the existing client if the
    // email is already known, otherwise create them.
    const [createdUser] = await db
      .insert(users)
      .values({ email, firstName, lastName, phone })
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id });

    const userId =
      createdUser?.id ??
      (
        await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, email))
          .limit(1)
      )[0]?.id;

    if (!userId) {
      return NextResponse.json({ error: "Failed to resolve client" }, { status: 500 });
    }

    const [booking] = await db
      .insert(appointments)
      .values({
        appointmentDate: normalizedDate,
        notes: finalNotes,
        userId,
        serviceId: normalizedServiceId,
      })
      .returning();

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    // Logged in full so Worker observability shows the real cause; the client
    // only ever sees the generic message.
    console.error(
      "Booking Error:",
      error instanceof Error ? `${error.name}: ${error.message}\n${error.stack}` : error,
    );

    const debugRequested =
      new URL(req.url).searchParams.get("debug") === DEBUG_TOKEN;

    return NextResponse.json(
      debugRequested
        ? { error: "Failed to create booking", debug: describeError(error) }
        : { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
