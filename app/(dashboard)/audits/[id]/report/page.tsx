import { notFound } from "next/navigation";
import { ReportButtons } from "@/components/forms/report-buttons";
import { Card, PageHeader, PriorityBadge } from "@/components/ui";
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
      <PageHeader title="Report Preview" description="Client-ready advisor operations audit report with scorecard, workflow findings, and prioritized action plan." action={<ReportButtons auditId={audit.id} />} />
      <article className="mx-auto max-w-5xl space-y-6 bg-white p-8 text-slate-900 shadow-soft print:max-w-none print:p-0 print:shadow-none">
        <section className="rounded-xl border border-slate-200 bg-[#0B1220] p-8 text-white print:border-slate-200 print:bg-white print:text-slate-950">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200 print:text-slate-600">Prepared by Smart Logics</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight">{audit.client.companyName}</h1>
          <p className="mt-2 text-xl text-slate-300 print:text-slate-700">Advisor Operations Audit</p>
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4 print:border-slate-200 print:bg-slate-50"><p className="text-xs uppercase text-slate-400">Monthly hours lost</p><p className="mt-1 text-xl font-bold">{number(audit.totalMonthlyHoursLost)}</p></div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4 print:border-slate-200 print:bg-slate-50"><p className="text-xs uppercase text-slate-400">Monthly savings</p><p className="mt-1 text-xl font-bold">{currency(audit.totalEstimatedMonthlySavings)}</p></div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4 print:border-slate-200 print:bg-slate-50"><p className="text-xs uppercase text-slate-400">Annual savings</p><p className="mt-1 text-xl font-bold">{currency(audit.totalEstimatedAnnualSavings)}</p></div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4 print:border-slate-200 print:bg-slate-50"><p className="text-xs uppercase text-slate-400">Date</p><p className="mt-1 text-xl font-bold">{date(new Date())}</p></div>
          </div>
        </section>
        <Card className="shadow-none">
          <h2 className="text-xl font-bold text-slate-950">Executive Summary</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">{audit.executiveSummary || "This report summarizes operational bottlenecks, automation opportunities, and priority recommendations."}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <p className="rounded-md bg-slate-50 p-3"><strong>Hours lost:</strong><br />{number(audit.totalMonthlyHoursLost)}</p>
            <p className="rounded-md bg-slate-50 p-3"><strong>Monthly savings:</strong><br />{currency(audit.totalEstimatedMonthlySavings)}</p>
            <p className="rounded-md bg-slate-50 p-3"><strong>Annual savings:</strong><br />{currency(audit.totalEstimatedAnnualSavings)}</p>
            <p className="rounded-md bg-slate-50 p-3"><strong>Starting point:</strong><br />{audit.recommendedStartingPoint || "Not set"}</p>
          </div>
        </Card>
        <Card className="shadow-none overflow-x-auto">
          <h2 className="text-xl font-bold text-slate-950">Audit Scorecard</h2>
          <table className="mt-4 w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-3 py-2">Workflow Area</th><th className="px-3 py-2">Priority</th><th className="px-3 py-2">Level</th><th className="px-3 py-2">Hours Lost</th><th className="px-3 py-2">Monthly Savings</th><th className="px-3 py-2">Solution</th></tr></thead><tbody>{audit.workflowResponses.map((res) => { const score = audit.scores.find((s) => s.workflowAreaId === res.workflowAreaId); const rec = audit.recommendations.find((r) => r.workflowAreaId === res.workflowAreaId); return <tr key={res.id} className="border-t"><td className="px-3 py-3 font-semibold">{res.workflowArea.name}</td><td className="px-3 py-3">{number(score?.priorityScore, 0)}</td><td className="px-3 py-3"><PriorityBadge level={score?.priorityLevel} /></td><td className="px-3 py-3">{number(res.monthlyHoursLost)}</td><td className="px-3 py-3">{currency(res.estimatedMonthlySavings)}</td><td className="px-3 py-3">{rec?.suggestedSolution || "Generate recommendation"}</td></tr>; })}</tbody></table>
        </Card>
        <Card className="shadow-none">
          <h2 className="text-xl font-bold text-slate-950">Workflow Breakdown</h2>
          <div className="mt-4 space-y-4">{audit.workflowResponses.map((res) => <section key={res.id} className="rounded-lg border border-slate-200 p-4"><h3 className="font-semibold text-slate-950">{res.workflowArea.name}</h3><div className="mt-3 grid gap-2 text-sm leading-6 text-slate-700"><p><strong>Current process:</strong> {res.currentProcess || "Not documented"}</p><p><strong>Bottlenecks:</strong> {res.bottlenecks || "Not documented"}</p><p><strong>Tools:</strong> {res.toolsUsed || "Not documented"}</p><p><strong>Time lost:</strong> {number(res.monthlyHoursLost)} monthly hours</p><p><strong>Automation opportunity:</strong> {res.automationOpportunityNotes || "Not documented"}</p></div></section>)}</div>
        </Card>
        <Card className="shadow-none overflow-x-auto">
          <h2 className="text-xl font-bold text-slate-950">Prioritized Action Plan</h2>
          <table className="mt-4 w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-3 py-2">Rank</th><th className="px-3 py-2">Workflow</th><th className="px-3 py-2">Recommendation</th><th className="px-3 py-2">Hours Saved</th><th className="px-3 py-2">Monthly Savings</th><th className="px-3 py-2">ROI</th><th className="px-3 py-2">Phase</th></tr></thead><tbody>{ranked.map((rec, index) => <tr key={rec.id} className="border-t"><td className="px-3 py-3 font-bold text-blue-700">{index + 1}</td><td className="px-3 py-3">{rec.workflowArea.name}</td><td className="px-3 py-3 font-medium">{rec.recommendationTitle}</td><td className="px-3 py-3">{number(rec.expectedHoursSavedMonthly)}</td><td className="px-3 py-3">{currency(rec.expectedMonthlySavings)}</td><td className="px-3 py-3">{rec.roiTimelineMonths} months</td><td className="px-3 py-3">{rec.suggestedPhase}</td></tr>)}</tbody></table>
        </Card>
        <Card className="shadow-none">
          <h2 className="text-xl font-bold text-slate-950">Next Step</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">Smart Logics should prepare a proposal beginning with {audit.recommendedStartingPoint || "the highest priority workflow"} and sequence the remaining workflows into practical implementation phases.</p>
        </Card>
      </article>
    </>
  );
}
