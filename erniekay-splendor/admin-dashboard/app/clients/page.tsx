import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { salonUrl } from "@/app/admin-utils";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.user.findMany({
    where: { appointments: { some: {} } },
    orderBy: { createdAt: "desc" },
    include: { appointments: { orderBy: { appointmentDate: "desc" }, include: { service: true } } },
  });

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Clients</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Client records</h1>
            <p className="mt-2 text-sm text-slate-600">Review client details, appointment history, and contact information.</p>
          </div>
          <Link href="/" className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white">
            Back to overview
          </Link>
        </div>
      </header>

      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-6">
          {clients.length ? (
            clients.map((client) => (
              <div key={client.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{client.firstName} {client.lastName}</p>
                    <p className="text-sm text-slate-500">{client.email}</p>
                    <p className="text-sm text-slate-500">{client.phone || "Phone not provided"}</p>
                  </div>
                  <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                    {client.appointments.length} booking{client.appointments.length === 1 ? "" : "s"}
                  </div>
                </div>
                {client.appointments.length > 0 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {client.appointments.slice(0, 2).map((appointment) => (
                      <div key={appointment.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                        <p className="font-semibold text-slate-900">{appointment.service.name}</p>
                        <p className="text-sm text-slate-500">{appointment.status} • {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No clients with bookings found.</div>
          )}
        </div>
      </section>

      <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">Referral source</p>
        <p className="mt-2 text-sm">This page displays users who have booked services through the shared salon system.</p>
        <a href={salonUrl} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline">
          Open salon site
        </a>
      </div>
    </div>
  );
}
