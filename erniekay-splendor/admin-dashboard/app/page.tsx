import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createService, issueReceipt, updateAppointmentStatus } from "./actions";

export const dynamic = "force-dynamic";

const salonUrl = process.env.NEXT_PUBLIC_SALON_APP_URL || "http://localhost:3001";

const money = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
});

const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const dayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const parseFeatures = (features: string | null) => {
  if (!features) return [];

  try {
    const parsed = JSON.parse(features);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return features
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "border-premium-green/25 bg-premium-green/10 text-premium-green";
    case "COMPLETED":
      return "border-royal-navy/20 bg-royal-navy/10 text-royal-navy";
    case "CANCELLED":
      return "border-error/25 bg-error/10 text-error";
    default:
      return "border-champagne-taupe/35 bg-champagne-taupe/10 text-champagne-taupe";
  }
};

const statusOptions = ["CONFIRMED", "COMPLETED", "CANCELLED"];

export default async function AdminDashboard() {
  const [appointments, services, clients, receipts] = await Promise.all([
    prisma.appointment.findMany({
      orderBy: { appointmentDate: "asc" },
      include: {
        service: true,
        user: true,
        receipt: true,
      },
    }),
    prisma.service.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    prisma.user.findMany({
      where: {
        appointments: {
          some: {},
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        appointments: {
          orderBy: { appointmentDate: "desc" },
          include: { service: true },
        },
      },
    }),
    prisma.receipt.findMany({
      orderBy: { issuedAt: "desc" },
      include: {
        appointment: {
          include: {
            service: true,
            user: true,
          },
        },
      },
    }),
  ]);

  const pendingBookings = appointments.filter((booking) => booking.status === "PENDING");
  const approvedBookings = appointments.filter((booking) => booking.status === "CONFIRMED");
  const completedBookings = appointments.filter((booking) => booking.status === "COMPLETED");
  const totalRevenue = receipts.reduce((total, receipt) => total + receipt.amount, 0);
  const nextBooking = appointments.find((booking) => booking.appointmentDate >= new Date());
  const featuredServices = services.slice(0, 5);
  const latestClients = clients.slice(0, 5);
  const latestReceipts = receipts.slice(0, 4);
  const bookingQueue = [...pendingBookings, ...approvedBookings].slice(0, 8);
  const calendarBookings = appointments.reduce<Record<string, typeof appointments>>((acc, booking) => {
    const key = booking.appointmentDate.toISOString().slice(0, 10);
    acc[key] = acc[key] || [];
    acc[key].push(booking);
    return acc;
  }, {});
  const calendarDays = Object.entries(calendarBookings).sort(([a], [b]) => a.localeCompare(b)).slice(0, 7);

  return (
    <main className="min-h-screen bg-[#f3f5f7] text-royal-navy">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-outline-variant bg-royal-navy text-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="flex h-full flex-col px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center bg-majestic-gold text-royal-navy">
                <span className="material-symbols-outlined">admin_panel_settings</span>
              </div>
              <div>
                <p className="font-body-bold text-[15px] leading-5">Erniekay Admin</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">Operations portal</p>
              </div>
            </div>

            <nav className="mt-8 grid gap-1">
              {[
                ["Dashboard", "dashboard", "#overview"],
                ["Bookings", "event_available", "#bookings"],
                ["Calendar", "calendar_month", "#calendar"],
                ["Services", "design_services", "#services"],
                ["Clients", "groups", "#clients"],
                ["Receipts", "receipt_long", "#receipts"],
              ].map(([label, icon, href]) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 px-3 py-3 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  <span className="font-body-bold">{label}</span>
                </a>
              ))}
            </nav>

            <div className="mt-auto border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-majestic-gold">Shared database</p>
              <p className="mt-2 text-sm leading-6 text-white/70">Bookings submitted on the salon site appear here automatically.</p>
              <a
                href={salonUrl}
                className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:text-majestic-gold"
              >
                View salon <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
              </a>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-outline-variant bg-white/95 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-champagne-taupe">Admin portal</p>
                <h1 className="font-headline-md text-[34px] leading-tight md:text-[42px]">Beauty operations dashboard</h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex min-h-11 items-center gap-3 border border-outline-variant bg-surface px-4">
                  <span className="material-symbols-outlined text-[20px] text-warm-slate">search</span>
                  <span className="text-sm text-warm-slate">Search coming next</span>
                </div>
                <a
                  href={salonUrl}
                  className="inline-flex min-h-11 items-center justify-center gap-2 bg-royal-navy px-5 text-[12px] font-bold uppercase tracking-[0.14em] text-white hover:bg-majestic-gold hover:text-royal-navy"
                >
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                  Open salon
                </a>
              </div>
            </div>
          </header>

          <div className="space-y-8 px-5 py-6 md:px-8" id="overview">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Pending approvals", pendingBookings.length, "hourglass_top", "Bookings waiting for action"],
                ["Confirmed", approvedBookings.length, "verified", "Approved upcoming work"],
                ["Completed", completedBookings.length, "task_alt", "Finished appointments"],
                ["Receipt revenue", money.format(totalRevenue), "payments", "Issued receipt total"],
              ].map(([label, value, icon, detail]) => (
                <div key={label} className="border border-outline-variant bg-white p-5 shadow-[0_8px_30px_rgba(17,24,68,0.04)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-warm-slate">{label}</p>
                      <p className="mt-3 font-headline-md text-4xl leading-none">{value}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center bg-majestic-gold/20 text-royal-navy">
                      <span className="material-symbols-outlined text-[22px]">{icon}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-warm-slate">{detail}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
              <div id="bookings" className="border border-outline-variant bg-white shadow-[0_8px_30px_rgba(17,24,68,0.04)]">
                <div className="flex flex-col gap-3 border-b border-outline-variant px-5 py-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="font-headline-md text-headline-md">Booking command center</h2>
                    <p className="text-sm text-warm-slate">Approve, complete, cancel, and issue receipts from one queue.</p>
                  </div>
                  <span className="inline-flex w-fit border border-champagne-taupe/35 bg-champagne-taupe/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-champagne-taupe">
                    {pendingBookings.length} pending
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[940px] border-collapse text-left">
                    <thead className="bg-[#f8f9fb] text-[11px] uppercase tracking-[0.14em] text-warm-slate">
                      <tr>
                        <th className="px-5 py-3">Client</th>
                        <th className="px-5 py-3">Service</th>
                        <th className="px-5 py-3">Schedule</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Receipt</th>
                        <th className="px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/70">
                      {(bookingQueue.length ? bookingQueue : appointments.slice(0, 8)).map((booking) => (
                        <tr key={booking.id} className="align-top hover:bg-[#fafafa]">
                          <td className="px-5 py-4">
                            <p className="font-body-bold">{booking.user.firstName} {booking.user.lastName}</p>
                            <p className="text-sm text-warm-slate">{booking.user.email}</p>
                            <p className="text-sm text-warm-slate">{booking.user.phone || "No phone"}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-body-bold">{booking.service.name}</p>
                            <p className="text-sm text-warm-slate">{booking.service.category}</p>
                            {booking.notes && <p className="mt-2 max-w-sm whitespace-pre-line text-xs leading-5 text-warm-slate">{booking.notes}</p>}
                          </td>
                          <td className="px-5 py-4 text-sm">{dateTime.format(booking.appointmentDate)}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${getStatusClass(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {booking.receipt ? (
                              <div>
                                <p className="font-body-bold">{booking.receipt.receiptNumber}</p>
                                <p className="text-sm text-warm-slate">{money.format(booking.receipt.amount)}</p>
                              </div>
                            ) : (
                              <form action={issueReceipt}>
                                <input type="hidden" name="appointmentId" value={booking.id} />
                                <button className="inline-flex items-center gap-2 border border-royal-navy px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-royal-navy hover:text-white">
                                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                                  Issue
                                </button>
                              </form>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              {statusOptions.map((status) => (
                                <form key={status} action={updateAppointmentStatus}>
                                  <input type="hidden" name="appointmentId" value={booking.id} />
                                  <input type="hidden" name="status" value={status} />
                                  <button className="border border-outline-variant px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] hover:border-royal-navy hover:bg-surface">
                                    {status === "CONFIRMED" ? "Approve" : status.toLowerCase()}
                                  </button>
                                </form>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div id="calendar" className="space-y-6">
                <section className="border border-outline-variant bg-white p-5 shadow-[0_8px_30px_rgba(17,24,68,0.04)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-headline-md text-headline-md">Calendar</h2>
                      <p className="text-sm text-warm-slate">Next scheduled booking</p>
                    </div>
                    <span className="material-symbols-outlined text-champagne-taupe">calendar_month</span>
                  </div>
                  {nextBooking ? (
                    <div className="mt-5 border-l-2 border-majestic-gold pl-4">
                      <p className="font-body-bold">{dateTime.format(nextBooking.appointmentDate)}</p>
                      <p className="mt-1 text-sm text-warm-slate">{nextBooking.service.name}</p>
                      <p className="text-sm text-warm-slate">{nextBooking.user.firstName} {nextBooking.user.lastName}</p>
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-warm-slate">No upcoming bookings.</p>
                  )}
                  <div className="mt-5 space-y-3">
                    {calendarDays.map(([day, bookings]) => (
                      <div key={day} className="border border-outline-variant bg-[#fbfbfb] p-3">
                        <p className="font-body-bold text-sm">{dayLabel.format(new Date(`${day}T00:00:00`))}</p>
                        <p className="mt-1 text-xs text-warm-slate">{bookings.length} booking{bookings.length === 1 ? "" : "s"}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="border border-outline-variant bg-royal-navy p-5 text-white shadow-[0_8px_30px_rgba(17,24,68,0.08)]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-majestic-gold">Portal health</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="border border-white/10 p-3">
                      <p className="font-headline-md text-3xl">{services.length}</p>
                      <p className="text-xs text-white/60">Services</p>
                    </div>
                    <div className="border border-white/10 p-3">
                      <p className="font-headline-md text-3xl">{appointments.length}</p>
                      <p className="text-xs text-white/60">Bookings</p>
                    </div>
                  </div>
                </section>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]" id="services">
              <section className="border border-outline-variant bg-white p-5 shadow-[0_8px_30px_rgba(17,24,68,0.04)]">
                <h2 className="font-headline-md text-headline-md">Create service</h2>
                <form action={createService} className="mt-5 grid gap-3">
                  <input name="name" required placeholder="Service name" className="min-h-11 border border-outline-variant px-4 font-body-base" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input name="category" required placeholder="Category" className="min-h-11 border border-outline-variant px-4 font-body-base" />
                    <input name="imageUrl" type="url" placeholder="Picture URL" className="min-h-11 border border-outline-variant px-4 font-body-base" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input name="price" type="number" min="0" step="0.01" placeholder="Price" className="min-h-11 border border-outline-variant px-4 font-body-base" />
                    <input name="durationMinutes" type="number" min="15" step="15" placeholder="Minutes" className="min-h-11 border border-outline-variant px-4 font-body-base" />
                  </div>
                  <textarea name="description" rows={3} placeholder="Service description" className="resize-none border border-outline-variant px-4 py-3 font-body-base" />
                  <textarea name="features" rows={4} placeholder="Features, one per line" className="resize-none border border-outline-variant px-4 py-3 font-body-base" />
                  <button className="inline-flex min-h-12 items-center justify-center gap-2 bg-royal-navy px-5 text-[12px] font-bold uppercase tracking-[0.14em] text-majestic-gold hover:bg-majestic-gold hover:text-royal-navy">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Add service
                  </button>
                </form>
              </section>

              <section className="border border-outline-variant bg-white p-5 shadow-[0_8px_30px_rgba(17,24,68,0.04)]">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-headline-md text-headline-md">Service library</h2>
                    <p className="text-sm text-warm-slate">Recent services with photos and feature tags.</p>
                  </div>
                  <span className="text-sm font-body-bold">{services.length} total</span>
                </div>
                <div className="mt-5 grid gap-4">
                  {featuredServices.map((service) => {
                    const features = parseFeatures(service.features).slice(0, 3);

                    return (
                      <article key={service.id} className="grid gap-4 border border-outline-variant p-4 sm:grid-cols-[96px_1fr]">
                        <div className="aspect-square overflow-hidden bg-surface">
                          {service.imageUrl ? (
                            <img src={service.imageUrl} alt={service.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] font-bold uppercase tracking-[0.12em] text-warm-slate">
                              No image
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-body-bold">{service.name}</p>
                              <p className="text-sm text-warm-slate">{service.category} / {service.durationMinutes} min</p>
                            </div>
                            <p className="font-body-bold">{money.format(service.price)}</p>
                          </div>
                          {service.description && <p className="mt-2 line-clamp-2 text-sm text-warm-slate">{service.description}</p>}
                          {features.length > 0 && (
                            <ul className="mt-3 flex flex-wrap gap-2">
                              {features.map((feature) => (
                                <li key={feature} className="bg-surface px-3 py-1 text-xs text-warm-slate">{feature}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </article>
                    );
                  })}
                  {featuredServices.length === 0 && <p className="text-sm text-warm-slate">No services have been added yet.</p>}
                </div>
              </section>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <section id="clients" className="border border-outline-variant bg-white p-5 shadow-[0_8px_30px_rgba(17,24,68,0.04)]">
                <h2 className="font-headline-md text-headline-md">Client records</h2>
                <div className="mt-5 divide-y divide-outline-variant">
                  {latestClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                      <div>
                        <p className="font-body-bold">{client.firstName} {client.lastName}</p>
                        <p className="text-sm text-warm-slate">{client.email}</p>
                        <p className="text-sm text-warm-slate">{client.phone || "No phone supplied"}</p>
                      </div>
                      <span className="border border-outline-variant bg-surface px-3 py-1 text-xs font-bold text-warm-slate">
                        {client.appointments.length} booking{client.appointments.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  ))}
                  {latestClients.length === 0 && <p className="text-sm text-warm-slate">No booking clients yet.</p>}
                </div>
              </section>

              <section id="receipts" className="border border-outline-variant bg-white p-5 shadow-[0_8px_30px_rgba(17,24,68,0.04)]">
                <h2 className="font-headline-md text-headline-md">Receipts</h2>
                <div className="mt-5 space-y-3">
                  {latestReceipts.map((receipt) => (
                    <div key={receipt.id} className="border border-outline-variant p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-body-bold">{receipt.receiptNumber}</p>
                          <p className="text-sm text-warm-slate">{receipt.appointment.user.firstName} {receipt.appointment.user.lastName}</p>
                          <p className="text-sm text-warm-slate">{receipt.appointment.service.name}</p>
                        </div>
                        <p className="font-body-bold">{money.format(receipt.amount)}</p>
                      </div>
                      <p className="mt-3 text-xs text-warm-slate">Issued {dateTime.format(receipt.issuedAt)}</p>
                    </div>
                  ))}
                  {latestReceipts.length === 0 && <p className="text-sm text-warm-slate">No receipts issued yet.</p>}
                </div>
              </section>
            </section>
          </div>

          <footer className="border-t border-outline-variant bg-white px-5 py-5 text-sm text-warm-slate md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <span>Admin database: shared SQLite file at ../prisma/dev.db</span>
              <Link href={salonUrl} className="font-body-bold text-royal-navy hover:text-champagne-taupe">
                Back to salon website
              </Link>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}
