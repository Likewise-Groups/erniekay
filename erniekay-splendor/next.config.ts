import type { NextConfig } from "next";

// The academy moved to its own app (erniekay-academy), where /academy/<path>
// became /<path>. Read at build time, so the variable must be set for the build.
const academyUrl = process.env.NEXT_PUBLIC_ACADEMY_URL?.trim().replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async redirects() {
    if (!academyUrl) return [];
    return [
      // Temporary (307) while the academy's address may still change.
      { source: "/academy", destination: academyUrl, permanent: false },
      { source: "/academy/:path*", destination: `${academyUrl}/:path*`, permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
    ],
  },
};

export default nextConfig;
