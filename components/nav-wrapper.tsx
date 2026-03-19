"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { BottomNav } from "./bottom-nav";
import { DesktopNav } from "./desktop-nav";
import { DesktopFooter } from "./desktop-footer";
import { ChatbotFab } from "./chatbot-fab";

const FULL_SCREEN_ROUTES = ["/auth/intro", "/auth/login", "/auth/register", "/onboarding"];

export function NavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullScreen = FULL_SCREEN_ROUTES.some((r) => pathname.startsWith(r));

  if (isFullScreen) {
    return <main style={{ minHeight: "100vh" }}>{children}</main>;
  }

  return (
    <>
      <div className="mobile-only">
        <Header />
      </div>
      <div className="desktop-only">
        <DesktopNav />
      </div>

      <main className="mobile-main desktop-main flex-1">{children}</main>

      <div className="mobile-only">
        <BottomNav />
      </div>
      <div className="desktop-only">
        <DesktopFooter />
      </div>

      <ChatbotFab />
    </>
  );
}
