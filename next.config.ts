import type { NextConfig } from "next";

const isMobileBuild = process.env.NEXT_MOBILE_BUILD === "1";

const nextConfig: NextConfig = {
  // Static export for Capacitor mobile builds
  ...(isMobileBuild && {
    output: "export",
    // Disable image optimisation for static export (no server available)
    images: { unoptimized: true },
    // Trailing slash required for Capacitor file:// protocol
    trailingSlash: true,
  }),
};

export default nextConfig;
