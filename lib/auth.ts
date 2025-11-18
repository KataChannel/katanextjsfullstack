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
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true, // Allow dynamic host detection
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.innerbright.vn' : undefined,
      },
    },
  },
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
    async jwt({ token, user, trigger, account }) {
      // Initial sign in - add user data to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
        
        console.log('[Auth] JWT callback - user data added:', {
          userId: user.id,
          userEmail: user.email,
          role: user.role,
          provider: account?.provider,
        });
      }
      
      // Refresh token data on update
      if (trigger === "update") {
        const dbUser = await authPrisma.user.findUnique({
          where: { id: token.id as string },
          select: { id: true, email: true, role: true, emailVerified: true },
        });
        
        if (dbUser) {
          token.email = dbUser.email;
          token.role = dbUser.role;
          token.emailVerified = dbUser.emailVerified;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // Add token data to session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as Date | null;
        
        console.log('[Auth] Session callback:', {
          userId: token.id,
          userEmail: token.email,
          userRole: token.role,
        });
      }
      
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
        console.log('[Auth] Google OAuth login:', {
          accountEmail: user.email,
          accountId: account.providerAccountId,
          userId: user.id,
        });

        // Check if user exists in database
        const existingUser = await authPrisma.user.findUnique({
          where: { email: user.email! },
          select: { 
            id: true, 
            email: true,
            role: true,
            emailVerified: true 
          },
        });

        console.log('[Auth] Existing user found:', existingUser);

        if (existingUser) {
          // Update emailVerified if not set
          if (!existingUser.emailVerified) {
            await authPrisma.user.update({
              where: { id: existingUser.id },
              data: { emailVerified: new Date() },
            });
            console.log('[Auth] Auto-verified email for OAuth user:', existingUser.email);
          }

          // Make sure the user object has correct data from DB
          user.id = existingUser.id;
          user.email = existingUser.email;
          user.role = existingUser.role;
          user.emailVerified = existingUser.emailVerified || new Date();
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
