import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createService, issueReceipt, updateAppointmentStatus } from "./actions";
import { dateTime, getStatusClass, money, parseFeatures, salonUrl, statusOptions } from "./admin-utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [appointments, services, clients, receipts] = await Promise.all([
    prisma.appointment.findMany({
      orderBy: { appointmentDate: "asc" },
      include: { service: true, user: true, receipt: true },
    }),
    prisma.service.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    prisma.user.findMany({
      where: { appointments: { some: {} } },
      orderBy: { createdAt: "desc" },
      include: {
        appointments: { orderBy: { appointmentDate: "desc" }, include: { service: true } },
      },
    }),
    prisma.receipt.findMany({
      orderBy: { issuedAt: "desc" },
      include: { appointment: { include: { service: true, user: true } } },
    }),
  ]);

  const pendingCount = appointments.filter((appointment) => appointment.status === "PENDING").length;
  const confirmedCount = appointments.filter((appointment) => appointment.status === "CONFIRMED").length;
  const completedCount = appointments.filter((appointment) => appointment.status === "COMPLETED").length;
  const totalRevenue = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  const nextBooking = appointments.find((appointment) => appointment.appointmentDate >= new Date());
  const featuredServices = services.slice(0, 5);
  const latestClients = clients.slice(0, 5);
  const latestReceipts = receipts.slice(0, 4);
  const bookingQueue = appointments.slice(0, 8);
  const calendarBookings = appointments.reduce<Record<string, typeof appointments>>((acc, appointment) => {
    const key = appointment.appointmentDate.toISOString().slice(0, 10);
    acc[key] = acc[key] || [];
    acc[key].push(appointment);
    return acc;
  }, {});
  const calendarDays = Object.entries(calendarBookings).sort(([a], [b]) => a.localeCompare(b)).slice(0, 7);

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Admin portal</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Beauty operations dashboard</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">Use the sidebar to open each section on its own page. Manage bookings, services, clients, and receipts with a cleaner, more focused view.</p>
          </div>

          <div className="flex flex-col gap-4 xl:items-end">
            <form action="#" method="get" className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
              <span className="material-symbols-outlined text-slate-500">search</span>
              <input type="search" name="q" placeholder="Search bookings, services, clients" className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500" />
              <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Search</button>
            </form>
            <Link href={salonUrl} className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              <span className="material-symbols-outlined">storefront</span>
              Open salon
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
          {[
            ["Pending approvals", pendingCount, "hourglass_top", "Bookings waiting for action"],
            ["Confirmed", confirmedCount, "verified", "Approved upcoming work"],
            ["Completed", completedCount, "task_alt", "Finished appointments"],
            ["Receipt revenue", money.format(totalRevenue), "payments", "Issued receipt total"],
          ].map(([title, value, icon, subtitle]) => (
            <div key={String(title)} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-50 text-slate-700">
                  <span className="material-symbols-outlined text-[24px]">{icon}</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">{subtitle}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Calendar</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Next scheduled booking</h2>
              </div>
              <span className="material-symbols-outlined text-[24px] text-slate-400">calendar_month</span>
            </div>
            {nextBooking ? (
              <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">{dateTime.format(nextBooking.appointmentDate)}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{nextBooking.service.name}</p>
                <p className="text-sm text-slate-500">{nextBooking.user.firstName} {nextBooking.user.lastName}</p>
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500">No upcoming bookings.</p>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Portal health</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-800 p-4">
                <p className="text-3xl font-semibold">{services.length}</p>
                <p className="mt-2 text-sm text-slate-300">Services</p>
              </div>
              <div className="rounded-3xl bg-slate-800 p-4">
                <p className="text-3xl font-semibold">{appointments.length}</p>
                <p className="mt-2 text-sm text-slate-300">Bookings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Create service</p>
              <p className="mt-1 text-sm text-slate-500">Add a new offering to the salon catalog.</p>
            </div>
            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Admin only</span>
          </div>

          <form action={createService} className="mt-6 grid gap-4">
            <input name="name" required placeholder="Service name" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="category" required placeholder="Category" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
              <input name="imageUrl" type="url" placeholder="Picture URL" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="price" type="number" min="0" step="0.01" placeholder="Price" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
              <input name="durationMinutes" type="number" min="15" step="15" placeholder="Minutes" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
            </div>
            <textarea name="description" rows={4} placeholder="Service description" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
            <textarea name="features" rows={4} placeholder="Features, one per line" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
            <button className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              <span className="material-symbols-outlined">add</span>
              Add service
            </button>
          </form>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Service library</p>
              <p className="mt-1 text-sm text-slate-500">Recent services with photos and feature tags.</p>
            </div>
            <span className="text-sm font-semibold text-slate-500">{services.length} total</span>
          </div>

          <div className="mt-6 space-y-4">
            {featuredServices.length ? (
              featuredServices.map((service) => {
                const features = parseFeatures(service.features).slice(0, 3);
                return (
                  <article key={service.id} className="grid gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[96px_1fr]">
                    <div className="aspect-square overflow-hidden rounded-2xl bg-slate-200">
                      {service.imageUrl ? (
                        <img src={service.imageUrl} alt={service.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">No image</div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{service.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{service.category} / {service.durationMinutes} min</p>
                        </div>
                        <p className="font-semibold text-slate-900">{money.format(service.price)}</p>
                      </div>
                      {service.description && <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>}
                      {features.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {features.map((feature) => (
                            <span key={feature} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="text-sm text-slate-500">No services have been added yet.</p>
            )}
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Booking command center</p>
              <p className="mt-1 text-sm text-slate-500">Approve, complete, cancel, and issue receipts from one queue.</p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">{pendingCount} pending</span>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-[0.16em]">
                <tr>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Schedule</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Receipt</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bookingQueue.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{booking.user.firstName} {booking.user.lastName}</p>
                      <p className="text-slate-500">{booking.user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{booking.service.name}</p>
                      <p className="text-slate-500">{booking.service.category}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{dateTime.format(booking.appointmentDate)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {booking.receipt ? booking.receipt.receiptNumber : "No receipt"}
                    </td>
                    <td className="px-5 py-4 space-y-2">
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
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Client records</p>
              <p className="mt-1 text-sm text-slate-500">Latest active clients and booking counts.</p>
            </div>
            <span className="text-sm font-semibold text-slate-500">{clients.length} total</span>
          </div>
          <div className="mt-6 space-y-4">
            {latestClients.length ? latestClients.map((client) => (
              <div key={client.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{client.firstName} {client.lastName}</p>
                    <p className="text-sm text-slate-500">{client.email}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {client.appointments.length} bookings
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No booking clients yet.</p>
            )}
          </div>
        </section>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">Admin database</p>
        <p className="mt-2 text-sm">This portal uses the shared salon database, so bookings made on the salon site also appear in the admin dashboard.</p>
        <Link href={salonUrl} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline">
          Open salon site
        </Link>
      </section>
    </div>
  );
}
