"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Plus, X, Image as ImageIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

const GRADIENTS = [
  "linear-gradient(140deg, #FF6B2B 0%, #C94A10 100%)",
  "linear-gradient(140deg, #BC002D 0%, #7C0020 100%)",
  "linear-gradient(140deg, #06B6D4 0%, #0369A1 100%)",
  "linear-gradient(140deg, #F59E0B 0%, #B45309 100%)",
  "linear-gradient(140deg, #8B5CF6 0%, #5B21B6 100%)",
  "linear-gradient(140deg, #10B981 0%, #065F46 100%)",
];

function gradientFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

function timeAgo(dateStr: string) {
  const s = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function UserAvatar({ src, name, size = 40 }: { src?: string | null; name?: string | null; size?: number }) {
  const initials = (name ?? "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const resolved = src?.startsWith("http") ? `/api/avatar/avatars/${src.split("/").pop()}` : src;
  return resolved ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolved} alt={name ?? ""} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, var(--accent), #FF9A4C)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.34, fontWeight: 800, color: "white", flexShrink: 0,
    }}>{initials}</div>
  );
}

type FeedPost = {
  id: string;
  author: string;
  avatar: string | null;
  caption: string;
  imageUrl: string | null;
  tags: string[];
  createdAt: string;
  likeCount: number;
  liked: boolean;
  saved: boolean;
};

const FILTERS = ["For You", "Trending", "Following", "Local"];

