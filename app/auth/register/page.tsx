"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SocialAuthButtons } from "@/components/social-auth-buttons";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/onboarding");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: "440px" }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span style={{ fontSize: "40px" }}>🍜</span>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.5px", marginTop: "8px" }}>
            Join Foodipa
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "6px" }}>
            Create your culinary passport
          </p>
        </div>

        {/* Social sign-in */}
        <SocialAuthButtons />

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "22px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
          <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, whiteSpace: "nowrap" }}>or sign up with email</span>
          <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
        </div>

        {/* Credentials form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Your Name</label>
            <div style={{ ...G, borderRadius: "14px", height: "52px", display: "flex", alignItems: "center", gap: "12px", padding: "0 16px" }}>
              <User size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Chef Gordon" required style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--foreground)" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Email</label>
            <div style={{ ...G, borderRadius: "14px", height: "52px", display: "flex", alignItems: "center", gap: "12px", padding: "0 16px" }}>
              <Mail size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--foreground)" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Password</label>
            <div style={{ ...G, borderRadius: "14px", height: "52px", display: "flex", alignItems: "center", gap: "12px", padding: "0 16px" }}>
              <Lock size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--foreground)" }} />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--muted)" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: "13px", color: "#EF4444", padding: "10px 14px", borderRadius: "10px", background: "rgba(239,68,68,0.08)" }}>
              ⚠️ {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            style={{ marginTop: "4px", height: "52px", borderRadius: "14px", background: "var(--accent)", color: "white", fontSize: "15px", fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 20px rgba(255,107,43,0.35)" }}
          >
            {loading ? "Creating account…" : (<>Create account <ArrowRight size={16} /></>)}
          </motion.button>
        </form>

        <p style={{ textAlign: "center", fontSize: "14px", color: "var(--muted)", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
