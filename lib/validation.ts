import { z } from "zod";
import { AUDIT_STATUSES, CLIENT_STATUSES, SALES_STATUSES, USER_ROLES } from "./constants";

const nonNegative = z.coerce.number().min(0);
const optionalNumber = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().min(0).optional()
);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const clientSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  firmType: z.string().optional(),
  assetsUnderManagement: z.string().optional(),
  numberOfAdvisors: optionalNumber,
  numberOfSupportStaff: optionalNumber,
  crmUsed: z.string().optional(),
  complianceTools: z.string().optional(),
  reportingTools: z.string().optional(),
  custodianPlatforms: z.string().optional(),
  contactPersonName: z.string().min(1, "Contact name is required"),
  contactPersonEmail: z.string().email("Valid email is required"),
  contactPersonPhone: z.string().optional(),
  contactPersonLinkedin: z.string().optional(),
  currentAutomationMaturity: z.string().optional(),
  mainPainPoints: z.string().optional(),
  growthGoals: z.string().optional(),
  status: z.enum(CLIENT_STATUSES as [string, ...string[]]),
});

export const auditSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  auditName: z.string().min(1, "Audit name is required"),
  auditStatus: z.enum(AUDIT_STATUSES as [string, ...string[]]),
  assignedAuditorId: z.string().optional(),
  startedAt: z.string().optional(),
});

const score = z.coerce.number().int().min(1).max(5);

export const workflowSchema = z.object({
  currentProcess: z.string().min(1, "Current process is required"),
  toolsUsed: z.string().min(1, "Tools used is required"),
  manualSteps: z.string().min(1, "Manual steps are required"),
  bottlenecks: z.string().min(1, "Bottlenecks are required"),
  taskVolumeMonthly: nonNegative,
  timePerTaskMinutes: nonNegative,
  peopleInvolved: z.coerce.number().int().min(0),
  hourlyCost: optionalNumber,
  errorRatePercentage: z.coerce.number().min(0).max(100),
  reworkFrequency: z.string().optional(),
  complianceRiskNotes: z.string().optional(),
  clientExperienceImpact: z.string().optional(),
  automationOpportunityNotes: z.string().optional(),
  consultantNotes: z.string().optional(),
  timeDrainScore: score,
  revenueImpactScore: score,
  complianceRiskScore: score,
  clientExperienceScore: score,
  automationPotentialScore: score,
  implementationComplexityScore: score,
  roiTimelineScore: score,
});

export const recommendationSchema = z.object({
  id: z.string(),
  problemSummary: z.string().min(1),
  recommendationTitle: z.string().min(1),
  recommendationDescription: z.string().min(1),
  suggestedSolution: z.string().min(1),
  expectedHoursSavedMonthly: nonNegative,
  expectedMonthlySavings: nonNegative,
  expectedAnnualSavings: nonNegative,
  roiTimelineMonths: z.coerce.number().int().min(0),
  implementationComplexity: z.string().min(1),
  suggestedPhase: z.string().min(1),
  estimatedPriceRange: z.string().min(1),
});

export const salesNoteSchema = z.object({
  clientId: z.string().min(1),
  auditId: z.string().optional(),
  note: z.string().min(1),
  followUpDate: z.string().optional(),
  salesStatus: z.enum(SALES_STATUSES as [string, ...string[]]),
});

export const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
});

export const userSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(USER_ROLES as [string, ...string[]]),
  status: z.string().min(1),
});
