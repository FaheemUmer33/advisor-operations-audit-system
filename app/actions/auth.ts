"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { clearSession, setSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";

export async function loginAction(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!user || user.status !== "Active") return { error: "Invalid login." };

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) return { error: "Invalid login." };

  setSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  clearSession();
  redirect("/login");
}
