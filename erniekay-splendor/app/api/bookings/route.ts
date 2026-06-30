import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, address, notes, serviceId, artistId, date, time } = body;

    if (!email || !fullName || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Split full name
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // Format notes to include address if it's a home service
    const finalNotes = address 
      ? `Home Service Address: ${address}\n\nClient Notes: ${notes || 'None'}`
      : `Client Notes: ${notes || 'None'}`;

    // For the appointment date, create a basic Date object. 
    // In a real app, you would parse the specific timezone, but this works for local demo.
    const appointmentDate = new Date(`${date} ${time}`);

    // Create the booking in the database
    // We use connectOrCreate for the user to avoid duplicates based on email.
    // For the service, since we're using dummy data on the frontend, we use an existing ID or create a placeholder.
    const booking = await prisma.appointment.create({
      data: {
        appointmentDate: isNaN(appointmentDate.getTime()) ? new Date() : appointmentDate,
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
        service: {
          connectOrCreate: {
            where: { id: serviceId || "custom-service" },
            create: {
              id: serviceId || "custom-service",
              name: serviceId || "Custom Service",
              category: "Booking Flow",
              durationMinutes: 60,
              price: 0,
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
