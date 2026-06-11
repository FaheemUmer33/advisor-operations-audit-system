import Link from "next/link";
import { BarChart3, FileText, Gauge, Lightbulb, LogOut, Settings, StickyNote, Users, Building2 } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/clients", label: "Clients", icon: Building2 },
  { href: "/audits", label: "Audits", icon: BarChart3 },
  { href: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/sales-notes", label: "Sales Notes", icon: StickyNote },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/users", label: "Users", icon: Users },
];

export async function Sidebar() {
  const user = await getCurrentUser();
  return (
    <aside className="no-print fixed inset-y-0 left-0 hidden w-72 flex-col bg-navy text-white lg:flex">
      <div className="border-b border-white/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Smart Logics</p>
        <p className="mt-2 text-lg font-semibold">Advisor Operations Audit System</p>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-white">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="text-sm font-medium">{user?.fullName}</p>
        <p className="text-xs text-blue-200">{user?.role}</p>
        <form action={logoutAction} className="mt-3">
          <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-white/10" type="submit">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
