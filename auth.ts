import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import { Prisma } from "@prisma/client";

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
        const deletedSessions: Prisma.BatchPayload =
          await prisma.session.deleteMany({
            where: {
              expires: {
                lt: new Date(),
              },
            },
          });

        const tempUser = await prisma.tempUser.findFirst({
          select: {
            phoneNumber: true,
          },
          where: {
            email: user.email,
          },
        });

        if (tempUser) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              phoneNumber: tempUser.phoneNumber,
            },
          });

          await prisma.tempUser.delete({
            where: {
              email: user.email,
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
