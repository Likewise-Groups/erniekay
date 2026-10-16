import Link from "next/link";

import { Notice, PageHeader } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { getDb, siteMedia } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import {
  MEDIA_GROUPS,
  MEDIA_SLOTS,
  resolveMedia,
  type MediaOverrides,
} from "@/lib/mediaSlots";
import { allowedTypesLabel, MAX_UPLOAD_BYTES, storageConfigured } from "@/lib/storage";

import MediaSlotCard from "./MediaSlotCard";

export const metadata = { title: "Site media · Erniekay Admin" };
export const dynamic = "force-dynamic";

const NOTICES: Record<string, { tone: "success" | "error"; message: string }> = {
  reset: { tone: "success", message: "Slot reset to the original picture." },
  updated: { tone: "success", message: "Saved." },
  unchanged: { tone: "success", message: "Nothing to change." },
  "no-override": {
    tone: "error",
    message: "That slot is still showing its default — upload a picture before editing its description.",
  },
  "unknown-slot": { tone: "error", message: "That slot is not part of the site any more." },
};

/**
 * Every editable picture on the public site, grouped by where it appears.
 *
 * The slot list is the shared contract with erniekay-splendor — the same
 * lib/mediaSlots.ts, copied — so a slot added to a section component shows up
 * here with no work beyond the copy. A slot with no SiteMedia row renders its
 * built-in default and is labelled "Default"; replacing it writes one row, and
 * "Reset" deletes it again.
 *
 * The whole override table is read in one query rather than one per slot:
 * there are at most a few dozen rows, and the page renders all of them.
 */
export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; group?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  const rows = await getDb()
    .select({
      slot: siteMedia.slot,
      url: siteMedia.url,
      kind: siteMedia.kind,
      alt: siteMedia.alt,
      updatedBy: siteMedia.updatedBy,
      updatedAt: siteMedia.updatedAt,
    })
    .from(siteMedia);

  const overrides: MediaOverrides = {};
  const meta = new Map<string, { updatedBy: string | null; updatedAt: Date }>();
  for (const row of rows) {
    if (!row.url?.trim()) continue;
    overrides[row.slot] = { url: row.url, kind: row.kind, alt: row.alt };
    meta.set(row.slot, { updatedBy: row.updatedBy, updatedAt: row.updatedAt });
  }

  const uploadsEnabled = storageConfigured();
  const banner = params.notice ? NOTICES[params.notice] : undefined;
  const customCount = MEDIA_SLOTS.filter((slot) => overrides[slot.id]).length;

  /**
   * Defaults are /public paths belonging to the *public site*, not to this
   * application — "/makeup.jpg" is a file in erniekay-splendor. Previewing one
   * here has to point at that origin or every unreplaced slot renders as a
   * broken image. Uploaded media is already an absolute Supabase URL.
   */
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
  const previewUrl = (url: string) => (url.startsWith("/") ? `${siteUrl}${url}` : url);

  return (
    <>
      <PageHeader
        title="Site media"
        description={`${MEDIA_SLOTS.length} editable positions · ${customCount} replaced · the rest show the original design.`}
      />

      {banner ? <Notice tone={banner.tone}>{banner.message}</Notice> : null}

      {uploadsEnabled ? null : (
        <Notice tone="error">
          Uploads are switched off: <code className="font-mono">SUPABASE_URL</code> and{" "}
          <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> are not set. Existing media
          still renders; nothing can be replaced until they are.
        </Notice>
      )}

      <p className="mb-6 text-xs text-brand-ink/40">
        Up to {MAX_UPLOAD_BYTES / 1024 / 1024} MB per file ({allowedTypesLabel()}). A change is live
        on the public site as soon as it is saved — there is no draft state.
      </p>

      {/* Jump links: the page is long, and staff usually arrive wanting one section. */}
      <nav className="mb-6 flex flex-wrap gap-1.5">
        {MEDIA_GROUPS.map((group) => (
          <Link
            key={group}
            href={`#${encodeURIComponent(group)}`}
            className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-ink/60 ring-1 ring-brand/10 transition-all duration-200 hover:bg-cream hover:text-brand hover:ring-brand/20"
          >
            {group}
          </Link>
        ))}
      </nav>

      <div className="space-y-8">
        {MEDIA_GROUPS.map((group) => {
          const slots = MEDIA_SLOTS.filter((slot) => slot.group === group);
          if (slots.length === 0) return null;

          return (
            <section key={group} id={encodeURIComponent(group)} className="scroll-mt-6">
              <h2 className="mb-4 text-[0.7rem] font-bold uppercase tracking-widest text-brand-ink/40">
                {group}
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {slots.map((slot) => {
                  const info = meta.get(slot.id);
                  const resolved = resolveMedia(overrides, slot.id);

                  return (
                    <MediaSlotCard
                      key={slot.id}
                      slot={slot}
                      resolved={{ ...resolved, url: previewUrl(resolved.url) }}
                      updatedBy={info?.updatedBy}
                      updatedAt={info ? formatDateTime(info.updatedAt) : null}
                      uploadsEnabled={uploadsEnabled}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
