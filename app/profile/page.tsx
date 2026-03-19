"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  MapPin, Mail, Edit3, Camera,
  Bell, Shield, Palette, HelpCircle, LogOut, ChevronRight,
  Check, X, Star, Utensils, Flame,
} from "lucide-react";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

type ProfileData = {
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    dietaryPrefs: string[];
    favCuisines: string[];
    flavorProfile: string[];
    createdAt: string;
  };
  stats: { posts: number; saved: number; scans: number };
};

const CUISINE_FLAGS: Record<string, string> = {
  Japanese: "🇯🇵", Italian: "🇮🇹", Mexican: "🇲🇽", Indian: "🇮🇳",
  Chinese: "🇨🇳", Thai: "🇹🇭", French: "🇫🇷", Nigerian: "🇳🇬",
  Lebanese: "🇱🇧", Korean: "🇰🇷", Spanish: "🇪🇸", American: "🇺🇸",
};

const SETTINGS = [
  {
    section: "Account",
    items: [
      { icon: Bell, label: "Notifications", sublabel: "Push & email alerts", href: null },
      { icon: Shield, label: "Privacy & Security", sublabel: "Data, visibility, password", href: null },
      { icon: Palette, label: "Appearance", sublabel: "Theme, fonts, display", href: null },
    ],
  },
  {
    section: "Support",
    items: [
      { icon: HelpCircle, label: "Help & FAQ", sublabel: "Get answers", href: null },
      { icon: Star, label: "Rate Foodipa", sublabel: "Leave us a review", href: null },
    ],
  },
];

function normalizeAvatarUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // Rewrite legacy direct MinIO http:// URLs to the proxy route
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const match = url.match(/\/([^/]+\/[^/]+\.[a-z]+)$/i);
    if (match) return `/api/avatar/avatars/${match[1].split("/").pop()}`;
  }
  return url;
}

