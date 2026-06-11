import { AuditForm } from "@/components/forms/audit-form";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/db";

export default async function NewAuditPage({ searchParams }: { searchParams: { clientId?: string } }) {
  const [clients, users] = await Promise.all([
    prisma.client.findMany({ orderBy: { companyName: "asc" } }),
    prisma.user.findMany({ orderBy: { fullName: "asc" } }),
  ]);
  return (
    <>
      <PageHeader title="Create Audit" description="Create an operations audit with six workflow sections." />
      <Card>{clients.length === 0 ? <EmptyState label="No clients found. Create a client first." /> : <AuditForm clients={clients} users={users} selectedClientId={searchParams.clientId} />}</Card>
    </>
  );
}
