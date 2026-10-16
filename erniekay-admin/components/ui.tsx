import Link from "next/link";

import { statusTone } from "@/lib/status";

/**
 * The shared vocabulary of the admin: page headers, cards, tables, badges,
 * filters and paging.
 *
 * Server components with no state — every one of them is markup plus classes.
 * They exist so the six list pages look like one application rather than six,
 * and so a change to how, say, an empty table reads happens once.
 */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="page-enter mb-8 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-brand">{title}</h1>
        {description ? (
          <p className="mt-1.5 text-sm text-brand-ink/60">{description}</p>
        ) : null}
        {/* Gold accent line */}
        <div className="mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-gold to-gold-soft" />
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`group/card overflow-hidden rounded-2xl bg-white/90 shadow-sm ring-1 ring-brand/5 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:ring-brand/10 ${className}`}
    >
      {title ? (
        <h2 className="border-b border-cream-dark px-5 py-3.5 font-heading text-sm font-semibold tracking-wide text-brand">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: string | null | undefined }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusTone(status)}`}
    >
      {/* Colored dot indicator */}
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {status || "—"}
    </span>
  );
}

/** A labelled value, used down the left of every detail page. */
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-3.5">
      <dt className="text-[0.65rem] font-semibold uppercase tracking-widest text-brand-ink/40">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm break-words text-brand-ink/80">{children ?? "—"}</dd>
    </div>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  // Horizontal scroll on the container, not the page: these tables have more
  // columns than a laptop has room for, and the surrounding chrome should stay put.
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[44rem] text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap border-b border-cream-dark bg-cream/60 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-brand-ink/50 ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`border-b border-cream-dark/50 px-5 py-3.5 align-top text-brand-ink/75 ${className}`}
    >
      {children}
    </td>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-14 text-center text-sm text-brand-ink/40">
        <div className="mx-auto mb-3 text-3xl opacity-30">📭</div>
        {children}
      </td>
    </tr>
  );
}

/**
 * Status filters, as links rather than a `<select>`.
 *
 * The filter belongs in the URL: staff share "the pending bookings" with each
 * other, and a filtered list that cannot be linked to is a list they screenshot
 * instead.
 */
export function FilterTabs({
  basePath,
  param = "status",
  current,
  options,
  extraParams,
}: {
  basePath: string;
  param?: string;
  current?: string;
  options: Array<{ value: string; label: string; count?: number }>;
  extraParams?: Record<string, string | undefined>;
}) {
  const href = (value: string) => {
    const params = new URLSearchParams();
    for (const [key, entry] of Object.entries(extraParams ?? {})) {
      if (entry) params.set(key, entry);
    }
    if (value) params.set(param, value);
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <nav className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = (current ?? "") === option.value;
        return (
          <Link
            key={option.value || "all"}
            href={href(option.value)}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition-all duration-200 ${
              active
                ? "bg-brand text-gold ring-brand shadow-sm shadow-brand/20"
                : "bg-white text-brand-ink/60 ring-brand/10 hover:bg-cream hover:text-brand hover:ring-brand/20"
            }`}
          >
            {option.label}
            {option.count === undefined ? null : (
              <span
                className={
                  active
                    ? "ml-1.5 text-gold/60"
                    : "ml-1.5 text-brand-ink/30"
                }
              >
                {option.count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Offset paging.
 *
 * `hasMore` is derived by the caller fetching one row beyond the page size,
 * which avoids a second COUNT query on tables that only ever grow.
 */
export function Pagination({
  basePath,
  page,
  hasMore,
  params,
}: {
  basePath: string;
  page: number;
  hasMore: boolean;
  params?: Record<string, string | undefined>;
}) {
  if (page === 1 && !hasMore) return null;

  const href = (target: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value) query.set(key, value);
    }
    if (target > 1) query.set("page", String(target));
    const search = query.toString();
    return search ? `${basePath}?${search}` : basePath;
  };

  const linkClass =
    "rounded-xl border border-brand/10 bg-white px-4 py-2 text-sm font-medium text-brand transition-all duration-200 hover:bg-cream hover:border-brand/20 hover:shadow-sm";
  const disabledClass =
    "rounded-xl border border-brand/5 bg-cream/50 px-4 py-2 text-sm text-brand-ink/25 cursor-not-allowed";

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-4">
      <span className="text-xs font-medium text-brand-ink/40">Page {page}</span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={linkClass} rel="prev">
            ← Previous
          </Link>
        ) : (
          <span className={disabledClass}>← Previous</span>
        )}
        {hasMore ? (
          <Link href={href(page + 1)} className={linkClass} rel="next">
            Next →
          </Link>
        ) : (
          <span className={disabledClass}>Next →</span>
        )}
      </div>
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  href,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  /**
   * Draws the gold bar down the left edge. Opt-in, and meant for one card in a
   * row: a marker every card carries marks nothing. Use it on the figure the
   * page is really about — pending bookings, on the overview.
   */
  accent?: boolean;
}) {
  const body = (
    <>
      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-brand-ink/40">
        {label}
      </p>
      <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-brand">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-brand-ink/40">{hint}</p> : null}
    </>
  );

  const className =
    "relative block overflow-hidden rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-brand/5 backdrop-blur-sm";

  const accentBar = accent ? (
    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gold to-gold-soft" />
  ) : null;

  return href ? (
    <Link
      href={href}
      className={`${className} transition-all duration-300 hover:shadow-md hover:ring-brand/10 hover:-translate-y-0.5`}
    >
      {accentBar}
      {body}
    </Link>
  ) : (
    <div className={className}>
      {accentBar}
      {body}
    </div>
  );
}

/**
 * The banner every mutating page uses to report what just happened.
 *
 * Driven by a query parameter rather than component state, because the actions
 * that produce it end in a redirect — the outcome has to survive a navigation.
 */
export function Notice({ tone, children }: { tone: "success" | "error"; children: React.ReactNode }) {
  const tones = {
    success: "border-l-emerald-500 bg-emerald-50/80 text-emerald-900 ring-emerald-200/50",
    error: "border-l-rose-500 bg-rose-50/80 text-rose-900 ring-rose-200/50",
  } as const;

  const icons = {
    success: "✓",
    error: "✕",
  } as const;

  return (
    <p
      role="status"
      className={`mb-5 flex items-center gap-2.5 rounded-xl border-l-4 px-4 py-3 text-sm ring-1 backdrop-blur-sm ${tones[tone]}`}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-current/10 text-xs font-bold">
        {icons[tone]}
      </span>
      {children}
    </p>
  );
}
