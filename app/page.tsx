"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search, TrendingUp, Flame, ArrowUpRight, ArrowRight, Sparkles, Globe, Camera, FlaskConical, BookOpen, Activity, MapPin, ChevronRight } from "lucide-react";
import { useState } from "react";

/* ─── Shared data ────────────────────────────────────────── */

const features = [
  {
    href: "/discover",
    icon: MapPin,
    emoji: "🗺️",
    title: "Global Food Finder",
    subtitle: "Restaurants & markets near you",
    description: "Discover authentic restaurants, street food markets, and hidden culinary gems anywhere in the world using real-time location.",
    gradient: "linear-gradient(140deg, #FF6B2B 0%, #C94A10 100%)",
    glow: "rgba(255, 107, 43, 0.28)",
    color: "#FF6B2B",
  },
  {
    href: "/lab",
    icon: FlaskConical,
    emoji: "🧪",
    title: "The Lab",
    subtitle: "AI-powered recipes",
    description: "Generate custom recipes, cocktails, and meal ideas powered by Groq AI. From fridge leftovers to Michelin-star dishes.",
    gradient: "linear-gradient(140deg, #7C3AED 0%, #4338CA 100%)",
    glow: "rgba(124, 58, 237, 0.22)",
    color: "#7C3AED",
  },
  {
    href: "/culture",
    icon: BookOpen,
    emoji: "🌍",
    title: "Culture Hub",
    subtitle: "Food origins & traditions",
    description: "Explore the rich history and traditions behind world cuisines. From Japanese ramen to West African jollof — every dish tells a story.",
    gradient: "linear-gradient(140deg, #F59E0B 0%, #D97706 100%)",
    glow: "rgba(245, 158, 11, 0.22)",
    color: "#F59E0B",
  },
  {
    href: "/pulse",
    icon: Activity,
    emoji: "📸",
    title: "Food Pulse",
    subtitle: "Share your adventures",
    description: "Join a global community of food lovers. Share your discoveries, get inspired by others, and stay on top of culinary trends.",
    gradient: "linear-gradient(140deg, #10B981 0%, #047857 100%)",
    glow: "rgba(16, 185, 129, 0.22)",
    color: "#10B981",
  },
  {
    href: "/scan",
    icon: Camera,
    emoji: "📷",
    title: "Food Scanner",
    subtitle: "Instant AI identification",
    description: "Point your camera at any dish and get instant identification, ingredients, cultural origin, and perfect pairing suggestions.",
    gradient: "linear-gradient(140deg, #EC4899 0%, #9D174D 100%)",
    glow: "rgba(236, 72, 153, 0.22)",
    color: "#EC4899",
  },
];

const bentoCards = [
  { href: "/discover", emoji: "🗺️", title: "Global Food Finder", subtitle: "Restaurants & markets near you", gradient: "linear-gradient(140deg, #FF6B2B 0%, #C94A10 100%)", glow: "rgba(255, 107, 43, 0.28)", span: "full" },
  { href: "/lab", emoji: "🧪", title: "The Lab", subtitle: "AI-powered recipes", gradient: "linear-gradient(140deg, #7C3AED 0%, #4338CA 100%)", glow: "rgba(124, 58, 237, 0.22)", span: "half" },
  { href: "/culture", emoji: "🌍", title: "Culture Hub", subtitle: "Food origins & traditions", gradient: "linear-gradient(140deg, #F59E0B 0%, #D97706 100%)", glow: "rgba(245, 158, 11, 0.22)", span: "half" },
  { href: "/pulse", emoji: "📸", title: "Food Pulse", subtitle: "Share your adventures", gradient: "linear-gradient(140deg, #10B981 0%, #047857 100%)", glow: "rgba(16, 185, 129, 0.22)", span: "half" },
  { href: "/lab?mode=fridge", emoji: "❄️", title: "Fridge Raid", subtitle: "Cook with what you have", gradient: "linear-gradient(140deg, #EC4899 0%, #9D174D 100%)", glow: "rgba(236, 72, 153, 0.22)", span: "half" },
];

const trending = [
  { name: "Jollof Wars 2025", flags: "🇳🇬🇬🇭", tag: "#JollofWars", hot: true },
  { name: "Korean Street Food", flags: "🇰🇷", tag: "#KStreetFood", hot: false },
  { name: "Smash Burger Renaissance", flags: "🍔", tag: "#SmashBurger", hot: true },
];

