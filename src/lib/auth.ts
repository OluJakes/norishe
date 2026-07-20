import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

if (!process.env.NEXTAUTH_SECRET) {
  // Fail loudly at startup rather than surfacing as a cryptic
  // error=Configuration redirect the first time someone hits /admin.
  console.warn(
    "[auth] NEXTAUTH_SECRET is not set. Add it to your .env file (see .env.example) " +
      "and restart the dev server, or admin login will fail with a Configuration error."
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mustChangePwd: user.mustChangePwd,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.mustChangePwd = (user as any).mustChangePwd;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).mustChangePwd = token.mustChangePwd;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};
