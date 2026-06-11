"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  FileText,
  Gauge,
  Lightbulb,
  Settings,
  StickyNote,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

function NavLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={cn(
        "group flex min-h-10 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]",
        active
          ? "bg-blue-700 text-white shadow-sm"
          : "text-slate-300 hover:bg-white/[0.075] hover:text-white"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 transition-transform duration-200 ease-out",
          active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
        )}
      />
      {label}
    </Link>
  );
}

export function SidebarNav() {
  return (
    <>
      {links.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          Icon={item.icon}
        />
      ))}
    </>
  );
}
