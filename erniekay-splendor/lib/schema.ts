import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Mirrors the existing Supabase tables exactly (created by the Prisma init
 * migration). Table and column names are quoted PascalCase/camelCase, so every
 * name is spelled out explicitly here — do not rely on casing conventions.
 *
 * `id` and `updatedAt` had no database-level defaults under Prisma (it filled
 * them client-side), so they are filled client-side here too.
 */

const id = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () =>
  timestamp("createdAt", { precision: 3, mode: "date" }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updatedAt", { precision: 3, mode: "date" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date());

export const users = pgTable(
  "User",
  {
    id: id(),
    email: text("email").notNull(),
    passwordHash: text("passwordHash"),
    role: text("role").notNull().default("CLIENT"),
    firstName: text("firstName"),
    lastName: text("lastName"),
    phone: text("phone"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex("User_email_key").on(table.email)],
);

export const services = pgTable("Service", {
  id: id(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  features: text("features"),
  durationMinutes: integer("durationMinutes").notNull(),
  price: doublePrecision("price").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const appointments = pgTable("Appointment", {
  id: id(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  serviceId: text("serviceId")
    .notNull()
    .references(() => services.id),
  appointmentDate: timestamp("appointmentDate", { precision: 3, mode: "date" }).notNull(),
  status: text("status").notNull().default("PENDING"),
  notes: text("notes"),
  // The booking intent. A payment is priced FROM these rather than from a
  // request body — that is what stops a client pairing a cheap payment with an
  // expensive booking. Canonical JSON array; see canonicalSelection().
  selectedServices: text("selectedServices"),
  amountDue: doublePrecision("amountDue").notNull().default(0),
  currency: text("currency").notNull().default("GHS"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const receipts = pgTable(
  "Receipt",
  {
    id: id(),
    receiptNumber: text("receiptNumber").notNull(),
    appointmentId: text("appointmentId")
      .notNull()
      .references(() => appointments.id, { onDelete: "cascade" }),
    amount: doublePrecision("amount").notNull(),
    currency: text("currency").notNull().default("USD"),
    status: text("status").notNull().default("ISSUED"),
    issuedAt: timestamp("issuedAt", { precision: 3, mode: "date" }).notNull().defaultNow(),
    notes: text("notes"),
  },
  (table) => [
    uniqueIndex("Receipt_receiptNumber_key").on(table.receiptNumber),
    uniqueIndex("Receipt_appointmentId_key").on(table.appointmentId),
  ],
);

/**
 * MTN MoMo collection attempts, keyed by the X-Reference-Id we generate.
 *
 * A row is written when the request-to-pay is accepted, before any appointment
 * exists — the customer approves on their phone and MTN calls back
 * independently of whether the booking write succeeded. `appointmentId` is
 * therefore nullable and filled in afterwards, and is what makes "was this
 * booking paid for?" answerable. Previously the reference was only ever
 * concatenated into Appointment.notes, where nothing could query it.
 */
export const payments = pgTable(
  "Payment",
  {
    id: id(),
    // MoMo X-Reference-Id. Unique so the callback can upsert idempotently —
    // MTN retries a callback until it gets a 200.
    referenceId: text("referenceId").notNull(),
    appointmentId: text("appointmentId").references(() => appointments.id, {
      onDelete: "set null",
    }),
    provider: text("provider").notNull().default("MTN_MOMO"),
    amount: doublePrecision("amount").notNull(),
    currency: text("currency").notNull().default("GHS"),
    // PENDING | SUCCESSFUL | FAILED — mirrors MtnPaymentResult["status"].
    status: text("status").notNull().default("PENDING"),
    // "live" | "sandbox". Recorded per row so a sandbox transaction can never
    // be mistaken for a real one when reconciling later.
    mode: text("mode").notNull().default("live"),
    payerPhone: text("payerPhone"),
    customerName: text("customerName"),
    serviceName: text("serviceName"),
    // Last raw payload MTN sent, kept verbatim for dispute resolution.
    rawCallback: text("rawCallback"),
    // Request attribution. Without these there is no way to tie an abusive
    // request to a source, which also makes rate limiting impossible.
    // clientIp is personal data — agree a retention period before launch.
    clientIp: text("clientIp"),
    userAgent: text("userAgent"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex("Payment_referenceId_key").on(table.referenceId)],
);

export const courses = pgTable(
  "Course",
  {
    id: id(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    price: doublePrecision("price").notNull(),
    durationWeeks: integer("durationWeeks").notNull(),
    level: text("level"),
  },
  (table) => [uniqueIndex("Course_slug_key").on(table.slug)],
);

export const enrollments = pgTable("Enrollment", {
  id: id(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  courseId: text("courseId")
    .notNull()
    .references(() => courses.id),
  status: text("status").notNull().default("ACTIVE"),
  enrolledAt: timestamp("enrolledAt", { precision: 3, mode: "date" }).notNull().defaultNow(),
});

export const admissionsApplications = pgTable("AdmissionsApplication", {
  id: id(),
  programId: text("programId")
    .notNull()
    .references(() => courses.id),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  status: text("status").notNull().default("Draft"),
  experience: text("experience"),
  portfolioUrl: text("portfolioUrl"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const bridalInquiries = pgTable("BridalInquiry", {
  id: id(),
  userId: text("userId").references(() => users.id, { onDelete: "set null" }),
  fullName: text("fullName").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  socialHandle: text("socialHandle"),
  weddingDate: text("weddingDate").notNull(),
  venue: text("venue").notNull(),
  totalGuests: text("totalGuests"),
  bridalPartySize: text("bridalPartySize"),
  aesthetic: text("aesthetic"),
  selectedServices: text("selectedServices"),
  package: text("package"),
  prepLocation: text("prepLocation"),
  extraMakeupCount: text("extraMakeupCount"),
  groomService: boolean("groomService"),
  createdAt: createdAt(),
});

export const products = pgTable(
  "Product",
  {
    id: id(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    price: doublePrecision("price").notNull(),
    stock: integer("stock").notNull().default(0),
    imageUrl: text("imageUrl"),
    category: text("category"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex("Product_slug_key").on(table.slug)],
);

export const orders = pgTable("Order", {
  id: id(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  totalAmount: doublePrecision("totalAmount").notNull(),
  status: text("status").notNull().default("PENDING"),
  shippingAddress: text("shippingAddress"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const orderItems = pgTable("OrderItem", {
  id: id(),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("productId")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: doublePrecision("priceAtPurchase").notNull(),
});
