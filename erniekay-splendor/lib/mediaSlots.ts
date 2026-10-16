/**
 * Every picture on the public site that staff are allowed to replace.
 *
 * ── Why slots rather than a media library ────────────────────────────────────
 * Each image and video on this site sits in a fixed position in a hand-built
 * layout: a 16/9 hero video, a square collage tile, a 4/5 package card. The
 * layouts are not generic grids, so "upload a photo" is not a meaningful action
 * on its own — the meaningful action is "replace the photo that is in *this*
 * position". A slot is that position: a stable id, the aspect the layout gives
 * it, and the file currently hard-coded there.
 *
 * ── Why the defaults live here ──────────────────────────────────────────────
 * `defaultUrl` is the /public path the component shipped with. A slot with no
 * SiteMedia row renders its default, so the site looks identical before anyone
 * touches the admin, and "reset to original" is just deleting a row. This also
 * means adding a new editable picture is a two-line change here plus one
 * `mediaSrc()` call in the component.
 *
 * ── Server-safe ─────────────────────────────────────────────────────────────
 * No React, no imports, no environment access — this file is imported by client
 * components, server components and the separate admin application alike.
 *
 * ── Canonical copy ──────────────────────────────────────────────────────────
 * This file is the original. `erniekay-admin/lib/mediaSlots.ts` is a verbatim
 * copy, checked by `npm run check:shared` in that project. Edit this one.
 */

export type MediaKind = "image" | "video";

export type MediaSlot = {
  /** Stored in SiteMedia.slot. Never change one — a rename orphans its row. */
  id: string;
  /** Grouping heading in the admin. Order comes from MEDIA_GROUPS. */
  group: string;
  label: string;
  /** What the layout renders by default. A row may override it. */
  kind: MediaKind;
  /** The hard-coded /public path this slot shipped with. */
  defaultUrl: string;
  defaultAlt?: string;
  /** CSS aspect-ratio the layout gives this slot, e.g. "4 / 5". */
  aspect?: string;
  /** Shown under the label in the admin, for anything non-obvious. */
  note?: string;
};

export const MEDIA_GROUPS = [
  "Home — Hero collage",
  "Salon — Hair",
  "Salon — Nails",
  "Salon — Skin & SPA",
  "Salon — Makeup",
  "Bridal — Showreel",
  "Bridal — Makeup packages",
  "Bridal — Hair packages",
  "About",
  "Academy",
  "Gallery — Makeup",
  "Gallery — Bridal",
  "Gallery — Salon",
] as const;

export type MediaGroup = (typeof MEDIA_GROUPS)[number];

