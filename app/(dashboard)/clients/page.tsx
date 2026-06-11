import Link from "next/link";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteClientAction } from "@/app/actions/app";
import { Button, ButtonLink, Card, DataTable, EmptyState, PageHeader, StatusBadge, TableBody, TableHead, tableCell } from "@/components/ui";
import { CLIENT_STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { date } from "@/lib/utils";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string };
}) {
  const q = searchParams.q?.trim();
  const status = searchParams.status;
  const clients = await prisma.client.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { companyName: { contains: q } },
                { contactPersonName: { contains: q } },
                { firmType: { contains: q } },
              ],
            }
          : {},
        status ? { status } : {},
      ],
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <PageHeader title="Clients" description="Manage advisory firm profiles, discovery context, audit activity, and sales follow-up." action={<ButtonLink href="/clients/new"><Plus className="h-4 w-4" />Add Client</ButtonLink>} />
      <Card className="mb-4">
        <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]" action="/clients">
          <input name="q" placeholder="Search by company, contact, or firm type" defaultValue={q} className="rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          <select name="status" defaultValue={status ?? ""} className="rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
            <option value="">All statuses</option>
            {CLIENT_STATUSES.map((item) => <option key={item}>{item}</option>)}
          </select>
          <Button type="submit">Filter</Button>
        </form>
      </Card>
      {clients.length === 0 ? <EmptyState /> : (
        <DataTable>
            <TableHead>
              <tr>
                <th className={tableCell}>Company</th><th className={tableCell}>Firm type</th><th className={tableCell}>Website</th><th className={tableCell}>Contact</th><th className={tableCell}>Status</th><th className={tableCell}>Last updated</th><th className={tableCell}>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <tr key={client.id} className="transition hover:bg-slate-50">
                  <td className={`${tableCell} font-semibold text-slate-950`}>{client.companyName}</td>
                  <td className={tableCell}>{client.firmType || "Not set"}</td>
                  <td className={tableCell}>{client.website ? <a className="font-medium text-blue-600 hover:text-blue-700" href={client.website}>{client.website}</a> : "Not set"}</td>
                  <td className={tableCell}>{client.contactPersonName}</td>
                  <td className={tableCell}><StatusBadge status={client.status} /></td>
                  <td className={tableCell}>{date(client.updatedAt)}</td>
                  <td className={tableCell}>
                    <div className="flex gap-2">
                      <Link className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-700" title="View" href={`/clients/${client.id}`}><Eye className="h-4 w-4" /></Link>
                      <Link className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-700" title="Edit" href={`/clients/${client.id}?edit=1`}><Pencil className="h-4 w-4" /></Link>
                      <Link className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-700" title="Create audit" href={`/audits/new?clientId=${client.id}`}><Plus className="h-4 w-4" /></Link>
                      <form action={deleteClientAction.bind(null, client.id)}>
                        <button className="rounded-md p-1.5 text-red-600 hover:bg-red-50" title="Delete" type="submit"><Trash2 className="h-4 w-4" /></button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </TableBody>
        </DataTable>
      )}
    </>
  );
}
