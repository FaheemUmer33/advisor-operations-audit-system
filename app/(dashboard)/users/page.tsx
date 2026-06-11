import { createUserAction } from "@/app/actions/app";
import { DataTable, EmptyState, Field, PageHeader, Select, SubmitButton, SectionCard, StatusBadge, TableBody, TableHead, tableCell } from "@/components/ui";
import { USER_ROLES } from "@/lib/constants";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { date } from "@/lib/utils";

export default async function UsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader title="Users" description="Manage MVP users and roles." />
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <SectionCard title="Create User" description="Add a user for admin, consultant, sales, or client viewer access.">
          <form action={createUserAction} className="mt-4 space-y-4">
            <Field label="Full name" name="fullName" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Password" name="password" type="password" required />
            <Select label="Role" name="role" options={USER_ROLES} defaultValue="consultant" required />
            <Select label="Status" name="status" options={["Active", "Inactive"]} defaultValue="Active" required />
            <SubmitButton>Create User</SubmitButton>
          </form>
        </SectionCard>
        {users.length === 0 ? <EmptyState /> : <DataTable><TableHead><tr><th className={tableCell}>Name</th><th className={tableCell}>Email</th><th className={tableCell}>Role</th><th className={tableCell}>Status</th><th className={tableCell}>Created</th></tr></TableHead><TableBody>{users.map((user) => <tr className="transition hover:bg-slate-50" key={user.id}><td className={`${tableCell} font-semibold text-slate-950`}>{user.fullName}</td><td className={tableCell}>{user.email}</td><td className={tableCell}>{user.role}</td><td className={tableCell}><StatusBadge status={user.status} /></td><td className={tableCell}>{date(user.createdAt)}</td></tr>)}</TableBody></DataTable>}
      </div>
    </>
  );
}
