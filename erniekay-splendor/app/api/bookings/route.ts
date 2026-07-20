import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    await prisma.service.upsert({
      where: { id: normalizedServiceId },
      update: {
        name: serviceName || selectedServices || normalizedServiceId,
        category: category || "Booking Flow",
        price: normalizedPrice,
      },
      create: {
        id: normalizedServiceId,
        name: serviceName || selectedServices || normalizedServiceId,
        category: category || "Booking Flow",
        durationMinutes: 60,
        price: normalizedPrice,
      },
    });

    const booking = await prisma.appointment.create({
      data: {
        appointmentDate: normalizedDate,
        notes: finalNotes,
        user: {
          connectOrCreate: {
            where: { email },
            create: {
              email,
              firstName,
              lastName,
              phone,
            },
          },
        },
        service: { connect: { id: normalizedServiceId } },
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
