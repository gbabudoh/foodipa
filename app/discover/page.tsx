"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Star, Clock, ChevronRight, Navigation } from "lucide-react";
import { useState } from "react";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

const categories = [
  { label: "All", emoji: "🍽️" },
  { label: "Restaurants", emoji: "🏪" },
  { label: "Markets", emoji: "🛒" },
  { label: "Street Food", emoji: "🥘" },
  { label: "Cafés", emoji: "☕" },
  { label: "Bakeries", emoji: "🥖" },
];

const nearby = [
  // Restaurants
  { name: "Seoul Kitchen", cuisine: "Korean · BBQ", rating: 4.6, distance: "0.7 km", time: "12 min", emoji: "🇰🇷", tag: "Top Rated", tagColor: "#7C3AED", category: "Restaurants" },
  { name: "The Spice Route", cuisine: "Indian · Curry", rating: 4.7, distance: "1.1 km", time: "18 min", emoji: "🍛", tag: null, tagColor: "", category: "Restaurants" },
  { name: "Taco Libre", cuisine: "Mexican · Tacos", rating: 4.5, distance: "1.8 km", time: "25 min", emoji: "🌮", tag: null, tagColor: "", category: "Restaurants" },
  { name: "Sakura Ramen", cuisine: "Japanese · Ramen", rating: 4.8, distance: "2.1 km", time: "28 min", emoji: "🍜", tag: "Popular", tagColor: "#EC4899", category: "Restaurants" },
  // Markets
  { name: "Lagos Fresh Market", cuisine: "West African · Groceries", rating: 4.4, distance: "0.9 km", time: "14 min", emoji: "🛒", tag: "Open Now", tagColor: "#10B981", category: "Markets" },
  { name: "Spice Bazaar", cuisine: "Middle Eastern · Spices", rating: 4.7, distance: "1.6 km", time: "20 min", emoji: "🌶️", tag: null, tagColor: "", category: "Markets" },
  { name: "Farmer's Co-op", cuisine: "Local · Organic Produce", rating: 4.6, distance: "2.3 km", time: "30 min", emoji: "🥦", tag: "Weekend Only", tagColor: "#F59E0B", category: "Markets" },
  // Street Food
  { name: "Nkemdi's Suya Spot", cuisine: "Nigerian · Suya", rating: 4.8, distance: "0.3 km", time: "8 min", emoji: "🔥", tag: "Trending", tagColor: "#FF6B2B", category: "Street Food" },
  { name: "Pad Thai Corner", cuisine: "Thai · Noodles", rating: 4.5, distance: "0.6 km", time: "10 min", emoji: "🍜", tag: null, tagColor: "", category: "Street Food" },
  { name: "Kebab King", cuisine: "Turkish · Kebab", rating: 4.3, distance: "1.0 km", time: "15 min", emoji: "🥙", tag: "Late Night", tagColor: "#7C3AED", category: "Street Food" },
  // Cafés
  { name: "Brew & Books", cuisine: "Café · Specialty Coffee", rating: 4.9, distance: "0.4 km", time: "9 min", emoji: "☕", tag: "Top Rated", tagColor: "#7C3AED", category: "Cafés" },
  { name: "The Matcha House", cuisine: "Japanese · Tea & Pastries", rating: 4.7, distance: "1.2 km", time: "17 min", emoji: "🍵", tag: "Cozy", tagColor: "#10B981", category: "Cafés" },
  { name: "Café Nomad", cuisine: "International · Coffee & Bites", rating: 4.5, distance: "1.9 km", time: "24 min", emoji: "🌍", tag: null, tagColor: "", category: "Cafés" },
  // Bakeries
  { name: "Maison du Croissant", cuisine: "French · Patisserie", rating: 4.9, distance: "1.4 km", time: "22 min", emoji: "🥐", tag: "New", tagColor: "#10B981", category: "Bakeries" },
  { name: "Sourdough & Co.", cuisine: "Artisan · Bread & Pastries", rating: 4.6, distance: "2.0 km", time: "26 min", emoji: "🍞", tag: null, tagColor: "", category: "Bakeries" },
  { name: "Sweet Crust", cuisine: "Nigerian · Cakes & Pastries", rating: 4.4, distance: "2.4 km", time: "32 min", emoji: "🎂", tag: "Local Fave", tagColor: "#FF6B2B", category: "Bakeries" },
];

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = nearby.filter((place) => {
    const matchesCategory = activeCategory === "All" || place.category === activeCategory;
    const q = query.toLowerCase();
    const matchesQuery = !q || place.name.toLowerCase().includes(q) || place.cuisine.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="desktop-page-inner" style={{ minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ padding: "32px 20px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.4px" }}>
            Global Food Finder 🗺️
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "5px" }}>
            Restaurants, markets & street food near you
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{ ...G, borderRadius: "16px", height: "52px", display: "flex", alignItems: "center", gap: "12px", padding: "0 18px", marginTop: "20px" }}
        >
          <Search size={17} style={{ color: "var(--muted)", flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, cuisines…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--foreground)" }}
          />
        </motion.div>
      </div>

      {/* ── Map ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          margin: "0 20px",
          borderRadius: "24px",
          overflow: "hidden",
          height: "210px",
          position: "relative",
          background: "linear-gradient(135deg, #1a3a2a 0%, #2d5c3e 50%, #1e3d2a 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
      >
        {/* Grid lines */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`v${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${(i + 1) * 20}%`, width: "1px", background: "rgba(255,255,255,0.08)" }} />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`h${i}`} style={{ position: "absolute", left: 0, right: 0, top: `${(i + 1) * 17}%`, height: "1px", background: "rgba(255,255,255,0.08)" }} />
        ))}

        {/* Pins */}
        {[{ x: "35%", y: "42%", accent: true }, { x: "60%", y: "28%", accent: false }, { x: "20%", y: "62%", accent: false }, { x: "72%", y: "56%", accent: false }, { x: "47%", y: "72%", accent: false }].map((pin, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.18 + i * 0.08, type: "spring", stiffness: 300 }}
            style={{ position: "absolute", left: pin.x, top: pin.y, transform: "translate(-50%,-50%)" }}
          >
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: pin.accent ? "var(--accent)" : "white",
              border: pin.accent ? "none" : "2px solid var(--accent)",
              boxShadow: pin.accent ? "0 4px 12px rgba(255,107,43,0.4)" : "0 2px 8px rgba(0,0,0,0.2)",
            }}>
              <MapPin size={13} style={{ color: pin.accent ? "white" : "var(--accent)" }} />
            </div>
          </motion.div>
        ))}

        {/* Live badge */}
        <div style={{
          position: "absolute", top: "14px", left: "14px",
          display: "flex", alignItems: "center", gap: "7px",
          padding: "7px 14px", borderRadius: "50px",
          background: "rgba(0,0,0,0.42)", backdropFilter: "blur(10px)",
        }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
          <span style={{ color: "white", fontSize: "12px", fontWeight: 600 }}>Live Map</span>
        </div>

        {/* Location btn */}
        <button style={{
          position: "absolute", bottom: "14px", right: "14px",
          width: "40px", height: "40px", borderRadius: "12px",
          background: "white", display: "flex", alignItems: "center", justifyContent: "center",
          border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.2)", cursor: "pointer",
        }}>
          <Navigation size={16} style={{ color: "var(--accent)" }} />
        </button>
      </motion.div>

      {/* ── Category Filter ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ padding: "20px 20px 0" }}
      >
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", borderRadius: "50px",
                fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap",
                cursor: "pointer", transition: "all 0.2s", border: "none",
                ...(activeCategory === cat.label
                  ? { background: "var(--accent)", color: "white", boxShadow: "0 4px 12px rgba(255,107,43,0.3)" }
                  : { ...G, color: "var(--foreground)" }
                ),
              }}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Nearby List ── */}
      <div style={{ padding: "24px 20px 36px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "14px" }}>
          Nearby Spots
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)", fontSize: "14px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🔍</div>
              No spots found. Try a different filter or search term.
            </div>
          )}
          {filtered.map((place, i) => (
            <motion.div
              key={place.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              style={{
                ...G, borderRadius: "20px",
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 16px", cursor: "pointer",
              }}
            >
              <div style={{
                width: "54px", height: "54px", borderRadius: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px", flexShrink: 0,
                background: "rgba(255,255,255,0.5)",
                border: "1px solid var(--glass-border)",
              }}>
                {place.emoji}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {place.name}
                  </p>
                  {place.tag && (
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "50px", background: `${place.tagColor}18`, color: place.tagColor, flexShrink: 0 }}>
                      {place.tag}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "7px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {place.cuisine}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "12px", fontWeight: 600, color: "var(--foreground)" }}>
                    <Star size={11} fill="#F59E0B" style={{ color: "#F59E0B" }} />{place.rating}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "12px", color: "var(--muted)" }}>
                    <MapPin size={11} />{place.distance}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "12px", color: "var(--muted)" }}>
                    <Clock size={11} />{place.time}
                  </span>
                </div>
              </div>

              <ChevronRight size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
