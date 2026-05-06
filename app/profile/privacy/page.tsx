"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, EyeOff, UserX } from "lucide-react";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <div style={{ padding: "40px 20px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          style={{ width: "40px", height: "40px", borderRadius: "12px", ...G, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <ArrowLeft size={18} style={{ color: "var(--foreground)" }} />
        </motion.button>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>Privacy & Security</h1>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ ...G, borderRadius: "24px", overflow: "hidden" }}>
          {[
            { id: "password", label: "Change Password", sub: "Last changed 3 months ago", icon: Lock },
            { id: "visibility", label: "Profile Visibility", sub: "Make your profile private", icon: EyeOff },
            { id: "data", label: "Data & Permissions", sub: "Manage what we share", icon: Shield },
            { id: "delete", label: "Delete Account", sub: "Permanently remove your data", icon: UserX, danger: true },
          ].map((item, i, arr) => (
            <div
              key={item.id}
              style={{
                display: "flex", alignItems: "center", gap: "16px", padding: "20px",
                borderBottom: i < arr.length - 1 ? "1px solid var(--glass-border)" : "none",
                cursor: "pointer",
              }}
            >
              <div style={{
                width: "40px", height: "40px", borderRadius: "12px",
                background: item.danger ? "rgba(239,68,68,0.1)" : "rgba(255,107,43,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <item.icon size={18} style={{ color: item.danger ? "#EF4444" : "var(--accent)" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "15px", fontWeight: 700, color: item.danger ? "#EF4444" : "var(--foreground)" }}>{item.label}</p>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "1px" }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
