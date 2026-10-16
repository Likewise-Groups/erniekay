-- Everything the admin application needs that the public app never required.
--
-- Three things, in dependency order:
--   1. SiteMedia   — makes the pictures on the public site editable
--   2. AdminAudit  — records who changed what, since staff now mutate live data
--   3. Indexes     — the admin lists sort by createdAt and filter by status,
--                    which the public app never did
--
-- Row level security is left exactly as the surrounding tables have it: these
-- tables are reached only through the server (service credentials), never from
-- a browser with an anon key.

-- ── 1. SiteMedia ──────────────────────────────────────────────────────────
--
-- Slot-keyed rather than a free gallery. Every picture on the public site sits
-- in a fixed, named position in the layout ("the hero video on the hair
-- section"), and staff replace what is in that position — they do not
-- restructure the page. The slot ids and their built-in defaults live in
-- lib/mediaSlots.ts; a missing row simply means "still showing the default",
-- which is why this table starts empty and no seed is needed.
--
-- "url" holds an absolute Supabase Storage URL for uploaded media and a
-- /public path for anything still on the default. Both are rendered the same.
CREATE TABLE IF NOT EXISTS "SiteMedia" (
  "id"          text PRIMARY KEY,
  "slot"        text NOT NULL,
  "url"         text NOT NULL,
  -- "image" | "video". Kept per row because a slot can legitimately switch:
  -- the hair hero is a video today and could become a still tomorrow.
  "kind"        text NOT NULL DEFAULT 'image',
  "alt"         text,
  -- Storage object path, so replacing media can delete what it superseded.
  -- Null for rows that only point at a /public default or an external URL.
  "storagePath" text,
  "updatedBy"   text,
  "createdAt"   timestamp(3) NOT NULL DEFAULT now(),
  "updatedAt"   timestamp(3) NOT NULL DEFAULT now()
);
--> statement-breakpoint
-- One row per slot: the admin upserts on this, so replacing a picture can never
-- leave two rows fighting over the same position.
CREATE UNIQUE INDEX IF NOT EXISTS "SiteMedia_slot_key" ON "SiteMedia" ("slot");
--> statement-breakpoint

-- ── 2. AdminAudit ─────────────────────────────────────────────────────────
--
-- Staff can now confirm bookings and attach payments by hand. Both change what
-- the business believes it was paid, so each write records who did it. Kept
-- deliberately generic (entity + action + detail) rather than one table per
-- action — the value is the trail, not queryability.
CREATE TABLE IF NOT EXISTS "AdminAudit" (
  "id"        text PRIMARY KEY,
  -- The User.id of the admin. Not a foreign key: deleting a staff account must
  -- not delete the record of what they did.
  "actorId"   text,
  "actorEmail" text NOT NULL,
  -- "appointment" | "payment" | "media" | "admission" | "auth"
  "entity"    text NOT NULL,
  "entityId"  text,
  "action"    text NOT NULL,
  -- Human-readable summary, e.g. "PENDING -> CONFIRMED".
  "detail"    text,
  "createdAt" timestamp(3) NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "AdminAudit_createdAt_idx" ON "AdminAudit" ("createdAt" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "AdminAudit_entity_entityId_idx" ON "AdminAudit" ("entity", "entityId");
--> statement-breakpoint

-- ── 3. Admin read paths ───────────────────────────────────────────────────
--
-- The public app only ever inserted. Every admin list is "most recent first,
-- optionally filtered by status", which is a sequential scan without these.
CREATE INDEX IF NOT EXISTS "Appointment_createdAt_idx" ON "Appointment" ("createdAt" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Appointment_status_appointmentDate_idx"
  ON "Appointment" ("status", "appointmentDate");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Payment_status_createdAt_idx" ON "Payment" ("status", "createdAt" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "BridalInquiry_createdAt_idx" ON "BridalInquiry" ("createdAt" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "AdmissionsApplication_status_createdAt_idx"
  ON "AdmissionsApplication" ("status", "createdAt" DESC);
--> statement-breakpoint
-- Sign-in looks a user up by email and then checks the role. The email unique
-- index already covers the lookup; this covers "list every admin".
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User" ("role");
