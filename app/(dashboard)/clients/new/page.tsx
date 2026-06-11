import { PageHeader } from "@/components/ui";
import { ClientForm } from "@/components/forms/client-form";

export default function NewClientPage() {
  return (
    <>
      <PageHeader title="Create Client" description="Add advisory firm profile and discovery context." />
      <ClientForm />
    </>
  );
}
