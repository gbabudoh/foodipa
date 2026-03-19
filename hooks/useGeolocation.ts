"use client";

import { useCallback, useState } from "react";

export type Coords = {
  lat: number;
  lng: number;
  accuracy?: number;
};

/**
 * useGeolocation — wraps @capacitor/geolocation with navigator.geolocation fallback.
 */
export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback(async (): Promise<Coords | null> => {
    setLoading(true);
    setError(null);

    try {
      const { isNative } = await import("@/lib/capacitor");

      if (isNative()) {
        const { Geolocation } = await import("@capacitor/geolocation");

        const perm = await Geolocation.checkPermissions();
        if (perm.location === "denied") {
          setError("Location permission denied. Enable it in device settings.");
          return null;
        }
        if (perm.location !== "granted") {
          await Geolocation.requestPermissions();
        }

        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });

        const result: Coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setCoords(result);
        return result;
      } else {
        // Web fallback
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            setError("Geolocation not supported by this browser.");
            reject(null);
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const result: Coords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
              };
              setCoords(result);
              resolve(result);
            },
            (err) => {
              setError(err.message);
              resolve(null);
            },
            { enableHighAccuracy: true, timeout: 10000 }
          );
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Location error";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { coords, error, loading, getLocation };
}
