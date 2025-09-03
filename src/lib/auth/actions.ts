"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { guest } from "@/lib/db/schemas";

import { signInSchema, signUpSchema } from "./schema";
import { type SignInFormData, type SignUpFormData } from "./zodType";

const COOKIE_OPTIONS = {
  httpOnly: true as const,
  secure: true as const,
  sameSite: "strict" as const,
  path: "/" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function createGuestSession() {
  try {
    // Prepare data creation
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + COOKIE_OPTIONS.maxAge * 1000); // 7 days

    // Add data to database (guest)
    await db.insert(guest).values({
      sessionToken,
      expiresAt,
    });

    // Create the cookie
    const cookieStore = await cookies();
    cookieStore.set("guest_session", sessionToken, COOKIE_OPTIONS);

    return { ok: true, sessionToken };
  } catch (error) {
    console.error("Create guest session error:", error);
    return {
      ok: false,
      error: "Failed to create guest session",
    };
  }
}

export async function getGuestSession() {
  try {
    const cookieStore = await cookies();
    const guestSessionToken = cookieStore.get("guest_session")?.value;

    if (!guestSessionToken) {
      return null;
    }

    const guestSession = await db
      .select()
      .from(guest)
      .where(eq(guest.sessionToken, guestSessionToken))
      .limit(1);

    if (guestSession.length === 0) {
      cookieStore.delete("guest_session");
      return null;
    }

    const session = guestSession[0];

    if (session.expiresAt < new Date()) {
      await db.delete(guest).where(eq(guest.sessionToken, guestSessionToken));
      cookieStore.delete("guest_session");
      return null;
    }

    return session;
  } catch (error) {
    console.error("Get guest session error:", error);
    return null;
  }
}

export async function signUp(payload: SignUpFormData) {
  try {
    const data = signUpSchema.parse(payload);

    const res = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });

    // delete guest session if any after sign in
    await migrateGuestToUser();
    return { ok: true, userId: res.user?.id };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Sign up failed",
    };
  }
}

export async function signIn(payload: SignInFormData) {
  try {
    const data = signInSchema.parse(payload);

    const res = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    // delete guest session if any after sign in
    await migrateGuestToUser();
    return { ok: true, userId: res.user?.id };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Sign in failed",
    };
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session?.user ?? null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function signInGitHub() {
  const response = await auth.api.signInSocial({
    body: {
      provider: "github",
    },
  });
  if (response?.url) {
    redirect(response.url);
  }

  // delete guest session if any after sign in
  await migrateGuestToUser();
}

export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return { ok: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Sign out failed",
    };
  }
}

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session;
}

// guest session into user -- delete current guest session
async function migrateGuestToUser() {
  try {
    const guestSession = await getGuestSession();
    if (!guestSession) return;

    // Here you would merge guest cart data with user account
    // For now, we'll just clean up the guest session
    await db
      .delete(guest)
      .where(eq(guest.sessionToken, guestSession.sessionToken));
    const cookieStore = await cookies();
    cookieStore.delete("guest_session");
  } catch (error) {
    console.error("Merge guest data error:", error);
  }
}
