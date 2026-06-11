import { notFound } from "next/navigation";
import { saveRecommendationAction } from "@/app/actions/app";
import { Card, Field, PageHeader, SubmitButton, TextArea } from "@/components/ui";
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
      <PageHeader title="Recommendations" description={`${audit.client.companyName} - edit generated recommendations.`} />
      <div className="space-y-4">
        {audit.recommendations.map((rec) => (
          <Card key={rec.id}>
            <h2 className="font-semibold text-navy">{rec.workflowArea.name}</h2>
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
              <div className="md:col-span-2 flex items-center justify-between">
                <p className="text-sm text-slate-600">{number(rec.expectedHoursSavedMonthly)} hours, {currency(rec.expectedMonthlySavings)} monthly</p>
                <SubmitButton>Save Recommendation</SubmitButton>
              </div>
            </form>
          </Card>
        ))}
      </div>
    </>
  );
}
