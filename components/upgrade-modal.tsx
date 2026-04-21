"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, X, Camera, FlaskConical, Globe } from "lucide-react";
import { useState } from "react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/subscription/checkout", { method: "POST" });
      if (res.ok) {
        // Upgrade successful, refresh the page to get the new PRO status from session/DB
        window.location.reload();
      } else {
        alert("Failed to process upgrade. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
            }}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 101,
              background: "var(--background)",
              borderTop: "1px solid var(--glass-border)",
              borderRadius: "28px 28px 0 0",
              maxWidth: "512px",
              margin: "0 auto",
              overflow: "hidden",
            }}
          >
            {/* Header Art / Gradient */}
            <div style={{
              background: "linear-gradient(135deg, #FF6B2B 0%, #C94A10 100%)",
              padding: "40px 24px 30px",
              position: "relative",
              textAlign: "center"
            }}>
              <button
                onClick={onClose}
                style={{
                  position: "absolute", top: "16px", right: "16px",
                  background: "rgba(0,0,0,0.2)", border: "none", borderRadius: "50%",
                  width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <X size={16} color="white" />
              </button>

              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "18px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", marginBottom: "16px" }}>
                <Sparkles size={28} color="white" />
              </div>

              <h2 style={{ fontSize: "28px", fontWeight: 900, color: "white", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                Upgrade to <br/> Foodipa+ PRO
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", marginTop: "8px" }}>
                You&apos;ve reached your free AI limit.
              </p>
            </div>

            {/* Features list */}
            <div style={{ padding: "24px 30px 40px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
                {[
                  { icon: FlaskConical, text: "Unlimited AI Recipe Generations" },
                  { icon: Camera, text: "Infinite Camera Food Scans" },
                  { icon: Globe, text: "Advanced Food Tracking & Offline Maps" }
                ].map((feature, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: "rgba(255,107,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <feature.icon size={18} style={{ color: "var(--accent)" }} />
                    </div>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)" }}>{feature.text}</p>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--foreground)" }}>$4.99 <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--muted)" }}>/ month</span></p>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={loading}
                onClick={handleUpgrade}
                style={{
                  width: "100%", padding: "18px", borderRadius: "16px",
                  background: "var(--foreground)", color: "var(--background)",
                  fontSize: "16px", fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? "Processing..." : "Subscribe Now"}
                {!loading && <Check size={18} />}
              </motion.button>
              <p style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center", marginTop: "14px" }}>
                Note: This is a mocked checkout flow for testing.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
