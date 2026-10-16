import { getDb } from "./db";
import { siteMedia } from "./schema";
import type { MediaOverrides } from "./mediaSlots";

/**
 * Reads every media override in one query.
 *
 * Server-only: call it from a page (a Server Component) and pass the result
 * down to the section components as a prop. The sections are "use client" —
 * they render carousels and open the booking modal — so they cannot query the
 * database themselves.
 *
 * One query for the whole page rather than one per slot. The table has at most
 * a few dozen rows (one per slot in MEDIA_SLOTS), so fetching all of it is
 * cheaper than any filtered variant would be.
 *
 * Never throws. A database hiccup must not blank out the home page: the site
 * has always had working hard-coded pictures, and an empty override map means
 * every slot falls back to exactly those. The error is logged so Worker
 * observability still shows it.
 */
export async function getMediaOverrides(): Promise<MediaOverrides> {
  try {
    const db = getDb();
    const rows = await db
      .select({
        slot: siteMedia.slot,
        url: siteMedia.url,
        kind: siteMedia.kind,
        alt: siteMedia.alt,
      })
      .from(siteMedia);

    const overrides: MediaOverrides = {};
    for (const row of rows) {
      // A row with a blank url would render a broken <img>; treat it as absent.
      if (!row.url?.trim()) continue;
      overrides[row.slot] = { url: row.url, kind: row.kind, alt: row.alt };
    }

    return overrides;
  } catch (error) {
    console.error(
      "Site media lookup failed; falling back to built-in defaults:",
      error instanceof Error ? `${error.name}: ${error.message}` : error,
    );
    return {};
  }
}
