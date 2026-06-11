import Link from "next/link";
import { Eye, Plus, Trash2 } from "lucide-react";
import { deleteAuditAction } from "@/app/actions/app";
import { ButtonLink, DataTable, EmptyState, PageHeader, StatusBadge, TableBody, TableHead, tableCell } from "@/components/ui";
import { currency, number } from "@/lib/calculations";
import { prisma } from "@/lib/db";

export default async function AuditsPage() {
  const audits = await prisma.audit.findMany({ include: { client: true }, orderBy: { updatedAt: "desc" } });
  return (
    <>
      <PageHeader title="Audits" description="Operations audits with priority scoring, savings estimates, and recommended starting points." action={<ButtonLink href="/audits/new"><Plus className="h-4 w-4" />Create Audit</ButtonLink>} />
      {audits.length === 0 ? <EmptyState /> : (
        <DataTable>
            <TableHead><tr><th className={tableCell}>Audit</th><th className={tableCell}>Client</th><th className={tableCell}>Status</th><th className={tableCell}>Priority</th><th className={tableCell}>Monthly savings</th><th className={tableCell}>Annual savings</th><th className={tableCell}>Starting point</th><th className={tableCell}>Actions</th></tr></TableHead>
            <TableBody>
              {audits.map((audit) => (
                <tr key={audit.id} className="transition hover:bg-slate-50">
                  <td className={`${tableCell} font-semibold text-slate-950`}>{audit.auditName}</td><td className={tableCell}>{audit.client.companyName}</td><td className={tableCell}><StatusBadge status={audit.auditStatus} /></td><td className={`${tableCell} font-semibold text-blue-700`}>{number(audit.totalPriorityScore, 0)}</td><td className={tableCell}>{currency(audit.totalEstimatedMonthlySavings)}</td><td className={tableCell}>{currency(audit.totalEstimatedAnnualSavings)}</td><td className={tableCell}>{audit.recommendedStartingPoint || "Not set"}</td>
                  <td className={tableCell}><div className="flex gap-2"><Link className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-700" href={`/audits/${audit.id}`}><Eye className="h-4 w-4" /></Link><form action={deleteAuditAction.bind(null, audit.id)}><button className="rounded-md p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></form></div></td>
                </tr>
              ))}
            </TableBody>
        </DataTable>
      )}
    </>
  );
}
