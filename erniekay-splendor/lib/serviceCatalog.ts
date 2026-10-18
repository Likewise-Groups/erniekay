/**
 * The authoritative price list for salon bookings.
 *
 * Server-safe (no "use client", no React) so API routes can price a booking
 * without trusting the browser. Before this existed, /api/payments/mtn/
 * request-to-pay charged whatever `amount` the request body contained and
 * /api/bookings wrote the client's `totalPrice` straight into Service.price,
 * so an unauthenticated POST could both underpay and rewrite the catalogue.
 *
 * Prices come from the section components (HairSection, NailsSection,
 * SkinSection, MakeupSection), which are canonical — Navbar carried a second,
 * drifted copy (Shampooing 120 vs 200, Frontal Sew-In 300 vs 500) and now
 * imports from here instead.
 */

export type SubService = {
  /**
   * Unique within its category — this is the string stored on the booking and
   * looked up by priceSelection, so variants must stay qualified ("Shampooing
   * (Special Product)"). Bare variant names would collide: "Special Product"
   * belongs to both Shampooing and Relaxing.
   */
  name: string;
  /** Either a number, or a string like "70-150" / "100+". See parsePrice. */
  price: string | number;
  /** Sub-category heading. Entries sharing one are rendered under it together. */
  group?: string;
  /** Short display text under a group heading. Falls back to `name`. */
  label?: string;
  /**
   * Priced variants the customer must choose between. When present, the
   * sub-service itself is only a toggle in the UI: the booking carries the
   * chosen tier's `name` instead, and the bare parent name cannot be priced.
   */
  tiers?: SubService[];
  /** Heading over the tier choice, e.g. "Hair length". Defaults to "Choose your <name>". */
  tierTitle?: string;
  /** Unpriced questions asked once this sub-service is selected. */
  questions?: FollowUpQuestion[];
};

/** A one-answer question whose reply is recorded on the booking for the stylist. */
export type FollowUpQuestion = {
  id: string;
  title: string;
  options: { label: string; hint?: string }[];
};

export type ServiceCategory = {
  id: string;
  title: string;
  subServices: SubService[];
  /** Customer-facing caveat shown above the sub-service list when booking. */
  note?: string;
};

/**
 * Reads the chargeable amount out of a price value.
 *
 * Ranges ("70-150") and open-ended prices ("100+") resolve to the LOWER bound,
 * because that is the figure the booking UI has always shown and charged. The
 * balance for these is settled in the salon — do not "fix" this to charge the
 * upper bound without changing what the customer is quoted first.
 */
