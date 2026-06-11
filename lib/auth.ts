import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "smart_logics_session";

function secret() {
  return process.env.AUTH_SECRET || "local-development-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createSessionValue(userId: string) {
  const value = `${userId}.${Date.now()}`;
  return `${value}.${sign(value)}`;
}

export function verifySessionValue(session?: string) {
  if (!session) return null;
  const parts = session.split(".");
  if (parts.length !== 3) return null;
  const value = `${parts[0]}.${parts[1]}`;
  const expected = sign(value);
  const actual = parts[2];
  if (expected.length !== actual.length) return null;
  const valid = timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
  return valid ? parts[0] : null;
}

export async function getCurrentUser() {
  const userId = verifySessionValue(cookies().get(COOKIE_NAME)?.value);
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

export function setSession(userId: string) {
  cookies().set(COOKIE_NAME, createSessionValue(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSession() {
  cookies().delete(COOKIE_NAME);
}
