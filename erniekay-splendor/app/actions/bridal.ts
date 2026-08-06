"use server";

import { db } from "@/lib/db";
import { bridalInquiries } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function submitBridalInquiry(formData: any) {
  try {
    const [inquiry] = await db
      .insert(bridalInquiries)
      .values({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        socialHandle: formData.socialHandle || null,
        weddingDate: formData.weddingDate,
        venue: formData.venue,
        totalGuests: formData.totalGuests || null,
        bridalPartySize: formData.bridalPartySize || null,
        aesthetic: formData.aesthetic || null,
        selectedServices: formData.selectedServices
          ? JSON.stringify(formData.selectedServices)
          : null,
        package: formData.package || null,
        prepLocation: formData.prepLocation || null,
        extraMakeupCount: formData.extraMakeupCount || null,
        groomService:
          typeof formData.groomService === "boolean" ? formData.groomService : null,
      })
      .returning();

    revalidatePath("/bridal");
    return { success: true, inquiry };
  } catch (error: any) {
    console.error("Failed to submit bridal inquiry:", error);
    return { success: false, error: error.message || "Failed to submit inquiry" };
  }
}
