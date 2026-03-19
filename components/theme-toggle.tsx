"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "12px",
          background: "var(--glass-bg)",
        }}
      />
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center"
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "12px",
        background: "var(--glass-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--card-shadow)",
      }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.18 }}
        >
          {theme === "dark"
            ? <Sun size={16} style={{ color: "var(--foreground)" }} />
            : <Moon size={16} style={{ color: "var(--foreground)" }} />
          }
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