export const parsePrice = (price: string | number): number => {
  if (typeof price === "number") return price;
  const match = price.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "hair-services",
    title: "Hair Services",
    subServices: [
      { group: "Shampooing", label: "Regular", name: "Shampooing (Regular)", price: 50 },
      { group: "Shampooing", label: "Special Product", name: "Shampooing (Special Product)", price: 180 },
      { group: "Relaxing", label: "Regular Product", name: "Relaxing (Regular Product)", price: 150 },
      { group: "Relaxing", label: "Special Product", name: "Relaxing (Special Product)", price: 350 },
      { group: "Perm Cut Only", label: "Fresh Cut", name: "Perm Cut Only (Fresh Cut)", price: 350 },
      { group: "Perm Cut Only", label: "Cut Only", name: "Perm Cut Only (Cut Only)", price: 150 },
      { group: "Perm Cut Only", label: "Cut and Style", name: "Perm Cut Only (Cut and Style)", price: 250 },
      { group: "Perm Cut Only", label: "Perm and Style", name: "Perm Cut Only (Perm and Style)", price: 350 },
    ],
  },
  {
    id: "sew-in",
    title: "Sew-In",
    subServices: [
      { name: "Traditional Sew-In", price: 300 },
      { name: "Closure Sew-In", price: 400 },
      { name: "Frontal Sew-In", price: 500 },
      { name: "Half-Up Half-Down", price: 400 },
    ],
  },
  {
    id: "installation",
    title: "Installation",
    note:
      "Styling is not included in the installation price. To complete your look, add your preferred option from the Styling section to your booking.",
    subServices: [
      { name: "Closure Installation Only", price: 150 },
      { name: "180 Frontal Installation Only", price: 300 },
      { name: "360 Frontal Installation Only", price: 500 },
      { name: "180 Frontal Pony Only", price: 400 },
      { name: "360 Frontal Pony Only", price: 600 },
    ],
  },
  {
    id: "styling",
    title: "Styling",
    subServices: [
      {
        name: "Straightening",
        price: "70-150",
        tierTitle: "Straightening: hair length",
        tiers: [
          { name: "Straightening (8\"–12\")", label: "8\"–12\"", price: 70 },
          { name: "Straightening (14\"–16\")", label: "14\"–16\"", price: 80 },
          { name: "Straightening (18\"–20\")", label: "18\"–20\"", price: 90 },
          { name: "Straightening (22\"–24\")", label: "22\"–24\"", price: 100 },
          { name: "Straightening (26\"–28\")", label: "26\"–28\"", price: 120 },
          { name: "Straightening (30\"–34\")", label: "30\"–34\"", price: 150 },
        ],
      },
      {
        name: "Curling",
        price: "80-200",
        tierTitle: "Curling: hair length",
        tiers: [
          { name: "Curling (8\"–12\")", label: "8\"–12\"", price: 80 },
          { name: "Curling (14\"–16\")", label: "14\"–16\"", price: 100 },
          { name: "Curling (18\"–20\")", label: "18\"–20\"", price: 120 },
          { name: "Curling (22\"–24\")", label: "22\"–24\"", price: 150 },
          { name: "Curling (26\"–28\")", label: "26\"–28\"", price: 180 },
          { name: "Curling (30\"–34\")", label: "30\"–34\"", price: 200 },
        ],
      },
      { name: "Pixie Curls only", price: 150 },
      { name: "Bridal inspo only", price: "300-1000" },
    ],
  },
  {
    id: "revamp-colouring",
    title: "Revamp / Colouring",
    subServices: [
      { name: "Revamp Only", price: 150 },
      {
        name: "Colouring",
        price: "400-1200",
        tiers: [
          { name: "Colouring (Colours)", label: "Colours", price: "400-1000" },
          { name: "Colouring (Highlights)", label: "Highlights", price: "400-600" },
          { name: "Colouring (Premium)", label: "Premium", price: "600-1200" },
        ],
        questions: [
          {
            id: "colour-service",
            title: "Colour service",
            options: [
              { label: "Full Colour" },
              { label: "Highlights" },
              { label: "Balayage" },
              { label: "Ombre" },
              { label: "Root Colour" },
              { label: "Colour Correction" },
              { label: "Creative/Fashion Colour" },
            ],
          },
          {
            id: "hair-length",
            title: "Hair length",
            options: [
              { label: "Short", hint: "Pixie / above shoulder" },
              { label: "Medium", hint: "Shoulder length" },
              { label: "Long", hint: "Below shoulder" },
              { label: "Extra Long", hint: "Mid-back and below" },
            ],
          },
          {
            id: "hair-volume",
            title: "Hair volume",
            options: [
              { label: "Light" },
              { label: "Medium" },
              { label: "Full/Thick" },
              { label: "Extra Full" },
            ],
          },
          {
            id: "colour-type",
            title: "Colour type",
            options: [
              { label: "Standard Colour" },
              { label: "Premium Colour" },
              { label: "Bleach + Colour" },
              { label: "Special/Creative Colour" },
            ],
          },
        ],
      },
      { name: "Natural Hair", price: "300-500" },
    ],
  },
  {
    id: "custom-wigging",
    title: "Custom Wigging",
    subServices: [
      { name: "Closure (2*6, 4*4)", price: 300 },
      { name: "Closure (5*5, 6*6)", price: 400 },
      { name: "180 Frontal", price: 500 },
      { name: "360 Frontal", price: 700 },
      { name: "Express services (+extra)", price: "200-400" },
      { name: "Pixie wigging (+extra)", price: 150 },
      { name: "Corn-rolls for wigging", price: 80 },
    ],
  },
  {
    id: "nail-care",
    title: "Nail Care & Artistry",
    subServices: [
      { name: "Artisan Manicure", price: "150" },
      { name: "The Splendor Pedicure", price: "200" },
      { name: "Gel Extensions (Full Set)", price: "250" },
      { name: "Editorial Nail Art", price: "100+" },
    ],
  },
  {
    id: "spa-skin",
    title: "SPA & Skin Rejuvenation",
    subServices: [
      { name: "Glow Facial", price: "150" },
      { name: "Dermaplaning Luxe", price: "220" },
      { name: "Red Carpet Peel", price: "275" },
    ],
  },
  {
    id: "professional-makeup",
    title: "Professional Makeup",
    subServices: [
      { name: "Special Occasion Makeup", price: "150" },
      { name: "Editorial / Photoshoot", price: "250" },
      { name: "Makeup Consultation & Class", price: "180" },
    ],
  },
];

