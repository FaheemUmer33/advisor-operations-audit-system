import { Sidebar } from "@/components/sidebar";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
