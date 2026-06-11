export const DEFAULT_HOURLY_COST = 75;
export const DEFAULT_AUTOMATION_SAVING_PERCENTAGE = 0.6;

export type WorkflowMetricInput = {
  taskVolumeMonthly: number;
  timePerTaskMinutes: number;
  hourlyCost?: number | null;
  automationSavingPercentage?: number | null;
};

export type ScoreInput = {
  timeDrainScore: number;
  revenueImpactScore: number;
  complianceRiskScore: number;
  clientExperienceScore: number;
  automationPotentialScore: number;
  implementationComplexityScore: number;
  roiTimelineScore: number;
};

export function calculateWorkflowMetrics(input: WorkflowMetricInput) {
  const hourlyCost = input.hourlyCost ?? DEFAULT_HOURLY_COST;
  const savingRate =
    input.automationSavingPercentage ?? DEFAULT_AUTOMATION_SAVING_PERCENTAGE;
  const monthlyHoursLost =
    (input.taskVolumeMonthly * input.timePerTaskMinutes) / 60;
  const estimatedHoursSavedMonthly = monthlyHoursLost * savingRate;
  const estimatedMonthlySavings = estimatedHoursSavedMonthly * hourlyCost;
  const estimatedAnnualSavings = estimatedMonthlySavings * 12;

  return {
    monthlyHoursLost,
    estimatedHoursSavedMonthly,
    estimatedMonthlySavings,
    estimatedAnnualSavings,
  };
}

export function calculatePriorityScore(input: ScoreInput) {
  const score =
    (input.timeDrainScore * 25 +
      input.revenueImpactScore * 20 +
      input.complianceRiskScore * 15 +
      input.clientExperienceScore * 15 +
      input.automationPotentialScore * 15 +
      input.roiTimelineScore * 10 -
      input.implementationComplexityScore * 10) /
    5;

  return Math.max(0, Math.min(100, score));
}

export function getPriorityLevel(score: number) {
  if (score >= 80) return "Critical Priority";
  if (score >= 60) return "High Priority";
  if (score >= 40) return "Medium Priority";
  if (score >= 20) return "Low Priority";
  return "Minimal Priority";
}

export function currency(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function number(value: number | null | undefined, digits = 1) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(value ?? 0);
}
