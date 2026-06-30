"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitAdmission(formData: any) {
  try {
    const application = await prisma.admissionsApplication.create({
      data: {
        programId: formData.programId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        status: formData.status || "Submitted",
        experience: formData.experience || null,
        portfolioUrl: formData.portfolioUrl || null,
      },
    });

    revalidatePath("/academy/admissions");
    return { success: true, application };
  } catch (error: any) {
    console.error("Failed to submit admission application:", error);
    return { success: false, error: error.message || "Failed to submit application" };
  }
}
