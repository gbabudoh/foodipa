"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SocialAuthButtons } from "@/components/social-auth-buttons";

function Orb({ x, y, size, color, delay }: { x: string; y: string; size: number; color: string; delay: number }) {
  return (
    <motion.div
      animate={{ y: [0, -24, 0], x: [0, 10, 0] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      style={{
        position: "absolute", left: x, top: y,
        width: size, height: size, borderRadius: "50%",
        background: color, filter: "blur(80px)",
        opacity: 0.3, pointerEvents: "none",
      }}
    />
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        position: "relative",
        overflow: "hidden",
        background: "var(--background)",
      }}
    >
      {/* Background orbs */}
      <Orb x="-8%"  y="8%"  size={380} color="rgba(255,107,43,0.7)"  delay={0}   />
      <Orb x="60%"  y="-5%" size={320} color="rgba(124,58,237,0.55)" delay={1.6} />
      <Orb x="45%"  y="65%" size={280} color="rgba(236,72,153,0.4)"  delay={3}   />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: "440px",
          borderRadius: "32px",
          overflow: "hidden",
          background: "var(--glass-bg)",
          backdropFilter: "blur(48px)",
          WebkitBackdropFilter: "blur(48px)",
          border: "1px solid var(--glass-border)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.55)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header strip */}
        <div
          style={{
            padding: "24px 28px 20px",
            background: "linear-gradient(135deg, rgba(255,107,43,0.1) 0%, rgba(124,58,237,0.07) 100%)",
            borderBottom: "1px solid var(--glass-border)",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {/* Back to intro */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => router.push("/auth/intro")}
            style={{
              width: "36px", height: "36px", borderRadius: "12px",
              background: "var(--glass-bg)", backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid var(--glass-border)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ArrowLeft size={15} style={{ color: "var(--muted)" }} />
          </motion.button>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "34px", height: "34px", borderRadius: "11px",
                background: "linear-gradient(135deg, var(--accent), #FF9A4C)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "17px", boxShadow: "0 3px 12px rgba(255,107,43,0.38)",
              }}
            >
              🍜
            </div>
            <span
              style={{
                fontSize: "18px", fontWeight: 900, letterSpacing: "-0.3px",
                background: "linear-gradient(135deg, var(--accent), #FF9A4C)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}
            >
              foodipa
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "28px" }}>

          {/* Heading */}
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
              Sign in 👋
            </h1>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "5px" }}>
              Continue your culinary journey
            </p>
          </div>

          {/* Social */}
          <SocialAuthButtons />

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
            <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 700, letterSpacing: "0.06em" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* Email */}
            <motion.div animate={{ scale: focused === "email" ? 1.01 : 1 }} transition={{ duration: 0.15 }}>
              <div
                style={{
                  borderRadius: "14px", height: "52px",
                  display: "flex", alignItems: "center", gap: "12px", padding: "0 16px",
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                  border: focused === "email" ? "1.5px solid var(--accent)" : "1px solid var(--glass-border)",
                  boxShadow: focused === "email" ? "0 0 0 3px rgba(255,107,43,0.12)" : "none",
                  transition: "border 0.2s, box-shadow 0.2s",
                }}
              >
                <Mail size={15} style={{ color: focused === "email" ? "var(--accent)" : "var(--muted)", flexShrink: 0, transition: "color 0.2s" }} />
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="your@email.com"
                  required
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--foreground)", fontFamily: "inherit" }}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div animate={{ scale: focused === "password" ? 1.01 : 1 }} transition={{ duration: 0.15 }}>
              <div
                style={{
                  borderRadius: "14px", height: "52px",
                  display: "flex", alignItems: "center", gap: "12px", padding: "0 16px",
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                  border: focused === "password" ? "1.5px solid var(--accent)" : "1px solid var(--glass-border)",
                  boxShadow: focused === "password" ? "0 0 0 3px rgba(255,107,43,0.12)" : "none",
                  transition: "border 0.2s, box-shadow 0.2s",
                }}
              >
                <Lock size={15} style={{ color: focused === "password" ? "var(--accent)" : "var(--muted)", flexShrink: 0, transition: "color 0.2s" }} />
                <input
                  type={showPw ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="Your password"
                  required
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--foreground)", fontFamily: "inherit" }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--muted)", display: "flex", alignItems: "center" }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </motion.div>

            {/* Forgot */}
            <div style={{ textAlign: "right", marginTop: "-4px" }}>
              <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}>
                Forgot password?
              </span>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ fontSize: "13px", color: "#EF4444", padding: "10px 14px", borderRadius: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              whileHover={{ boxShadow: "0 10px 32px rgba(255,107,43,0.5)" }}
              disabled={loading}
              style={{
                height: "52px", borderRadius: "14px",
                background: "linear-gradient(135deg, #FF6B2B 0%, #FF9A4C 100%)",
                color: "white", fontSize: "15px", fontWeight: 800,
                border: "none", cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: "0 4px 20px rgba(255,107,43,0.38)",
                letterSpacing: "-0.2px",
              }}
            >
              {loading
                ? <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.35)", borderTopColor: "white", animation: "spin 0.8s linear infinite" }} />
                : <><span>Sign in</span><ArrowRight size={16} /></>
              }
            </motion.button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--muted)", marginTop: "20px" }}>
            New to Foodipa?{" "}
            <Link href="/auth/register" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
