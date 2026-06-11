import { createAuditAction } from "@/app/actions/app";
import { ButtonLink, Field, FormSection, Select, SubmitButton } from "@/components/ui";
import { AUDIT_STATUSES } from "@/lib/constants";
import type { Client, User } from "@prisma/client";

export function AuditForm({ clients, users, selectedClientId }: { clients: Client[]; users: User[]; selectedClientId?: string }) {
  return (
    <form action={createAuditAction} className="space-y-5">
      <FormSection title="Audit setup" description="Create the engagement and automatically scaffold the six required workflow areas.">
        <label className="block text-sm font-medium text-slate-700">
          <span className="flex items-center gap-1">Client <span className="text-blue-600">*</span></span>
          <select name="clientId" required defaultValue={selectedClientId ?? clients[0]?.id} className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
            {clients.map((client) => <option key={client.id} value={client.id}>{client.companyName}</option>)}
          </select>
        </label>
        <Field label="Audit name" name="auditName" defaultValue="Operations Automation Audit" required />
        <Select label="Status" name="auditStatus" options={AUDIT_STATUSES} defaultValue="Draft" required />
        <label className="block text-sm font-medium text-slate-700">
          Assigned auditor
          <select name="assignedAuditorId" className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
            {users.map((user) => <option key={user.id} value={user.id}>{user.fullName}</option>)}
          </select>
        </label>
        <Field label="Started at" name="startedAt" type="date" />
      </FormSection>
      <div className="flex flex-wrap gap-3">
        <SubmitButton>Create Audit</SubmitButton>
        <ButtonLink href="/audits" variant="secondary">Cancel</ButtonLink>
      </div>
    </form>
  );
}
