"use client";

import { useCallback } from "react";

/**
 * usePreferences — wraps @capacitor/preferences (key-value persistent storage).
 * Falls back to localStorage on web.
 */
export function usePreferences() {
  const set = useCallback(async (key: string, value: string) => {
    try {
      const { isNative } = await import("@/lib/capacitor");
      if (isNative()) {
        const { Preferences } = await import("@capacitor/preferences");
        await Preferences.set({ key, value });
      } else {
        localStorage.setItem(key, value);
      }
    } catch {
      localStorage.setItem(key, value);
    }
  }, []);

  const get = useCallback(async (key: string): Promise<string | null> => {
    try {
      const { isNative } = await import("@/lib/capacitor");
      if (isNative()) {
        const { Preferences } = await import("@capacitor/preferences");
        const { value } = await Preferences.get({ key });
        return value;
      } else {
        return localStorage.getItem(key);
      }
    } catch {
      return localStorage.getItem(key);
    }
  }, []);

  const remove = useCallback(async (key: string) => {
    try {
      const { isNative } = await import("@/lib/capacitor");
      if (isNative()) {
        const { Preferences } = await import("@capacitor/preferences");
        await Preferences.remove({ key });
      } else {
        localStorage.removeItem(key);
      }
    } catch {
      localStorage.removeItem(key);
    }
  }, []);

  return { set, get, remove };
}
