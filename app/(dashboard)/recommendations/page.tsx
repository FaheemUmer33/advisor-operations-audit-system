import Link from "next/link";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { currency } from "@/lib/calculations";
import { prisma } from "@/lib/db";

export default async function RecommendationsPage() {
  const recs = await prisma.recommendation.findMany({ include: { audit: { include: { client: true } }, workflowArea: true }, orderBy: { updatedAt: "desc" } });
  return (
    <>
      <PageHeader title="Recommendations" description="Generated automation recommendations across audits." />
      {recs.length === 0 ? <EmptyState /> : <Card className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase text-slate-500"><tr><th className="py-3">Client</th><th>Workflow</th><th>Recommendation</th><th>Monthly savings</th><th>Phase</th></tr></thead><tbody className="divide-y divide-slate-100">{recs.map((rec) => <tr key={rec.id}><td className="py-3">{rec.audit.client.companyName}</td><td>{rec.workflowArea.name}</td><td><Link className="text-accent" href={`/audits/${rec.auditId}/recommendations`}>{rec.recommendationTitle}</Link></td><td>{currency(rec.expectedMonthlySavings)}</td><td>{rec.suggestedPhase}</td></tr>)}</tbody></table></Card>}
    </>
  );
}
