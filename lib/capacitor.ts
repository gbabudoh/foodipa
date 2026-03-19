/**
 * Capacitor platform utilities
 * Safe wrappers that gracefully fall back to web APIs when running in a browser.
 */

export function isNative(): boolean {
  if (typeof window === "undefined") return false;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Capacitor } = require("@capacitor/core");
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function getPlatform(): "ios" | "android" | "web" {
  if (typeof window === "undefined") return "web";
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Capacitor } = require("@capacitor/core");
    return Capacitor.getPlatform() as "ios" | "android" | "web";
  } catch {
    return "web";
  }
}
