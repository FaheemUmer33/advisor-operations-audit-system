import { Sidebar } from "@/components/sidebar";
import { requireUser } from "@/lib/auth";
import { Badge } from "@/components/ui";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="lg:pl-72">
        <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Smart Logics
              </p>
              <p className="text-sm font-medium text-slate-900">
                Advisory operations command center
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone="blue">{user.role}</Badge>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
