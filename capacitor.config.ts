import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.foodipa.app",
  appName: "Foodipa",
  webDir: "out",

  server: {
    androidScheme: "https",
    // During local development, point the native app to your dev server:
    // url: "http://192.168.x.x:3000",
    // cleartext: true,
  },

  plugins: {
    // ── Splash Screen ─────────────────────────────────────
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: "#FFF8F0",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },

    // ── Status Bar ────────────────────────────────────────
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#FFF8F0",
    },

    // ── Push Notifications ────────────────────────────────
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },

    // ── Keyboard ──────────────────────────────────────────
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true,
    },

    // ── Local Notifications ───────────────────────────────
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#FF6B2B",
    },
  },

  // ── iOS specific ──────────────────────────────────────
  ios: {
    contentInset: "automatic",
    scheme: "Foodipa",
    backgroundColor: "#FFF8F0",
  },

  // ── Android specific ──────────────────────────────────
  android: {
    backgroundColor: "#FFF8F0",
    allowMixedContent: false,
  },
};

export default config;
