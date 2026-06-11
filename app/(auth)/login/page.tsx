import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4">
      <section className="w-full max-w-md rounded-lg bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Smart Logics</p>
        <h1 className="mt-3 text-2xl font-semibold text-navy">Advisor Operations Audit System</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to manage advisory firm operations audits.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
