"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Globe, X } from "lucide-react";
import { useState } from "react";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

const cuisines = [
  { name: "Nigerian", emoji: "🇳🇬", dishes: ["Jollof Rice", "Egusi Soup", "Suya", "Puff Puff"], color: "#008751", fact: "Nigeria has over 250 ethnic groups, each with unique culinary traditions. Jollof rice is a cultural symbol and the subject of friendly rivalry across West Africa." },
  { name: "Japanese", emoji: "🇯🇵", dishes: ["Sushi", "Ramen", "Tempura", "Miso"], color: "#BC002D", fact: "Japanese cuisine (Washoku) was inscribed on UNESCO's Intangible Cultural Heritage list. The 'Ichiju Sansai' philosophy (one soup, three sides) shapes everyday Japanese meals." },
  { name: "Mexican", emoji: "🇲🇽", dishes: ["Tacos", "Mole", "Guacamole", "Tamales"], color: "#006847", fact: "Mexican cuisine has been recognized by UNESCO since 2010. Mole — a complex sauce with over 20 ingredients — took centuries to perfect and varies dramatically by region." },
  { name: "Indian", emoji: "🇮🇳", dishes: ["Biryani", "Butter Chicken", "Dosa", "Samosa"], color: "#FF9933", fact: "India's cuisine is as diverse as its 1.4 billion population. Ayurvedic principles of balancing six tastes — sweet, sour, salty, pungent, bitter, and astringent — shape traditional cooking." },
  { name: "Italian", emoji: "🇮🇹", dishes: ["Pizza", "Pasta", "Risotto", "Tiramisu"], color: "#008C45", fact: "Italy has the most UNESCO-recognized foods in the world. Each of Italy's 20 regions has its own distinct cuisine — the north-south divide between pasta and pizza is centuries old." },
  { name: "Chinese", emoji: "🇨🇳", dishes: ["Dim Sum", "Peking Duck", "Hot Pot", "Dumplings"], color: "#DE2910", fact: "Chinese cuisine spans 8 major regional traditions. Cantonese, Sichuan, and Hunan each have entirely different flavor profiles, techniques, and signature ingredients." },
  { name: "Moroccan", emoji: "🇲🇦", dishes: ["Tagine", "Couscous", "Pastilla", "Harira"], color: "#C1272D", fact: "Moroccan food blends Berber, Arabic, Andalusian, and Mediterranean influences. The tagine — both a dish and its clay cooking vessel — cooks low and slow to develop extraordinary depth." },
  { name: "Korean", emoji: "🇰🇷", dishes: ["Kimchi", "Bibimbap", "BBQ", "Tteokbokki"], color: "#003478", fact: "Kimchi is eaten at virtually every Korean meal. There are over 200 varieties, and it has been named UNESCO Intangible Cultural Heritage of Korea." },
  { name: "Ethiopian", emoji: "🇪🇹", dishes: ["Injera", "Doro Wat", "Tibs", "Kitfo"], color: "#078930", fact: "Ethiopian cuisine is traditionally eaten communally from a shared platter. Injera — a sourdough flatbread — doubles as both plate and utensil." },
  { name: "Peruvian", emoji: "🇵🇪", dishes: ["Ceviche", "Lomo Saltado", "Cuy", "Anticucho"], color: "#D91023", fact: "Peru is one of the world's top gastronomy destinations. Ceviche — fish cured in citrus — is the national dish, and Lima has more restaurants per capita than almost any other city." },
];

const foodFacts = [
  { fact: "The world's oldest known recipe is a 4,000-year-old beer recipe from ancient Mesopotamia.", emoji: "🍺" },
  { fact: "Saffron is the world's most expensive spice at over $5,000 per kg — each flower only produces 3 stigmas, all hand-picked.", emoji: "🌸" },
  { fact: "The Maillard reaction (browning when cooking) creates over 1,000 different chemical compounds responsible for flavor and aroma.", emoji: "🔬" },
  { fact: "Chocolate was once used as currency by the Aztecs. Cacao beans were so valuable that counterfeiters made fake beans from clay.", emoji: "🍫" },
];

export default function CulturePage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof cuisines[0] | null>(null);

  const filtered = cuisines.filter(
    (c) => query === "" || c.name.toLowerCase().includes(query.toLowerCase()) || c.dishes.some((d) => d.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="desktop-page-inner" style={{ minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ padding: "32px 20px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.4px" }}>
            Culture Hub 🌍
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "5px" }}>
            Explore food origins, history & traditions
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
            placeholder="Search cuisines or dishes…"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--foreground)" }}
          />
        </motion.div>
      </div>

      {/* ── Cuisine Grid ── */}
      <div style={{ padding: "0 20px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "14px" }}>
          World Cuisines
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {filtered.map((cuisine, i) => (
            <motion.button
              key={cuisine.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12 + i * 0.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelected(cuisine)}
              style={{
                ...G, borderRadius: "18px",
                display: "flex", alignItems: "center", gap: "12px",
                padding: "14px 16px", textAlign: "left",
                border: "1px solid var(--glass-border)",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>{cuisine.emoji}</span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {cuisine.name}
                </p>
                <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {cuisine.dishes.slice(0, 2).join(" · ")}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Food Facts ── */}
      <div style={{ padding: "32px 20px 36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Globe size={13} style={{ color: "var(--accent)" }} />
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>
            Food Facts
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {foodFacts.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              style={{ ...G, borderRadius: "18px", display: "flex", alignItems: "flex-start", gap: "14px", padding: "16px 18px" }}
            >
              <span style={{ fontSize: "1.5rem", flexShrink: 0, marginTop: "1px" }}>{item.emoji}</span>
              <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--foreground)" }}>{item.fact}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Cuisine Detail Sheet ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
                background: "var(--glass-bg)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
                borderTop: "1px solid var(--glass-border)",
                borderRadius: "28px 28px 0 0",
                maxWidth: "512px", margin: "0 auto",
              }}
            >
              {/* Handle */}
              <div style={{ display: "flex", justifyContent: "center", paddingTop: "14px", paddingBottom: "4px" }}>
                <div style={{ width: "36px", height: "3px", borderRadius: "2px", background: "var(--muted)", opacity: 0.35 }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px 16px", borderBottom: "1px solid var(--glass-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "2.5rem" }}>{selected.emoji}</span>
                  <div>
                    <h2 style={{ fontSize: "19px", fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>
                      {selected.name} Cuisine
                    </h2>
                    <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                      {selected.dishes.length} signature dishes
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                  <X size={20} style={{ color: "var(--muted)" }} />
                </button>
              </div>

              <div style={{ padding: "20px 24px 40px", display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{
                  padding: "18px 20px", borderRadius: "18px",
                  background: "rgba(255,255,255,0.4)", border: "1px solid var(--glass-border)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "10px" }}>
                    <BookOpen size={13} style={{ color: "var(--accent)" }} />
                    <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)" }}>
                      Cultural Insight
                    </span>
                  </div>
                  <p style={{ fontSize: "14px", lineHeight: 1.65, color: "var(--foreground)" }}>{selected.fact}</p>
                </div>

                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "10px" }}>
                    Signature Dishes
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selected.dishes.map((dish) => (
                      <span key={dish} style={{ padding: "8px 16px", borderRadius: "50px", fontSize: "13px", fontWeight: 600, background: `${selected.color}15`, color: selected.color }}>
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
