"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Heart } from "lucide-react";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

export default function RatePage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "40px 20px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          style={{ width: "40px", height: "40px", borderRadius: "12px", ...G, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--foreground)" }} />
        </motion.button>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>Rate Foodipa</h1>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        {!submitted ? (
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "24px", background: "rgba(255,107,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Heart size={40} style={{ color: "var(--accent)" }} />
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 900, color: "var(--foreground)", marginBottom: "12px" }}>Loving the app?</h2>
            <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "32px", maxWidth: "240px", margin: "0 auto 32px", lineHeight: 1.6 }}>
              Your feedback helps us make Foodipa better for everyone.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "48px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(s)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <Star
                    size={36}
                    style={{
                      fill: s <= rating ? "var(--accent)" : "none",
                      color: s <= rating ? "var(--accent)" : "var(--glass-border)",
                      transition: "all 0.2s"
                    }}
                  />
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setSubmitted(true)}
              disabled={rating === 0}
              style={{
                width: "100%", height: "56px", borderRadius: "18px",
                background: rating > 0 ? "var(--accent)" : "var(--glass-border)",
                color: "white", fontSize: "16px", fontWeight: 800, border: "none",
                cursor: rating > 0 ? "pointer" : "not-allowed",
                transition: "all 0.3s"
              }}
            >
              Submit Review
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ width: "80px", height: "80px", borderRadius: "24px", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Star size={40} style={{ color: "#10B981", fill: "#10B981" }} />
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 900, color: "var(--foreground)", marginBottom: "12px" }}>Thank you!</h2>
            <p style={{ fontSize: "15px", color: "var(--muted)", marginBottom: "32px" }}>We appreciate your support!</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => router.back()}
              style={{ padding: "14px 32px", borderRadius: "14px", ...G, fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
            >
              Back to Profile
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
