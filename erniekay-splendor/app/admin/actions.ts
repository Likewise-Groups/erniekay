"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDb } from "@/lib/db";
import { appointments, receipts, services } from "@/lib/schema";

const toNumber = (value: FormDataEntryValue | null, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeFeatures = (value: FormDataEntryValue | null) => {
  const features = String(value || "")
    .split(/\r?\n|,/)
    .map((feature) => feature.trim())
    .filter(Boolean);

  return features.length ? JSON.stringify(features) : null;
};

const receiptNumber = () => {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `EK-${stamp}-${suffix}`;
};

export async function createService(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();

  if (!name || !category) return;

  await getDb().insert(services).values({
    name,
    category,
    description: String(formData.get("description") || "").trim() || null,
    imageUrl: String(formData.get("imageUrl") || "").trim() || null,
    features: normalizeFeatures(formData.get("features")),
    durationMinutes: toNumber(formData.get("durationMinutes"), 60),
    price: toNumber(formData.get("price"), 0),
  });

  revalidatePath("/admin");
}

export async function updateAppointmentStatus(formData: FormData) {
  const appointmentId = String(formData.get("appointmentId") || "");
  const status = String(formData.get("status") || "PENDING");

  if (!appointmentId) return;

  await getDb().update(appointments).set({ status }).where(eq(appointments.id, appointmentId));

  revalidatePath("/admin");
}

export async function issueReceipt(formData: FormData) {
  const appointmentId = String(formData.get("appointmentId") || "");

  if (!appointmentId) return;

  const db = getDb();

  const [appointment] = await db
    .select({
      serviceName: services.name,
      servicePrice: services.price,
      existingReceiptId: receipts.id,
    })
    .from(appointments)
    .innerJoin(services, eq(appointments.serviceId, services.id))
    .leftJoin(receipts, eq(receipts.appointmentId, appointments.id))
    .where(eq(appointments.id, appointmentId))
    .limit(1);

  if (!appointment || appointment.existingReceiptId) return;

  await db.insert(receipts).values({
    receiptNumber: receiptNumber(),
    appointmentId,
    amount: appointment.servicePrice,
    currency: "USD",
    notes: `Receipt for ${appointment.serviceName}`,
  });

  revalidatePath("/admin");
}
