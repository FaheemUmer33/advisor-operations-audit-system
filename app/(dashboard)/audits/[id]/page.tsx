import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Lightbulb, Pencil } from "lucide-react";
import { generateRecommendationsAction } from "@/app/actions/app";
import { ButtonLink, Card, EmptyState, Metric, PageHeader } from "@/components/ui";
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
      <PageHeader title={audit.auditName} description={`${audit.client.companyName} - ${audit.auditStatus}`} action={<div className="flex gap-2"><form action={generateRecommendationsAction.bind(null, audit.id)}><button className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white"><Lightbulb className="mr-2 inline h-4 w-4" />Generate Recommendations</button></form><ButtonLink href={`/audits/${audit.id}/report`}><FileText className="mr-2 h-4 w-4" />Report</ButtonLink></div>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Completion" value={`${completion}%`} />
        <Metric label="Hours lost" value={number(audit.totalMonthlyHoursLost)} />
        <Metric label="Monthly savings" value={currency(audit.totalEstimatedMonthlySavings)} />
        <Metric label="Annual savings" value={currency(audit.totalEstimatedAnnualSavings)} />
        <Metric label="Priority score" value={number(audit.totalPriorityScore, 0)} />
      </div>
      <Card className="mt-6">
        <h2 className="font-semibold text-navy">Overview</h2>
        <p className="mt-2 text-sm text-slate-600">Recommended starting point: <strong>{audit.recommendedStartingPoint || "Not calculated"}</strong>. Started {date(audit.startedAt)}.</p>
      </Card>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {audit.workflowResponses.map((response) => {
          const score = audit.scores.find((item) => item.workflowAreaId === response.workflowAreaId);
          return (
            <Card key={response.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-navy">{response.workflowArea.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{response.isCompleted ? "Complete" : "Incomplete"} - {score?.priorityLevel || "Minimal Priority"}</p>
                </div>
                <Link title="Edit workflow" href={`/audits/${audit.id}/workflows/${response.id}`}><Pencil className="h-4 w-4 text-accent" /></Link>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-slate-500">Priority</dt><dd>{number(score?.priorityScore, 0)}</dd></div>
                <div><dt className="text-slate-500">Hours lost</dt><dd>{number(response.monthlyHoursLost)}</dd></div>
                <div><dt className="text-slate-500">Monthly savings</dt><dd>{currency(response.estimatedMonthlySavings)}</dd></div>
              </dl>
            </Card>
          );
        })}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card><h2 className="font-semibold text-navy">Recommendations</h2><div className="mt-4 space-y-3">{audit.recommendations.length === 0 ? <EmptyState /> : audit.recommendations.map((rec) => <Link className="block rounded-md border border-slate-200 p-3 text-sm" href={`/audits/${audit.id}/recommendations`} key={rec.id}>{rec.workflowArea.name}: {rec.recommendationTitle}</Link>)}</div></Card>
        <Card><h2 className="font-semibold text-navy">Reports and Sales Notes</h2><p className="mt-4 text-sm">{audit.reports.length} reports generated. {audit.salesNotes.length} linked sales notes.</p></Card>
      </div>
    </>
  );
}