export const MEDIA_SLOTS: MediaSlot[] = [
  // ── Home hero ─────────────────────────────────────────────────────────────
  // Three staggered columns of three. Positions read down each column, so
  // slot 1-3 is the left column, 4-6 the middle, 7-9 the right.
  { id: "home.hero.1", group: "Home — Hero collage", label: "Column 1 · top", kind: "image", defaultUrl: "/makeup.jpg", aspect: "3 / 4" },
  { id: "home.hero.2", group: "Home — Hero collage", label: "Column 1 · middle", kind: "image", defaultUrl: "/makeup2.jpg", aspect: "3 / 4" },
  { id: "home.hero.3", group: "Home — Hero collage", label: "Column 1 · bottom", kind: "image", defaultUrl: "/hair3.jpg", aspect: "3 / 4" },
  { id: "home.hero.4", group: "Home — Hero collage", label: "Column 2 · top", kind: "image", defaultUrl: "/MAKEUP10.jpg", aspect: "3 / 4" },
  { id: "home.hero.5", group: "Home — Hero collage", label: "Column 2 · middle", kind: "image", defaultUrl: "/facial.jpg", aspect: "3 / 4" },
  { id: "home.hero.6", group: "Home — Hero collage", label: "Column 2 · bottom", kind: "image", defaultUrl: "/hair4.jpg", aspect: "3 / 4" },
  { id: "home.hero.7", group: "Home — Hero collage", label: "Column 3 · top", kind: "image", defaultUrl: "/makeup6.jpg", aspect: "3 / 4" },
  { id: "home.hero.8", group: "Home — Hero collage", label: "Column 3 · middle", kind: "image", defaultUrl: "/face-1.jpg", aspect: "3 / 4" },
  { id: "home.hero.9", group: "Home — Hero collage", label: "Column 3 · bottom", kind: "image", defaultUrl: "/hair2.jpg", aspect: "3 / 4" },

  // ── Salon: Hair ───────────────────────────────────────────────────────────
  {
    id: "salon.hair.featured",
    group: "Salon — Hair",
    label: "Featured card (mobile)",
    kind: "video",
    defaultUrl: "/hair.MOV",
    aspect: "4 / 5",
    note: "Autoplays muted. Behind the “Editor's Choice · Custom Wigging” caption.",
  },
  {
    id: "salon.hair.showcase",
    group: "Salon — Hair",
    label: "Showcase tile (desktop bento)",
    kind: "video",
    defaultUrl: "/hair.MOV",
    aspect: "1 / 2",
    note: "Rendered at 40% opacity behind text — pick something with a calm centre.",
  },

  // ── Salon: Nails ──────────────────────────────────────────────────────────
  { id: "salon.nails.1", group: "Salon — Nails", label: "Collage · left top", kind: "video", defaultUrl: "/nail service.mp4", aspect: "4 / 5" },
  { id: "salon.nails.2", group: "Salon — Nails", label: "Collage · left bottom", kind: "video", defaultUrl: "/nail service 2.mp4", aspect: "1 / 1" },
  { id: "salon.nails.3", group: "Salon — Nails", label: "Collage · right top", kind: "video", defaultUrl: "/nail service 3.mp4", aspect: "1 / 1" },
  { id: "salon.nails.4", group: "Salon — Nails", label: "Collage · right bottom", kind: "video", defaultUrl: "/nail service 5.mp4", aspect: "4 / 5" },

  // ── Salon: Skin ───────────────────────────────────────────────────────────
  {
    id: "salon.skin.hero",
    group: "Salon — Skin & SPA",
    label: "Section hero",
    kind: "image",
    defaultUrl: "/facial.jpg",
    defaultAlt: "A serene spa environment focusing on SPA",
    aspect: "3 / 4",
    note: "A caption card overlaps the bottom third — keep the subject high in frame.",
  },

  // ── Salon: Makeup ─────────────────────────────────────────────────────────
  { id: "salon.makeup.primary", group: "Salon — Makeup", label: "Main video", kind: "video", defaultUrl: "/makeupv.mp4", aspect: "16 / 9" },
  {
    id: "salon.makeup.primary-poster",
    group: "Salon — Makeup",
    label: "Main video · poster frame",
    kind: "image",
    defaultUrl: "/makeup.jpg",
    aspect: "16 / 9",
    note: "Shown while the video loads. Should match the first frame.",
  },
  { id: "salon.makeup.secondary", group: "Salon — Makeup", label: "Secondary video", kind: "video", defaultUrl: "/makeupv1.mp4", aspect: "1 / 1" },
  { id: "salon.makeup.secondary-poster", group: "Salon — Makeup", label: "Secondary video · poster frame", kind: "image", defaultUrl: "/makeup2.jpg", aspect: "1 / 1" },
  {
    id: "salon.makeup.tile",
    group: "Salon — Makeup",
    label: "Image tile",
    kind: "image",
    defaultUrl: "/makeup5.jpg",
    defaultAlt: "Traditional bridal makeup",
    aspect: "1 / 1",
  },

  // ── Bridal: showreel ──────────────────────────────────────────────────────
  { id: "bridal.showreel.primary", group: "Bridal — Showreel", label: "Large video", kind: "video", defaultUrl: "/obremsmakeover_19-Jun-2026.mp4", aspect: "3 / 4" },
  { id: "bridal.showreel.primary-poster", group: "Bridal — Showreel", label: "Large video · poster frame", kind: "image", defaultUrl: "/makeup4.jpg", aspect: "3 / 4" },
  { id: "bridal.showreel.secondary", group: "Bridal — Showreel", label: "Overlapping video", kind: "video", defaultUrl: "/hair.MOV", aspect: "1 / 1" },
  { id: "bridal.showreel.secondary-poster", group: "Bridal — Showreel", label: "Overlapping video · poster frame", kind: "image", defaultUrl: "/hair1.jpg", aspect: "1 / 1" },

  // ── Bridal: package cards ─────────────────────────────────────────────────
  // Slot ids carry the package id from BridalPackages.tsx, so a card and its
  // picture stay associated even if the cards are reordered.
  { id: "bridal.package.mk-trial", group: "Bridal — Makeup packages", label: "Trial", kind: "image", defaultUrl: "/makeup.jpg", aspect: "4 / 5" },
  { id: "bridal.package.mk-bronze", group: "Bridal — Makeup packages", label: "Bronze Package", kind: "image", defaultUrl: "/makeup7.jpg", aspect: "4 / 5" },
  { id: "bridal.package.mk-gold", group: "Bridal — Makeup packages", label: "Gold Package", kind: "image", defaultUrl: "/hair1.jpg", aspect: "4 / 5" },
  { id: "bridal.package.mk-platinum", group: "Bridal — Makeup packages", label: "Platinum Package", kind: "image", defaultUrl: "/MAKEUP9.jpg", aspect: "4 / 5" },
  { id: "bridal.package.mk-premium", group: "Bridal — Makeup packages", label: "Premium Package", kind: "image", defaultUrl: "/MAKEUP10.jpg", aspect: "4 / 5" },
  { id: "bridal.package.mk-splendor-experience", group: "Bridal — Makeup packages", label: "The Splendor Premium Experience", kind: "image", defaultUrl: "/makeup4.jpg", aspect: "4 / 5" },
  { id: "bridal.package.mk-luxury-touch", group: "Bridal — Makeup packages", label: "Luxury Touch", kind: "image", defaultUrl: "/makeup5.jpg", aspect: "4 / 5" },

  { id: "bridal.package.hr-bronze", group: "Bridal — Hair packages", label: "Bronze Package", kind: "image", defaultUrl: "/hair.jpg", aspect: "4 / 5" },
  { id: "bridal.package.hr-silver", group: "Bridal — Hair packages", label: "Silver Package", kind: "image", defaultUrl: "/hair2.jpg", aspect: "4 / 5" },
  { id: "bridal.package.hr-gold", group: "Bridal — Hair packages", label: "Gold Package", kind: "image", defaultUrl: "/hair3.jpg", aspect: "4 / 5" },
  { id: "bridal.package.hr-diamond", group: "Bridal — Hair packages", label: "Diamond Package", kind: "image", defaultUrl: "/hair4.jpg", aspect: "4 / 5" },
  { id: "bridal.package.hr-premium", group: "Bridal — Hair packages", label: "Premium Package", kind: "image", defaultUrl: "/bridal-hair-1.jpg", aspect: "4 / 5" },
  { id: "bridal.package.hr-premium-x", group: "Bridal — Hair packages", label: "Premium X Package", kind: "image", defaultUrl: "/bridal-hair-2.jpg", aspect: "4 / 5" },
  { id: "bridal.package.hr-platinum", group: "Bridal — Hair packages", label: "Platinum Package", kind: "image", defaultUrl: "/bridal-hair-3.jpg", aspect: "4 / 5" },
  { id: "bridal.package.hr-delux", group: "Bridal — Hair packages", label: "De-Lux Package", kind: "image", defaultUrl: "/bridal-hair-4.jpg", aspect: "4 / 5" },
  { id: "bridal.package.hr-desplendor", group: "Bridal — Hair packages", label: "De-Splendor Package", kind: "image", defaultUrl: "/bridal-hair-5.jpg", aspect: "4 / 5" },

  // ── About ─────────────────────────────────────────────────────────────────
  { id: "about.hero", group: "About", label: "Page hero", kind: "image", defaultUrl: "/hero-1.jpg", aspect: "4 / 3" },
  { id: "about.story", group: "About", label: "Brand story portrait", kind: "image", defaultUrl: "/erniekay.jpg", aspect: "3 / 4" },
  { id: "about.team.founder", group: "About", label: "Founder portrait", kind: "image", defaultUrl: "/erniekay1.jpg", aspect: "3 / 4" },

  // ── Academy ───────────────────────────────────────────────────────────────
  //
  // These shipped pointing at lh3.googleusercontent.com stock photographs left
  // over from the design tool the page was built in. They are the only pictures
  // on the site that are not the salon's own work, which makes them the ones
  // most worth being able to replace — and the reason `defaultUrl` here is an
  // absolute URL rather than a /public path.
  {
    id: "academy.hero",
    group: "Academy",
    label: "Page hero background",
    kind: "image",
    defaultUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDC4JazpJCdG1rjirZUUP9lIEbNWP0R2dN9XMVAjXg2aFCmG8US3lA-dKgpPB33DC-w6OJVggHLtQzCj5FO_AzLP0bIFZCwer3Xczt_89VoqNzum9mWKi00safjEmotPOtxSsQUa3hbzHgbGXGTI0lWlzfqpWZ_ekSrT1dsYHarAnfUYI1vd82D3cgwQCmUqJ04CiuWdf9ZFZGyP0BuSnZWnniDvnjxCzucWdLN3QiA-F8wEiCXnNbAtx5E2kDB29kNsQ4ri5xrz54",
    defaultAlt:
      "Professional beauty educator demonstrating makeup technique in a luxury studio",
    aspect: "16 / 9",
    note: "Rendered at 40% opacity behind the headline — avoid busy detail in the left third.",
  },
  {
    id: "academy.course.bridal",
    group: "Academy",
    label: "Course card · Bridal Artistry",
    kind: "image",
    defaultUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBiygL4gzPWGhn4pKtNMf4XV8I8cgk8uF9hXZiQACP8BOs9fEpUGazN-Quos2mNo7vzjqLemek3TII3wCMwV1lZ1uyHYQnBB5A2gp2cAOJM0zg_Z8nxJOJneF5vXbMhWQA2WiU1aBeTfyGhEonWk--FvMSDZ-6j9zdIsppduewJa7lUUSNTqhn6Eiwbm_A1ZWxr2RekUBA8y85zcFSo6ZQIUKmo2izolCIvUxeSbIbQLCcQ7x50GffhzRlLBjzMbE-K_Qdd6Y8sRJY",
    defaultAlt: "Bridal makeup application in progress — editorial, gold-toned shimmer",
    aspect: "4 / 3",
  },
  {
    id: "academy.course.hair",
    group: "Academy",
    label: "Course card · Editorial Hair",
    kind: "image",
    defaultUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDg0WYHqzgcM6lAEAidz7XzIs_rePMeaWrmeb-DpKzAJRvb7cQfQSssXFG-zbnu9NHHuIjzIikw-NdODcxBC-JRB-_0Lk10f1muMiQauxkd9xSTI95sHW8erBHxbg5KdFQz0nbzjO0FU-QImx_L5wTu0UUubZ9HflSgkqWtUTpb2ai-SEQqkXk8E63t5EUkemRiBoDOLYb-wlTM7C2H9TIsIWGnGFrP_oHmamO5Do2-7_geoh1dyr0aftcQaezyb1xf1H8OBdR_3zE",
    defaultAlt: "Architectural editorial hair styling — sleek updo with high-gloss finish",
    aspect: "4 / 3",
  },
  {
    id: "academy.course.skin",
    group: "Academy",
    label: "Course card · Skin Therapy",
    kind: "image",
    defaultUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJxbZaGgIXfLcxHIiBZoe8VwMVcbnSnpbKrrWvBojiouN026ahXMW2Z1-_Hbwtglfuqh3Z2rHd8HhvmX9UDFS_leja1Cq9cMiDS1yC2ziiLGY6oqZER_I4ZEbnyLzXJHco6s8nfn2oZ25Y0IdZuD8vW7qmvW_sNPoT1vL715Hz0DsOCS2TnGQLaqOzvKeQKRf3K8tq1dy0zMjpNpKKsnKbjuK-yGgVLOteLkWnnY_YCe1vz2pxRTGojDYIz-F2n4l2CjgnB6QZCsw",
    defaultAlt: "Clinical skin therapy session — soft clinical lighting with professional equipment",
    aspect: "4 / 3",
  },
  {
    id: "academy.course.bespoke",
    group: "Academy",
    label: "Bespoke training card",
    kind: "image",
    defaultUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6V1KQD6u0Ea4NiHNBxMtBQN1SUZbh4lVBhb4ABC7b43AILy_fZmjYLP1ot4suWzgxZvMAJrovkpnmQYwU5zeUq6-7df6EjXudKifZBebEC2tOIUuHBt3CJxVun6Ak5WcE4mEUpavtO5YmjLZvjgOErIVSFh_efcMNme2-8NCuYxmr6SqY7E2nUc3lOFICWqFgpjWSdXDaA5BWzUfJ4t0if_6v06odGEiTSNbAHB_DiIBRhcGhOgIsgBc4i2h9SSM16UZ6IAPs6ys",
    defaultAlt: "Modern high-end studio workspace with gold laptop and editorial fashion items",
    aspect: "4 / 3",
  },
  {
    id: "academy.learning",
    group: "Academy",
    label: "Learning experience portrait",
    kind: "image",
    defaultUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRCV5VBo3O1x1cLURQDGo0SqTMJV6AlVeD-Q63XeCOf8f4rXek-T3unTmb-e845XNR87deqJ40aVDGgwyIeWK8idNYCsuXhuOqUQK_RFt9undKcDr7kt42HfqbbLylrych3bFHNzfxpvSFusTkj0_mdX17GtEuqGF_CcvSU3GeXZQuR1rkmSzg9oPVE1p1D2hhAkNuWhrYEnHSk3AW8PzaK8cy03b_nlHyn0-3OaIPqhEK2lCfyldEvlRw-ecwmE3Qbu0puM5wHVA",
    defaultAlt:
      "Erniekay Splendor Beauty Academy training studio — rows of vanities with Hollywood mirrors",
    aspect: "4 / 5",
    note: "A gold badge overlaps the bottom-right corner on desktop.",
  },
  {
    id: "academy.testimonial.sarah",
    group: "Academy",
    label: "Graduate portrait · Sarah Jenkins",
    kind: "image",
    defaultUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwBOnjhUF3mODgSjuTaQzYfb4BjzTu4VBF74NInc3nCun2YuPg8APHNUxHGfNjhyrCAu9sHH_6cfppY5PiEEkgrnnO6MxUtDyYj5LgcbhzkcJQ4bHk1BIwPjfMOkF9KXZPa2D9JeYld23xyfufK6srCCld5N2roWpRF8JMGDnKr9mYQRjXQI2aQ1DESZewHo04gEMADMFQgA35w6nPjI1yhVIys2PfTUs9uA6o5pzuzIne_xktEujleSCXlpzD7pID9gePWd5iVwE",
    defaultAlt: "Professional headshot of Sarah Jenkins",
    aspect: "1 / 1",
    note: "Shown as a 48px circle — a tight head-and-shoulders crop is essential.",
  },
  {
    id: "academy.testimonial.amina",
    group: "Academy",
    label: "Graduate portrait · Amina O.",
    kind: "image",
    defaultUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwBOnjhUF3mODgSjuTaQzYfb4BjzTu4VBF74NInc3nCun2YuPg8APHNUxHGfNjhyrCAu9sHH_6cfppY5PiEEkgrnnO6MxUtDyYj5LgcbhzkcJQ4bHk1BIwPjfMOkF9KXZPa2D9JeYld23xyfufK6srCCld5N2roWpRF8JMGDnKr9mYQRjXQI2aQ1DESZewHo04gEMADMFQgA35w6nPjI1yhVIys2PfTUs9uA6o5pzuzIne_xktEujleSCXlpzD7pID9gePWd5iVwE",
    defaultAlt: "Professional headshot of Amina O.",
    aspect: "1 / 1",
    note: "Shown as a 48px circle — a tight head-and-shoulders crop is essential.",
  },

  // ── Gallery ───────────────────────────────────────────────────────────────
  // Slot ids carry the item id from GalleryGrid.tsx.
  { id: "gallery.mk-v1", group: "Gallery — Makeup", label: "The Erniekay Glow", kind: "video", defaultUrl: "/makeupv.mp4", aspect: "3 / 4" },
  { id: "gallery.mk-v2", group: "Gallery — Makeup", label: "Soft Glam in Motion", kind: "video", defaultUrl: "/makeupv1.mp4", aspect: "3 / 4" },
  { id: "gallery.mk-v3", group: "Gallery — Makeup", label: "Obrems Makeover", kind: "video", defaultUrl: "/obremsmakeover_19-Jun-2026.mp4", aspect: "3 / 4" },
  { id: "gallery.mk-1", group: "Gallery — Makeup", label: "Editorial Radiance", kind: "image", defaultUrl: "/makeup.jpg", aspect: "3 / 4" },
  { id: "gallery.mk-2", group: "Gallery — Makeup", label: "Bold & Bronzed", kind: "image", defaultUrl: "/makeup2.jpg", aspect: "1 / 1" },
  { id: "gallery.mk-3", group: "Gallery — Makeup", label: "Full Glam Smile", kind: "image", defaultUrl: "/makeUP3.jpg", aspect: "3 / 4" },
  { id: "gallery.mk-6", group: "Gallery — Makeup", label: "Studio Luxe", kind: "image", defaultUrl: "/makeup6.jpg", aspect: "3 / 4" },
  { id: "gallery.mk-7", group: "Gallery — Makeup", label: "Signature Beat", kind: "image", defaultUrl: "/makeup7.jpg", aspect: "1 / 1" },
  { id: "gallery.mk-8", group: "Gallery — Makeup", label: "Camera Ready", kind: "image", defaultUrl: "/makeup8.jpg", aspect: "3 / 4" },
  { id: "gallery.mk-9", group: "Gallery — Makeup", label: "Couture Finish", kind: "image", defaultUrl: "/MAKEUP9.jpg", aspect: "3 / 4" },
  { id: "gallery.mk-10", group: "Gallery — Makeup", label: "Flawless Base", kind: "image", defaultUrl: "/MAKEUP10.jpg", aspect: "3 / 4" },

  { id: "gallery.br-1", group: "Gallery — Bridal", label: "Bridal Soft Glam", kind: "image", defaultUrl: "/makeup4.jpg", aspect: "3 / 4" },
  { id: "gallery.br-2", group: "Gallery — Bridal", label: "Traditional Splendor", kind: "image", defaultUrl: "/makeup5.jpg", aspect: "3 / 4" },

  { id: "gallery.sl-hair", group: "Gallery — Salon", label: "Hair Artistry", kind: "video", defaultUrl: "/hair.MOV", aspect: "3 / 4" },
  { id: "gallery.sl-n1", group: "Gallery — Salon", label: "Nail Couture", kind: "video", defaultUrl: "/nail%20service.mp4", aspect: "3 / 4" },
  { id: "gallery.sl-n2", group: "Gallery — Salon", label: "Gel Perfection", kind: "video", defaultUrl: "/nail%20service%202.mp4", aspect: "3 / 4" },
  { id: "gallery.sl-n3", group: "Gallery — Salon", label: "Sculpted Tips", kind: "video", defaultUrl: "/nail%20service%203.mp4", aspect: "3 / 4" },
  { id: "gallery.sl-n4", group: "Gallery — Salon", label: "Luxe Manicure", kind: "video", defaultUrl: "/nail%20service%204.mp4", aspect: "3 / 4" },
  { id: "gallery.sl-n5", group: "Gallery — Salon", label: "Polished Finish", kind: "video", defaultUrl: "/nail%20service%205.mp4", aspect: "3 / 4" },
  { id: "gallery.sl-h1", group: "Gallery — Salon", label: "Salon Atelier", kind: "image", defaultUrl: "/hero-1.jpg", aspect: "4 / 3" },
  { id: "gallery.sl-h2", group: "Gallery — Salon", label: "Crowning Glory", kind: "image", defaultUrl: "/hero-2.jpg", aspect: "4 / 3" },
  { id: "gallery.sl-fc", group: "Gallery — Salon", label: "Skin Rejuvenation", kind: "image", defaultUrl: "/facial.jpg", aspect: "4 / 5" },
];

