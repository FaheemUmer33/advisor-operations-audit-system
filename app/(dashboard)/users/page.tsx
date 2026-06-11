import { createUserAction } from "@/app/actions/app";
import { Card, EmptyState, Field, PageHeader, Select, SubmitButton } from "@/components/ui";
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
        <Card>
          <h2 className="font-semibold text-navy">Create User</h2>
          <form action={createUserAction} className="mt-4 space-y-4">
            <Field label="Full name" name="fullName" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Password" name="password" type="password" required />
            <Select label="Role" name="role" options={USER_ROLES} defaultValue="consultant" required />
            <Select label="Status" name="status" options={["Active", "Inactive"]} defaultValue="Active" required />
            <SubmitButton>Create User</SubmitButton>
          </form>
        </Card>
        {users.length === 0 ? <EmptyState /> : <Card className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase text-slate-500"><tr><th className="py-3">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Created</th></tr></thead><tbody className="divide-y divide-slate-100">{users.map((user) => <tr key={user.id}><td className="py-3 font-medium">{user.fullName}</td><td>{user.email}</td><td>{user.role}</td><td>{user.status}</td><td>{date(user.createdAt)}</td></tr>)}</tbody></table></Card>}
      </div>
    </>
  );
}
