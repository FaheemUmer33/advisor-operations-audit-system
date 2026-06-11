import { createAuditAction } from "@/app/actions/app";
import { Field, Select, SubmitButton } from "@/components/ui";
import { AUDIT_STATUSES } from "@/lib/constants";
import type { Client, User } from "@prisma/client";

export function AuditForm({ clients, users, selectedClientId }: { clients: Client[]; users: User[]; selectedClientId?: string }) {
  return (
    <form action={createAuditAction} className="grid gap-4 md:grid-cols-2">
      <label className="block text-sm font-medium text-slate-700">
        Client
        <select name="clientId" required defaultValue={selectedClientId ?? clients[0]?.id} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
          {clients.map((client) => <option key={client.id} value={client.id}>{client.companyName}</option>)}
        </select>
      </label>
      <Field label="Audit name" name="auditName" defaultValue="Operations Automation Audit" required />
      <Select label="Status" name="auditStatus" options={AUDIT_STATUSES} defaultValue="Draft" required />
      <label className="block text-sm font-medium text-slate-700">
        Assigned auditor
        <select name="assignedAuditorId" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
          {users.map((user) => <option key={user.id} value={user.id}>{user.fullName}</option>)}
        </select>
      </label>
      <Field label="Started at" name="startedAt" type="date" />
      <div className="md:col-span-2"><SubmitButton>Create Audit</SubmitButton></div>
    </form>
  );
}
