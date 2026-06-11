import Link from "next/link";
import { DataTable, EmptyState, PageHeader, StatusBadge, TableBody, TableHead, tableCell } from "@/components/ui";
import { prisma } from "@/lib/db";
import { date } from "@/lib/utils";

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({ include: { audit: { include: { client: true } } }, orderBy: { createdAt: "desc" } });
  return <><PageHeader title="Reports" description="Generated client-ready report records and printable previews." />{reports.length === 0 ? <EmptyState /> : <DataTable><TableHead><tr><th className={tableCell}>Title</th><th className={tableCell}>Client</th><th className={tableCell}>Status</th><th className={tableCell}>Generated</th></tr></TableHead><TableBody>{reports.map((report) => <tr className="transition hover:bg-slate-50" key={report.id}><td className={tableCell}><Link className="font-semibold text-blue-600 hover:text-blue-700" href={`/audits/${report.auditId}/report`}>{report.reportTitle}</Link></td><td className={tableCell}>{report.audit.client.companyName}</td><td className={tableCell}><StatusBadge status={report.reportStatus} /></td><td className={tableCell}>{date(report.generatedAt)}</td></tr>)}</TableBody></DataTable>}</>;
}
