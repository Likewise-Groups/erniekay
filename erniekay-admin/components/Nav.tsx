"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AdmissionsIcon,
  AppointmentsIcon,
  AuditIcon,
  BridalIcon,
  MediaIcon,
  OverviewIcon,
  PaymentsIcon,
} from "@/components/icons";

/**
 * The sidebar.
 *
 * A client component purely to read the current path — highlighting the
 * section you are in is the only interactivity here. The sign-out control is
 * passed in as a child from the layout so the server action that backs it does
 * not have to be imported into client code.
 */

/**
 * Line icons rather than emoji: emoji render as a different picture on every
 * platform, sit off the text baseline, and cannot take the gold of the active
 * state — they are always their own colour. These inherit `currentColor`.
 */
const LINKS = [
  { href: "/", label: "Overview", Icon: OverviewIcon, exact: true },
  { href: "/appointments", label: "Appointments", Icon: AppointmentsIcon },
  { href: "/payments", label: "Payments", Icon: PaymentsIcon },
  { href: "/bridal", label: "Bridal enquiries", Icon: BridalIcon },
  { href: "/admissions", label: "Admissions", Icon: AdmissionsIcon },
  { href: "/media", label: "Site media", Icon: MediaIcon },
  { href: "/audit", label: "Activity log", Icon: AuditIcon },
];

export default function Nav({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {LINKS.map((link, i) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);

        /* Visual separator before the "Site media" group */
        const separator = i === 5;

        return (
          <div key={link.href}>
            {separator ? (
              <div className="my-2 border-t border-white/[0.06]" />
            ) : null}
            <Link
              href={link.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                active
                  ? "bg-white/[0.12] font-semibold text-gold shadow-sm shadow-gold/5"
                  : "text-white/60 hover:bg-white/[0.06] hover:text-white/90"
              }`}
            >
              {/* Active indicator bar */}
              {active ? (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gold" />
              ) : null}
              <link.Icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  active ? "text-gold" : "text-white/40 group-hover:text-white/70"
                }`}
              />
              <span>{link.label}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
