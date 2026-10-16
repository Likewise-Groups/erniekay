"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { recordAudit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import { admissionsApplications, getDb } from "@/lib/db";
import { isAdmissionStatus } from "@/lib/status";

/**
 * Moves an academy application through review.
 *
 * The public app only ever writes "Submitted"; Reviewing / Accepted / Rejected
 * are decisions a person makes, and this is the only place they are made. Each
 * one is audited — an applicant who is told they were rejected will ask who
 * decided and when.
 */
export async function updateAdmissionStatus(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const returnQuery = String(formData.get("returnQuery") ?? "");

  const back = (notice: string): never => {
    revalidatePath("/admissions");
    const separator = returnQuery ? "&" : "";
    redirect(`/admissions?${returnQuery}${separator}notice=${notice}`);
  };

  if (!id || !isAdmissionStatus(status)) back("invalid");

  const db = getDb();
  const [before] = await db
    .select({
      status: admissionsApplications.status,
      firstName: admissionsApplications.firstName,
      lastName: admissionsApplications.lastName,
      email: admissionsApplications.email,
    })
    .from(admissionsApplications)
    .where(eq(admissionsApplications.id, id))
    .limit(1);

  if (!before) back("missing");
  if (before.status === status) back("unchanged");

  await db
    .update(admissionsApplications)
    .set({ status, updatedAt: new Date() })
    .where(eq(admissionsApplications.id, id));

  await recordAudit(admin, {
    entity: "admission",
    entityId: id,
    action: "status changed",
    detail: `${before.status} -> ${status} (${before.firstName} ${before.lastName}, ${before.email})`,
  });

  back("updated");
}
