"use client";

import Image from "next/image";
import { resolveMedia, type MediaOverrides } from "@/lib/mediaSlots";

type Props = {
  media: MediaOverrides | undefined;
  slot: string;
  /** Applied to whichever element ends up being rendered. */
  className?: string;
  /** Poster slot for video slots. Ignored when the slot resolves to an image. */
  posterSlot?: string;
  /** Overrides the slot's alt text. Decorative media should pass "". */
  alt?: string;
  sizes?: string;
  priority?: boolean;
  /**
   * Skip Next's image optimiser. Needed for any host not listed in
   * next.config.ts `images.remotePatterns`.
   */
  unoptimized?: boolean;
};

/**
 * Renders one editable media slot, as whatever kind it currently holds.
 *
 * The point of this component is that a slot's kind is data, not markup. A
 * layout position that ships as a video can be replaced with a still from the
 * admin, and the reverse — so every call site would otherwise need the same
 * `kind === "video" ? <video> : <Image>` branch. Getting that wrong renders an
 * `<img>` pointing at an .mp4, which shows as a broken image with no error.
 *
 * Videos are always muted, looped and inline: they are decoration inside a
 * layout, and an autoplaying video with sound is blocked by every browser
 * anyway.
 */
export default function SlotMedia({
  media,
  slot,
  className,
  posterSlot,
  alt,
  sizes,
  priority,
  unoptimized = true,
}: Props) {
  const resolved = resolveMedia(media, slot);
  const label = alt ?? resolved.alt;

  if (!resolved.url) return null;

  if (resolved.kind === "video") {
    const poster = posterSlot ? resolveMedia(media, posterSlot).url : undefined;

    return (
      <video
        src={resolved.url}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        // React applies `muted` as a property after the browser has already
        // weighed autoplay against the server HTML, so a muted-only autoplay
        // can be refused and the video sits on a blank first frame. Mute and
        // start it explicitly once it is in the DOM.
        ref={(el) => {
          if (!el) return;
          el.muted = true;
          if (el.paused) el.play().catch(() => {});
        }}
        aria-label={label || undefined}
        className={className}
      />
    );
  }

  return (
    <Image
      src={resolved.url}
      alt={label}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      className={className}
    />
  );
}