const BY_ID = new Map(MEDIA_SLOTS.map((slot) => [slot.id, slot]));

export const getMediaSlot = (slotId: string): MediaSlot | undefined => BY_ID.get(slotId);

export const slotsInGroup = (group: string): MediaSlot[] =>
  MEDIA_SLOTS.filter((slot) => slot.group === group);

/**
 * What a component actually needs to render one slot.
 *
 * `isOverridden` is what the admin uses to offer "reset to original"; the
 * public components ignore it.
 */
export type ResolvedMedia = {
  slot: string;
  url: string;
  kind: MediaKind;
  alt: string;
  isOverridden: boolean;
};

/** slot id -> the SiteMedia row for it. Built by lib/media.ts. */
export type MediaOverrides = Record<
  string,
  { url: string; kind: string; alt: string | null } | undefined
>;

/**
 * Resolves one slot against the overrides, falling back to the built-in default.
 *
 * Total: an unknown slot id yields a usable (empty) result rather than throwing,
 * because a stale row for a slot that has since been removed from the layout
 * must not take the whole page down.
 */
export function resolveMedia(
  overrides: MediaOverrides | undefined,
  slotId: string,
): ResolvedMedia {
  const slot = BY_ID.get(slotId);
  const override = overrides?.[slotId];

  if (override) {
    return {
      slot: slotId,
      url: override.url,
      kind: override.kind === "video" ? "video" : "image",
      alt: override.alt ?? slot?.defaultAlt ?? slot?.label ?? "",
      isOverridden: true,
    };
  }

  return {
    slot: slotId,
    url: slot?.defaultUrl ?? "",
    kind: slot?.kind ?? "image",
    alt: slot?.defaultAlt ?? slot?.label ?? "",
    isOverridden: false,
  };
}

/** Shorthand for the common case: just the URL. */
export const mediaSrc = (overrides: MediaOverrides | undefined, slotId: string): string =>
  resolveMedia(overrides, slotId).url;
