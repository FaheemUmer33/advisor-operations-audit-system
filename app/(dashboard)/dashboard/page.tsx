import Link from "next/link";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  TrendingUp,
} from "lucide-react";
import { PageHeader, Metric, Card, EmptyState, PriorityBadge, SectionCard, StatusBadge } from "@/components/ui";
import { currency, number } from "@/lib/calculations";
import { prisma } from "@/lib/db";
import { date } from "@/lib/utils";

export default async function DashboardPage() {
  const [
    totalClients,
    auditsInProgress,
    completedAudits,
    reportsGenerated,
    auditTotals,
    opportunities,
    recentClients,
    recentAudits,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.audit.count({ where: { auditStatus: "In Progress" } }),
    prisma.audit.count({ where: { auditStatus: "Completed" } }),
    prisma.report.count(),
    prisma.audit.aggregate({
      _sum: {
        totalMonthlyHoursLost: true,
        totalEstimatedMonthlySavings: true,
        totalEstimatedAnnualSavings: true,
      },
    }),
    prisma.auditScore.findMany({
      orderBy: { priorityScore: "desc" },
      take: 5,
      include: { workflowArea: true, audit: { include: { client: true } } },
    }),
    prisma.client.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.audit.findMany({ orderBy: { updatedAt: "desc" }, take: 5, include: { client: true } }),
  ]);

  return (
    <>
      <PageHeader
        title="Executive Dashboard"
        description="A concise view of client audit activity, operational drag, savings potential, and the highest-value automation opportunities."
      />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Key Metrics
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total clients" value={String(totalClients)} description="Firms in the audit pipeline" icon={Building2} />
        <Metric label="Audits in progress" value={String(auditsInProgress)} description="Active operational reviews" icon={Clock3} tone="warning" />
        <Metric label="Completed audits" value={String(completedAudits)} description="Finished audit engagements" icon={CheckCircle2} tone="success" />
        <Metric label="Reports generated" value={String(reportsGenerated)} description="Client-ready reports saved" icon={FileText} />
        <Metric label="Monthly hours lost" value={number(auditTotals._sum.totalMonthlyHoursLost)} description="Measured workflow capacity drain" icon={BarChart3} tone="purple" />
        <Metric label="Monthly savings" value={currency(auditTotals._sum.totalEstimatedMonthlySavings)} description="Estimated automation savings" icon={DollarSign} tone="success" />
        <Metric label="Annual savings" value={currency(auditTotals._sum.totalEstimatedAnnualSavings)} description="Annualized opportunity value" icon={TrendingUp} tone="success" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-1"
          title="Top Workflow Opportunities"
          description="Highest-priority automation starting points across active audits."
        >
          <div className="mt-4 space-y-3">
            {opportunities.length === 0 ? <EmptyState /> : opportunities.map((item) => (
              <Link key={item.id} href={`/audits/${item.auditId}`} className="block rounded-md border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:bg-blue-50/30">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm text-slate-950">{item.workflowArea.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.audit.client.companyName}</p>
                  </div>
                  <p className="text-lg font-bold text-blue-700">{number(item.priorityScore, 0)}</p>
                </div>
                <div className="mt-3">
                  <PriorityBadge level={item.priorityLevel} />
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Recent Clients" description="Recently updated advisory firm records.">
          <div className="mt-4 space-y-3">
            {recentClients.length === 0 ? <EmptyState /> : recentClients.map((client) => (
              <Link key={client.id} href={`/clients/${client.id}`} className="block rounded-md border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-slate-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm text-slate-950">{client.companyName}</p>
                    <p className="mt-1 text-xs text-slate-500">Updated {date(client.updatedAt)}</p>
                  </div>
                  <StatusBadge status={client.status} />
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Recent Audits" description="Latest audit activity and statuses.">
          <div className="mt-4 space-y-3">
            {recentAudits.length === 0 ? <EmptyState /> : recentAudits.map((audit) => (
              <Link key={audit.id} href={`/audits/${audit.id}`} className="block rounded-md border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-slate-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm text-slate-950">{audit.auditName}</p>
                    <p className="mt-1 text-xs text-slate-500">{audit.client.companyName}</p>
                  </div>
                  <StatusBadge status={audit.auditStatus} />
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
