import { prisma } from "@/lib/db";
import {
  calculatePriorityScore,
  calculateWorkflowMetrics,
  getPriorityLevel,
} from "@/lib/calculations";
import { DEFAULT_AUTOMATION_SAVING_PERCENTAGE } from "./calculations";

export async function createAuditScaffold(auditId: string) {
  const workflowAreas = await prisma.workflowArea.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  await prisma.$transaction(
    workflowAreas.flatMap((area) => [
      prisma.auditWorkflowResponse.upsert({
        where: { auditId_workflowAreaId: { auditId, workflowAreaId: area.id } },
        update: {},
        create: { auditId, workflowAreaId: area.id },
      }),
      prisma.auditScore.upsert({
        where: { auditId_workflowAreaId: { auditId, workflowAreaId: area.id } },
        update: {},
        create: { auditId, workflowAreaId: area.id },
      }),
    ])
  );
}

export async function recalculateAuditTotals(auditId: string) {
  const responses = await prisma.auditWorkflowResponse.findMany({
    where: { auditId },
    include: { workflowArea: true },
  });
  const scores = await prisma.auditScore.findMany({
    where: { auditId },
    include: { workflowArea: true },
  });

  const totalMonthlyHoursLost = responses.reduce(
    (sum, item) => sum + item.monthlyHoursLost,
    0
  );
  const totalEstimatedMonthlySavings = responses.reduce(
    (sum, item) => sum + item.estimatedMonthlySavings,
    0
  );
  const totalEstimatedAnnualSavings = responses.reduce(
    (sum, item) => sum + item.estimatedAnnualSavings,
    0
  );
  const totalPriorityScore =
    scores.length > 0
      ? scores.reduce((sum, item) => sum + item.priorityScore, 0) / scores.length
      : 0;
  const top = [...scores].sort((a, b) => b.priorityScore - a.priorityScore)[0];

  await prisma.audit.update({
    where: { id: auditId },
    data: {
      totalMonthlyHoursLost,
      totalEstimatedMonthlySavings,
      totalEstimatedAnnualSavings,
      totalPriorityScore,
      recommendedStartingPoint: top?.workflowArea.name,
    },
  });
}

export function computeWorkflowUpdate(input: {
  taskVolumeMonthly: number;
  timePerTaskMinutes: number;
  hourlyCost?: number | null;
  timeDrainScore: number;
  revenueImpactScore: number;
  complianceRiskScore: number;
  clientExperienceScore: number;
  automationPotentialScore: number;
  implementationComplexityScore: number;
  roiTimelineScore: number;
  automationSavingPercentage?: number | null;
}) {
  const metrics = calculateWorkflowMetrics({
    taskVolumeMonthly: input.taskVolumeMonthly,
    timePerTaskMinutes: input.timePerTaskMinutes,
    hourlyCost: input.hourlyCost,
    automationSavingPercentage:
      input.automationSavingPercentage ?? DEFAULT_AUTOMATION_SAVING_PERCENTAGE,
  });
  const priorityScore = calculatePriorityScore(input);
  return {
    metrics,
    priorityScore,
    priorityLevel: getPriorityLevel(priorityScore),
  };
}
