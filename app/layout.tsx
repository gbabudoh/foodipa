import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NavWrapper } from "@/components/nav-wrapper";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

import { GoogleAnalytics, MatomoAnalytics } from "@/components/analytics";

export const metadata: Metadata = {
  title: {
    default: "Foodipa — Your Culinary Universe",
    template: "%s | Foodipa"
  },
  description:
    "Discover global cuisines, AI-powered recipes, food culture, and connect with fellow food adventurers.",
  keywords: ["food", "recipes", "AI food scanner", "culinary community", "global finder"],
  authors: [{ name: "Foodipa Team" }],
  creator: "Foodipa",
  publisher: "Foodipa",
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://foodipa.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://foodipa.app",
    siteName: "Foodipa",
    title: "Foodipa — Your Culinary Universe",
    description: "Discover global cuisines and AI-powered recipes.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Foodipa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foodipa — Your Culinary Universe",
    description: "Discover global cuisines and AI-powered recipes.",
    images: ["/og-image.jpg"],
    creator: "@foodipa",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FF6B2B",
};

import { MobileRuntime } from "@/components/mobile-runtime";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased`}>
        <Providers>
          <MobileRuntime>
            <NavWrapper>{children}</NavWrapper>
          </MobileRuntime>
          <GoogleAnalytics />
          <MatomoAnalytics />
        </Providers>
      </body>
    </html>
  );
}
