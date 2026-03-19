import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import MicrosoftEntraId from "next-auth/providers/microsoft-entra-id";
import Apple from "next-auth/providers/apple";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    MicrosoftEntraId({
      clientId: process.env.MICROSOFT_ENTRA_ID_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_ENTRA_ID_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.MICROSOFT_ENTRA_ID_TENANT_ID ?? "common"}/v2.0`,
    }),
    Apple({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          onboardingComplete: user.onboardingComplete,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        // Credentials provider sets onboardingComplete directly.
        // OAuth providers don't — fetch it from DB.
        if ((user as { onboardingComplete?: boolean }).onboardingComplete !== undefined) {
          token.onboardingComplete = (user as { onboardingComplete?: boolean }).onboardingComplete;
        } else if (user.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { onboardingComplete: true },
          });
          token.onboardingComplete = dbUser?.onboardingComplete ?? false;
        }
      }
      // On update() trigger, re-fetch from DB — the only reliable source of truth
      if (trigger === "update" && token.id) {
        const fresh = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { onboardingComplete: true },
        });
        if (fresh) token.onboardingComplete = fresh.onboardingComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as { onboardingComplete?: boolean }).onboardingComplete =
          token.onboardingComplete as boolean;
      }
      return session;
    },
  },
});
