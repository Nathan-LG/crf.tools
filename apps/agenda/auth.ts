import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@repo/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",

  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        return profile.email.endsWith("@croix-rouge.fr");
      }
    },

    async jwt({ token, user, session, trigger }) {
      if (trigger === "update" && session?.name !== token.name) {
        token.name = session.name;
      }

      if (user) {
        const globalUser = await prisma.globalUser.findFirst({
          select: {
            type: true,
          },
          where: {
            email: user.email,
          },
        });

        if (globalUser?.type === "temp") {
          const tempUser = await prisma.tempUser.delete({
            select: {
              phoneNumber: true,
            },
            where: {
              email: user.email,
            },
          });

          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              phoneNumber: tempUser.phoneNumber,
            },
          });

          await prisma.globalUser.update({
            where: {
              email: user.email,
            },
            data: {
              type: "complete",
            },
          });
        } else if (globalUser === null) {
          await prisma.globalUser.create({
            data: {
              email: user.email,
              type: "complete",
            },
          });
        }

        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },

    async authorized({ auth }) {
      return !!auth;
    },
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/signin",
  },
});
