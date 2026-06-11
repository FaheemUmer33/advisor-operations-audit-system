import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/login-form";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="grid min-h-screen bg-[#0B1220] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden flex-col justify-between border-r border-white/10 bg-[#0B1220] p-10 text-white lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-sm font-bold">
              SL
            </div>
            <div>
              <p className="text-lg font-bold">Smart Logics</p>
              <p className="text-sm text-slate-400">Advisor Operations Audit System</p>
            </div>
          </div>
          <div className="mt-24 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
              Enterprise audit platform
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Operations audit platform for advisory firms.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Evaluate workflows, quantify time drain, prioritize automation
              opportunities, and prepare executive-ready consulting reports.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="font-semibold">6</p>
            <p className="mt-1 text-slate-400">Workflow areas</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="font-semibold">ROI</p>
            <p className="mt-1 text-slate-400">Savings model</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="font-semibold">Report</p>
            <p className="mt-1 text-slate-400">Client-ready</p>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Smart Logics
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            Sign in to your workspace
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Access the Advisor Operations Audit System.
          </p>
          <div className="mt-7">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
