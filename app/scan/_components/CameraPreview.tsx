"use client";

import { motion } from "framer-motion";
import { Camera, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from "react";

interface CameraPreviewProps {
  onCapture: (dataUrl: string) => void;
  onError: (msg: string) => void;
}

export interface CameraPreviewHandle {
  capture: () => void;
  stop: () => void;
}

export const CameraPreview = forwardRef<CameraPreviewHandle, CameraPreviewProps>(({ onCapture, onError }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsActive(false);
    }
  }, []);

  const startStream = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsActive(true);
      }
    } catch (err) {
      console.error("Camera Access Error:", err);
      onError("Could not access camera. Please ensure you have granted permissions.");
    }
  }, [onError]);

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (context) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          onCapture(dataUrl);
        }
      }
    },
    stop: stopStream
  }));

  const mountedRef = useRef(false);
  const isStartingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    
    const initialize = async () => {
      if (isStartingRef.current || streamRef.current) return;
      isStartingRef.current = true;
      
      try {
        await startStream();
      } catch (err) {
        console.error("Scanner Init Error:", err);
      } finally {
        isStartingRef.current = false;
        // If we unmounted during the async call, clean up immediately
        if (!mountedRef.current) {
          stopStream();
        }
      }
    };

    initialize().catch((err) => {
      console.error("Critical Scanner Init Error:", err);
    });

    return () => {
      mountedRef.current = false;
      stopStream();
    };
  }, [startStream, stopStream]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#000", overflow: "hidden" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(1)", // No mirror for environment camera
        }}
      />
      
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Viewfinder Overlay */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {/* Animated corners */}
        {[
          { top: 24, left: 24, borderTop: "3px solid var(--accent)", borderLeft: "3px solid var(--accent)" },
          { top: 24, right: 24, borderTop: "3px solid var(--accent)", borderRight: "3px solid var(--accent)" },
          { bottom: 24, left: 24, borderBottom: "3px solid var(--accent)", borderLeft: "3px solid var(--accent)" },
          { bottom: 24, right: 24, borderBottom: "3px solid var(--accent)", borderRight: "3px solid var(--accent)" },
        ].map((style, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            style={{ position: "absolute", width: "32px", height: "32px", borderRadius: "6px", ...style }}
          />
        ))}

        {/* Scan line */}
        <motion.div
          animate={{ top: ["20%", "80%", "20%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", left: "10%", right: "10%",
            height: "2px", background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
            boxShadow: "0 0 15px var(--accent)",
          }}
        />
      </div>

      {!isActive && (
        <div style={{ 
          position: "absolute", inset: 0, 
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.8)", gap: "12px", zIndex: 10
        }}>
          <Camera size={40} style={{ color: "var(--muted)" }} className="animate-pulse" />
          <p style={{ color: "white", fontSize: "14px", fontWeight: 600 }}>Initializing Camera...</p>
        </div>
      )}
    </div>
  );
});

CameraPreview.displayName = "CameraPreview";
