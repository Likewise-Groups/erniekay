/**
 * The admin's icon set.
 *
 * Inline SVG rather than an icon font or a package: there are a dozen icons,
 * they never change, and both alternatives cost a network request that can fail
 * — the public site loads Material Symbols from Google and shows ligature text
 * ("arrow_back") until it arrives. Inline paths are in the HTML already.
 *
 * All of them are 24×24 line icons on the same grid with `currentColor`, so
 * they take their colour and size from the element around them.
 */

type IconProps = { className?: string };

const base = (className?: string) => ({
  className: className ?? "h-5 w-5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  // Decorative: every icon here sits beside its own text label.
  "aria-hidden": true,
});

export const OverviewIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

export const AppointmentsIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const PaymentsIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export const BridalIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export const AdmissionsIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const MediaIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const AuditIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

export const ExternalIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export const SignOutIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export const CardIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

export const ArrowRightIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export const ChevronLeftIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M15 19l-7-7 7-7" />
  </svg>
);

export const ChevronRightIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const UsersIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export const BanknoteIcon = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/** A filled dot, for the status pills. Not on the 24-grid — it is 8×8. */
export const StatusDot = ({ className }: IconProps) => (
  <svg
    className={className ?? "h-2 w-2"}
    fill="currentColor"
    viewBox="0 0 8 8"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <circle cx="4" cy="4" r="3" />
  </svg>
);
