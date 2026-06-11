import Link from "next/link";
import { PageHeader, Metric, Card, EmptyState } from "@/components/ui";
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
      <PageHeader title="Dashboard" description="Operational audit pipeline and automation opportunity summary." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total clients" value={String(totalClients)} />
        <Metric label="Audits in progress" value={String(auditsInProgress)} />
        <Metric label="Completed audits" value={String(completedAudits)} />
        <Metric label="Reports generated" value={String(reportsGenerated)} />
        <Metric label="Monthly hours lost" value={number(auditTotals._sum.totalMonthlyHoursLost)} />
        <Metric label="Monthly savings" value={currency(auditTotals._sum.totalEstimatedMonthlySavings)} />
        <Metric label="Annual savings" value={currency(auditTotals._sum.totalEstimatedAnnualSavings)} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <h2 className="font-semibold text-navy">Top Workflow Opportunities</h2>
          <div className="mt-4 space-y-3">
            {opportunities.length === 0 ? <EmptyState /> : opportunities.map((item) => (
              <Link key={item.id} href={`/audits/${item.auditId}`} className="block rounded-md border border-slate-200 p-3 hover:border-accent">
                <p className="font-medium text-sm">{item.workflowArea.name}</p>
                <p className="text-xs text-slate-500">{item.audit.client.companyName}</p>
                <p className="mt-1 text-sm font-semibold text-accent">{number(item.priorityScore, 0)} - {item.priorityLevel}</p>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold text-navy">Recent Clients</h2>
          <div className="mt-4 space-y-3">
            {recentClients.length === 0 ? <EmptyState /> : recentClients.map((client) => (
              <Link key={client.id} href={`/clients/${client.id}`} className="block rounded-md border border-slate-200 p-3 hover:border-accent">
                <p className="font-medium text-sm">{client.companyName}</p>
                <p className="text-xs text-slate-500">{client.status} - Updated {date(client.updatedAt)}</p>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold text-navy">Recent Audits</h2>
          <div className="mt-4 space-y-3">
            {recentAudits.length === 0 ? <EmptyState /> : recentAudits.map((audit) => (
              <Link key={audit.id} href={`/audits/${audit.id}`} className="block rounded-md border border-slate-200 p-3 hover:border-accent">
                <p className="font-medium text-sm">{audit.auditName}</p>
                <p className="text-xs text-slate-500">{audit.client.companyName} - {audit.auditStatus}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
