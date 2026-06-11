import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, Mail, Plus, Users } from "lucide-react";
import { ClientForm } from "@/components/forms/client-form";
import { ButtonLink, EmptyState, Metric, PageHeader, SectionCard, StatusBadge } from "@/components/ui";
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
        <ClientForm client={client} />
      </>
    );
  }
  return (
    <>
      <PageHeader
        title={client.companyName}
        description="Executive client profile, technology context, linked audits, and sales notes."
        meta={<StatusBadge status={client.status} />}
        action={<ButtonLink href={`/audits/new?clientId=${client.id}`}><Plus className="h-4 w-4" />Create Audit</ButtonLink>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Firm type" value={client.firmType || "Not set"} icon={Building2} />
        <Metric label="AUM" value={client.assetsUnderManagement || "Not set"} icon={Users} tone="warning" />
        <Metric label="Primary contact" value={client.contactPersonName} description={client.contactPersonEmail} icon={Mail} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <SectionCard title="Firm Overview" description="Scale and operating profile for audit scoping.">
          <dl className="grid gap-3 text-sm">
            <div className="rounded-md bg-slate-50 p-3"><dt className="text-slate-500">Team</dt><dd className="mt-1 font-semibold text-slate-950">{client.numberOfAdvisors ?? 0} advisors, {client.numberOfSupportStaff ?? 0} support staff</dd></div>
            <div className="rounded-md bg-slate-50 p-3"><dt className="text-slate-500">Automation maturity</dt><dd className="mt-1 text-slate-800">{client.currentAutomationMaturity || "Not set"}</dd></div>
            <div className="rounded-md bg-slate-50 p-3"><dt className="text-slate-500">Website</dt><dd className="mt-1">{client.website ? <a className="font-medium text-blue-600" href={client.website}>{client.website}</a> : "Not set"}</dd></div>
          </dl>
        </SectionCard>
        <SectionCard title="Technology Stack" description="Systems involved in operations workflows.">
          <dl className="space-y-3 text-sm">
            <div><dt className="text-slate-500">CRM</dt><dd className="font-medium text-slate-900">{client.crmUsed || "Not set"}</dd></div>
            <div><dt className="text-slate-500">Compliance</dt><dd className="font-medium text-slate-900">{client.complianceTools || "Not set"}</dd></div>
            <div><dt className="text-slate-500">Reporting</dt><dd className="font-medium text-slate-900">{client.reportingTools || "Not set"}</dd></div>
            <div><dt className="text-slate-500">Custodians</dt><dd className="font-medium text-slate-900">{client.custodianPlatforms || "Not set"}</dd></div>
          </dl>
        </SectionCard>
        <SectionCard title="Pain Points and Goals" description="Consulting context for recommendations.">
          <div className="space-y-4 text-sm leading-6">
            <p><span className="font-semibold text-slate-950">Pain points:</span> {client.mainPainPoints || "Not set"}</p>
            <p><span className="font-semibold text-slate-950">Growth goals:</span> {client.growthGoals || "Not set"}</p>
          </div>
        </SectionCard>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <SectionCard title="Linked Audits" description="Audit engagements attached to this client.">
          <div className="mt-4 space-y-3">
            {client.audits.length === 0 ? <EmptyState /> : client.audits.map((audit) => (
              <Link key={audit.id} href={`/audits/${audit.id}`} className="block rounded-md border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-slate-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{audit.auditName}</p>
                    <p className="mt-1 text-sm text-slate-500">{currency(audit.totalEstimatedMonthlySavings)} monthly savings - {number(audit.totalPriorityScore, 0)} priority</p>
                  </div>
                  <StatusBadge status={audit.auditStatus} />
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Sales Notes" description="Commercial follow-up context and next touchpoints.">
          <div className="mt-4 space-y-3">
            {client.salesNotes.length === 0 ? <EmptyState /> : client.salesNotes.map((note) => (
              <div key={note.id} className="rounded-md border border-slate-200 bg-white p-4 text-sm">
                <p className="leading-6 text-slate-800">{note.note}</p>
                <p className="mt-1 text-xs text-slate-500">{note.salesStatus} - {date(note.createdAt)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
