"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21">
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

function AppleIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 814 1000" fill={color}>
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.3-164-39.3c-76.5 0-103.7 40.8-165.9 40.8s-105.5-57.3-155-123.1c-58.8-82.5-107.9-205.3-107.9-322.9 0-230 155.5-348.7 308.1-348.7 79 0 144.5 51.8 194.3 51.8 47.8 0 122.6-55.1 210.6-55.1zM665.3 220.6c36.9-43.6 63.5-104.6 63.5-165.6 0-8.7-.7-17.4-2.2-24.8-60.4 2.2-132.9 40.2-176.6 89.5-33.4 37.5-65.4 98.5-65.4 160.2 0 9.4 1.5 18.7 2.2 21.7 3.6.5 9.4 1.5 15.2 1.5 54.3 0 122.5-36.1 163.3-82.5z" />
    </svg>
  );
}

const PROVIDERS = [
  {
    id: "google",
    label: "Continue with Google",
    Icon: () => <GoogleIcon />,
    style: { ...G, color: "var(--foreground)" } as React.CSSProperties,
  },
  {
    id: "microsoft-entra-id",
    label: "Continue with Microsoft",
    Icon: () => <MicrosoftIcon />,
    style: { ...G, color: "var(--foreground)" } as React.CSSProperties,
  },
  {
    id: "apple",
    label: "Continue with Apple",
    Icon: () => <AppleIcon color="var(--foreground)" />,
    style: { ...G, color: "var(--foreground)" } as React.CSSProperties,
  },
];

export function SocialAuthButtons() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleSocial(providerId: string) {
    setLoadingId(providerId);
    await signIn(providerId, { callbackUrl: "/" });
    // page will redirect; no need to reset loadingId
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {PROVIDERS.map(({ id, label, Icon, style }) => (
        <motion.button
          key={id}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSocial(id)}
          disabled={loadingId !== null}
          style={{
            ...style,
            height: "52px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: loadingId !== null ? "not-allowed" : "pointer",
            opacity: loadingId !== null && loadingId !== id ? 0.5 : 1,
            transition: "opacity 0.2s",
            border: "none",
            width: "100%",
          }}
        >
          {loadingId === id ? (
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid rgba(128,128,128,0.3)", borderTopColor: "var(--foreground)", animation: "spin 0.8s linear infinite" }} />
          ) : (
            <Icon />
          )}
          {label}
        </motion.button>
      ))}
    </div>
  );
}
