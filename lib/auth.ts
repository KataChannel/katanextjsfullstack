import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { getPrismaClient } from "@/lib/database";

// Get default Prisma client for authentication (tazagroup.vn)
const authPrisma = getPrismaClient('tazagroup.vn');

// Extend session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      emailVerified: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    emailVerified: Date | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
    emailVerified: Date | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-ignore - Type mismatch between @auth/prisma-adapter and next-auth versions
  adapter: PrismaAdapter(authPrisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true, // Allow dynamic host detection
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/welcome",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email và mật khẩu là bắt buộc");
        }

        const user = await authPrisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error("Email hoặc mật khẩu không đúng");
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Email hoặc mật khẩu không đúng");
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("Vui lòng xác thực email trước khi đăng nhập");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }

      // Handle session update
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // For credentials provider, check email verification
      if (account?.provider === "credentials") {
        const dbUser = await authPrisma.user.findUnique({
          where: { id: user.id },
          select: { emailVerified: true },
        });
        
        if (!dbUser?.emailVerified) {
          throw new Error("Email chưa được xác thực. Vui lòng kiểm tra email và nhập mã OTP.");
        }
      }
      
      // OAuth providers are automatically verified by NextAuth adapter
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      console.log("New user created:", user.email);
      // TODO: Send welcome email
    },
  },
  debug: process.env.NODE_ENV === "development",
});
