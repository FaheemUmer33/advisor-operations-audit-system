import Link from "next/link";
import { Eye, Plus, Trash2 } from "lucide-react";
import { deleteAuditAction } from "@/app/actions/app";
import { ButtonLink, Card, EmptyState, PageHeader } from "@/components/ui";
import { currency, number } from "@/lib/calculations";
import { prisma } from "@/lib/db";

export default async function AuditsPage() {
  const audits = await prisma.audit.findMany({ include: { client: true }, orderBy: { updatedAt: "desc" } });
  return (
    <>
      <PageHeader title="Audits" description="Operations audits and calculated opportunity totals." action={<ButtonLink href="/audits/new"><Plus className="mr-2 h-4 w-4" />Create Audit</ButtonLink>} />
      {audits.length === 0 ? <EmptyState /> : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-3">Audit</th><th>Client</th><th>Status</th><th>Priority</th><th>Monthly savings</th><th>Annual savings</th><th>Starting point</th><th>Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {audits.map((audit) => (
                <tr key={audit.id}>
                  <td className="py-3 font-medium">{audit.auditName}</td><td>{audit.client.companyName}</td><td>{audit.auditStatus}</td><td>{number(audit.totalPriorityScore, 0)}</td><td>{currency(audit.totalEstimatedMonthlySavings)}</td><td>{currency(audit.totalEstimatedAnnualSavings)}</td><td>{audit.recommendedStartingPoint || "Not set"}</td>
                  <td><div className="flex gap-2"><Link href={`/audits/${audit.id}`}><Eye className="h-4 w-4" /></Link><form action={deleteAuditAction.bind(null, audit.id)}><button><Trash2 className="h-4 w-4 text-red-600" /></button></form></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
