import { notFound } from "next/navigation";
import { ReportButtons } from "@/components/forms/report-buttons";
import { Card, PageHeader } from "@/components/ui";
import { currency, number } from "@/lib/calculations";
import { prisma } from "@/lib/db";
import { date } from "@/lib/utils";

export default async function ReportPage({ params }: { params: { id: string } }) {
  const audit = await prisma.audit.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      workflowResponses: { include: { workflowArea: true }, orderBy: { workflowArea: { displayOrder: "asc" } } },
      scores: { include: { workflowArea: true } },
      recommendations: { include: { workflowArea: true } },
    },
  });
  if (!audit) notFound();
  const ranked = [...audit.recommendations].sort((a, b) => b.expectedMonthlySavings - a.expectedMonthlySavings);
  return (
    <>
      <PageHeader title="Report Preview" description="Printable advisor operations audit report." action={<ReportButtons auditId={audit.id} />} />
      <article className="space-y-6 bg-white p-8 text-slate-900 print:p-0">
        <section className="border-b border-slate-200 pb-8">
          <p className="text-sm font-semibold uppercase text-accent">Prepared by Smart Logics</p>
          <h1 className="mt-4 text-4xl font-semibold text-navy">{audit.client.companyName}</h1>
          <p className="mt-2 text-xl">Advisor Operations Audit</p>
          <p className="mt-8 text-sm text-slate-600">{date(new Date())}</p>
        </section>
        <Card className="shadow-none">
          <h2 className="text-xl font-semibold text-navy">Executive Summary</h2>
          <p className="mt-3 text-sm">{audit.executiveSummary || "This report summarizes operational bottlenecks, automation opportunities, and priority recommendations."}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <p><strong>Hours lost:</strong><br />{number(audit.totalMonthlyHoursLost)}</p>
            <p><strong>Monthly savings:</strong><br />{currency(audit.totalEstimatedMonthlySavings)}</p>
            <p><strong>Annual savings:</strong><br />{currency(audit.totalEstimatedAnnualSavings)}</p>
            <p><strong>Starting point:</strong><br />{audit.recommendedStartingPoint || "Not set"}</p>
          </div>
        </Card>
        <Card className="shadow-none overflow-x-auto">
          <h2 className="text-xl font-semibold text-navy">Audit Scorecard</h2>
          <table className="mt-4 w-full text-left text-sm"><thead><tr><th>Workflow Area</th><th>Priority</th><th>Level</th><th>Hours Lost</th><th>Monthly Savings</th><th>Solution</th></tr></thead><tbody>{audit.workflowResponses.map((res) => { const score = audit.scores.find((s) => s.workflowAreaId === res.workflowAreaId); const rec = audit.recommendations.find((r) => r.workflowAreaId === res.workflowAreaId); return <tr key={res.id} className="border-t"><td className="py-2">{res.workflowArea.name}</td><td>{number(score?.priorityScore, 0)}</td><td>{score?.priorityLevel}</td><td>{number(res.monthlyHoursLost)}</td><td>{currency(res.estimatedMonthlySavings)}</td><td>{rec?.suggestedSolution || "Generate recommendation"}</td></tr>; })}</tbody></table>
        </Card>
        <Card className="shadow-none">
          <h2 className="text-xl font-semibold text-navy">Workflow Breakdown</h2>
          <div className="mt-4 space-y-4">{audit.workflowResponses.map((res) => <section key={res.id} className="border-b border-slate-100 pb-4"><h3 className="font-semibold">{res.workflowArea.name}</h3><p className="text-sm"><strong>Current process:</strong> {res.currentProcess || "Not documented"}</p><p className="text-sm"><strong>Bottlenecks:</strong> {res.bottlenecks || "Not documented"}</p><p className="text-sm"><strong>Tools:</strong> {res.toolsUsed || "Not documented"}</p><p className="text-sm"><strong>Time lost:</strong> {number(res.monthlyHoursLost)} monthly hours</p><p className="text-sm"><strong>Automation opportunity:</strong> {res.automationOpportunityNotes || "Not documented"}</p></section>)}</div>
        </Card>
        <Card className="shadow-none overflow-x-auto">
          <h2 className="text-xl font-semibold text-navy">Prioritized Action Plan</h2>
          <table className="mt-4 w-full text-left text-sm"><thead><tr><th>Rank</th><th>Workflow</th><th>Recommendation</th><th>Hours Saved</th><th>Monthly Savings</th><th>ROI</th><th>Phase</th></tr></thead><tbody>{ranked.map((rec, index) => <tr key={rec.id} className="border-t"><td className="py-2">{index + 1}</td><td>{rec.workflowArea.name}</td><td>{rec.recommendationTitle}</td><td>{number(rec.expectedHoursSavedMonthly)}</td><td>{currency(rec.expectedMonthlySavings)}</td><td>{rec.roiTimelineMonths} months</td><td>{rec.suggestedPhase}</td></tr>)}</tbody></table>
        </Card>
        <Card className="shadow-none">
          <h2 className="text-xl font-semibold text-navy">Next Step</h2>
          <p className="mt-3 text-sm">Smart Logics should prepare a proposal beginning with {audit.recommendedStartingPoint || "the highest priority workflow"} and sequence the remaining workflows into practical implementation phases.</p>
        </Card>
      </article>
    </>
  );
}
