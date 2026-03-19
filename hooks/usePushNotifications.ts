"use client";

import { useCallback, useEffect, useState } from "react";

export type NotificationPermission = "granted" | "denied" | "prompt";

/**
 * usePushNotifications — wraps @capacitor/push-notifications.
 * Registers device token for NOVU / FCM / APNs.
 */
export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("prompt");

  const register = useCallback(async () => {
    try {
      const { isNative } = await import("@/lib/capacitor");
      if (!isNative()) return;

      const { PushNotifications } = await import("@capacitor/push-notifications");

      // Request permission
      const result = await PushNotifications.requestPermissions();
      setPermission(result.receive as NotificationPermission);

      if (result.receive !== "granted") return;

      // Register with APNs / FCM
      await PushNotifications.register();

      // Listen for registration token
      PushNotifications.addListener("registration", (t) => {
        setToken(t.value);
        // TODO: send t.value to your backend / NOVU to associate with user
        console.log("[PushNotifications] device token:", t.value);
      });

      PushNotifications.addListener("registrationError", (err) => {
        console.error("[PushNotifications] registration error:", err);
      });

      // Listen for incoming push while app is open
      PushNotifications.addListener("pushNotificationReceived", (notification) => {
        console.log("[PushNotifications] received:", notification);
      });

      // Listen for notification tap
      PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
        console.log("[PushNotifications] action:", action);
        // TODO: deep-link based on action.notification.data
      });
    } catch (err) {
      console.error("[PushNotifications] setup error:", err);
    }
  }, []);

  useEffect(() => {
    register();
    return () => {
      import("@capacitor/push-notifications")
        .then(({ PushNotifications }) => PushNotifications.removeAllListeners())
        .catch(() => {});
    };
  }, [register]);

  return { token, permission };
}
