"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { randomUUID } from "crypto";
import { and, eq, lt } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { guest } from "@/lib/db/schemas";

import { signInSchema, signUpSchema } from "./schema";
import { type SignInFormData } from "./zodType";

const COOKIE_OPTIONS = {
  httpOnly: true as const,
  secure: true as const,
  sameSite: "strict" as const,
  path: "/" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function createGuestSession() {
  const cookieStore = await cookies(); // cookie from header
  const existing = cookieStore.get("guest_session");
  if (existing?.value) {
    // if exist, return the existed
    return { ok: true, sessionToken: existing.value };
  }

  const sessionToken = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + COOKIE_OPTIONS.maxAge * 1000);

  await db.insert(guest).values({
    sessionToken,
    expiresAt,
  });

  cookieStore.set("guest_session", sessionToken, COOKIE_OPTIONS);
  return { ok: true, sessionToken };
}

export async function guestSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("guest_session")?.value;
  if (!token) {
    return { sessionToken: null };
  }
  const now = new Date();
  await db
    .delete(guest)
    .where(and(eq(guest.sessionToken, token), lt(guest.expiresAt, now)));

  return { sessionToken: token };
}

export async function signUp(formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const data = signUpSchema.parse(rawData);

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
}

export async function signIn(payload: SignInFormData) {
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
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/");
}

// guest session into user -- delete current guest session
async function migrateGuestToUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("guest_session")?.value;
  if (!token) return;

  await db.delete(guest).where(eq(guest.sessionToken, token));
  cookieStore.delete("guest_session");
}
