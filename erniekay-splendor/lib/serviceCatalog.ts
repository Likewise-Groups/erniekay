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
  name: string;
  /** Either a number, or a string like "70-150" / "100+". See parsePrice. */
  price: string | number;
};

export type ServiceCategory = {
  id: string;
  title: string;
  subServices: SubService[];
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
      { name: "Shampooing", price: 200 },
      { name: "Relaxing", price: 350 },
      { name: "Perm Cut Only", price: 350 },
      { name: "Normal Pony", price: 250 },
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
    subServices: [
      { name: "Closure Installation", price: 200 },
      { name: "Frontal Installation", price: 300 },
      { name: "180 Frontal Pony", price: 400 },
      { name: "360 Frontal Pony", price: 600 },
    ],
  },
  {
    id: "styling",
    title: "Styling",
    subServices: [
      { name: "Straightening", price: "70-150" },
      { name: "Curling", price: "80-200" },
      { name: "Pixie Curls", price: 150 },
      { name: "Bridal Inspo", price: "300-1000" },
    ],
  },
  {
    id: "revamp-colouring",
    title: "Revamp / Colouring",
    subServices: [
      { name: "Revamp Only", price: "100-200" },
      { name: "Colouring", price: "400-1000" },
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

const BY_ID = new Map(SERVICE_CATEGORIES.map((category) => [category.id, category]));

export const getCategory = (categoryId: string): ServiceCategory | undefined =>
  BY_ID.get(categoryId);

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

  for (const name of unique) {
    const sub = category.subServices.find((candidate) => candidate.name === name);
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
