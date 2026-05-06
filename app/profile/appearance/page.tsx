"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Palette, Moon, Sun, Type } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

export default function AppearancePage() {
  const router = useRouter();
  const [fontSize, setFontSize] = useState(15); // base px
  const [brightness, setBrightness] = useState(1); // 0 to 1

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--background)",
      filter: `brightness(${0.5 + brightness * 0.5})`,
      transition: "filter 0.2s ease"
    }}>
      <div style={{ padding: "40px 20px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          style={{ width: "40px", height: "40px", borderRadius: "12px", ...G, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--foreground)" }} />
        </motion.button>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>Appearance</h1>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ ...G, borderRadius: "24px", overflow: "hidden" }}>
          {/* Theme */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px", borderBottom: "1px solid var(--glass-border)" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,107,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Palette size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>Theme Mode</p>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "1px" }}>Switch between light and dark</p>
            </div>
            <ThemeToggle />
          </div>

          {/* Typography */}
          <div style={{ padding: "20px", borderBottom: "1px solid var(--glass-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,107,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Type size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>Typography</p>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "1px" }}>Adjust text size: {fontSize}px</p>
              </div>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              style={{
                width: "100%",
                accentColor: "var(--accent)",
                cursor: "pointer",
                height: "6px",
                borderRadius: "10px",
                appearance: "none",
                background: "rgba(120, 120, 128, 0.2)",
                outline: "none"
              }}
            />
            <p style={{ fontSize: `${fontSize}px`, color: "var(--foreground)", marginTop: "12px", transition: "font-size 0.2s" }}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>

          {/* Brightness */}
          <div style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,107,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Sun size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>Display Brightness</p>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "1px" }}>Level: {Math.round(brightness * 100)}%</p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={brightness}
              onChange={(e) => setBrightness(parseFloat(e.target.value))}
              style={{
                width: "100%",
                accentColor: "var(--accent)",
                cursor: "pointer",
                height: "6px",
                borderRadius: "10px",
                appearance: "none",
                background: "rgba(120, 120, 128, 0.2)",
                outline: "none"
              }}
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => router.back()}
          style={{
            width: "200px", height: "52px", borderRadius: "50px",
            background: "var(--accent)", color: "white",
            fontSize: "14px", fontWeight: 800, border: "none",
            marginTop: "32px", marginInline: "auto", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(255,107,43,0.35)",
            letterSpacing: "-0.2px",
          }}
        >
          Save Changes
        </motion.button>
      </div>
    </div>
  );
}
