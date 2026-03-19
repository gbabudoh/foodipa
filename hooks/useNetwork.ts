"use client";

import { useEffect, useState } from "react";

export type NetworkStatus = {
  connected: boolean;
  connectionType: "wifi" | "cellular" | "none" | "unknown";
};

/**
 * useNetwork — wraps @capacitor/network with navigator.onLine fallback.
 */
export function useNetwork(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    connected: typeof navigator !== "undefined" ? navigator.onLine : true,
    connectionType: "unknown",
  });

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    async function setup() {
      try {
        const { isNative } = await import("@/lib/capacitor");

        if (isNative()) {
          const { Network } = await import("@capacitor/network");

          const current = await Network.getStatus();
          setStatus({
            connected: current.connected,
            connectionType: current.connectionType as NetworkStatus["connectionType"],
          });

          const handle = await Network.addListener("networkStatusChange", (s) => {
            setStatus({
              connected: s.connected,
              connectionType: s.connectionType as NetworkStatus["connectionType"],
            });
          });

          cleanup = () => handle.remove();
        } else {
          // Web fallback
          const onOnline = () => setStatus({ connected: true, connectionType: "unknown" });
          const onOffline = () => setStatus({ connected: false, connectionType: "none" });
          window.addEventListener("online", onOnline);
          window.addEventListener("offline", onOffline);
          cleanup = () => {
            window.removeEventListener("online", onOnline);
            window.removeEventListener("offline", onOffline);
          };
        }
      } catch {
        // ignore
      }
    }

    setup();
    return () => { cleanup?.(); };
  }, []);

  return status;
}