/**
 * Canonical form of a selection: NFC-normalised, trimmed, deduplicated, sorted.
 *
 * Used to STORE a selection, never to compare two independently-produced lists.
 * Sorting is by codepoint (the default) rather than localeCompare, which varies
 * by locale and would order the same names differently on different runtimes.
 */
export const canonicalSelection = (names: string[]): string[] =>
  [...new Set(names.map((name) => name.normalize("NFC").trim()).filter(Boolean))].sort();

/**
 * Accepts a selection as either an array or a legacy comma-joined string.
 *
 * Splitting on "," is lossy and must never be used for catalogue lookups: two
 * real sub-service names contain commas ("Closure (2*6, 4*4)", "Closure (5*5,
 * 6*6)"), so a round-trip through join(", ")/split(",") shatters them into
 * fragments that match nothing. The string branch exists only for /booking,
 * which posts non-catalogue service ids and is never priced from the catalogue.
 */
export const asSelectionArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return canonicalSelection(value.map(String));
  if (typeof value === "string" && value.trim()) {
    return canonicalSelection(value.split(",").map((name) => name.trim()));
  }
  return [];
};

export type SubServiceRow =
  | { kind: "heading"; key: string; title: string }
  | { kind: "item"; key: string; label: string; sub: SubService };

/**
 * Flattens a category's sub-services into rows for a list UI, inserting a
 * heading row wherever `group` changes. Walks the array in order rather than
 * bucketing by key, so the catalogue's own ordering is what the UI shows.
 */
export const subServiceRows = (subServices: SubService[]): SubServiceRow[] => {
  const rows: SubServiceRow[] = [];
  let currentGroup: string | undefined;

  for (const sub of subServices) {
    if (sub.group !== currentGroup) {
      currentGroup = sub.group;
      if (sub.group) rows.push({ kind: "heading", key: `group:${sub.group}`, title: sub.group });
    }
    rows.push({ kind: "item", key: sub.name, label: sub.label ?? sub.name, sub });
  }

  return rows;
};

const BY_ID = new Map(SERVICE_CATEGORIES.map((category) => [category.id, category]));

export const getCategory = (categoryId: string): ServiceCategory | undefined =>
  BY_ID.get(categoryId);

/**
 * Like getCategory, but throws on an unknown id.
 *
 * Section components look categories up by a literal id, and the modal must be
 * handed the catalogue object itself — rebuilding a `{ id, title, subServices }`
 * literal at the call site drops every other field (a category's `note`, and
 * whatever is added next) without a type error to catch it.
 */
export const requireCategory = (categoryId: string): ServiceCategory => {
  const category = BY_ID.get(categoryId);
  if (!category) throw new Error(`Unknown service category "${categoryId}".`);
  return category;
};

/** Convenience for components that only need one category's sub-services. */
export const subServicesOf = (categoryId: string): SubService[] =>
  BY_ID.get(categoryId)?.subServices ?? [];

export type PricedSelection = {
  category: ServiceCategory;
  items: { name: string; price: number }[];
  total: number;
};

/**
 * Prices a booking from the catalogue alone.
 *
 * Throws rather than falling back to a client-supplied figure — a booking that
 * cannot be priced server-side must not proceed to payment.
 */
export class UnpriceableSelectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnpriceableSelectionError";
  }
}

export function priceSelection(
  categoryId: string,
  selectedNames: string[],
): PricedSelection {
  const category = getCategory(categoryId);

  if (!category) {
    throw new UnpriceableSelectionError(`Unknown service category "${categoryId}".`);
  }

  if (!selectedNames.length) {
    throw new UnpriceableSelectionError("No services selected.");
  }

  // Deduplicated so a repeated name in the request cannot multiply the total —
  // the UI only ever offers each sub-service once.
  const unique = [...new Set(selectedNames)];
  const items: { name: string; price: number }[] = [];
  const unknown: string[] = [];

  // Tiered sub-services are priced by their tier; the parent alone is not a
  // price, so it is deliberately absent from this list and reads as unknown.
  const priceable = category.subServices.flatMap((sub) => sub.tiers ?? [sub]);

  for (const name of unique) {
    const sub = priceable.find((candidate) => candidate.name === name);
    if (sub) items.push({ name: sub.name, price: parsePrice(sub.price) });
    else unknown.push(name);
  }

  if (unknown.length) {
    throw new UnpriceableSelectionError(
      `Unknown service(s) for ${category.title}: ${unknown.join(", ")}.`,
    );
  }

  return {
    category,
    items,
    total: items.reduce((sum, item) => sum + item.price, 0),
  };
}
