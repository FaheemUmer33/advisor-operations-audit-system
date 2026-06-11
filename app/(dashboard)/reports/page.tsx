import Link from "next/link";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";
import { date } from "@/lib/utils";

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({ include: { audit: { include: { client: true } } }, orderBy: { createdAt: "desc" } });
  return <><PageHeader title="Reports" description="Generated report records." />{reports.length === 0 ? <EmptyState /> : <Card className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase text-slate-500"><tr><th className="py-3">Title</th><th>Client</th><th>Status</th><th>Generated</th></tr></thead><tbody className="divide-y divide-slate-100">{reports.map((report) => <tr key={report.id}><td className="py-3"><Link className="text-accent" href={`/audits/${report.auditId}/report`}>{report.reportTitle}</Link></td><td>{report.audit.client.companyName}</td><td>{report.reportStatus}</td><td>{date(report.generatedAt)}</td></tr>)}</tbody></table></Card>}</>;
}
