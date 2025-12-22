import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "./db"

declare module "next-auth" {
  interface User {
    role?: string
    plan?: string
    emailVerified?: Date | null
  }
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      role?: string
      plan?: string
      emailVerified?: Date | null
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string
    plan?: string
    emailVerified?: Date | null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/signup",
    error: "/auth/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('[Auth] Missing email or password')
          return null
        }

        // Case-insensitive email lookup
        const user = await prisma.user.findFirst({
          where: {
            email: {
              equals: credentials.email as string,
              mode: 'insensitive'
            }
          }
        })

        if (!user) {
          console.log('[Auth] User not found for email:', credentials.email)
          return null
        }

        if (!user.password) {
          console.log('[Auth] User has no password (OAuth-only account):', credentials.email)
          return null
        }

        console.log('[Auth] Found user:', user.email, 'Attempting password verification...')

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          console.log('[Auth] Invalid password for user:', credentials.email)
          return null
        }

        console.log('[Auth] Login successful for:', credentials.email)

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
          emailVerified: user.emailVerified,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Only populate token from user on initial sign-in
      // Prisma cannot run in Edge Runtime (middleware), so we can't fetch from DB here
      // Fresh emailVerified status is checked in server components (dashboard layout)
      if (user) {
        token.role = user.role
        token.plan = user.plan
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role
        session.user.plan = token.plan
        session.user.emailVerified = token.emailVerified
      }
      return session
    }
  }
})
