"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChefHat, Loader2, RefreshCw, Copy, Check } from "lucide-react";
import { useState, useRef } from "react";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

const modes = [
  { id: "recipe", label: "Recipe Generator", emoji: "📖", placeholder: "E.g. A creamy Nigerian pepper soup with goat meat…" },
  { id: "fridge", label: "Fridge Raid", emoji: "❄️", placeholder: "E.g. I have eggs, tomatoes, onion, rice, and canned beans…" },
  { id: "cocktail", label: "Cocktail Lab", emoji: "🍹", placeholder: "E.g. A tropical cocktail with rum and passion fruit…" },
  { id: "substitute", label: "Ingredient Swap", emoji: "🔄", placeholder: "E.g. What can I use instead of heavy cream in a pasta?" },
];

const quickPrompts = [
  "Quick 15-min dinner idea",
  "Healthy breakfast bowl",
  "Vegan Nigerian stew",
  "5-ingredient pasta",
  "Traditional miso soup",
  "Spicy Korean ramen",
];

export default function LabPage() {
  const [activeMode, setActiveMode] = useState("recipe");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentMode = modes.find((m) => m.id === activeMode)!;

  async function generateRecipe() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode: activeMode }),
      });
      const data = await res.json();
      setResult(data.recipe || "No recipe generated. Please try again.");
    } catch {
      setResult("⚠️ Could not reach the AI. Make sure your GROQ_API_KEY is set in .env.local.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="desktop-page-inner" style={{ minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ padding: "32px 20px 28px" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.4px" }}>
            The Lab 🧪
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "5px" }}>
            AI-powered recipe generation, powered by Groq
          </p>
        </motion.div>

        {/* Mode selector */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "24px" }}
        >
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => { setActiveMode(mode.id); setResult(""); }}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "14px 16px", borderRadius: "18px",
                fontSize: "12px", fontWeight: 600, textAlign: "left",
                cursor: "pointer", transition: "all 0.2s", border: "none",
                ...(activeMode === mode.id
                  ? { background: "var(--accent)", color: "white", boxShadow: "0 4px 18px rgba(255,107,43,0.32)" }
                  : { ...G, color: "var(--foreground)" }
                ),
              }}
            >
              <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{mode.emoji}</span>
              <span style={{ lineHeight: 1.3 }}>{mode.label}</span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* ── Input Area ── */}
      <div style={{ padding: "0 20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          style={{ ...G, borderRadius: "22px", overflow: "hidden" }}
        >
          <div style={{ padding: "20px 20px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span style={{ fontSize: "1.3rem" }}>{currentMode.emoji}</span>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>
                {currentMode.label}
              </span>
            </div>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={currentMode.placeholder}
              rows={3}
              style={{
                width: "100%", background: "transparent", border: "none", outline: "none",
                fontSize: "14px", color: "var(--foreground)", resize: "none", lineHeight: 1.6,
                fontFamily: "inherit",
              }}
              onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) generateRecipe(); }}
            />
          </div>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 20px", borderTop: "1px solid var(--glass-border)",
          }}>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>⌘↵ to generate</span>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={generateRecipe}
              disabled={!prompt.trim() || loading}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 20px", borderRadius: "12px",
                fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer",
                transition: "all 0.2s",
                background: prompt.trim() && !loading ? "var(--accent)" : "var(--glass-border)",
                color: prompt.trim() && !loading ? "white" : "var(--muted)",
                boxShadow: prompt.trim() && !loading ? "0 4px 14px rgba(255,107,43,0.3)" : "none",
              }}
            >
              {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={14} />}
              {loading ? "Cooking…" : "Generate"}
            </motion.button>
          </div>
        </motion.div>

        {/* Quick prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          style={{ marginTop: "24px" }}
        >
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "12px" }}>
            Quick Ideas
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                style={{
                  ...G, borderRadius: "50px",
                  padding: "9px 16px", fontSize: "12px", fontWeight: 500,
                  color: "var(--foreground)", cursor: "pointer", border: "1px solid var(--glass-border)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {(result || loading) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{ ...G, borderRadius: "22px", overflow: "hidden", marginTop: "24px" }}
            >
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", borderBottom: "1px solid var(--glass-border)",
                background: "linear-gradient(135deg, rgba(255,107,43,0.07) 0%, rgba(124,58,237,0.07) 100%)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ChefHat size={15} style={{ color: "var(--accent)" }} />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)" }}>AI Recipe</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => { setResult(""); setPrompt(""); }}
                    style={{ ...G, width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid var(--glass-border)" }}>
                    <RefreshCw size={13} style={{ color: "var(--muted)" }} />
                  </motion.button>
                  {result && (
                    <motion.button whileTap={{ scale: 0.85 }} onClick={copyResult}
                      style={{ ...G, width: "32px", height: "32px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid var(--glass-border)" }}>
                      {copied ? <Check size={13} style={{ color: "var(--accent)" }} /> : <Copy size={13} style={{ color: "var(--muted)" }} />}
                    </motion.button>
                  )}
                </div>
              </div>

              <div style={{ padding: "20px" }}>
                {loading ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "28px 0" }}>
                    <Loader2 size={28} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
                    <p style={{ fontSize: "14px", color: "var(--muted)" }}>Your AI chef is cooking…</p>
                  </div>
                ) : (
                  <pre style={{ fontSize: "14px", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", color: "var(--foreground)" }}>
                    {result}
                  </pre>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ height: "36px" }} />
    </div>
  );
}
