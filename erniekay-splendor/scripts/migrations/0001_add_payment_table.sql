CREATE TABLE "Payment" (
	"id" text PRIMARY KEY NOT NULL,
	"referenceId" text NOT NULL,
	"appointmentId" text,
	"provider" text DEFAULT 'MTN_MOMO' NOT NULL,
	"amount" double precision NOT NULL,
	"currency" text DEFAULT 'GHS' NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"mode" text DEFAULT 'live' NOT NULL,
	"payerPhone" text,
	"customerName" text,
	"serviceName" text,
	"rawCallback" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "public"."Appointment"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "Payment_referenceId_key" ON "Payment" USING btree ("referenceId");