function resizeImage(file: File, maxPx = 1080): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function PulsePage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("For You");

  // Compose state
  const [showCompose, setShowCompose] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [newTags, setNewTags] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadPosts(filter: string) {
    setLoading(true);
    try {
      const param = filter === "Trending" ? "trending" : "forYou";
      const res = await fetch(`/api/posts?filter=${param}`);
      const data: Omit<FeedPost, "saved">[] = await res.json();
      setPosts(data.map((p) => ({ ...p, saved: false })));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPosts(activeFilter); }, [activeFilter]);

  async function toggleLike(id: string) {
    if (!session) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 } : p
      )
    );
    try {
      await fetch(`/api/posts/${id}/like`, { method: "POST" });
    } catch {
      // revert on failure
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 } : p
        )
      );
    }
  }

  function toggleSave(id: string) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)));
  }

  function handleShare(post: FeedPost) {
    if (navigator.share) navigator.share({ title: "Foodipa", text: post.caption, url: window.location.href });
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImage(file);
    setImageDataUrl(dataUrl);
    setImagePreview(dataUrl);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submitPost() {
    if (!newCaption.trim()) return;
    setPosting(true);
    setPostError(null);
    try {
      const tags = newTags.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: newCaption, imageDataUrl, tags }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Post failed");
      setPosts((prev) => [{ ...json.post, saved: false }, ...prev]);
      closeCompose();
    } catch (err) {
      setPostError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPosting(false);
    }
  }

  function closeCompose() {
    setShowCompose(false);
    setNewCaption("");
    setNewTags("");
    setImagePreview(null);
    setImageDataUrl(null);
    setPostError(null);
  }

  return (
    <div className="desktop-page-inner" style={{ minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ padding: "32px 20px 20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}
        >
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.4px" }}>
              Food Pulse 📸
            </h1>
            <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "5px" }}>
              Share your culinary adventures
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setShowCompose(true)}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "10px 18px", borderRadius: "14px",
              fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer",
              background: "var(--accent)", color: "white",
              boxShadow: "0 4px 16px rgba(255,107,43,0.32)",
            }}
          >
            <Plus size={14} /> Post
          </motion.button>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 }}
          style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "9px 18px", borderRadius: "50px", whiteSpace: "nowrap",
                fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s",
                ...(activeFilter === f
                  ? { background: "var(--accent)", color: "white", boxShadow: "0 3px 12px rgba(255,107,43,0.28)" }
                  : { ...G, color: "var(--foreground)" }),
              }}
            >
              {f}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ── Feed ── */}
      <div style={{ padding: "0 20px 100px", display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* Skeleton */}
        {loading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ ...G, borderRadius: "24px", height: "340px", opacity: 0.5 }} />
        ))}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ ...G, borderRadius: "24px", padding: "48px 24px", textAlign: "center" }}
          >
            <p style={{ fontSize: "3rem", marginBottom: "12px" }}>🍽️</p>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)" }}>No posts yet</p>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "6px" }}>Be the first to share a food adventure!</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCompose(true)}
              style={{ marginTop: "20px", padding: "12px 24px", borderRadius: "14px", background: "var(--accent)", color: "white", border: "none", fontWeight: 700, fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 14px rgba(255,107,43,0.3)" }}
            >
              Share something 🚀
            </motion.button>
          </motion.div>
        )}

        {/* Posts */}
        {!loading && posts.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{ ...G, borderRadius: "24px", overflow: "hidden" }}
          >
            {/* Photo or gradient placeholder */}
            <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
              {post.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.imageUrl} alt={post.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: gradientFor(post.id), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "4.5rem" }}>🍽️</span>
                </div>
              )}
              {post.tags.length > 0 && (
                <span style={{
                  position: "absolute", top: "14px", right: "14px",
                  fontSize: "11px", fontWeight: 700, padding: "5px 12px", borderRadius: "50px",
                  background: "rgba(0,0,0,0.32)", color: "white", backdropFilter: "blur(8px)",
                }}>
                  {post.tags[0]}
                </span>
              )}
            </div>

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 18px 10px" }}>
              <UserAvatar src={post.avatar} name={post.author} size={40} />
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)" }}>{post.author}</p>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>{timeAgo(post.createdAt)}</p>
              </div>
            </div>

            {/* Caption */}
            <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--foreground)", padding: "0 18px 14px" }}>
              {post.caption}
            </p>

            {/* Tags */}
            {post.tags.length > 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "0 18px 14px" }}>
                {post.tags.slice(1).map((t) => (
                  <span key={t} style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "50px", background: "rgba(255,107,43,0.08)", color: "var(--accent)" }}>
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderTop: "1px solid var(--glass-border)" }}>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => toggleLike(post.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "8px 14px", borderRadius: "50px", border: "none", cursor: "pointer",
                  background: post.liked ? "rgba(255,107,43,0.1)" : "transparent",
                }}
              >
                <Heart size={17} fill={post.liked ? "var(--accent)" : "none"} style={{ color: post.liked ? "var(--accent)" : "var(--muted)" }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: post.liked ? "var(--accent)" : "var(--muted)" }}>{post.likeCount}</span>
              </motion.button>

              <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 14px" }}>
                <MessageCircle size={17} style={{ color: "var(--muted)" }} />
              </div>

              <div style={{ flex: 1 }} />

              <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleSave(post.id)}
                style={{ width: "38px", height: "38px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", background: "transparent" }}>
                <Bookmark size={17} fill={post.saved ? "var(--accent)" : "none"} style={{ color: post.saved ? "var(--accent)" : "var(--muted)" }} />
              </motion.button>

              <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleShare(post)}
                style={{ width: "38px", height: "38px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", background: "transparent" }}>
                <Share2 size={17} style={{ color: "var(--muted)" }} />
              </motion.button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* ── Compose Sheet ── */}
      <AnimatePresence>
        {showCompose && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeCompose}
              style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 51,
                background: "var(--background)",
                borderTop: "1px solid var(--glass-border)",
                borderRadius: "28px 28px 0 0",
                maxWidth: "512px", margin: "0 auto",
              }}
            >
              {/* Handle */}
              <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 4px" }}>
                <div style={{ width: "36px", height: "3px", borderRadius: "2px", background: "var(--muted)", opacity: 0.35 }} />
              </div>

              {/* Title bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px 16px", borderBottom: "1px solid var(--glass-border)" }}>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--foreground)" }}>Share Your Adventure</h2>
                <button onClick={closeCompose} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <X size={20} style={{ color: "var(--muted)" }} />
                </button>
              </div>

              <div style={{ padding: "20px 24px 48px", display: "flex", flexDirection: "column", gap: "14px", maxHeight: "72vh", overflowY: "auto" }}>

                {/* Image picker */}
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleImagePick} />

                {imagePreview ? (
                  <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden", height: "190px" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      onClick={() => { setImagePreview(null); setImageDataUrl(null); }}
                      style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      <X size={14} color="white" />
                    </button>
                  </div>
                ) : (
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    onClick={() => fileRef.current?.click()}
                    style={{
                      height: "140px", borderRadius: "18px",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px",
                      border: "2px dashed var(--glass-border)", cursor: "pointer",
                    }}
                  >
                    <ImageIcon size={26} style={{ color: "var(--muted)" }} />
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--muted)" }}>Tap to add photo</p>
                    <p style={{ fontSize: "12px", color: "var(--muted)", opacity: 0.7 }}>Optional · JPG, PNG or WebP</p>
                  </motion.div>
                )}

                {/* Caption */}
                <div style={{ ...G, borderRadius: "16px", padding: "14px 16px" }}>
                  <textarea
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Tell us about this dish… 🍽️"
                    rows={3}
                    style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--foreground)", resize: "none", lineHeight: 1.6, fontFamily: "inherit" }}
                  />
                </div>

                {/* Tags */}
                <div style={{ ...G, borderRadius: "16px", padding: "12px 16px" }}>
                  <input
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Tags: Nigerian, Spicy, Homemade (comma separated)"
                    style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "var(--foreground)", fontFamily: "inherit" }}
                  />
                </div>

                {postError && (
                  <p style={{ fontSize: "12px", color: "#EF4444", textAlign: "center" }}>{postError}</p>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={submitPost}
                  disabled={posting || !newCaption.trim()}
                  style={{
                    width: "100%", padding: "16px", borderRadius: "18px",
                    fontSize: "15px", fontWeight: 700, border: "none",
                    cursor: posting || !newCaption.trim() ? "not-allowed" : "pointer",
                    background: newCaption.trim() ? "var(--accent)" : "var(--glass-border)",
                    color: newCaption.trim() ? "white" : "var(--muted)",
                    boxShadow: newCaption.trim() ? "0 4px 18px rgba(255,107,43,0.32)" : "none",
                    opacity: posting ? 0.7 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  {posting ? "Posting…" : "Post to Food Pulse 🚀"}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
