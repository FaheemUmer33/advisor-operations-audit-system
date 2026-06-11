import Link from "next/link";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteClientAction } from "@/app/actions/app";
import { ButtonLink, Card, EmptyState, PageHeader } from "@/components/ui";
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
      <PageHeader title="Clients" description="Manage advisory firm clients." action={<ButtonLink href="/clients/new"><Plus className="mr-2 h-4 w-4" />Add Client</ButtonLink>} />
      <Card className="mb-4">
        <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]" action="/clients">
          <input name="q" placeholder="Search clients" defaultValue={q} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
          <select name="status" defaultValue={status ?? ""} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {CLIENT_STATUSES.map((item) => <option key={item}>{item}</option>)}
          </select>
          <button className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white">Filter</button>
        </form>
      </Card>
      {clients.length === 0 ? <EmptyState /> : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3">Company</th><th>Firm type</th><th>Website</th><th>Contact</th><th>Status</th><th>Last updated</th><th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="py-3 font-medium">{client.companyName}</td>
                  <td>{client.firmType || "Not set"}</td>
                  <td>{client.website ? <a className="text-accent" href={client.website}>{client.website}</a> : "Not set"}</td>
                  <td>{client.contactPersonName}</td>
                  <td>{client.status}</td>
                  <td>{date(client.updatedAt)}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link title="View" href={`/clients/${client.id}`}><Eye className="h-4 w-4" /></Link>
                      <Link title="Edit" href={`/clients/${client.id}?edit=1`}><Pencil className="h-4 w-4" /></Link>
                      <Link title="Create audit" href={`/audits/new?clientId=${client.id}`}><Plus className="h-4 w-4" /></Link>
                      <form action={deleteClientAction.bind(null, client.id)}>
                        <button title="Delete" type="submit"><Trash2 className="h-4 w-4 text-red-600" /></button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
