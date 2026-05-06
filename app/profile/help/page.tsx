"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle, MessageCircle, ExternalLink } from "lucide-react";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

const FAQS = [
  { q: "How do I scan a dish?", a: "Tap the camera icon on the home screen or navigation bar, and point it at any food item. Our AI will identify it instantly." },
  { q: "Can I save recipes offline?", a: "Yes, you can bookmark any recipe and access it later from your Saved Recipes section in your profile." },
  { q: "Is Foodipa available globally?", a: "Absolutely! We cover cuisines from over 195 countries and support multiple languages." },
];

export default function HelpPage() {
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
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>Help & FAQ</h1>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ ...G, borderRadius: "20px", padding: "20px" }}
            >
              <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)", marginBottom: "8px" }}>{faq.q}</p>
              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{faq.a}</p>
            </motion.div>
          ))}
        </div>

        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "14px" }}>
          Contact Us
        </p>

        <div style={{ ...G, borderRadius: "20px", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px", borderBottom: "1px solid var(--glass-border)", cursor: "pointer" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "11px", background: "rgba(255,107,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageCircle size={16} style={{ color: "var(--accent)" }} />
            </div>
            <p style={{ flex: 1, fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>Live Chat Support</p>
            <ExternalLink size={14} style={{ color: "var(--muted)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px", cursor: "pointer" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "11px", background: "rgba(255,107,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HelpCircle size={16} style={{ color: "var(--accent)" }} />
            </div>
            <p style={{ flex: 1, fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>Report a Problem</p>
            <ExternalLink size={14} style={{ color: "var(--muted)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
