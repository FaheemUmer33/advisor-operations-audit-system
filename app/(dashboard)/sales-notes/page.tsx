import { createSalesNoteAction } from "@/app/actions/app";
import { Card, EmptyState, PageHeader, Select, SubmitButton, TextArea, Field } from "@/components/ui";
import { SALES_STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { date } from "@/lib/utils";

export default async function SalesNotesPage() {
  const [notes, clients, audits] = await Promise.all([
    prisma.salesNote.findMany({ include: { client: true, audit: true }, orderBy: { createdAt: "desc" } }),
    prisma.client.findMany({ orderBy: { companyName: "asc" } }),
    prisma.audit.findMany({ include: { client: true }, orderBy: { auditName: "asc" } }),
  ]);
  return (
    <>
      <PageHeader title="Sales Notes" description="Track follow-up context after audits." />
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <h2 className="font-semibold text-navy">Add Note</h2>
          <form action={createSalesNoteAction} className="mt-4 space-y-4">
            <label className="block text-sm font-medium text-slate-700">Client<select name="clientId" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">{clients.map((client) => <option value={client.id} key={client.id}>{client.companyName}</option>)}</select></label>
            <label className="block text-sm font-medium text-slate-700">Audit<select name="auditId" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"><option value="">No linked audit</option>{audits.map((audit) => <option value={audit.id} key={audit.id}>{audit.client.companyName} - {audit.auditName}</option>)}</select></label>
            <TextArea label="Note" name="note" required />
            <Field label="Follow-up date" name="followUpDate" type="date" />
            <Select label="Sales status" name="salesStatus" options={SALES_STATUSES} defaultValue="Not Contacted" required />
            <SubmitButton>Add Note</SubmitButton>
          </form>
        </Card>
        <Card>
          <h2 className="font-semibold text-navy">Notes</h2>
          <div className="mt-4 space-y-3">{notes.length === 0 ? <EmptyState /> : notes.map((note) => <div key={note.id} className="rounded-md border border-slate-200 p-3 text-sm"><p className="font-medium">{note.client.companyName}</p><p className="mt-1">{note.note}</p><p className="mt-2 text-xs text-slate-500">{note.salesStatus} - Follow-up {date(note.followUpDate)} - Created {date(note.createdAt)}</p></div>)}</div>
        </Card>
      </div>
    </>
  );
}
