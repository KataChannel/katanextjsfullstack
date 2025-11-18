import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { getPrismaClient } from "@/lib/database";

// Get Prisma client for the current domain
// Domain is determined from NEXT_PUBLIC_DOMAIN or defaults to innerbright.vn
const currentDomain = process.env.NEXT_PUBLIC_DOMAIN || 'innerbright.vn';
const authPrisma = getPrismaClient(currentDomain);

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
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
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
    async session({ session, user }) {
      // With database sessions, user comes from DB directly
      if (session.user && user) {
        console.log('[Auth] Session callback:', {
          userId: user.id,
          userEmail: user.email,
        });

        // Load full user from DB to get role
        const dbUser = await authPrisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, role: true, emailVerified: true },
        });

        console.log('[Auth] Session - DB user:', {
          role: dbUser?.role,
          verified: !!dbUser?.emailVerified
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
          session.user.emailVerified = dbUser.emailVerified;
        }
      }
      
      console.log('[Auth] Final session:', {
        hasUser: !!session.user,
        userRole: session.user?.role
      });
      
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log('[Auth] signIn callback:', {
        provider: account?.provider,
        userEmail: user.email,
        userId: user.id,
        userRole: user.role
      });

      // For credentials provider, check email verification
      if (account?.provider === "credentials") {
        const dbUser = await authPrisma.user.findUnique({
          where: { id: user.id },
          select: { emailVerified: true, role: true },
        });
        
        console.log('[Auth] Credentials login - DB user:', {
          email: user.email,
          emailVerified: dbUser?.emailVerified,
          role: dbUser?.role
        });
        
        if (!dbUser?.emailVerified) {
          throw new Error("Email chưa được xác thực. Vui lòng kiểm tra email và nhập mã OTP.");
        }
      }
      
      // For OAuth providers (Google, etc.)
      if (account?.provider === "google") {
        // Check if user exists and update emailVerified if needed
        const existingUser = await authPrisma.user.findUnique({
          where: { email: user.email! },
          select: { id: true, emailVerified: true },
        });

        if (existingUser && !existingUser.emailVerified) {
          // Auto-verify email for OAuth logins
          await authPrisma.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date() },
          });
        }
      }
      
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
