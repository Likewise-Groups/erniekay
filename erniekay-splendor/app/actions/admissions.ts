"use server";

import { getDb } from "@/lib/db";
import { admissionsApplications } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function submitAdmission(formData: any) {
  try {
    const [application] = await getDb()
      .insert(admissionsApplications)
      .values({
        programId: formData.programId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        status: formData.status || "Submitted",
        experience: formData.experience || null,
        portfolioUrl: formData.portfolioUrl || null,
      })
      .returning();

    revalidatePath("/academy/admissions");
    return { success: true, application };
  } catch (error: any) {
    console.error("Failed to submit admission application:", error);
    return { success: false, error: error.message || "Failed to submit application" };
  }
}
