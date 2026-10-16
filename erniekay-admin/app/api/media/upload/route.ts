import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { recordAudit } from "@/lib/audit";
import { requireAdminApi } from "@/lib/auth";
import { getDb, siteMedia } from "@/lib/db";
import { getMediaSlot } from "@/lib/mediaSlots";
import {
  MAX_UPLOAD_BYTES,
  allowedTypesLabel,
  deleteObject,
  describeType,
  objectPath,
  storageConfigured,
  uploadObject,
} from "@/lib/storage";

/**
 * Replaces the media in one slot.
 *
 * ── Why a route handler and not a server action ─────────────────────────────
 * Server actions cap their request body at 1 MB by default. Raising that limit
 * would apply to every action in the application, and the thing being uploaded
 * here is a video. A route handler has no such cap, and it also lets the
 * browser show real upload progress, which matters when staff are pushing a
 * 20 MB clip over a Ghanaian mobile connection.
 *
 * The service-role key never leaves this process: the browser uploads to us,
 * and we upload to Supabase.
 */

// Uploads stream through this handler; there is nothing here to cache.
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const admin = await requireAdminApi();
  if (admin instanceof Response) return admin;

  if (!storageConfigured()) {
    return Response.json(
      { error: "Uploads are not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Could not read the upload." }, { status: 400 });
  }

  const slotId = String(form.get("slot") ?? "");
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "").trim().slice(0, 300);

  // The slot must be one the layout actually has. Free-text slots would
  // accumulate rows that no page ever reads and that nothing can clean up.
  const slot = getMediaSlot(slotId);
  if (!slot) {
    return Response.json({ error: `Unknown slot "${slotId}".` }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Choose a file to upload." }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json(
      {
        error: `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${
          MAX_UPLOAD_BYTES / 1024 / 1024
        } MB.`,
      },
      { status: 413 },
    );
  }

  // The browser-supplied content type decides both the extension and whether
  // the slot renders as an image or a video, so an unrecognised one is refused
  // rather than guessed at — a file stored with the wrong type renders as a
  // broken image on the public site.
  const described = describeType(file.type);
  if (!described) {
    return Response.json(
      { error: `${file.type || "That file type"} is not allowed. Use: ${allowedTypesLabel()}.` },
      { status: 415 },
    );
  }

  const db = getDb();

  const [existing] = await db
    .select({ storagePath: siteMedia.storagePath, url: siteMedia.url })
    .from(siteMedia)
    .where(eq(siteMedia.slot, slotId))
    .limit(1);

  const path = objectPath(slotId, described.extension);

  let url: string;
  try {
    url = await uploadObject(path, await file.arrayBuffer(), file.type);
  } catch (error) {
    console.error("Media upload failed:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 502 },
    );
  }

  // Upsert on the slot, never insert: SiteMedia has one row per position, and
  // two rows for one slot would leave the public site's lookup picking
  // arbitrarily between them.
  await db
    .insert(siteMedia)
    .values({
      slot: slotId,
      url,
      kind: described.kind,
      alt: alt || slot.defaultAlt || null,
      storagePath: path,
      updatedBy: admin.email,
    })
    .onConflictDoUpdate({
      target: siteMedia.slot,
      set: {
        url,
        kind: described.kind,
        alt: alt || slot.defaultAlt || null,
        storagePath: path,
        updatedBy: admin.email,
        updatedAt: new Date(),
      },
    });

  // Only after the row points at the new object: deleting first would leave the
  // site showing a 404 if the upload then failed.
  await deleteObject(existing?.storagePath);

  await recordAudit(admin, {
    entity: "media",
    entityId: slotId,
    action: "media replaced",
    detail: `${slot.group} · ${slot.label} -> ${described.kind}, ${(file.size / 1024).toFixed(0)} kB`,
  });

  revalidatePath("/media");

  return Response.json({ url, kind: described.kind });
}
