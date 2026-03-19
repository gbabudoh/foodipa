import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/onboarding",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl, cookies } = request;
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isAuthRoute = pathname.startsWith("/auth");
      const isOnboarding = pathname === "/onboarding";
      const isApiAuth = pathname.startsWith("/api/auth");
      const isApi = pathname.startsWith("/api");

      // Always allow API routes
      if (isApiAuth || isApi) return true;

      // Not logged in
      if (!isLoggedIn) {
        if (isAuthRoute) return true;
        return Response.redirect(new URL("/auth/intro", nextUrl));
      }

      // Check onboarding status — cookie is the reliable signal right after save;
      // JWT flag covers subsequent visits once the session refreshes naturally.
      const cookieDone = cookies.get("onboarding_done")?.value === "1";
      const jwtDone = (auth?.user as { onboardingComplete?: boolean })?.onboardingComplete ?? false;
      const onboardingComplete = cookieDone || jwtDone;

      // Logged in but onboarding not done
      if (!onboardingComplete && !isOnboarding) {
        return Response.redirect(new URL("/onboarding", nextUrl));
      }

      // Logged in + onboarding done — bounce away from auth/onboarding pages
      if (onboardingComplete && (isAuthRoute || isOnboarding)) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
