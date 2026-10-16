/**
 * Supabase Storage, over its REST API.
 *
 * No @supabase/supabase-js: this app needs three operations (upload, delete,
 * public URL) against one bucket, and the SDK is a large dependency to carry
 * for that. The REST endpoints are stable and the service-role key is a plain
 * bearer token.
 *
 * ── The key never reaches the browser ───────────────────────────────────────
 * SUPABASE_SERVICE_ROLE_KEY bypasses row level security. Everything here runs
 * server-side (route handlers and server actions); the browser uploads to this
 * app, and this app uploads to Supabase. The bucket is public for reads because
 * the public site links straight at the object URL.
 */

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB — a short 1080p clip.

/** What the bucket accepts, mapped to the extension we store it under. */
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export type UploadKind = "image" | "video";

export function describeType(contentType: string): { kind: UploadKind; extension: string } | null {
  const extension = ALLOWED_TYPES[contentType];
  if (!extension) return null;
  return { kind: contentType.startsWith("video/") ? "video" : "image", extension };
}

export const allowedTypesLabel = (): string =>
  [...new Set(Object.values(ALLOWED_TYPES))].join(", ");

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_MEDIA_BUCKET || "site-media";

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to upload media.",
    );
  }

  return { url: url.replace(/\/+$/, ""), key, bucket };
}

/** True when uploads are configured — the media page degrades rather than 500s. */
export function storageConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Builds the object path for a slot.
 *
 * Slot id first, so everything belonging to one position on the site sorts
 * together in the Supabase dashboard. A random suffix rather than the original
 * filename: two uploads of "IMG_1234.jpg" must not collide, and the CDN caches
 * by URL, so reusing a path would leave the old picture showing.
 */
export function objectPath(slotId: string, extension: string): string {
  const safeSlot = slotId.replace(/[^a-zA-Z0-9._-]/g, "_");
  const stamp = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  return `${safeSlot}/${stamp}.${extension}`;
}

export function publicUrl(path: string): string {
  const { url, bucket } = config();
  // Each segment is encoded separately so slashes survive as path separators.
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${url}/storage/v1/object/public/${bucket}/${encoded}`;
}

export async function uploadObject(
  path: string,
  body: ArrayBuffer,
  contentType: string,
): Promise<string> {
  const { url, key, bucket } = config();

  const response = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": contentType,
      // Uploaded media is immutable — a replacement gets a new path — so it can
      // be cached hard. This is what keeps the public site fast after an edit.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    body,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Supabase Storage upload failed (${response.status}). ${detail.slice(0, 300)}`,
    );
  }

  return publicUrl(path);
}

/**
 * Deletes the object a slot used to point at.
 *
 * Best effort. A failure here leaves an orphaned file costing a few cents of
 * storage; treating it as fatal would instead leave the slot pointing at media
 * the staff member has already replaced in the UI.
 */
export async function deleteObject(path: string | null | undefined): Promise<void> {
  if (!path) return;

  try {
    const { url, key, bucket } = config();
    const response = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${key}` },
    });

    if (!response.ok && response.status !== 404) {
      console.error(`Storage delete failed for ${path}: ${response.status}`);
    }
  } catch (error) {
    console.error(
      `Storage delete failed for ${path}:`,
      error instanceof Error ? `${error.name}: ${error.message}` : error,
    );
  }
}
