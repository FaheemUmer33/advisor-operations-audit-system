import { notFound } from "next/navigation";
import { saveRecommendationAction } from "@/app/actions/app";
import { Field, PageHeader, SectionCard, SubmitButton, TextArea } from "@/components/ui";
import { currency, number } from "@/lib/calculations";
import { prisma } from "@/lib/db";

export default async function AuditRecommendationsPage({ params }: { params: { id: string } }) {
  const audit = await prisma.audit.findUnique({
    where: { id: params.id },
    include: { client: true, recommendations: { include: { workflowArea: true }, orderBy: { workflowArea: { displayOrder: "asc" } } } },
  });
  if (!audit) notFound();
  return (
    <>
      <PageHeader title="Recommendation Board" description={`${audit.client.companyName} consulting recommendations with expected savings, implementation phase, and pricing context.`} />
      <div className="space-y-4">
        {audit.recommendations.map((rec) => (
          <SectionCard
            key={rec.id}
            title={rec.workflowArea.name}
            description={`${number(rec.expectedHoursSavedMonthly)} hours saved monthly - ${currency(rec.expectedMonthlySavings)} monthly savings - ${rec.suggestedPhase}`}
          >
            <form action={saveRecommendationAction} className="mt-4 grid gap-4 md:grid-cols-2">
              <input type="hidden" name="id" value={rec.id} />
              <Field label="Title" name="recommendationTitle" defaultValue={rec.recommendationTitle} required />
              <Field label="Suggested solution" name="suggestedSolution" defaultValue={rec.suggestedSolution} required />
              <TextArea label="Problem summary" name="problemSummary" defaultValue={rec.problemSummary} required />
              <TextArea label="Description" name="recommendationDescription" defaultValue={rec.recommendationDescription} required />
              <Field label="Expected hours saved monthly" name="expectedHoursSavedMonthly" type="number" defaultValue={rec.expectedHoursSavedMonthly} required />
              <Field label="Expected monthly savings" name="expectedMonthlySavings" type="number" defaultValue={rec.expectedMonthlySavings} required />
              <Field label="Expected annual savings" name="expectedAnnualSavings" type="number" defaultValue={rec.expectedAnnualSavings} required />
              <Field label="ROI timeline months" name="roiTimelineMonths" type="number" defaultValue={rec.roiTimelineMonths} required />
              <Field label="Implementation complexity" name="implementationComplexity" defaultValue={rec.implementationComplexity} required />
              <Field label="Suggested phase" name="suggestedPhase" defaultValue={rec.suggestedPhase} required />
              <Field label="Estimated price range" name="estimatedPriceRange" defaultValue={rec.estimatedPriceRange} required />
              <div className="md:col-span-2 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-slate-700">{number(rec.expectedHoursSavedMonthly)} hours saved monthly, {currency(rec.expectedMonthlySavings)} estimated monthly savings</p>
                <SubmitButton>Save Recommendation</SubmitButton>
              </div>
            </form>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
