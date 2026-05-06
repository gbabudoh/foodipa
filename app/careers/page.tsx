"use client";

import { motion } from "framer-motion";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

export default function CareersPage() {
  const jobs = [
    { role: "Senior AI Engineer", location: "Remote / London", dept: "Engineering" },
    { role: "Product Designer", location: "Remote / Lagos", dept: "Design" },
    { role: "Culinary Content Strategist", location: "Remote", dept: "Content" },
  ];

  return (
    <div className="desktop-page-inner" style={{ minHeight: "100vh", padding: "80px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "40px", fontWeight: 900, color: "var(--foreground)", letterSpacing: "-1px", marginBottom: "16px" }}>
            Join the <span style={{ color: "var(--accent)" }}>Food Revolution</span>
          </h1>
          <p style={{ fontSize: "16px", color: "var(--muted)", marginBottom: "48px" }}>
            We&apos;re looking for passionate individuals to help us build the future of food discovery.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {jobs.map((job, i) => (
              <motion.div
                key={job.role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ ...G, borderRadius: "18px", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
              >
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--foreground)" }}>{job.role}</h2>
                  <p style={{ fontSize: "14px", color: "var(--muted)", marginTop: "4px" }}>{job.dept} • {job.location}</p>
                </div>
                <div style={{ padding: "8px 16px", borderRadius: "10px", background: "var(--accent)", color: "white", fontSize: "13px", fontWeight: 700 }}>
                  Apply
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
