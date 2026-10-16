import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

/**
 * Uploaded media is served from Supabase Storage's public object endpoint. The
 * hostname is project-specific, so it is derived from SUPABASE_URL rather than
 * hard-coded — a wrong hostname here shows as a 400 from /_next/image with no
 * hint about which host was rejected.
 *
 * Previews in the admin also pass `unoptimized`, so this is a safety net rather
 * than the mechanism: without it, switching a preview to the optimiser later
 * would fail in a confusing way.
 */
const supabaseHost = (() => {
  const raw = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return undefined;
  try {
    return new URL(raw).hostname;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  /**
   * This directory, not the parent.
   *
   * erniekay/ has its own package-lock.json above both applications, so
   * Turbopack infers the parent as the workspace root and then resolves
   * node_modules and output paths from there. Stating it removes the ambiguity
   * (and the warning it prints on every build).
   */
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },

  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https" as const,
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
