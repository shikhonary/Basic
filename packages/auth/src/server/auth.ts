import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "@workspace/db/main"
import { sendVerificationEmail, sendResetPasswordEmail } from "@workspace/email"

/**
 * Server-side Better Auth instance.
 *
 * This is the single source of truth for all auth configuration.
 * Import this in your server code (e.g. Next.js route handlers, middleware).
 *
 * The Prisma adapter points at the custom-generated client from
 * packages/db/generated/main — NOT @prisma/client — as required by Prisma 7+.
 */
export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await db.user.update({
              where: { id: user.id },
              data: {
                roles: {
                  connect: { name: "USER" },
                },
              },
            })
          } catch (error) {
            console.error(
              "ERROR [Better Auth/User]: Failed to assign USER role on registration:",
              error
            )
          }
        },
      },
    },
    session: {
      create: {
        before: async (session, ctx) => {
          const body = ctx?.body as { rememberMe?: boolean } | undefined
          const rememberMe = body?.rememberMe

          // If rememberMe is not checked, shorten database session lifetime to 7 days
          if (!rememberMe) {
            const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
            return {
              data: {
                ...session,
                expiresAt,
              },
            }
          }

          return { data: session }
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      const resetUrl = `${appUrl}/auth/reset-password?token=${token}`

      const result = await sendResetPasswordEmail({
        to: user.email,
        name: user.name || "User",
        url: resetUrl,
      })

      if (!result.success) {
        console.error(
          "ERROR [Better Auth/Email]: Failed to send reset password email:",
          result.error
        )
      }
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Modify callback URL to redirect to /auth/sign-in?verified=true upon successful validation
      const redirectUrl = new URL(url)
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      redirectUrl.searchParams.set(
        "callbackURL",
        `${appUrl}/auth/sign-in?verified=true`
      )

      const result = await sendVerificationEmail({
        to: user.email,
        name: user.name || "User",
        url: redirectUrl.toString(),
      })

      if (!result.success) {
        console.error(
          "ERROR [Better Auth/Email]: Failed to send verification email:",
          result.error
        )
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  // Allow multiple domains to share the same auth package
  trustedOrigins: process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(",")
    : process.env.NEXT_PUBLIC_APP_URL
      ? [process.env.NEXT_PUBLIC_APP_URL]
      : [],
})

export type Auth = typeof auth
