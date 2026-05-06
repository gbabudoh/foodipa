"use client";

import { motion } from "framer-motion";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

export default function AboutPage() {
  return (
    <div className="desktop-page-inner" style={{ minHeight: "100vh", padding: "80px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
            Our Story
          </p>
          <h1 style={{ fontSize: "48px", fontWeight: 900, color: "var(--foreground)", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "32px" }}>
            Revolutionizing the way the world <span style={{ color: "var(--accent)" }}>experiences food</span>.
          </h1>
          
          <div style={{ ...G, borderRadius: "24px", padding: "40px", marginBottom: "48px" }}>
            <p style={{ fontSize: "18px", color: "var(--foreground)", lineHeight: 1.8, marginBottom: "24px" }}>
              Foodipa was born out of a simple realization: food is the universal language, yet we often lack the tools to fully explore its richness and diversity.
            </p>
            <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: 1.8, marginBottom: "24px" }}>
              Our mission is to empower every food lover with cutting-edge technology. Whether you&apos;re discovering a hidden gem in a foreign city, generating a Michelin-star recipe from your leftovers, or learning about the cultural heritage of a traditional dish, Foodipa is your ultimate culinary companion.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {[
              { title: "84K+", desc: "Global Explorers" },
              { title: "195+", desc: "Cuisines Covered" },
              { title: "12K+", desc: "AI Recipes Generated" },
              { title: "50+", desc: "Food Experts" },
            ].map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                style={{ ...G, borderRadius: "20px", padding: "24px", textAlign: "center" }}
              >
                <h3 style={{ fontSize: "32px", fontWeight: 800, color: "var(--accent)" }}>{stat.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
