"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { MapPin, FlaskConical, BookOpen, Activity, Camera, ChevronDown, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

function UserAvatar({ name, image, size = 32 }: { name?: string | null; image?: string | null; size?: number }) {
  const initials = (name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const src = image?.startsWith("http") ? `/api/avatar/avatars/${image.split("/").pop()}` : image;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name ?? "Profile"} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block" }} />;
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, var(--accent), #FF9A4C)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.34, fontWeight: 800, color: "white",
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

const links = [
  { href: "/discover", label: "Discover", icon: MapPin },
  { href: "/scan", label: "Scan", icon: Camera },
  { href: "/lab", label: "Lab", icon: FlaskConical },
  { href: "/culture", label: "Culture", icon: BookOpen },
  { href: "/pulse", label: "Pulse", icon: Activity },
];

export function DesktopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleSignOut() {
    setOpen(false);
    await signOut({ redirect: false });
    router.push("/auth/login");
  }

  const name = session?.user?.name;
  const email = session?.user?.email;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--nav-bg)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderBottom: "1px solid var(--nav-border)",
      }}
    >
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 40px",
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "32px",
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <span style={{
            fontSize: "24px",
            fontWeight: 900,
            letterSpacing: "-0.5px",
            background: "linear-gradient(135deg, var(--accent) 0%, #FF9A4C 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            foodipa
          </span>
          <span style={{ fontSize: "22px" }}>🍜</span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1, justifyContent: "center" }}>
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} style={{ textDecoration: "none", position: "relative" }}>
                <motion.div
                  whileHover={{ y: -1 }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "var(--accent)" : "var(--muted)",
                    background: isActive ? "rgba(255,107,43,0.08)" : "transparent",
                    transition: "color 0.2s, background 0.2s",
                    cursor: "pointer",
                  }}
                >
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-indicator"
                      style={{
                        position: "absolute",
                        bottom: 2,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "20px",
                        height: "2px",
                        borderRadius: "99px",
                        background: "var(--accent)",
                      }}
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <ThemeToggle />

          {/* User avatar + dropdown */}
          <div ref={ref} style={{ position: "relative" }}>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "3px 10px 3px 3px",
                borderRadius: "50px",
                background: open ? "rgba(255,107,43,0.1)" : "var(--glass-bg)",
                border: open ? "1.5px solid var(--accent)" : "1px solid var(--glass-border)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              aria-label="Account menu"
            >
              <UserAvatar name={name} image={session?.user?.image} size={32} />
              {name && (
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)", maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {name.split(" ")[0]}
                </span>
              )}
              <ChevronDown size={13} style={{ color: "var(--muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </motion.button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  style={{
                    position: "absolute", top: "calc(100% + 10px)", right: 0,
                    width: "220px", borderRadius: "18px", overflow: "hidden",
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
                    border: "1px solid var(--glass-border)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)",
                    zIndex: 100,
                  }}
                >
                  {/* User info */}
                  <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid var(--glass-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <UserAvatar name={name} image={session?.user?.image} size={36} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "13px", fontWeight: 800, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {name ?? "User"}
                        </p>
                        <p style={{ fontSize: "11px", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "1px" }}>
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: "6px" }}>
                    <Link href="/profile" onClick={() => setOpen(false)} style={{ textDecoration: "none" }}>
                      <motion.div
                        whileHover={{ background: "rgba(255,107,43,0.07)" }}
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", cursor: "pointer" }}
                      >
                        <div style={{ width: "30px", height: "30px", borderRadius: "10px", background: "rgba(255,107,43,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <User size={14} style={{ color: "var(--accent)" }} />
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>View Profile</span>
                      </motion.div>
                    </Link>

                    <motion.button
                      whileHover={{ background: "rgba(239,68,68,0.07)" }}
                      onClick={handleSignOut}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", cursor: "pointer", background: "transparent", border: "none", textAlign: "left" }}
                    >
                      <div style={{ width: "30px", height: "30px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <LogOut size={14} style={{ color: "#EF4444" }} />
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#EF4444" }}>Sign Out</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/scan" style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "10px 20px",
                borderRadius: "14px",
                background: "var(--accent)",
                color: "white",
                fontSize: "14px",
                fontWeight: 700,
                boxShadow: "0 4px 16px rgba(255,107,43,0.35)",
                cursor: "pointer",
              }}
            >
              Scan a Dish 📷
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
