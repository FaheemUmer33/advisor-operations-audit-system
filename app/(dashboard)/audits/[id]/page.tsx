import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart3, Clock3, DollarSign, FileText, Lightbulb, Pencil, Target, TrendingUp } from "lucide-react";
import { generateRecommendationsAction } from "@/app/actions/app";
import { Button, ButtonLink, Card, EmptyState, Metric, PageHeader, PriorityBadge, SectionCard, StatusBadge } from "@/components/ui";
import { currency, number } from "@/lib/calculations";
import { prisma } from "@/lib/db";
import { date } from "@/lib/utils";

export default async function AuditDetailPage({ params }: { params: { id: string } }) {
  const audit = await prisma.audit.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      workflowResponses: { include: { workflowArea: true }, orderBy: { workflowArea: { displayOrder: "asc" } } },
      scores: { include: { workflowArea: true } },
      recommendations: { include: { workflowArea: true } },
      salesNotes: true,
      reports: true,
    },
  });
  if (!audit) notFound();
  const complete = audit.workflowResponses.filter((item) => item.isCompleted).length;
  const completion = Math.round((complete / 6) * 100);
  return (
    <>
      <PageHeader
        title={audit.auditName}
        description={`${audit.client.companyName} operational audit with quantified workflow bottlenecks and automation priorities.`}
        meta={<StatusBadge status={audit.auditStatus} />}
        action={<div className="flex gap-2"><form action={generateRecommendationsAction.bind(null, audit.id)}><Button type="submit" variant="secondary"><Lightbulb className="h-4 w-4" />Generate Recommendations</Button></form><ButtonLink href={`/audits/${audit.id}/report`}><FileText className="h-4 w-4" />Report</ButtonLink></div>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Completion" value={`${completion}%`} description={`${complete} of 6 workflow areas complete`} icon={Target} tone="blue" />
        <Metric label="Priority score" value={number(audit.totalPriorityScore, 0)} description="Average weighted score" icon={BarChart3} tone="warning" />
        <Metric label="Hours lost" value={number(audit.totalMonthlyHoursLost)} description="Monthly operational drain" icon={Clock3} tone="purple" />
        <Metric label="Monthly savings" value={currency(audit.totalEstimatedMonthlySavings)} description="Estimated recoverable value" icon={DollarSign} tone="success" />
        <Metric label="Annual savings" value={currency(audit.totalEstimatedAnnualSavings)} description="Annualized opportunity" icon={TrendingUp} tone="success" />
      </div>
      <SectionCard className="mt-6" title="Audit Overview" description="Executive context and recommended first implementation focus.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md bg-slate-50 p-4"><p className="text-xs font-semibold uppercase text-slate-500">Client</p><p className="mt-1 font-semibold text-slate-950">{audit.client.companyName}</p></div>
          <div className="rounded-md bg-slate-50 p-4"><p className="text-xs font-semibold uppercase text-slate-500">Recommended starting point</p><p className="mt-1 font-semibold text-blue-700">{audit.recommendedStartingPoint || "Not calculated"}</p></div>
          <div className="rounded-md bg-slate-50 p-4"><p className="text-xs font-semibold uppercase text-slate-500">Started</p><p className="mt-1 font-semibold text-slate-950">{date(audit.startedAt)}</p></div>
        </div>
      </SectionCard>
      <div className="mt-6 border-b border-slate-200">
        <nav className="flex gap-2 text-sm font-semibold text-slate-500">
          {["Overview", "Workflow Areas", "Scores", "Recommendations", "Report", "Sales Notes"].map((tab, index) => (
            <span key={tab} className={index === 1 ? "border-b-2 border-blue-600 px-3 py-2 text-blue-700" : "px-3 py-2"}>
              {tab}
            </span>
          ))}
        </nav>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {audit.workflowResponses.map((response) => {
          const score = audit.scores.find((item) => item.workflowAreaId === response.workflowAreaId);
          return (
            <Card key={response.id} className="transition hover:border-blue-200 hover:shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-950">{response.workflowArea.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StatusBadge status={response.isCompleted ? "Completed" : "Draft"} />
                    <PriorityBadge level={score?.priorityLevel} />
                  </div>
                </div>
                <Link className="rounded-md border border-slate-200 p-2 text-slate-500 transition hover:border-blue-300 hover:text-blue-700" title="Edit workflow" href={`/audits/${audit.id}/workflows/${response.id}`}><Pencil className="h-4 w-4" /></Link>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-slate-50 p-3"><dt className="text-xs text-slate-500">Priority</dt><dd className="mt-1 font-bold text-slate-950">{number(score?.priorityScore, 0)}</dd></div>
                <div className="rounded-md bg-slate-50 p-3"><dt className="text-xs text-slate-500">Hours lost</dt><dd className="mt-1 font-bold text-slate-950">{number(response.monthlyHoursLost)}</dd></div>
                <div className="rounded-md bg-slate-50 p-3"><dt className="text-xs text-slate-500">Monthly savings</dt><dd className="mt-1 font-bold text-slate-950">{currency(response.estimatedMonthlySavings)}</dd></div>
              </dl>
            </Card>
          );
        })}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <SectionCard title="Recommendations" description="Generated consulting recommendations for this audit.">
          <div className="mt-4 space-y-3">{audit.recommendations.length === 0 ? <EmptyState /> : audit.recommendations.map((rec) => <Link className="block rounded-md border border-slate-200 p-4 text-sm transition hover:border-blue-300 hover:bg-slate-50" href={`/audits/${audit.id}/recommendations`} key={rec.id}><span className="font-semibold text-slate-950">{rec.workflowArea.name}</span><span className="block text-slate-500">{rec.recommendationTitle}</span></Link>)}</div>
        </SectionCard>
        <SectionCard title="Reports and Sales Notes" description="Report generation and commercial activity.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-slate-50 p-4"><p className="text-2xl font-bold text-slate-950">{audit.reports.length}</p><p className="text-sm text-slate-500">Reports generated</p></div>
            <div className="rounded-md bg-slate-50 p-4"><p className="text-2xl font-bold text-slate-950">{audit.salesNotes.length}</p><p className="text-sm text-slate-500">Linked sales notes</p></div>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
