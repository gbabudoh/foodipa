"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Mail, Smartphone, Check } from "lucide-react";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

export default function NotificationsPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState({
    push: true,
    email: true,
    marketing: false,
    discover: true,
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Header */}
      <div style={{ padding: "40px 20px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          style={{ width: "40px", height: "40px", borderRadius: "12px", ...G, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--foreground)" }} />
        </motion.button>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>Notifications</h1>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ ...G, borderRadius: "24px", overflow: "hidden" }}>
          {[
            { id: "push", label: "Push Notifications", sub: "Instant alerts on your device", icon: Smartphone },
            { id: "email", label: "Email Updates", sub: "Weekly summaries and news", icon: Mail },
            { id: "discover", label: "New Discoveries", sub: "Alerts for trending food near you", icon: Bell },
          ].map((item, i, arr) => (
            <div
              key={item.id}
              onClick={() => setPrefs(p => ({ ...p, [item.id]: !p[item.id as keyof typeof prefs] }))}
              style={{
                display: "flex", alignItems: "center", gap: "16px", padding: "20px",
                borderBottom: i < arr.length - 1 ? "1px solid var(--glass-border)" : "none",
                cursor: "pointer",
              }}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,107,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <item.icon size={18} style={{ color: "var(--accent)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>{item.label}</p>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "1px" }}>{item.sub}</p>
              </div>
              <div style={{
                width: "24px", height: "24px", borderRadius: "6px",
                background: prefs[item.id as keyof typeof prefs] ? "var(--accent)" : "rgba(255,107,43,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}>
                {prefs[item.id as keyof typeof prefs] && <Check size={14} color="white" />}
              </div>
            </div>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.back()}
          style={{
            width: "100%", height: "54px", borderRadius: "16px",
            background: "var(--accent)", color: "white",
            fontSize: "15px", fontWeight: 700, border: "none",
            marginTop: "24px", cursor: "pointer",
            boxShadow: "0 8px 32px rgba(255,107,43,0.3)",
          }}
        >
          Save Preferences
        </motion.button>
      </div>
    </div>
  );
}
