import env from "@/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { openAPI } from "better-auth/plugins";
import { v4 as uuidv4 } from "uuid";

import { sendMail } from "@/lib/actions/mail";
import { db } from "@/lib/db";

export type Session = typeof auth.$Infer.Session;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [openAPI(), nextCookies()], //nextCookies() should be last plugin in the list
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url }) => {
        await sendMail({
          to: user.email,
          subject: "Verify your email change",
          html: `<p>Click the link to verify: ${url}</p>`,
        });
      },
    },
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click the link to reset your password: ${url}</p>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${env.EMAIL_VERIFICATION_CALLBACK_URL}`;
      await sendMail({
        to: user.email,
        subject: "Verify your email address",
        html: `<p>Click the link to verify your email: ${verificationUrl}</p>`,
      });
    },
  },
  advanced: {
    generateId: () => uuidv4(),
    cookies: {
      session_token: {
        name: "auth_session",
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
  },
});
