import Link from "next/link";
import { DataTable, EmptyState, PageHeader, TableBody, TableHead, tableCell } from "@/components/ui";
import { currency } from "@/lib/calculations";
import { prisma } from "@/lib/db";

export default async function RecommendationsPage() {
  const recs = await prisma.recommendation.findMany({ include: { audit: { include: { client: true } }, workflowArea: true }, orderBy: { updatedAt: "desc" } });
  return (
    <>
      <PageHeader title="Recommendations" description="Generated automation recommendations across audits." />
      {recs.length === 0 ? <EmptyState /> : <DataTable><TableHead><tr><th className={tableCell}>Client</th><th className={tableCell}>Workflow</th><th className={tableCell}>Recommendation</th><th className={tableCell}>Monthly savings</th><th className={tableCell}>Phase</th></tr></TableHead><TableBody>{recs.map((rec) => <tr className="transition hover:bg-slate-50" key={rec.id}><td className={`${tableCell} font-semibold text-slate-950`}>{rec.audit.client.companyName}</td><td className={tableCell}>{rec.workflowArea.name}</td><td className={tableCell}><Link className="font-medium text-blue-600 hover:text-blue-700" href={`/audits/${rec.auditId}/recommendations`}>{rec.recommendationTitle}</Link></td><td className={`${tableCell} font-semibold`}>{currency(rec.expectedMonthlySavings)}</td><td className={tableCell}>{rec.suggestedPhase}</td></tr>)}</TableBody></DataTable>}
    </>
  );
}
