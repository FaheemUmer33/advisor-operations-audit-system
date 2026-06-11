import { createSalesNoteAction } from "@/app/actions/app";
import { EmptyState, PageHeader, Select, SubmitButton, TextArea, Field, SectionCard, StatusBadge } from "@/components/ui";
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
        <SectionCard title="Add Note" description="Capture sales follow-up context and link it to a client or audit.">
          <form action={createSalesNoteAction} className="mt-4 space-y-4">
            <label className="block text-sm font-medium text-slate-700">Client<select name="clientId" required className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">{clients.map((client) => <option value={client.id} key={client.id}>{client.companyName}</option>)}</select></label>
            <label className="block text-sm font-medium text-slate-700">Audit<select name="auditId" className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"><option value="">No linked audit</option>{audits.map((audit) => <option value={audit.id} key={audit.id}>{audit.client.companyName} - {audit.auditName}</option>)}</select></label>
            <TextArea label="Note" name="note" required />
            <Field label="Follow-up date" name="followUpDate" type="date" />
            <Select label="Sales status" name="salesStatus" options={SALES_STATUSES} defaultValue="Not Contacted" required />
            <SubmitButton>Add Note</SubmitButton>
          </form>
        </SectionCard>
        <SectionCard title="Notes" description="Recent commercial activity and follow-up status.">
          <div className="mt-4 space-y-3">{notes.length === 0 ? <EmptyState /> : notes.map((note) => <div key={note.id} className="rounded-md border border-slate-200 bg-white p-4 text-sm"><div className="flex items-start justify-between gap-3"><p className="font-semibold text-slate-950">{note.client.companyName}</p><StatusBadge status={note.salesStatus} /></div><p className="mt-2 leading-6 text-slate-700">{note.note}</p><p className="mt-2 text-xs text-slate-500">Follow-up {date(note.followUpDate)} - Created {date(note.createdAt)}</p></div>)}</div>
        </SectionCard>
      </div>
    </>
  );
}
