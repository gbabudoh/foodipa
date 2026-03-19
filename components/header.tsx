"use client";

import Link from "next/link";
import { Bell, User, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-40 flex items-center justify-between px-5"
      style={{
        height: "60px",
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--nav-border)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span className="text-[22px] font-black tracking-tight" style={{ background: "linear-gradient(135deg, var(--accent) 0%, #FF9A4C 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          foodipa
        </span>
        <span style={{ fontSize: "20px" }}>🍜</span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="relative flex items-center justify-center"
          style={{ width: "38px", height: "38px", borderRadius: "12px", background: "var(--glass-bg)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid var(--glass-border)" }}
          aria-label="Notifications"
        >
          <Bell size={16} style={{ color: "var(--foreground)" }} />
          <span style={{ position: "absolute", top: "8px", right: "8px", width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent)", border: "1.5px solid var(--background)" }} />
        </motion.button>

        <ThemeToggle />

        {/* Avatar + dropdown */}
        <div ref={ref} style={{ position: "relative" }}>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "3px 8px 3px 3px",
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
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--foreground)", maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {name.split(" ")[0]}
              </span>
            )}
            <ChevronDown size={13} style={{ color: "var(--muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </motion.button>

          {/* Dropdown */}
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
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    style={{ textDecoration: "none" }}
                  >
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
      </div>
    </motion.header>
  );
}
