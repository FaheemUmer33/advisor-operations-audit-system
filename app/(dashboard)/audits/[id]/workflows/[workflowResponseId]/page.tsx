import { notFound } from "next/navigation";
import { saveWorkflowAction } from "@/app/actions/app";
import { Card, Field, PageHeader, Select, SubmitButton, TextArea } from "@/components/ui";
import { prisma } from "@/lib/db";

const scoreOptions = ["1", "2", "3", "4", "5"];

export default async function WorkflowPage({ params }: { params: { id: string; workflowResponseId: string } }) {
  const response = await prisma.auditWorkflowResponse.findUnique({
    where: { id: params.workflowResponseId },
    include: { workflowArea: true, audit: { include: { client: true } } },
  });
  if (!response) notFound();
  const score = await prisma.auditScore.findUnique({
    where: { auditId_workflowAreaId: { auditId: response.auditId, workflowAreaId: response.workflowAreaId } },
  });
  return (
    <>
      <PageHeader title={response.workflowArea.name} description={`${response.audit.client.companyName} - workflow audit form`} />
      <Card>
        <form action={saveWorkflowAction.bind(null, response.id)} className="grid gap-4 md:grid-cols-2">
          <TextArea label="Current process" name="currentProcess" defaultValue={response.currentProcess} required />
          <TextArea label="Tools used" name="toolsUsed" defaultValue={response.toolsUsed} required />
          <TextArea label="Manual steps" name="manualSteps" defaultValue={response.manualSteps} required />
          <TextArea label="Bottlenecks" name="bottlenecks" defaultValue={response.bottlenecks} required />
          <Field label="Task volume monthly" name="taskVolumeMonthly" type="number" defaultValue={response.taskVolumeMonthly} required />
          <Field label="Time per task minutes" name="timePerTaskMinutes" type="number" defaultValue={response.timePerTaskMinutes} required />
          <Field label="People involved" name="peopleInvolved" type="number" defaultValue={response.peopleInvolved} required />
          <Field label="Hourly cost" name="hourlyCost" type="number" defaultValue={response.hourlyCost} />
          <Field label="Error rate percentage" name="errorRatePercentage" type="number" defaultValue={response.errorRatePercentage} required />
          <Field label="Rework frequency" name="reworkFrequency" defaultValue={response.reworkFrequency} />
          <TextArea label="Compliance risk notes" name="complianceRiskNotes" defaultValue={response.complianceRiskNotes} />
          <TextArea label="Client experience impact" name="clientExperienceImpact" defaultValue={response.clientExperienceImpact} />
          <TextArea label="Automation opportunity notes" name="automationOpportunityNotes" defaultValue={response.automationOpportunityNotes} />
          <TextArea label="Consultant notes" name="consultantNotes" defaultValue={response.consultantNotes} />
          <div className="md:col-span-2 grid gap-4 md:grid-cols-3 xl:grid-cols-7">
            <Select label="Time drain" name="timeDrainScore" options={scoreOptions} defaultValue={String(score?.timeDrainScore ?? 1)} required />
            <Select label="Revenue impact" name="revenueImpactScore" options={scoreOptions} defaultValue={String(score?.revenueImpactScore ?? 1)} required />
            <Select label="Compliance risk" name="complianceRiskScore" options={scoreOptions} defaultValue={String(score?.complianceRiskScore ?? 1)} required />
            <Select label="Client experience" name="clientExperienceScore" options={scoreOptions} defaultValue={String(score?.clientExperienceScore ?? 1)} required />
            <Select label="Automation potential" name="automationPotentialScore" options={scoreOptions} defaultValue={String(score?.automationPotentialScore ?? 1)} required />
            <Select label="Complexity" name="implementationComplexityScore" options={scoreOptions} defaultValue={String(score?.implementationComplexityScore ?? 1)} required />
            <Select label="ROI timeline" name="roiTimelineScore" options={scoreOptions} defaultValue={String(score?.roiTimelineScore ?? 1)} required />
          </div>
          <div className="md:col-span-2"><SubmitButton>Save Workflow</SubmitButton></div>
        </form>
      </Card>
    </>
  );
}
