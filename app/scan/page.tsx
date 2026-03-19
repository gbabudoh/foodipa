"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Camera, RefreshCw, Loader2, Utensils, MapPin, FlaskConical, X, ImageIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCamera } from "@/hooks/useCamera";
import { haptic } from "@/hooks/useHaptics";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

type ScanResult = {
  dish: string;
  cuisine: string;
  description: string;
  origin: string;
  ingredients: string[];
  pairsWith: string[];
  confidence: number;
};

export default function ScanPage() {
  const { photo, loading: cameraLoading, capture, clear } = useCamera();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCapture(source: "CAMERA" | "PHOTOS" | "PROMPT" = "PROMPT") {
    await haptic.light();
    setResult(null);
    setError(null);
    const photo = await capture(source);
    if (photo) {
      await analyze(photo.dataUrl);
    }
  }

  async function analyze(dataUrl: string) {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: dataUrl }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      await haptic.success();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(msg);
      await haptic.error();
    } finally {
      setAnalyzing(false);
    }
  }

  function handleReset() {
    clear();
    setResult(null);
    setError(null);
  }

  return (
    <div className="desktop-page-inner" style={{ minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ padding: "32px 20px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.4px" }}>
            Food Scanner 📷
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "5px" }}>
            Point at any dish — AI identifies it instantly
          </p>
        </motion.div>
      </div>

      <div style={{ padding: "0 20px" }}>

        {/* ── Camera / Preview Area ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {photo ? (
            /* Photo preview */
            <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", height: "320px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.dataUrl}
                alt="Captured food"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Overlay while analyzing */}
              {analyzing && (
                <div style={{
                  position: "absolute", inset: 0,
                  background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px",
                }}>
                  <Loader2 size={36} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
                  <p style={{ color: "white", fontSize: "15px", fontWeight: 600 }}>Analysing dish…</p>
                </div>
              )}
              {/* Reset button */}
              <button
                onClick={handleReset}
                style={{
                  position: "absolute", top: "14px", right: "14px",
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={16} color="white" />
              </button>
            </div>
          ) : (
            /* Camera prompt */
            <div
              style={{
                height: "320px", borderRadius: "24px",
                background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: "16px", position: "relative", overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              }}
            >
              {/* Animated viewfinder corners */}
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
                  style={{ position: "absolute", width: "28px", height: "28px", borderRadius: "4px", ...style }}
                />
              ))}

              {/* Scan line */}
              <motion.div
                animate={{ top: ["20%", "80%", "20%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute", left: "10%", right: "10%",
                  height: "2px", background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                  boxShadow: "0 0 12px var(--accent)",
                }}
              />

              <Camera size={40} style={{ color: "rgba(255,255,255,0.4)", zIndex: 1 }} />
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", zIndex: 1, textAlign: "center", padding: "0 32px" }}>
                Tap below to scan any dish with your camera
              </p>
            </div>
          )}
        </motion.div>

        {/* ── Action Buttons ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "14px" }}
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCapture("CAMERA")}
            disabled={cameraLoading || analyzing}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "9px",
              padding: "16px", borderRadius: "18px",
              fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer",
              background: "var(--accent)", color: "white",
              boxShadow: "0 4px 18px rgba(255,107,43,0.32)",
              opacity: cameraLoading || analyzing ? 0.6 : 1,
            }}
          >
            <Camera size={18} />
            Camera
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCapture("PHOTOS")}
            disabled={cameraLoading || analyzing}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "9px",
              padding: "16px", borderRadius: "18px",
              fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer",
              ...G,
              color: "var(--foreground)",
              opacity: cameraLoading || analyzing ? 0.6 : 1,
            }}
          >
            <ImageIcon size={18} />
            Gallery
          </motion.button>
        </motion.div>

        {/* ── Error ── */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ ...G, borderRadius: "16px", padding: "14px 18px", marginTop: "14px" }}
          >
            <p style={{ fontSize: "13px", color: "#EF4444", lineHeight: 1.5 }}>
              ⚠️ {error}
            </p>
            {error.includes("API") && (
              <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "6px" }}>
                Add <code style={{ background: "rgba(0,0,0,0.08)", padding: "1px 5px", borderRadius: "4px" }}>GOOGLE_GEMINI_API_KEY</code> to .env.local to enable food scanning.
              </p>
            )}
          </motion.div>
        )}

        {/* ── Scan Result ── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {/* Dish identity */}
              <div style={{ ...G, borderRadius: "22px", padding: "20px 20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "6px" }}>
                      Identified Dish
                    </p>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>
                      {result.dish}
                    </h2>
                    <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "3px" }}>
                      {result.cuisine} Cuisine · {result.origin}
                    </p>
                  </div>
                  <div style={{
                    minWidth: "52px", padding: "8px 10px", borderRadius: "14px", textAlign: "center",
                    background: "linear-gradient(135deg, var(--accent), #FF9A4C)",
                  }}>
                    <p style={{ color: "white", fontSize: "16px", fontWeight: 800 }}>{result.confidence}%</p>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.05em", marginTop: "1px" }}>MATCH</p>
                  </div>
                </div>

                <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--foreground)", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--glass-border)" }}>
                  {result.description}
                </p>
              </div>

              {/* Key ingredients */}
              <div style={{ ...G, borderRadius: "18px", padding: "16px 18px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>
                  Key Ingredients
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  {result.ingredients.map((ing) => (
                    <span key={ing} style={{
                      padding: "6px 13px", borderRadius: "50px",
                      fontSize: "12px", fontWeight: 500,
                      background: "rgba(255,107,43,0.1)", color: "var(--accent)",
                    }}>
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pairs with */}
              {result.pairsWith.length > 0 && (
                <div style={{ ...G, borderRadius: "18px", padding: "16px 18px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>
                    Pairs Well With
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                    {result.pairsWith.map((p) => (
                      <span key={p} style={{ padding: "6px 13px", borderRadius: "50px", fontSize: "12px", fontWeight: 500, background: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                <Link href={`/lab?prompt=${encodeURIComponent(`Recipe for ${result.dish}`)}`} style={{ textDecoration: "none" }}>
                  <motion.div whileTap={{ scale: 0.95 }} style={{
                    ...G, borderRadius: "16px", padding: "14px 10px",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", cursor: "pointer",
                  }}>
                    <FlaskConical size={20} style={{ color: "var(--accent)" }} />
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--foreground)", textAlign: "center" }}>Get Recipe</span>
                  </motion.div>
                </Link>

                <Link href="/discover" style={{ textDecoration: "none" }}>
                  <motion.div whileTap={{ scale: 0.95 }} style={{
                    ...G, borderRadius: "16px", padding: "14px 10px",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", cursor: "pointer",
                  }}>
                    <MapPin size={20} style={{ color: "#10B981" }} />
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--foreground)", textAlign: "center" }}>Find Nearby</span>
                  </motion.div>
                </Link>

                <motion.button whileTap={{ scale: 0.95 }} onClick={handleReset} style={{
                  ...G, borderRadius: "16px", padding: "14px 10px", border: "1px solid var(--glass-border)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", cursor: "pointer",
                }}>
                  <RefreshCw size={20} style={{ color: "var(--muted)" }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--foreground)" }}>Scan Again</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state tips ── */}
        {!photo && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "4px" }}>
              Best Results
            </p>
            {[
              { icon: "💡", tip: "Good lighting — natural light works best" },
              { icon: "📐", tip: "Centre the dish in the frame" },
              { icon: "🔍", tip: "Get close — details help identification" },
              { icon: "🍽️", tip: "Works on plated dishes, street food & markets" },
            ].map((item) => (
              <div key={item.tip} style={{ ...G, borderRadius: "14px", display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px" }}>
                <span style={{ fontSize: "1.3rem" }}>{item.icon}</span>
                <p style={{ fontSize: "13px", color: "var(--foreground)" }}>{item.tip}</p>
              </div>
            ))}
          </motion.div>
        )}

        <div style={{ height: "36px" }} />
      </div>
    </div>
  );
}
