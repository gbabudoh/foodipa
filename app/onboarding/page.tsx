"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ArrowRight, ArrowLeft, Check, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

const DIETARY = [
  { id: "vegetarian", label: "Vegetarian", icon: "🥗" },
  { id: "vegan", label: "Vegan", icon: "🌱" },
  { id: "halal", label: "Halal", icon: "☪️" },
  { id: "kosher", label: "Kosher", icon: "✡️" },
  { id: "gluten-free", label: "Gluten-Free", icon: "🌾" },
  { id: "dairy-free", label: "Dairy-Free", icon: "🥛" },
  { id: "nut-free", label: "Nut-Free", icon: "🥜" },
  { id: "pescatarian", label: "Pescatarian", icon: "🐟" },
];

const CUISINES = [
  { id: "Japanese", emoji: "🇯🇵" },
  { id: "Italian", emoji: "🇮🇹" },
  { id: "Mexican", emoji: "🇲🇽" },
  { id: "Indian", emoji: "🇮🇳" },
  { id: "Chinese", emoji: "🇨🇳" },
  { id: "Thai", emoji: "🇹🇭" },
  { id: "French", emoji: "🇫🇷" },
  { id: "Nigerian", emoji: "🇳🇬" },
  { id: "Lebanese", emoji: "🇱🇧" },
  { id: "Korean", emoji: "🇰🇷" },
  { id: "Spanish", emoji: "🇪🇸" },
  { id: "American", emoji: "🇺🇸" },
];

const FLAVORS = [
  { id: "spicy", label: "Spicy 🌶️" },
  { id: "umami", label: "Umami 🍄" },
  { id: "sweet", label: "Sweet 🍯" },
  { id: "sour", label: "Sour 🍋" },
  { id: "smoky", label: "Smoky 🔥" },
  { id: "fresh", label: "Fresh 🌿" },
  { id: "rich", label: "Rich & Creamy 🧈" },
  { id: "tangy", label: "Tangy 🍊" },
];

const STEPS = [
  { title: "Welcome to Foodipa", subtitle: "Let's personalise your culinary universe" },
  { title: "Your profile", subtitle: "How should we introduce you?" },
  { title: "Dietary preferences", subtitle: "We'll tailor every recommendation to you" },
  { title: "Favourite cuisines", subtitle: "Pick the ones that make your mouth water" },
  { title: "Your flavour profile", subtitle: "What flavours excite your palate?" },
];

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
}

