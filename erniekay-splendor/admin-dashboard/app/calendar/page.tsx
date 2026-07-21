import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { dateTime, dayLabel, salonUrl } from "@/app/admin-utils";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const appointments = await prisma.appointment.findMany({
    where: { appointmentDate: { gte: new Date() } },
    orderBy: { appointmentDate: "asc" },
    include: { service: true, user: true },
  });

  const grouped = appointments.reduce<Record<string, typeof appointments>>((acc, appointment) => {
    const day = appointment.appointmentDate.toISOString().slice(0, 10);
    acc[day] = acc[day] || [];
    acc[day].push(appointment);
    return acc;
  }, {});

  const days = Object.entries(grouped);

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Calendar</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Upcoming schedule</h1>
            <p className="mt-2 text-sm text-slate-600">See appointments organized by day and prepare for the next week.</p>
          </div>
          <Link href="/" className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white">
            Back to overview
          </Link>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {days.length > 0 ? (
          days.map(([day, items]) => (
            <div key={day} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{dayLabel.format(new Date(`${day}T00:00:00`))}</p>
              <p className="mt-2 text-4xl font-semibold text-slate-900">{items.length}</p>
              <div className="mt-4 space-y-4">
                {items.map((appointment) => (
                  <div key={appointment.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{dateTime.format(appointment.appointmentDate)}</p>
                    <p className="text-sm text-slate-600">{appointment.service.name}</p>
                    <p className="text-sm text-slate-500">{appointment.user.firstName} {appointment.user.lastName}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">No upcoming appointments found.</div>
        )}
      </section>

      <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">Salon connection</p>
        <p className="mt-2 text-sm">Open the salon website to view bookings as they arrive, and refresh this page to see the latest schedule.</p>
        <a href={salonUrl} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline">
          Open salon site
        </a>
      </div>
    </div>
  );
}
