"use client";

/**
 * useShare — wraps @capacitor/share with navigator.share fallback.
 */

type ShareOptions = {
  title: string;
  text: string;
  url?: string;
  dialogTitle?: string;
};

export async function shareContent(options: ShareOptions): Promise<boolean> {
  try {
    const { isNative } = await import("@/lib/capacitor");

    if (isNative()) {
      const { Share } = await import("@capacitor/share");
      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: options.dialogTitle ?? options.title,
      });
      return true;
    }

    // Web Share API fallback
    if (navigator.share) {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return true;
    }

    // Clipboard fallback
    const content = [options.title, options.text, options.url]
      .filter(Boolean)
      .join("\n");
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    return false;
  }
}
