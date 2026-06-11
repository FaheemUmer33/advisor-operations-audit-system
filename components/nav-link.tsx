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
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
        active
          ? "bg-blue-700 text-white shadow-sm"
          : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" />
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
