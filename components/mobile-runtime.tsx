"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { PushNotifications } from "@capacitor/push-notifications";

export function MobileRuntime({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // ── Deep Linking ──
    App.addListener("appUrlOpen", (event) => {
      // Example: com.foodipa.app://path/to/page -> /path/to/page
      const slug = event.url.split(".app://").pop();
      if (slug) {
        router.push(`/${slug}`);
      }
    });

    // ── Push Notifications ──
    const setupPush = async () => {
      let perm = await PushNotifications.checkPermissions();
      
      if (perm.receive !== "granted") {
        perm = await PushNotifications.requestPermissions();
      }

      if (perm.receive === "granted") {
        await PushNotifications.register();
      }
    };

    setupPush();

    PushNotifications.addListener("registration", (token) => {
      console.log("Push registration success, token: " + token.value);
      // In production, send this token to your backend (e.g. /api/user/push-token)
    });

    PushNotifications.addListener("registrationError", (error) => {
      console.error("Push registration error: ", error);
    });

    PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.log("Push received: ", notification);
    });

    PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
      console.log("Push action performed: ", notification);
      const data = notification.notification.data;
      if (data.url) {
        router.push(data.url);
      }
    });

    return () => {
      App.removeAllListeners();
      PushNotifications.removeAllListeners();
    };
  }, [router]);

  return <>{children}</>;
}
