-- Appointment becomes the booking intent: it records what was selected and what
-- is owed, so a payment can be priced from it rather than from a request body.
-- This is what removes the payment-binding bypass, where the client chose which
-- payment covered which booking.
ALTER TABLE "Appointment"
  ADD COLUMN IF NOT EXISTS "selectedServices" text,
  ADD COLUMN IF NOT EXISTS "amountDue" double precision DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS "currency" text DEFAULT 'GHS' NOT NULL;
--> statement-breakpoint
-- Request attribution. Nothing in the system could previously tie an abusive
-- request to a source, which also makes rate limiting impossible.
ALTER TABLE "Payment"
  ADD COLUMN IF NOT EXISTS "clientIp" text,
  ADD COLUMN IF NOT EXISTS "userAgent" text;
--> statement-breakpoint
-- Supports the "is this appointment already paid?" and rate-limit lookups.
-- Deliberately NOT unique: a customer may legitimately retry a failed payment,
-- producing several Payment rows for one appointment.
CREATE INDEX IF NOT EXISTS "Payment_appointmentId_idx" ON "Payment" ("appointmentId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Payment_payerPhone_createdAt_idx" ON "Payment" ("payerPhone", "createdAt");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Payment_clientIp_createdAt_idx" ON "Payment" ("clientIp", "createdAt");
