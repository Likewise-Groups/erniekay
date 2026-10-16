"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { recordAudit } from "@/lib/audit";
import { requireAdmin } from "@/lib/auth";
import { getDb, siteMedia } from "@/lib/db";
import { getMediaSlot } from "@/lib/mediaSlots";
import { deleteObject } from "@/lib/storage";

/**
 * The two media edits that are not an upload.
 *
 * Uploading goes through /api/media/upload — see the note there about body
 * size limits. These two are small form posts, so they stay as server actions.
 */

function back(group: string | undefined, notice: string): never {
  revalidatePath("/media");
  const query = new URLSearchParams({ notice });
  if (group) query.set("group", group);
  redirect(`/media?${query.toString()}`);
}

/**
 * Puts a slot back to the picture the site shipped with.
 *
 * Deleting the row *is* the reset: a slot with no SiteMedia row renders its
 * built-in default (see resolveMedia in lib/mediaSlots.ts). There is nothing to
 * restore and no "original" copy to keep, which is exactly why the defaults
 * live in code rather than in the database.
 */
export async function resetMediaSlot(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const slotId = String(formData.get("slot") ?? "");
  const group = String(formData.get("group") ?? "") || undefined;

  const slot = getMediaSlot(slotId);
  if (!slot) back(group, "unknown-slot");

  const db = getDb();

  const [removed] = await db
    .delete(siteMedia)
    .where(eq(siteMedia.slot, slotId))
    .returning({ storagePath: siteMedia.storagePath });

  if (!removed) back(group, "unchanged");

  // The uploaded object is now unreferenced. Best effort — an orphan costs
  // storage, a failed reset costs the staff member their intent.
  await deleteObject(removed.storagePath);

  await recordAudit(admin, {
    entity: "media",
    entityId: slotId,
    action: "reset to default",
    detail: `${slot.group} · ${slot.label}`,
  });

  back(group, "reset");
}

/**
 * Edits the alt text without re-uploading.
 *
 * Alt text is the one part of a slot a person may well want to fix on its own:
 * it is what a screen reader announces on the public site, and the description
 * typed during a hurried upload is usually the part that was skipped.
 */
export async function updateMediaAlt(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const slotId = String(formData.get("slot") ?? "");
  const group = String(formData.get("group") ?? "") || undefined;
  const alt = String(formData.get("alt") ?? "").trim().slice(0, 300);

  const slot = getMediaSlot(slotId);
  if (!slot) back(group, "unknown-slot");

  const db = getDb();
  const [existing] = await db
    .select({ alt: siteMedia.alt })
    .from(siteMedia)
    .where(eq(siteMedia.slot, slotId))
    .limit(1);

  // No row means the slot is still showing its default, and the default's alt
  // text lives in code. Writing a row here would silently "override" the
  // picture with the same picture, which is a confusing state to leave behind.
  if (!existing) back(group, "no-override");
  if ((existing.alt ?? "") === alt) back(group, "unchanged");

  await db
    .update(siteMedia)
    .set({ alt: alt || null, updatedBy: admin.email, updatedAt: new Date() })
    .where(eq(siteMedia.slot, slotId));

  await recordAudit(admin, {
    entity: "media",
    entityId: slotId,
    action: "alt text edited",
    detail: `${slot.group} · ${slot.label}`,
  });

  back(group, "updated");
}
