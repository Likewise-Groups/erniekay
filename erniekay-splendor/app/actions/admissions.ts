"use server";

import { getDb } from "@/lib/db";
import { admissionsApplications } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export type AdmissionInput = {
  programId?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  experience?: unknown;
  portfolioUrl?: unknown;
};

const text = (value: unknown, max: number): string | null => {
  const trimmed = String(value ?? "").trim();
  return trimmed ? trimmed.slice(0, max) : null;
};

/**
 * Records an admissions application.
 *
 * Server actions are POST-able by anyone who has the action id — they are
 * public endpoints, not internal functions — so every field is treated as
 * untrusted input.
 */
export async function submitAdmission(formData: AdmissionInput) {
  try {
    const firstName = text(formData.firstName, 100);
    const lastName = text(formData.lastName, 100);
    const email = text(formData.email, 254);
    const phone = text(formData.phone, 32);
    const programId = text(formData.programId, 64);

    if (!firstName || !lastName || !email || !phone || !programId) {
      return { success: false, error: "Missing required application details." };
    }

    const [application] = await getDb()
      .insert(admissionsApplications)
      .values({
        programId,
        firstName,
        lastName,
        email,
        phone,
        // Never taken from the request. `status: formData.status || "Submitted"`
        // let an applicant POST "Accepted" and have their own row render as
        // accepted in any admin view. An application's status is a decision the
        // business makes, not an input.
        status: "Submitted",
        experience: text(formData.experience, 2000),
        portfolioUrl: text(formData.portfolioUrl, 500),
      })
      .returning();

    revalidatePath("/academy/admissions");
    return { success: true, application };
  } catch (error) {
    console.error("Failed to submit admission application:", error);
    // The raw message is not returned to the caller: it can leak schema and
    // constraint names.
    return { success: false, error: "Failed to submit application" };
  }
}
