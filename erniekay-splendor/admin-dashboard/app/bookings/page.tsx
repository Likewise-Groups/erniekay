import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { dateTime, getStatusClass, money, statusOptions, salonUrl } from "@/app/admin-utils";
import { issueReceipt, updateAppointmentStatus } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { appointmentDate: "asc" },
    include: { service: true, user: true, receipt: true },
  });

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Bookings</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Manage appointments</h1>
            <p className="mt-2 text-sm text-slate-600">Approve, cancel, and issue receipts on a cleaner page.</p>
          </div>
          <Link href="/" className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white">
            Back to overview
          </Link>
        </div>
      </header>

      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-50 text-sm uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Receipt</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {appointments.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-900">{booking.user.firstName} {booking.user.lastName}</p>
                    <p className="text-sm text-slate-500">{booking.user.email}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-900">{booking.service.name}</p>
                    <p className="text-sm text-slate-500">{booking.service.category}</p>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">{dateTime.format(booking.appointmentDate)}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">
                    {booking.receipt ? money.format(booking.receipt.amount) : "No receipt"}
                  </td>
                  <td className="px-6 py-5 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((status) => (
                        <form key={`${booking.id}-${status}`} action={updateAppointmentStatus}>
                          <input type="hidden" name="appointmentId" value={booking.id} />
                          <input type="hidden" name="status" value={status} />
                          <button className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700 hover:bg-slate-100">
                            {status === "CONFIRMED" ? "Approve" : status.toLowerCase()}
                          </button>
                        </form>
                      ))}
                    </div>
                    {!booking.receipt && (
                      <form action={issueReceipt}>
                        <input type="hidden" name="appointmentId" value={booking.id} />
                        <button className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 hover:bg-emerald-100">
                          Issue receipt
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {appointments.length === 0 && (
          <div className="p-8 text-center text-slate-500">No appointments are available yet.</div>
        )}
      </section>

      <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">Salon link</p>
        <p className="mt-2 text-sm">Your salon website is still available from the sidebar and shared database behind the scenes.</p>
        <a href={salonUrl} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline">
          Open salon site
        </a>
      </div>
    </div>
  );
}
