"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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

  await prisma.service.create({
    data: {
      name,
      category,
      description: String(formData.get("description") || "").trim() || null,
      imageUrl: String(formData.get("imageUrl") || "").trim() || null,
      features: normalizeFeatures(formData.get("features")),
      durationMinutes: toNumber(formData.get("durationMinutes"), 60),
      price: toNumber(formData.get("price"), 0),
    },
  });

  revalidatePath("/admin");
}

export async function updateAppointmentStatus(formData: FormData) {
  const appointmentId = String(formData.get("appointmentId") || "");
  const status = String(formData.get("status") || "PENDING");

  if (!appointmentId) return;

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  revalidatePath("/admin");
}

export async function issueReceipt(formData: FormData) {
  const appointmentId = String(formData.get("appointmentId") || "");

  if (!appointmentId) return;

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { service: true, receipt: true },
  });

  if (!appointment || appointment.receipt) return;

  await prisma.receipt.create({
    data: {
      receiptNumber: receiptNumber(),
      appointmentId,
      amount: appointment.service.price,
      currency: "USD",
      notes: `Receipt for ${appointment.service.name}`,
    },
  });

  revalidatePath("/admin");
}
