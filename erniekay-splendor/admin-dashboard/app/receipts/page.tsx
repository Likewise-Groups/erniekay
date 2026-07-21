import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { dateTime, money, salonUrl } from "@/app/admin-utils";

export const dynamic = "force-dynamic";

export default async function ReceiptsPage() {
  const receipts = await prisma.receipt.findMany({
    orderBy: { issuedAt: "desc" },
    include: { appointment: { include: { service: true, user: true } } },
  });

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Receipts</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Issued receipts</h1>
            <p className="mt-2 text-sm text-slate-600">Track payments and receipt history for completed appointments.</p>
          </div>
          <Link href="/" className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white">
            Back to overview
          </Link>
        </div>
      </header>

      <section className="grid gap-6">
        {receipts.length ? (
          receipts.map((receipt) => (
            <div key={receipt.id} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{receipt.receiptNumber}</p>
                  <p className="text-sm text-slate-500">{receipt.appointment.user.firstName} {receipt.appointment.user.lastName}</p>
                  <p className="text-sm text-slate-500">{receipt.appointment.service.name}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900">{money.format(receipt.amount)}</div>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                  Issued at {dateTime.format(receipt.issuedAt)}
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                  Status {receipt.status}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No receipts have been issued yet.</div>
        )}
      </section>

      <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">Payment tracking</p>
        <p className="mt-2 text-sm">Receipts are generated on bookings after services are completed. Open the salon site to review full appointment details.</p>
        <a href={salonUrl} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline">
          Open salon site
        </a>
      </div>
    </div>
  );
}
