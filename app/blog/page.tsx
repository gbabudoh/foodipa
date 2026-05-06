"use client";

import { motion } from "framer-motion";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

export default function BlogPage() {
  const posts = [
    { title: "The Future of AI in Gastronomy", date: "May 12, 2025", category: "Technology" },
    { title: "Top 10 Hidden Street Food Markets in Lagos", date: "May 10, 2025", category: "Discovery" },
    { title: "Understanding Umami: The Fifth Taste", date: "May 08, 2025", category: "Culture" },
  ];

  return (
    <div className="desktop-page-inner" style={{ minHeight: "100vh", padding: "80px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "40px", fontWeight: 900, color: "var(--foreground)", letterSpacing: "-1px", marginBottom: "40px" }}>
            Foodipa <span style={{ color: "var(--accent)" }}>Blog</span>
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {posts.map((post, i) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ ...G, borderRadius: "20px", padding: "32px", cursor: "pointer" }}
              >
                <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", marginBottom: "8px" }}>
                  {post.category}
                </p>
                <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--foreground)", marginBottom: "12px" }}>{post.title}</h2>
                <p style={{ fontSize: "14px", color: "var(--muted)" }}>{post.date} • 5 min read</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