function Avatar({ src, name, size = 88 }: { src?: string | null; name?: string | null; size?: number }) {
  const resolvedSrc = normalizeAvatarUrl(src);
  const initials = (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return resolvedSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={name ?? "Avatar"}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--glass-border)" }}
    />
  ) : (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: "linear-gradient(135deg, var(--accent), #FF9A4C)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.32, fontWeight: 800, color: "white",
        border: "3px solid rgba(255,255,255,0.3)",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setEditName(d.user?.name ?? "");
        setEditBio(d.user?.bio ?? "");
        setEditLocation(d.user?.location ?? "");
      });
  }, []);

  async function saveEdit() {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, bio: editBio, location: editLocation }),
    });
    setData((prev) =>
      prev
        ? { ...prev, user: { ...prev.user, name: editName, bio: editBio, location: editLocation } }
        : prev
    );
    setSaving(false);
    setEditing(false);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      // Resize to max 512px on client to stay within body size limits
      const avatarDataUrl = await resizeImage(file, 512);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarDataUrl }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `Upload failed (${res.status})`);
      if (json.user?.avatar) {
        setData((prev) => prev ? { ...prev, user: { ...prev.user, avatar: json.user.avatar } } : prev);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Avatar upload failed");
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function resizeImage(file: File, maxPx: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({ redirect: false });
    router.push("/auth/login");
  }

  const user = data?.user;
  const stats = data?.stats;

  return (
    <div className="desktop-page-inner" style={{ minHeight: "100vh" }}>

      {/* ── Profile hero ── */}
      <div
        style={{
          background: "linear-gradient(160deg, rgba(255,107,43,0.12) 0%, rgba(124,58,237,0.08) 100%)",
          padding: "36px 20px 28px",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "flex-start", gap: "18px" }}
        >
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              style={{ position: "relative", cursor: "pointer", background: "none", border: "none", padding: 0, display: "block", borderRadius: "50%" }}
            >
              <Avatar src={user?.avatar} name={user?.name} size={84} />
              {/* Camera overlay */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "rgba(0,0,0,0.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: avatarUploading ? 1 : 0,
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => { if (!avatarUploading) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                onMouseLeave={e => { if (!avatarUploading) (e.currentTarget as HTMLElement).style.opacity = "0"; }}
              >
                {avatarUploading
                  ? <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "white", animation: "spin 0.8s linear infinite" }} />
                  : <Camera size={20} color="white" />
                }
              </div>
            </motion.button>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {editing ? (
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{
                  fontSize: "20px", fontWeight: 800, color: "var(--foreground)",
                  background: "rgba(255,107,43,0.08)", border: "1.5px solid var(--accent)",
                  borderRadius: "10px", padding: "4px 10px", outline: "none",
                  width: "100%", fontFamily: "inherit",
                }}
              />
            ) : (
              <h1 style={{ fontSize: "20px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>
                {user?.name ?? session?.user?.name ?? "—"}
              </h1>
            )}

            <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Mail size={11} />
              {user?.email ?? session?.user?.email}
            </p>

            {user?.location && !editing && (
              <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={11} />
                {user.location}
              </p>
            )}

            {editing && (
              <input
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="Your location…"
                style={{
                  fontSize: "12px", color: "var(--foreground)", marginTop: "6px",
                  background: "rgba(255,107,43,0.08)", border: "1.5px solid var(--accent)",
                  borderRadius: "8px", padding: "4px 10px", outline: "none",
                  width: "100%", fontFamily: "inherit",
                }}
              />
            )}
          </div>

          {/* Edit / Save buttons */}
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            {editing ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setEditing(false)}
                  style={{ ...G, width: "36px", height: "36px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" }}
                >
                  <X size={15} style={{ color: "var(--muted)" }} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={saveEdit}
                  disabled={saving}
                  style={{
                    width: "36px", height: "36px", borderRadius: "12px",
                    background: "var(--accent)", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(255,107,43,0.35)",
                  }}
                >
                  {saving ? <div style={{ width: "12px", height: "12px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", animation: "spin 0.8s linear infinite" }} /> : <Check size={15} color="white" />}
                </motion.button>
              </>
            ) : (
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setEditing(true)}
                style={{ ...G, display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}
              >
                <Edit3 size={13} />
                Edit
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ marginTop: "16px" }}>
          {editing ? (
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Tell the world about your food journey…"
              rows={2}
              style={{
                width: "100%", fontSize: "13px", color: "var(--foreground)", lineHeight: 1.6,
                background: "rgba(255,107,43,0.08)", border: "1.5px solid var(--accent)",
                borderRadius: "10px", padding: "8px 12px", outline: "none",
                fontFamily: "inherit", resize: "none",
              }}
            />
          ) : user?.bio ? (
            <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{user.bio}</p>
          ) : null}
        </motion.div>
      </div>

      {/* ── Stats ── */}
      <div style={{ padding: "0 20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          style={{ ...G, borderRadius: "22px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", overflow: "hidden" }}
        >
          {[
            { label: "Posts", value: stats?.posts ?? "—", icon: "📸" },
            { label: "Saved", value: stats?.saved ?? "—", icon: "🔖" },
            { label: "Scans", value: stats?.scans ?? "—", icon: "📷" },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "18px 12px", textAlign: "center",
                borderRight: i < 2 ? "1px solid var(--glass-border)" : "none",
              }}
            >
              <div style={{ fontSize: "1.3rem", marginBottom: "4px" }}>{s.icon}</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Preferences ── */}
        <AnimatePresence>
          {((user?.dietaryPrefs?.length ?? 0) > 0 || (user?.favCuisines?.length ?? 0) > 0 || (user?.flavorProfile?.length ?? 0) > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              style={{ ...G, borderRadius: "22px", padding: "20px", marginTop: "14px" }}
            >
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
                My Tastes
              </p>

              {(user?.dietaryPrefs?.length ?? 0) > 0 && (
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <Utensils size={12} style={{ color: "var(--accent)" }} />
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)" }}>Dietary</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {user?.dietaryPrefs.map((p) => (
                      <span key={p} style={{ fontSize: "11px", fontWeight: 600, padding: "4px 12px", borderRadius: "50px", background: "rgba(255,107,43,0.1)", color: "var(--accent)", border: "1px solid rgba(255,107,43,0.2)" }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(user?.favCuisines?.length ?? 0) > 0 && (
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px" }}>🌍</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)" }}>Favourite Cuisines</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {user?.favCuisines.map((c) => (
                      <span key={c} style={{ fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "50px", background: "var(--glass-bg)", color: "var(--foreground)", border: "1px solid var(--glass-border)" }}>
                        {CUISINE_FLAGS[c] ?? "🍽️"} {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(user?.flavorProfile?.length ?? 0) > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <Flame size={12} style={{ color: "var(--accent)" }} />
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)" }}>Flavour Profile</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {user?.flavorProfile.map((f) => (
                      <span key={f} style={{ fontSize: "11px", fontWeight: 600, padding: "4px 12px", borderRadius: "50px", background: "rgba(124,58,237,0.1)", color: "#7C3AED", border: "1px solid rgba(124,58,237,0.2)" }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Quick Actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
        >
          {[
            { label: "Saved Recipes", emoji: "🔖", href: "/profile/saved" },
            { label: "Scan History", emoji: "📷", href: "/profile/scans" },
          ].map(({ label, emoji, href }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(href)}
              style={{
                ...G, borderRadius: "18px", padding: "16px", cursor: "pointer",
                border: "none", display: "flex", flexDirection: "column", gap: "10px",
                alignItems: "flex-start", textAlign: "left",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{emoji}</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--foreground)", lineHeight: 1.3 }}>{label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Settings ── */}
        {SETTINGS.map((group, gi) => (
          <motion.div
            key={group.section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 + gi * 0.06 }}
            style={{ marginTop: "20px" }}
          >
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>
              {group.section}
            </p>
            <div style={{ ...G, borderRadius: "20px", overflow: "hidden" }}>
              {group.items.map((item, ii) => (
                <motion.button
                  key={item.label}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "14px",
                    padding: "15px 18px",
                    borderBottom: ii < group.items.length - 1 ? "1px solid var(--glass-border)" : "none",
                    background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "11px", background: "rgba(255,107,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <item.icon size={16} style={{ color: "var(--accent)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--foreground)" }}>{item.label}</p>
                    <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "1px" }}>{item.sublabel}</p>
                  </div>
                  <ChevronRight size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* ── Sign Out ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          style={{ marginTop: "20px" }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "14px",
              padding: "16px 18px", borderRadius: "20px",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
              cursor: "pointer", textAlign: "left",
            }}
          >
            <div style={{ width: "36px", height: "36px", borderRadius: "11px", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <LogOut size={16} style={{ color: "#EF4444" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#EF4444" }}>
                {signingOut ? "Signing out…" : "Sign Out"}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(239,68,68,0.7)", marginTop: "1px" }}>
                {session?.user?.email}
              </p>
            </div>
          </motion.button>
        </motion.div>

        {/* ── Footer ── */}
        <div style={{ textAlign: "center", padding: "28px 0 40px" }}>
          <p style={{ fontSize: "11px", color: "var(--muted)" }}>
            Foodipa · v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
