"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 0,
    emoji: "🍜",
    tag: "Welcome to Foodipa",
    title: "Your Culinary\nUniverse Awaits",
    desc: "Explore food, culture and flavour from every corner of the earth — all in one beautifully crafted app.",
    bg: ["#FF6B2B", "#FF3D00", "#C94A10"],
    orb1: "rgba(255,180,100,0.6)",
    orb2: "rgba(255,80,0,0.4)",
    pattern: "🍝 🌮 🍱 🥘 🍣 🫕 🥗 🍛 🫔 🥙",
  },
  {
    id: 1,
    emoji: "📷",
    tag: "AI Food Scanner",
    title: "Scan. Identify.\nExplore.",
    desc: "Point your camera at any dish anywhere in the world. Get instant AI identification, ingredients, cultural origin and perfect pairings.",
    bg: ["#7C3AED", "#5B21B6", "#4C1D95"],
    orb1: "rgba(167,139,250,0.6)",
    orb2: "rgba(109,40,217,0.4)",
    pattern: "🔍 📸 🤖 ✨ 🧠 📱 🎯 💡 🔬 🍽️",
  },
  {
    id: 2,
    emoji: "🧪",
    tag: "AI Recipe Lab",
    title: "Cook Smarter\nwith AI",
    desc: "Generate custom recipes from what's in your fridge. Create cocktails, swap ingredients, and get personalised meal plans — powered by Groq.",
    bg: ["#059669", "#047857", "#065F46"],
    orb1: "rgba(52,211,153,0.6)",
    orb2: "rgba(16,185,129,0.4)",
    pattern: "🥦 🧅 🫑 🥕 🧄 🌿 🫒 🥚 🧀 🌶️",
  },
  {
    id: 3,
    emoji: "🌍",
    tag: "Community & Culture",
    title: "Every Dish\nTells a Story",
    desc: "Explore food culture from 195 countries, share your culinary adventures, and connect with a global community of passionate food lovers.",
    bg: ["#F59E0B", "#D97706", "#B45309"],
    orb1: "rgba(252,211,77,0.6)",
    orb2: "rgba(245,158,11,0.4)",
    pattern: "🇯🇵 🇮🇹 🇳🇬 🇲🇽 🇮🇳 🇫🇷 🇰🇷 🇹🇭 🇱🇧 🇪🇸",
  },
];

function FloatingPattern({ text }: { text: string }) {
  const items = text.split(" ");
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {items.map((char, i) => (
        <motion.span
          key={i}
          animate={{
            y: [0, -14, 0],
            x: [0, i % 2 === 0 ? 6 : -6, 0],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${8 + (i * 19) % 85}%`,
            top: `${10 + (i * 23) % 78}%`,
            fontSize: "28px",
            userSelect: "none",
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

export default function IntroPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  // Auto-advance
  useEffect(() => {
    if (isLast) return;
    const t = setTimeout(() => {
      setDirection(1);
      setIdx(i => i + 1);
    }, 4800);
    return () => clearTimeout(t);
  }, [idx, isLast]);

  function next() {
    if (isLast) {
      router.push("/auth/login");
    } else {
      setDirection(1);
      setIdx(i => i + 1);
    }
  }

  function goTo(i: number) {
    setDirection(i > idx ? 1 : -1);
    setIdx(i);
  }

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      {/* ── Animated background ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${idx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(160deg, ${slide.bg[0]} 0%, ${slide.bg[1]} 55%, ${slide.bg[2]} 100%)`,
          }}
        >
          {/* Orb 1 */}
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", top: "-15%", left: "-10%",
              width: "70vw", height: "70vw",
              borderRadius: "50%",
              background: slide.orb1,
              filter: "blur(80px)",
            }}
          />
          {/* Orb 2 */}
          <motion.div
            animate={{ x: [0, -24, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            style={{
              position: "absolute", bottom: "5%", right: "-15%",
              width: "60vw", height: "60vw",
              borderRadius: "50%",
              background: slide.orb2,
              filter: "blur(90px)",
            }}
          />
          {/* Floating pattern */}
          <FloatingPattern text={slide.pattern} />
          {/* Glass overlay */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)" }} />
        </motion.div>
      </AnimatePresence>

      {/* ── UI Layer ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          maxWidth: "480px",
          margin: "0 auto",
          padding: "0 28px",
        }}
      >
        {/* Skip */}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "56px" }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push("/auth/login")}
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "50px",
              padding: "7px 16px",
              fontSize: "13px",
              fontWeight: 600,
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Skip <ChevronRight size={13} />
          </motion.button>
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "32px" }}>

          {/* Emoji icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`emoji-${idx}`}
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "32px",
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "52px",
                  boxShadow: "0 12px 48px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                {slide.emoji}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${idx}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
              style={{ textAlign: "center" }}
            >
              {/* Tag */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginBottom: "14px",
                  padding: "5px 14px",
                  borderRadius: "50px",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "0.04em",
                }}
              >
                {slide.tag}
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: "38px",
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1.15,
                  letterSpacing: "-0.8px",
                  marginBottom: "16px",
                  whiteSpace: "pre-line",
                  textShadow: "0 2px 20px rgba(0,0,0,0.2)",
                }}
              >
                {slide.title}
              </h1>

              {/* Desc */}
              <p
                style={{
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 1.65,
                  maxWidth: "340px",
                  margin: "0 auto",
                }}
              >
                {slide.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom controls ── */}
        <div style={{ paddingBottom: "48px", display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: "7px" }}>
            {SLIDES.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => goTo(i)}
                animate={{
                  width: i === idx ? 28 : 8,
                  opacity: i === idx ? 1 : 0.45,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  height: "8px",
                  borderRadius: "99px",
                  background: "white",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* CTA button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={next}
            style={{
              width: "100%",
              height: "58px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.6)",
              color: slide.bg[0],
              fontSize: "16px",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              letterSpacing: "-0.2px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {isLast ? "Get Started" : "Next"}
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight size={18} />
            </motion.div>
          </motion.button>

          {/* Already have account */}
          {isLast && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}
            >
              Already have an account?{" "}
              <span
                onClick={() => router.push("/auth/login")}
                style={{ color: "white", fontWeight: 700, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                Sign in
              </span>
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
