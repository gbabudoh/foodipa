"use client";

import Link from "next/link";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
};

export function DesktopFooter() {
  return (
    <footer style={{
      borderTop: "1px solid var(--nav-border)",
      background: "var(--nav-bg)",
      backdropFilter: "blur(28px)",
      WebkitBackdropFilter: "blur(28px)",
      marginTop: "80px",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "60px 40px 40px" }}>

        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{
                fontSize: "22px",
                fontWeight: 900,
                letterSpacing: "-0.5px",
                background: "linear-gradient(135deg, var(--accent) 0%, #FF9A4C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>foodipa</span>
              <span style={{ fontSize: "20px" }}>🍜</span>
            </div>
            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.7, maxWidth: "280px" }}>
              Your culinary universe — discover global cuisines, AI-powered recipes, food culture, and connect with fellow food adventurers.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {["🍎 App Store", "🤖 Google Play"].map((label) => (
                <div key={label} style={{
                  ...G,
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  cursor: "pointer",
                }}>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
              Features
            </p>
            {[
              { label: "Food Finder", href: "/discover" },
              { label: "The Lab", href: "/lab" },
              { label: "Culture Hub", href: "/culture" },
              { label: "Food Pulse", href: "/pulse" },
              { label: "Food Scanner", href: "/scan" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={{ display: "block", textDecoration: "none", marginBottom: "10px" }}>
                <span style={{ fontSize: "14px", color: "var(--foreground)", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--foreground)")}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>

          {/* Discover */}
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
              Explore
            </p>
            {["Trending Dishes", "World Cuisines", "AI Recipes", "Fridge Raid", "Cocktail Lab"].map((label) => (
              <p key={label} style={{ fontSize: "14px", color: "var(--foreground)", marginBottom: "10px", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--foreground)")}
              >
                {label}
              </p>
            ))}
          </div>

          {/* Company */}
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "16px" }}>
              Company
            </p>
            {["About", "Blog", "Careers", "Privacy Policy", "Terms of Service"].map((label) => (
              <p key={label} style={{ fontSize: "14px", color: "var(--foreground)", marginBottom: "10px", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--foreground)")}
              >
                {label}
              </p>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          paddingTop: "24px",
          borderTop: "1px solid var(--nav-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <p style={{ fontSize: "13px", color: "var(--muted)" }}>
            © 2025 Foodipa. All rights reserved.
          </p>
          <p style={{ fontSize: "13px", color: "var(--muted)" }}>
            Made with ❤️ for food lovers worldwide 🌍
          </p>
        </div>
      </div>
    </footer>
  );
}