const stats = [
  { emoji: "🌮", value: "195+", label: "Cuisines" },
  { emoji: "📖", value: "12K+", label: "Recipes" },
  { emoji: "👨‍🍳", value: "84K+", label: "Explorers" },
];

/* ─── Helpers ────────────────────────────────────────────── */

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

/* ─── Page ───────────────────────────────────────────────── */

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <>
      {/* ══════════════════════════════════════════
          MOBILE LAYOUT
      ══════════════════════════════════════════ */}
      <div className="mobile-only" style={{ minHeight: "100vh", maxWidth: "512px", margin: "0 auto" }}>

        {/* Hero */}
        <div style={{ padding: "32px 20px 28px" }}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--muted)", letterSpacing: "0.02em" }}>Good appetite! 👋</p>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--foreground)", lineHeight: 1.22, letterSpacing: "-0.5px", marginTop: "6px" }}>
              What are you <span style={{ color: "var(--accent)" }}>craving</span> today?
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4 }} style={{ marginTop: "20px" }}>
            <div style={{ ...G, borderRadius: "16px", height: "54px", display: "flex", alignItems: "center", gap: "12px", padding: "0 18px" }}>
              <Search size={18} style={{ color: "var(--muted)", flexShrink: 0 }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cuisines, dishes, restaurants…"
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--foreground)" }}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ ...G, borderRadius: "50px", display: "flex", alignItems: "center", gap: "7px", padding: "9px 14px" }}>
                <span style={{ fontSize: "15px" }}>{s.emoji}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)" }}>{s.value}</span>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bento grid */}
        <div style={{ padding: "0 20px" }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }} style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "14px" }}>
            Explore
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
            <Link href="/discover" style={{ display: "block", textDecoration: "none" }}>
              <motion.div whileTap={{ scale: 0.97 }} style={{ position: "relative", overflow: "hidden", borderRadius: "24px", height: "178px", background: bentoCards[0].gradient, boxShadow: `0 8px 36px ${bentoCards[0].glow}`, cursor: "pointer" }}>
                <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.13)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -40, right: 60, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, padding: "24px", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "2.6rem", lineHeight: 1 }}>{bentoCards[0].emoji}</span>
                  <div style={{ marginTop: "auto" }}>
                    <h3 style={{ color: "white", fontSize: "22px", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.3px" }}>{bentoCards[0].title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "13px", marginTop: "5px" }}>{bentoCards[0].subtitle}</p>
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: 22, right: 20, display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", borderRadius: "50px", padding: "7px 14px", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <span style={{ color: "white", fontSize: "12px", fontWeight: 700 }}>Explore</span>
                  <ArrowUpRight size={12} color="white" />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
            {bentoCards.slice(1, 3).map((card, i) => (
              <motion.div key={card.href} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}>
                <Link href={card.href} style={{ display: "block", textDecoration: "none" }}>
                  <motion.div whileTap={{ scale: 0.95 }} style={{ position: "relative", overflow: "hidden", borderRadius: "20px", height: "155px", background: card.gradient, boxShadow: `0 6px 24px ${card.glow}`, cursor: "pointer" }}>
                    <div style={{ position: "absolute", top: -35, right: -35, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.13)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", inset: 0, padding: "20px", display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "2.1rem", lineHeight: 1 }}>{card.emoji}</span>
                      <div style={{ marginTop: "auto" }}>
                        <h3 style={{ color: "white", fontSize: "15px", fontWeight: 700, lineHeight: 1.25 }}>{card.title}</h3>
                        <p style={{ color: "rgba(255,255,255,0.70)", fontSize: "12px", marginTop: "4px", lineHeight: 1.3 }}>{card.subtitle}</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
            {bentoCards.slice(3).map((card, i) => (
              <motion.div key={card.href} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 + i * 0.06 }}>
                <Link href={card.href} style={{ display: "block", textDecoration: "none" }}>
                  <motion.div whileTap={{ scale: 0.95 }} style={{ position: "relative", overflow: "hidden", borderRadius: "20px", height: "136px", background: card.gradient, boxShadow: `0 6px 24px ${card.glow}`, cursor: "pointer" }}>
                    <div style={{ position: "absolute", top: -30, right: -30, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.13)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", inset: 0, padding: "18px 20px", display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "1.9rem", lineHeight: 1 }}>{card.emoji}</span>
                      <div style={{ marginTop: "auto" }}>
                        <h3 style={{ color: "white", fontSize: "14px", fontWeight: 700, lineHeight: 1.25 }}>{card.title}</h3>
                        <p style={{ color: "rgba(255,255,255,0.70)", fontSize: "11px", marginTop: "3px", lineHeight: 1.3 }}>{card.subtitle}</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div style={{ padding: "32px 20px 36px" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>Trending Now</p>
            <TrendingUp size={14} style={{ color: "var(--accent)" }} />
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {trending.map((item, i) => (
              <motion.div key={item.tag} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.44 + i * 0.07 }} style={{ ...G, borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "1.6rem" }}>{item.flags}</span>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>{item.name}</p>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--accent)", marginTop: "2px" }}>{item.tag}</p>
                  </div>
                </div>
                {item.hot && (
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "50px", background: "rgba(255, 107, 43, 0.12)", color: "var(--accent)", fontSize: "10px", fontWeight: 700 }}>
                    <Flame size={10} />HOT
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════
          DESKTOP LAYOUT
      ══════════════════════════════════════════ */}
      <div className="desktop-only">

        {/* ── Hero Section ── */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 40px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

          {/* Left — copy */}
          <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "50px", background: "rgba(255,107,43,0.1)", border: "1px solid rgba(255,107,43,0.2)", marginBottom: "24px" }}>
              <Sparkles size={13} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.05em" }}>AI-POWERED FOOD DISCOVERY</span>
            </div>

            <h1 style={{ fontSize: "60px", fontWeight: 900, color: "var(--foreground)", lineHeight: 1.08, letterSpacing: "-2px", marginBottom: "24px" }}>
              Your culinary{" "}
              <span style={{ background: "linear-gradient(135deg, var(--accent) 0%, #FF9A4C 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                universe
              </span>{" "}
              starts here
            </h1>

            <p style={{ fontSize: "18px", color: "var(--muted)", lineHeight: 1.7, marginBottom: "36px", maxWidth: "480px" }}>
              Discover global cuisines, generate AI recipes, explore food culture, and connect with 84,000+ food adventurers worldwide.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "48px" }}>
              <Link href="/discover" style={{ textDecoration: "none" }}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "16px 28px", borderRadius: "16px", background: "var(--accent)", color: "white", fontSize: "15px", fontWeight: 700, boxShadow: "0 6px 24px rgba(255,107,43,0.38)", cursor: "pointer" }}>
                  <Globe size={18} />
                  Start Exploring
                  <ArrowRight size={16} />
                </motion.div>
              </Link>
              <Link href="/scan" style={{ textDecoration: "none" }}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "16px 28px", borderRadius: "16px", ...G, color: "var(--foreground)", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
                  <Camera size={18} />
                  Scan a Dish
                </motion.div>
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "32px" }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <p style={{ fontSize: "28px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>{s.emoji} {s.value}</p>
                  <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — feature cards mosaic */}
          <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.1 }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto", gap: "14px" }}>
            {features.slice(0, 4).map((f, i) => (
              <Link key={f.href} href={f.href} style={{ textDecoration: "none", gridRow: i === 0 ? "1" : undefined }}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: `0 16px 48px ${f.glow}` }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "20px",
                    height: i === 0 ? "180px" : "140px",
                    background: f.gradient,
                    boxShadow: `0 8px 28px ${f.glow}`,
                    cursor: "pointer",
                    padding: "22px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.12)", pointerEvents: "none" }} />
                  <span style={{ fontSize: "2rem", lineHeight: 1 }}>{f.emoji}</span>
                  <div style={{ marginTop: "auto" }}>
                    <h3 style={{ color: "white", fontSize: "15px", fontWeight: 700 }}>{f.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", marginTop: "3px" }}>{f.subtitle}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </section>

        {/* ── Features Section ── */}
        <section style={{ background: "var(--glass-bg)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--glass-border)", borderBottom: "1px solid var(--glass-border)", padding: "80px 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "56px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "12px" }}>Everything you need</p>
              <h2 style={{ fontSize: "42px", fontWeight: 900, color: "var(--foreground)", letterSpacing: "-1px", lineHeight: 1.1 }}>
                Five ways to explore food
              </h2>
              <p style={{ fontSize: "17px", color: "var(--muted)", marginTop: "16px", maxWidth: "560px", margin: "16px auto 0", lineHeight: 1.65 }}>
                From AI-generated recipes to real-time restaurant discovery — Foodipa is your complete culinary companion.
              </p>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {features.map((f, i) => (
                <motion.div
                  key={f.href}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link href={f.href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        ...G,
                        borderRadius: "24px",
                        padding: "28px",
                        height: "100%",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: f.gradient, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 20px ${f.glow}` }}>
                        <f.icon size={24} color="white" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--foreground)", marginBottom: "8px" }}>{f.title}</h3>
                        <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.65 }}>{f.description}</p>
                      </div>
                      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "6px", color: f.color, fontSize: "13px", fontWeight: 700 }}>
                        Explore <ChevronRight size={14} />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trending + Search Section ── */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>

            {/* Search */}
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "14px" }}>Find anything</p>
              <h2 style={{ fontSize: "36px", fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: "20px" }}>
                Search the world&apos;s culinary knowledge
              </h2>
              <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.7, marginBottom: "28px" }}>
                From Oaxacan mole to Sichuan hotpot — search any dish, ingredient, or cuisine and get instant AI-powered insights.
              </p>
              <div style={{ ...G, borderRadius: "18px", height: "58px", display: "flex", alignItems: "center", gap: "14px", padding: "0 20px" }}>
                <Search size={20} style={{ color: "var(--muted)", flexShrink: 0 }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search cuisines, dishes, ingredients…"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "15px", color: "var(--foreground)" }}
                />
                <Link href={`/lab?prompt=${encodeURIComponent(query || "Surprise me")}`} style={{ textDecoration: "none" }}>
                  <div style={{ padding: "8px 16px", borderRadius: "12px", background: "var(--accent)", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                    Ask AI →
                  </div>
                </Link>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
                {["Sushi 🍣", "Pasta 🍝", "Tacos 🌮", "Biryani 🍛", "Ramen 🍜"].map((chip) => (
                  <button key={chip} onClick={() => setQuery(chip.split(" ")[0])} style={{ padding: "7px 14px", borderRadius: "50px", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", fontSize: "13px", color: "var(--foreground)", cursor: "pointer", fontWeight: 500 }}>
                    {chip}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Trending */}
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>Trending Now</p>
                <TrendingUp size={16} style={{ color: "var(--accent)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {trending.map((item) => (
                  <motion.div
                    key={item.tag}
                    whileHover={{ x: 4 }}
                    style={{ ...G, borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ fontSize: "2rem" }}>{item.flags}</span>
                      <div>
                        <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--foreground)" }}>{item.name}</p>
                        <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--accent)", marginTop: "3px" }}>{item.tag}</p>
                      </div>
                    </div>
                    {item.hot ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", borderRadius: "50px", background: "rgba(255, 107, 43, 0.12)", color: "var(--accent)", fontSize: "11px", fontWeight: 700 }}>
                        <Flame size={11} />HOT
                      </div>
                    ) : (
                      <ChevronRight size={16} style={{ color: "var(--muted)" }} />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section style={{ maxWidth: "1280px", margin: "0 auto 80px", padding: "0 40px" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              borderRadius: "32px",
              padding: "64px",
              background: "linear-gradient(135deg, #FF6B2B 0%, #FF9A4C 50%, #C94A10 100%)",
              boxShadow: "0 20px 60px rgba(255,107,43,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
            <div style={{ position: "absolute", bottom: -60, left: 200, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "38px", fontWeight: 900, color: "white", letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: "12px" }}>
                Get Foodipa on your phone
              </h2>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.82)", lineHeight: 1.6, maxWidth: "440px" }}>
                Scan dishes in real life, get haptic feedback, use your camera — the full native experience on iOS and Android.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexShrink: 0, position: "relative", zIndex: 1 }}>
              {["🍎  App Store", "🤖  Google Play"].map((label) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ padding: "14px 24px", borderRadius: "16px", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)", color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
                >
                  {label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
}
