import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { ClientForm } from "@/components/forms/client-form";
import { ButtonLink, Card, EmptyState, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { currency, number } from "@/lib/calculations";
import { date } from "@/lib/utils";

export default async function ClientDetailPage({ params, searchParams }: { params: { id: string }; searchParams: { edit?: string } }) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { audits: { orderBy: { updatedAt: "desc" } }, salesNotes: { orderBy: { createdAt: "desc" } } },
  });
  if (!client) notFound();
  if (searchParams.edit) {
    return (
      <>
        <PageHeader title={`Edit ${client.companyName}`} />
        <Card><ClientForm client={client} /></Card>
      </>
    );
  }
  return (
    <>
      <PageHeader title={client.companyName} description={client.status} action={<ButtonLink href={`/audits/new?clientId=${client.id}`}><Plus className="mr-2 h-4 w-4" />Create Audit</ButtonLink>} />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <h2 className="font-semibold text-navy">Client Profile</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div><dt className="text-slate-500">Firm type</dt><dd>{client.firmType || "Not set"}</dd></div>
            <div><dt className="text-slate-500">AUM</dt><dd>{client.assetsUnderManagement || "Not set"}</dd></div>
            <div><dt className="text-slate-500">Team</dt><dd>{client.numberOfAdvisors ?? 0} advisors, {client.numberOfSupportStaff ?? 0} support</dd></div>
            <div><dt className="text-slate-500">Contact</dt><dd>{client.contactPersonName} - {client.contactPersonEmail}</dd></div>
          </dl>
        </Card>
        <Card>
          <h2 className="font-semibold text-navy">Tech Stack</h2>
          <p className="mt-4 text-sm"><strong>CRM:</strong> {client.crmUsed || "Not set"}</p>
          <p className="mt-2 text-sm"><strong>Compliance:</strong> {client.complianceTools || "Not set"}</p>
          <p className="mt-2 text-sm"><strong>Reporting:</strong> {client.reportingTools || "Not set"}</p>
          <p className="mt-2 text-sm"><strong>Custodians:</strong> {client.custodianPlatforms || "Not set"}</p>
        </Card>
        <Card>
          <h2 className="font-semibold text-navy">Discovery Notes</h2>
          <p className="mt-4 text-sm"><strong>Pain points:</strong> {client.mainPainPoints || "Not set"}</p>
          <p className="mt-2 text-sm"><strong>Growth goals:</strong> {client.growthGoals || "Not set"}</p>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-navy">Linked Audits</h2>
          <div className="mt-4 space-y-3">
            {client.audits.length === 0 ? <EmptyState /> : client.audits.map((audit) => (
              <Link key={audit.id} href={`/audits/${audit.id}`} className="block rounded-md border border-slate-200 p-3">
                <p className="font-medium">{audit.auditName}</p>
                <p className="text-sm text-slate-500">{audit.auditStatus} - {currency(audit.totalEstimatedMonthlySavings)} monthly savings - {number(audit.totalPriorityScore, 0)} priority</p>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold text-navy">Sales Notes</h2>
          <div className="mt-4 space-y-3">
            {client.salesNotes.length === 0 ? <EmptyState /> : client.salesNotes.map((note) => (
              <div key={note.id} className="rounded-md border border-slate-200 p-3 text-sm">
                <p>{note.note}</p>
                <p className="mt-1 text-xs text-slate-500">{note.salesStatus} - {date(note.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
