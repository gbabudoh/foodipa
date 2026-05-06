import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const isMobileBuild = process.env.NEXT_MOBILE_BUILD === "1";

const nextConfig: any = {
  // Silence Turbopack/Webpack conflict error (caused by next-pwa)
  turbopack: {},
  // Static export for Capacitor mobile builds
  ...(isMobileBuild && {
    output: "export",
    // Disable image optimisation for static export (no server available)
    images: { unoptimized: true },
    // Trailing slash required for Capacitor file:// protocol
    trailingSlash: true,
  }),
};

export default withPWA(nextConfig);
