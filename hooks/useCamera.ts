"use client";

import { useCallback, useState } from "react";

export type PhotoResult = {
  dataUrl: string;
  format: string;
};

/**
 * useCamera — wraps @capacitor/camera with a web file-input fallback.
 * Returns `capturePhoto` (prompts camera / gallery) and `pickFromGallery`.
 */
export function useCamera() {
  const [photo, setPhoto] = useState<PhotoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const _openNativeCamera = useCallback(
    async (source: "CAMERA" | "PHOTOS" | "PROMPT"): Promise<PhotoResult | null> => {
      const { Camera, CameraResultType, CameraSource } =
        await import("@capacitor/camera");

      const srcMap = {
        CAMERA: CameraSource.Camera,
        PHOTOS: CameraSource.Photos,
        PROMPT: CameraSource.Prompt,
      };

      const result = await Camera.getPhoto({
        quality: 92,
        allowEditing: source !== "CAMERA",
        resultType: CameraResultType.DataUrl,
        source: srcMap[source],
        saveToGallery: false,
      });

      if (!result.dataUrl) return null;
      return { dataUrl: result.dataUrl, format: result.format };
    },
    []
  );

  const _openWebFilePicker = useCallback(
    (accept = "image/*"): Promise<PhotoResult | null> =>
      new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return resolve(null);
          const reader = new FileReader();
          reader.onload = () =>
            resolve({ dataUrl: reader.result as string, format: file.type });
          reader.readAsDataURL(file);
        };
        input.click();
      }),
    []
  );

  const capture = useCallback(
    async (source: "CAMERA" | "PHOTOS" | "PROMPT" = "PROMPT") => {
      setLoading(true);
      setError(null);
      try {
        const { isNative } = await import("@/lib/capacitor");
        const result = isNative()
          ? await _openNativeCamera(source)
          : await _openWebFilePicker();

        setPhoto(result);
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Camera error";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [_openNativeCamera, _openWebFilePicker]
  );

  const checkPermissions = useCallback(async () => {
    const { isNative } = await import("@/lib/capacitor");
    if (!isNative()) return { camera: "granted", photos: "granted" };
    const { Camera } = await import("@capacitor/camera");
    return Camera.checkPermissions();
  }, []);

  const requestPermissions = useCallback(async () => {
    const { isNative } = await import("@/lib/capacitor");
    if (!isNative()) return { camera: "granted", photos: "granted" };
    const { Camera } = await import("@capacitor/camera");
    return Camera.requestPermissions({ permissions: ["camera", "photos"] });
  }, []);

  const clear = useCallback(() => setPhoto(null), []);

  return { photo, error, loading, capture, checkPermissions, requestPermissions, clear };
}
