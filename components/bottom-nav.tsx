"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Camera, Activity, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/discover", icon: MapPin, label: "Discover" },
  { href: "/scan", icon: Camera, label: "Scan", center: true },
  { href: "/pulse", icon: Activity, label: "Pulse" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "var(--nav-bg)",
        borderTop: "1px solid var(--nav-border)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          height: "64px",
          maxWidth: "512px",
          margin: "0 auto",
          padding: "0 8px",
        }}
      >
        {navItems.map(({ href, icon: Icon, label, center }) => {
          const isActive = pathname === href;

          if (center) {
            return (
              <Link
                key={href}
                href={href}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  position: "relative",
                }}
              >
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "18px",
                    background: isActive
                      ? "var(--accent)"
                      : "linear-gradient(135deg, var(--accent), #FF9A4C)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(255,107,43,0.42)",
                    marginBottom: "2px",
                    transform: "translateY(-8px)",
                  }}
                >
                  <Icon size={22} color="white" strokeWidth={2} />
                </motion.div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "var(--accent)" : "var(--muted)",
                    lineHeight: 1,
                    marginTop: "-6px",
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                height: "100%",
                position: "relative",
                textDecoration: "none",
              }}
            >
              {/* Active top pill */}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  style={{
                    position: "absolute",
                    top: 0,
                    width: "32px",
                    height: "2.5px",
                    borderRadius: "0 0 4px 4px",
                    background: "var(--accent)",
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}

              {/* Active background pill */}
              {isActive && (
                <motion.div
                  layoutId="nav-bg"
                  style={{
                    position: "absolute",
                    inset: "8px 6px",
                    borderRadius: "14px",
                    background: "rgba(255, 107, 43, 0.09)",
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}

              <motion.div
                whileTap={{ scale: 0.78 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 1.7}
                  style={{
                    color: isActive ? "var(--accent)" : "var(--muted)",
                    transition: "color 0.2s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "var(--accent)" : "var(--muted)",
                    lineHeight: 1,
                    transition: "color 0.2s ease",
                  }}
                >
                  {label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
