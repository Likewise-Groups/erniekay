import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { money, parseFeatures, salonUrl } from "@/app/admin-utils";
import { createService } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });

  return (
    <div className="space-y-8">
      <header className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Services</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Manage your service list</h1>
            <p className="mt-2 text-sm text-slate-600">Add new salon offerings and keep the catalog up to date.</p>
          </div>
          <Link href="/" className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white">
            Back to overview
          </Link>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Create service</p>
          <form action={createService} className="mt-6 space-y-4">
            <input name="name" required placeholder="Service name" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
            <input name="category" required placeholder="Category" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
            <input name="imageUrl" type="url" placeholder="Picture URL" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="price" type="number" min="0" step="0.01" placeholder="Price" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
              <input name="durationMinutes" type="number" min="15" step="15" placeholder="Duration (minutes)" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
            </div>
            <textarea name="description" rows={4} placeholder="Description" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
            <textarea name="features" rows={4} placeholder="Features (comma-separated or new lines)" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none" />
            <button className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Add service
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {services.length ? (
            services.map((service) => {
              const features = parseFeatures(service.features).slice(0, 3);

              return (
                <article key={service.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                  <div className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{service.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{service.category}</p>
                      </div>
                      <p className="font-semibold text-slate-900">{money.format(service.price)}</p>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{service.description}</p>
                    {features.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {features.map((feature) => (
                          <span key={feature} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
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
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No services have been added yet.</div>
          )}
        </div>
      </section>

      <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">Salon catalog</p>
        <p className="mt-2 text-sm">Services are shared with the salon booking site. Add new items here to keep offerings in sync.</p>
        <a href={salonUrl} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline">
          Open salon site
        </a>
      </div>
    </div>
  );
}
