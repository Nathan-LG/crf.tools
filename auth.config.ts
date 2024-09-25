import type { NextAuthConfig } from "next-auth";
import google from "next-auth/providers/google";

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },

  callbacks: {
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.sub as string;
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        throw error;
      }
    },

    async redirect({ url, baseUrl }) {
      try {
        if (url.startsWith(baseUrl)) return url;
        else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
        return baseUrl;
      } catch (error) {
        console.error("Error in redirect callback:", error);
        throw error;
      }
    },
  },

  providers: [google],
} satisfies NextAuthConfig;
