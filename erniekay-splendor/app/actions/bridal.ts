"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitBridalInquiry(formData: any) {
  try {
    const inquiry = await prisma.bridalInquiry.create({
      data: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        socialHandle: formData.socialHandle || null,
        weddingDate: formData.weddingDate,
        venue: formData.venue,
        totalGuests: formData.totalGuests || null,
        bridalPartySize: formData.bridalPartySize || null,
        aesthetic: formData.aesthetic || null,
        selectedServices: formData.selectedServices ? JSON.stringify(formData.selectedServices) : null,
        package: formData.package || null,
      },
    });

    revalidatePath("/bridal");
    return { success: true, inquiry };
  } catch (error: any) {
    console.error("Failed to submit bridal inquiry:", error);
    return { success: false, error: error.message || "Failed to submit inquiry" };
  }
}
