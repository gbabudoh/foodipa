"use client";

/**
 * useHaptics — wraps @capacitor/haptics.
 * No-ops silently on web/unsupported devices.
 */

async function run(fn: () => Promise<void>) {
  try {
    const { isNative } = await import("@/lib/capacitor");
    if (!isNative()) return;
    await fn();
  } catch {
    // silently ignore on unsupported platforms
  }
}

export const haptic = {
  /** Light tap — ideal for button presses */
  light: () =>
    run(async () => {
      const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
      await Haptics.impact({ style: ImpactStyle.Light });
    }),

  /** Medium tap — for toggles, selections */
  medium: () =>
    run(async () => {
      const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
      await Haptics.impact({ style: ImpactStyle.Medium });
    }),

  /** Heavy — for destructive actions, long presses */
  heavy: () =>
    run(async () => {
      const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
      await Haptics.impact({ style: ImpactStyle.Heavy });
    }),

  /** Success — confirm, like, save */
  success: () =>
    run(async () => {
      const { Haptics, NotificationType } = await import("@capacitor/haptics");
      await Haptics.notification({ type: NotificationType.Success });
    }),

  /** Warning — validation nudge */
  warning: () =>
    run(async () => {
      const { Haptics, NotificationType } = await import("@capacitor/haptics");
      await Haptics.notification({ type: NotificationType.Warning });
    }),

  /** Error — failed action */
  error: () =>
    run(async () => {
      const { Haptics, NotificationType } = await import("@capacitor/haptics");
      await Haptics.notification({ type: NotificationType.Error });
    }),
};
