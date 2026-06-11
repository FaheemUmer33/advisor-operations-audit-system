import { createClientAction, updateClientAction } from "@/app/actions/app";
import { ButtonLink, FormSection, SubmitButton, Field, Select, TextArea } from "@/components/ui";
import { CLIENT_STATUSES } from "@/lib/constants";
import type { Client } from "@prisma/client";

export function ClientForm({ client }: { client?: Client }) {
  const action = client ? updateClientAction.bind(null, client.id) : createClientAction;
  return (
    <form action={action} className="space-y-5">
      <FormSection title="Firm overview" description="Core client profile used in audit reports and sales follow-up.">
        <Field label="Company name" name="companyName" defaultValue={client?.companyName} required />
        <Field label="Website" name="website" defaultValue={client?.website} />
        <Field label="Firm type" name="firmType" defaultValue={client?.firmType} />
        <Field label="Assets under management" name="assetsUnderManagement" defaultValue={client?.assetsUnderManagement} />
        <Field label="Number of advisors" name="numberOfAdvisors" type="number" defaultValue={client?.numberOfAdvisors} />
        <Field label="Number of support staff" name="numberOfSupportStaff" type="number" defaultValue={client?.numberOfSupportStaff} />
        <Select label="Status" name="status" options={CLIENT_STATUSES} defaultValue={client?.status} required />
        <Field label="Current automation maturity" name="currentAutomationMaturity" defaultValue={client?.currentAutomationMaturity} />
      </FormSection>
      <FormSection title="Technology stack" description="Systems and tools involved in day-to-day operations.">
        <Field label="CRM used" name="crmUsed" defaultValue={client?.crmUsed} />
        <Field label="Compliance tools" name="complianceTools" defaultValue={client?.complianceTools} />
        <Field label="Reporting tools" name="reportingTools" defaultValue={client?.reportingTools} />
        <Field label="Custodian platforms" name="custodianPlatforms" defaultValue={client?.custodianPlatforms} />
      </FormSection>
      <FormSection title="Primary contact" description="Main stakeholder for audit coordination and proposal follow-up.">
        <Field label="Contact person name" name="contactPersonName" defaultValue={client?.contactPersonName} required />
        <Field label="Contact person email" name="contactPersonEmail" type="email" defaultValue={client?.contactPersonEmail} required />
        <Field label="Contact person phone" name="contactPersonPhone" defaultValue={client?.contactPersonPhone} />
        <Field label="Contact person LinkedIn" name="contactPersonLinkedin" defaultValue={client?.contactPersonLinkedin} />
      </FormSection>
      <FormSection title="Discovery context" description="Operational priorities Smart Logics should keep visible during audit scoping.">
        <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
          <TextArea label="Main pain points" name="mainPainPoints" defaultValue={client?.mainPainPoints} />
          <TextArea label="Growth goals" name="growthGoals" defaultValue={client?.growthGoals} />
        </div>
      </FormSection>
      <div className="flex flex-wrap gap-3">
        <SubmitButton>{client ? "Save Client" : "Create Client"}</SubmitButton>
        <ButtonLink href={client ? `/clients/${client.id}` : "/clients"} variant="secondary">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
