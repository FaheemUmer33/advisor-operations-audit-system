import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";
import { SidebarNav } from "@/components/nav-link";
import { Badge } from "@/components/ui";

export async function Sidebar() {
  const user = await getCurrentUser();
  return (
    <aside className="no-print fixed inset-y-0 left-0 hidden w-72 flex-col bg-[#0B1220] text-white lg:flex">
      <div className="border-b border-white/10 p-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-sm font-bold text-white">
            SL
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">Smart Logics</p>
            <p className="mt-0.5 text-xs text-slate-400">Advisor Operations Audit</p>
          </div>
        </Link>
        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Consulting OS
          </p>
          <p className="mt-1 text-sm text-slate-200">Wealth operations audit platform</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        <SidebarNav />
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <p className="text-sm font-semibold">{user?.fullName}</p>
          <div className="mt-2">
            <Badge tone="blue">{user?.role}</Badge>
          </div>
        </div>
        <form action={logoutAction} className="mt-3">
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white" type="submit">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
