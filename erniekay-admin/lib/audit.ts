import { adminAudit, getDb, type DbOrTx } from "./db";
import type { AdminUser } from "./auth";

/**
 * Records a staff action.
 *
 * Every write this application makes to live business data goes through here.
 * Staff can confirm bookings, attach payments to bookings and replace the
 * pictures on the public site — the first two change what the business believes
 * it was paid, and none of them should be anonymous.
 *
 * ── Never throws ────────────────────────────────────────────────────────────
 * A failed audit insert must not roll back the action it describes: refusing to
 * confirm a booking because a log line could not be written is the worse
 * outcome, and the operation the staff member performed has already happened by
 * the time we get here. The failure is logged instead. Where the trail must be
 * atomic with the change, pass the transaction as `db` — then it lives or dies
 * with it.
 */
export type AuditEntity =
  | "appointment"
  | "payment"
  | "media"
  | "admission"
  // The academy prospectus. Kept separate from "admission": one is the
  // programme on offer, the other is somebody applying to it.
  | "course"
  | "bridal"
  | "auth";

export async function recordAudit(
  actor: Pick<AdminUser, "id" | "email"> | { id: null; email: string },
  input: {
    entity: AuditEntity;
    entityId?: string | null;
    action: string;
    detail?: string | null;
  },
  db?: DbOrTx,
): Promise<void> {
  try {
    await (db ?? getDb()).insert(adminAudit).values({
      actorId: actor.id,
      actorEmail: actor.email,
      entity: input.entity,
      entityId: input.entityId ?? null,
      action: input.action,
      detail: input.detail ?? null,
    });
  } catch (error) {
    console.error(
      `Audit write failed (${input.entity}/${input.action}):`,
      error instanceof Error ? `${error.name}: ${error.message}` : error,
    );
  }
}
