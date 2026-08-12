"use server";

import { getDb } from "@/lib/db";
import { bridalInquiries } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export type BridalInquiryInput = Record<string, unknown>;

const text = (value: unknown, max: number): string | null => {
  const trimmed = String(value ?? "").trim();
  return trimmed ? trimmed.slice(0, max) : null;
};

/**
 * Guest/party counts. Stored as text (the columns are `text` in the schema, from
 * the Prisma original) but validated as numbers so the column cannot hold
 * arbitrary strings.
 */
const count = (value: unknown): string | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= 1000 ? String(Math.floor(n)) : null;
};

/**
 * Records a bridal enquiry.
 *
 * This is an enquiry, not a booking — nothing here is priced or charged, so the
 * `package` field is a stated preference rather than a commitment. Inputs are
 * still bounded and typed: a server action is a public endpoint, and the
 * previous `formData: any` wrote every column verbatim with only the database's
 * NOT NULL constraints standing in the way.
 */
export async function submitBridalInquiry(formData: BridalInquiryInput) {
  try {
    const fullName = text(formData.fullName, 150);
    const email = text(formData.email, 254);
    const phone = text(formData.phone, 32);
    const weddingDate = text(formData.weddingDate, 64);
    const venue = text(formData.venue, 300);

    if (!fullName || !email || !phone || !weddingDate || !venue) {
      return { success: false, error: "Missing required enquiry details." };
    }

    const selected = Array.isArray(formData.selectedServices)
      ? formData.selectedServices.map((item) => String(item).slice(0, 200)).slice(0, 50)
      : null;

    const [inquiry] = await getDb()
      .insert(bridalInquiries)
      .values({
        fullName,
        email,
        phone,
        socialHandle: text(formData.socialHandle, 100),
        weddingDate,
        venue,
        totalGuests: count(formData.totalGuests),
        bridalPartySize: count(formData.bridalPartySize),
        aesthetic: text(formData.aesthetic, 500),
        selectedServices: selected ? JSON.stringify(selected) : null,
        package: text(formData.package, 100),
        prepLocation: text(formData.prepLocation, 300),
        extraMakeupCount: count(formData.extraMakeupCount),
        groomService:
          typeof formData.groomService === "boolean" ? formData.groomService : null,
      })
      .returning();

    revalidatePath("/bridal");
    return { success: true, inquiry };
  } catch (error) {
    console.error("Failed to submit bridal inquiry:", error);
    return { success: false, error: "Failed to submit inquiry" };
  }
}