export default function OnboardingPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState((session?.user?.name as string) ?? "");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>([]);
  const [favCuisines, setFavCuisines] = useState<string[]>([]);
  const [flavorProfile, setFlavorProfile] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setAvatarPreview(url);
      setAvatarDataUrl(url);
    };
    reader.readAsDataURL(file);
  }

  async function handleFinish() {
    setSaving(true);
    setSaveError(null);
    try {
      // 1. Save to database
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, location, dietaryPrefs, favCuisines, flavorProfile, avatarDataUrl }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Save failed (${res.status})`);
      }

      // API sets onboarding_done cookie — middleware reads it directly.
      // No JWT update needed. Hard navigate so the fresh cookie is sent.
      window.location.href = "/";
    } catch (err) {
      console.error("[onboarding finish]", err);
      setSaveError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  const canNext = step === 1 ? name.trim().length > 0 : true;

  return (
    <div style={{ minHeight: "100vh", maxWidth: "520px", margin: "0 auto", padding: "0 20px" }}>

      {/* Progress bar */}
      <div style={{ padding: "28px 0 0" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: "3px", borderRadius: "99px",
                background: i <= step ? "var(--accent)" : "var(--glass-border)",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>
        <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "10px" }}>
          Step {step + 1} of {STEPS.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.28 }}
          style={{ paddingTop: "32px", paddingBottom: "120px" }}
        >
          <h2 style={{ fontSize: "26px", fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.4px", lineHeight: 1.2 }}>
            {STEPS[step].title}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "8px", marginBottom: "32px" }}>
            {STEPS[step].subtitle}
          </p>

          {/* ── Step 0: Welcome ── */}
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { icon: "🗺️", title: "Discover global food", desc: "Find restaurants and markets near you" },
                { icon: "🧪", title: "AI recipe generator", desc: "Create recipes from any ingredients" },
                { icon: "📷", title: "Scan any dish", desc: "Instant food identification with your camera" },
                { icon: "🌍", title: "Explore food culture", desc: "Learn the story behind every cuisine" },
              ].map(item => (
                <div key={item.title} style={{ ...G, borderRadius: "18px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "2rem" }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--foreground)" }}>{item.title}</p>
                    <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Step 1: Profile ── */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Avatar */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    width: "100px", height: "100px", borderRadius: "50%",
                    background: avatarPreview ? "transparent" : "linear-gradient(135deg, var(--accent), #FF9A4C)",
                    cursor: "pointer", overflow: "hidden", position: "relative",
                    border: "3px solid var(--accent)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <Camera size={28} color="white" />
                  }
                </div>
                <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600, cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
                  {avatarPreview ? "Change photo" : "Add profile photo"}
                </p>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: "none" }} />
              </div>

              {/* Name */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Display Name *</label>
                <div style={{ ...G, borderRadius: "14px", height: "52px", display: "flex", alignItems: "center", padding: "0 16px" }}>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your foodie name" required
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "15px", color: "var(--foreground)" }}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Bio</label>
                <div style={{ ...G, borderRadius: "14px", padding: "14px 16px" }}>
                  <textarea
                    value={bio} onChange={e => setBio(e.target.value)}
                    placeholder="Tell us about your food journey…"
                    rows={3}
                    style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--foreground)", resize: "none", fontFamily: "inherit", lineHeight: 1.6 }}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Location</label>
                <div style={{ ...G, borderRadius: "14px", height: "52px", display: "flex", alignItems: "center", gap: "12px", padding: "0 16px" }}>
                  <MapPin size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
                  <input
                    type="text" value={location} onChange={e => setLocation(e.target.value)}
                    placeholder="Lagos, Nigeria"
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--foreground)" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Dietary ── */}
          {step === 2 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {DIETARY.map(item => {
                const active = dietaryPrefs.includes(item.id);
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDietaryPrefs(p => toggle(p, item.id))}
                    style={{
                      ...G,
                      borderRadius: "16px", padding: "16px 14px",
                      display: "flex", alignItems: "center", gap: "10px",
                      border: active ? "2px solid var(--accent)" : "1px solid var(--glass-border)",
                      background: active ? "rgba(255,107,43,0.08)" : "var(--glass-bg)",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: "1.4rem" }}>{item.icon}</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: active ? "var(--accent)" : "var(--foreground)" }}>{item.label}</span>
                    {active && <Check size={14} style={{ color: "var(--accent)", marginLeft: "auto" }} />}
                  </motion.button>
                );
              })}
              <p style={{ gridColumn: "1/-1", fontSize: "13px", color: "var(--muted)", textAlign: "center", marginTop: "8px" }}>
                Skip if none apply
              </p>
            </div>
          )}

          {/* ── Step 3: Cuisines ── */}
          {step === 3 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {CUISINES.map(item => {
                const active = favCuisines.includes(item.id);
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setFavCuisines(p => toggle(p, item.id))}
                    style={{
                      ...G,
                      borderRadius: "16px", padding: "16px 10px",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                      border: active ? "2px solid var(--accent)" : "1px solid var(--glass-border)",
                      background: active ? "rgba(255,107,43,0.08)" : "var(--glass-bg)",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: "1.8rem" }}>{item.emoji}</span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: active ? "var(--accent)" : "var(--foreground)" }}>{item.id}</span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* ── Step 4: Flavors ── */}
          {step === 4 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {FLAVORS.map(item => {
                const active = flavorProfile.includes(item.id);
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFlavorProfile(p => toggle(p, item.id))}
                    style={{
                      padding: "12px 18px", borderRadius: "50px",
                      fontSize: "14px", fontWeight: 600,
                      border: active ? "2px solid var(--accent)" : "1px solid var(--glass-border)",
                      background: active ? "rgba(255,107,43,0.1)" : "var(--glass-bg)",
                      color: active ? "var(--accent)" : "var(--foreground)",
                      cursor: "pointer",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Nav buttons — fixed bottom ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: "520px",
        padding: saveError ? "10px 20px 16px" : "16px 20px",
        paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
        background: "var(--nav-bg)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid var(--nav-border)",
        display: "flex", flexDirection: "column", gap: "10px",
      }}>
        {saveError && (
          <p style={{ fontSize: "13px", color: "#EF4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "10px", padding: "9px 14px", textAlign: "center" }}>
            ⚠️ {saveError}
          </p>
        )}
        <div style={{ display: "flex", gap: "12px" }}>
        {step > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setStep(s => s - 1)}
            style={{ height: "52px", paddingInline: "20px", borderRadius: "14px", ...G, border: "1px solid var(--glass-border)", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: 600, color: "var(--foreground)" }}
          >
            <ArrowLeft size={16} /> Back
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!canNext || saving}
          onClick={step < STEPS.length - 1 ? () => setStep(s => s + 1) : handleFinish}
          style={{
            flex: 1, height: "52px", borderRadius: "14px",
            background: "var(--accent)", color: "white",
            fontSize: "15px", fontWeight: 700, border: "none",
            cursor: (!canNext || saving) ? "not-allowed" : "pointer",
            opacity: (!canNext || saving) ? 0.65 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            boxShadow: "0 4px 20px rgba(255,107,43,0.35)",
          }}
        >
          {saving ? "Saving…" : step < STEPS.length - 1 ? (<>Continue <ArrowRight size={16} /></>) : (<><Check size={16} /> Let&apos;s eat!</>)}
        </motion.button>
        </div>
      </div>
    </div>
  );
}
