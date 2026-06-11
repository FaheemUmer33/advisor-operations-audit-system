"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  auditSchema,
  clientSchema,
  recommendationSchema,
  salesNoteSchema,
  settingSchema,
  userSchema,
  workflowSchema,
} from "@/lib/validation";
import { createAuditScaffold, computeWorkflowUpdate, recalculateAuditTotals } from "@/lib/audit";
import { WORKFLOW_AREAS } from "@/lib/constants";

function clean(data: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value === "" ? undefined : value])
  );
}

export async function createClientAction(formData: FormData) {
  await requireUser();
  const parsed = clientSchema.safeParse(clean(Object.fromEntries(formData)));
  if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Invalid client");
  const client = await prisma.client.create({ data: parsed.data });
  revalidatePath("/clients");
  redirect(`/clients/${client.id}`);
}

export async function updateClientAction(id: string, formData: FormData) {
  await requireUser();
  const parsed = clientSchema.safeParse(clean(Object.fromEntries(formData)));
  if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Invalid client");
  await prisma.client.update({ where: { id }, data: parsed.data });
  revalidatePath(`/clients/${id}`);
  redirect(`/clients/${id}`);
}

export async function deleteClientAction(id: string) {
  await requireUser();
  await prisma.client.delete({ where: { id } });
  revalidatePath("/clients");
  redirect("/clients");
}

export async function createAuditAction(formData: FormData) {
  const user = await requireUser();
  const parsed = auditSchema.safeParse(clean(Object.fromEntries(formData)));
  if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Invalid audit");
  const audit = await prisma.audit.create({
    data: {
      ...parsed.data,
      assignedAuditorId: parsed.data.assignedAuditorId || user.id,
      startedAt: parsed.data.startedAt ? new Date(parsed.data.startedAt) : null,
    },
  });
  await createAuditScaffold(audit.id);
  revalidatePath("/audits");
  redirect(`/audits/${audit.id}`);
}

export async function deleteAuditAction(id: string) {
  await requireUser();
  await prisma.audit.delete({ where: { id } });
  revalidatePath("/audits");
  redirect("/audits");
}

export async function saveWorkflowAction(responseId: string, formData: FormData) {
  await requireUser();
  const response = await prisma.auditWorkflowResponse.findUnique({
    where: { id: responseId },
  });
  if (!response) throw new Error("Workflow response not found");

  const parsed = workflowSchema.safeParse(clean(Object.fromEntries(formData)));
  if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Invalid workflow");

  const automationSetting = await prisma.setting.findUnique({
    where: { key: "default_automation_saving_percentage" },
  });
  const automationSavingPercentage = automationSetting
    ? Number(automationSetting.value)
    : undefined;
  const { metrics, priorityScore, priorityLevel } = computeWorkflowUpdate({
    ...parsed.data,
    automationSavingPercentage,
  });

  await prisma.$transaction([
    prisma.auditWorkflowResponse.update({
      where: { id: responseId },
      data: {
        currentProcess: parsed.data.currentProcess,
        toolsUsed: parsed.data.toolsUsed,
        manualSteps: parsed.data.manualSteps,
        bottlenecks: parsed.data.bottlenecks,
        taskVolumeMonthly: parsed.data.taskVolumeMonthly,
        timePerTaskMinutes: parsed.data.timePerTaskMinutes,
        peopleInvolved: parsed.data.peopleInvolved,
        hourlyCost: parsed.data.hourlyCost,
        errorRatePercentage: parsed.data.errorRatePercentage,
        reworkFrequency: parsed.data.reworkFrequency,
        complianceRiskNotes: parsed.data.complianceRiskNotes,
        clientExperienceImpact: parsed.data.clientExperienceImpact,
        automationOpportunityNotes: parsed.data.automationOpportunityNotes,
        consultantNotes: parsed.data.consultantNotes,
        ...metrics,
        isCompleted: true,
      },
    }),
    prisma.auditScore.upsert({
      where: {
        auditId_workflowAreaId: {
          auditId: response.auditId,
          workflowAreaId: response.workflowAreaId,
        },
      },
      update: {
        timeDrainScore: parsed.data.timeDrainScore,
        revenueImpactScore: parsed.data.revenueImpactScore,
        complianceRiskScore: parsed.data.complianceRiskScore,
        clientExperienceScore: parsed.data.clientExperienceScore,
        automationPotentialScore: parsed.data.automationPotentialScore,
        implementationComplexityScore: parsed.data.implementationComplexityScore,
        roiTimelineScore: parsed.data.roiTimelineScore,
        priorityScore,
        priorityLevel,
      },
      create: {
        auditId: response.auditId,
        workflowAreaId: response.workflowAreaId,
        timeDrainScore: parsed.data.timeDrainScore,
        revenueImpactScore: parsed.data.revenueImpactScore,
        complianceRiskScore: parsed.data.complianceRiskScore,
        clientExperienceScore: parsed.data.clientExperienceScore,
        automationPotentialScore: parsed.data.automationPotentialScore,
        implementationComplexityScore: parsed.data.implementationComplexityScore,
        roiTimelineScore: parsed.data.roiTimelineScore,
        priorityScore,
        priorityLevel,
      },
    }),
  ]);
  await recalculateAuditTotals(response.auditId);
  revalidatePath(`/audits/${response.auditId}`);
  redirect(`/audits/${response.auditId}`);
}

const recommendationMap: Record<string, { title: string; solution: string }> = {
  "Client Reporting": {
    title: "Automate Client Reporting Workflow",
    solution: "AI client report generation system",
  },
  "Compliance Documentation": {
    title: "Streamline Compliance Documentation",
    solution: "AI compliance documentation assistant",
  },
  "Prospect Follow-Up": {
    title: "Automate Prospect Follow-Up",
    solution: "CRM follow-up automation",
  },
  "Meeting Preparation": {
    title: "Accelerate Meeting Preparation",
    solution: "AI meeting preparation assistant",
  },
  "CRM Maintenance": {
    title: "Reduce CRM Maintenance Burden",
    solution: "CRM data cleanup and update automation",
  },
  "Client Onboarding": {
    title: "Automate Client Onboarding",
    solution: "Automated onboarding workflow",
  },
};

export async function generateRecommendationsAction(auditId: string) {
  await requireUser();
  const responses = await prisma.auditWorkflowResponse.findMany({
    where: { auditId },
    include: {
      workflowArea: true,
      audit: { include: { scores: true } },
    },
  });
  for (const response of responses) {
    const score = response.audit.scores.find(
      (item) => item.workflowAreaId === response.workflowAreaId
    );
    const mapped = recommendationMap[response.workflowArea.name];
    await prisma.recommendation.upsert({
      where: {
        auditId_workflowAreaId: {
          auditId,
          workflowAreaId: response.workflowAreaId,
        },
      },
      update: {
        problemSummary: response.bottlenecks || "No bottlenecks documented yet.",
        expectedHoursSavedMonthly: response.estimatedHoursSavedMonthly,
        expectedMonthlySavings: response.estimatedMonthlySavings,
        expectedAnnualSavings: response.estimatedAnnualSavings,
      },
      create: {
        auditId,
        workflowAreaId: response.workflowAreaId,
        problemSummary: response.bottlenecks || "No bottlenecks documented yet.",
        recommendationTitle: mapped?.title ?? `Improve ${response.workflowArea.name}`,
        recommendationDescription: `Use automation to reduce manual effort in ${response.workflowArea.name.toLowerCase()} and improve operating consistency.`,
        suggestedSolution: mapped?.solution ?? "Workflow automation",
        expectedHoursSavedMonthly: response.estimatedHoursSavedMonthly,
        expectedMonthlySavings: response.estimatedMonthlySavings,
        expectedAnnualSavings: response.estimatedAnnualSavings,
        roiTimelineMonths: score && score.priorityScore >= 60 ? 3 : 6,
        implementationComplexity:
          score && score.implementationComplexityScore >= 4 ? "High" : "Moderate",
        suggestedPhase: score && score.priorityScore >= 60 ? "Phase 1" : "Phase 2",
        estimatedPriceRange:
          score && score.priorityScore >= 60 ? "$8,000 - $15,000" : "$4,000 - $9,000",
      },
    });
  }
  revalidatePath(`/audits/${auditId}`);
  redirect(`/audits/${auditId}/recommendations`);
}

export async function saveRecommendationAction(formData: FormData) {
  await requireUser();
  const parsed = recommendationSchema.safeParse(clean(Object.fromEntries(formData)));
  if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Invalid recommendation");
  const { id, ...data } = parsed.data;
  const rec = await prisma.recommendation.update({ where: { id }, data });
  revalidatePath(`/audits/${rec.auditId}/recommendations`);
}

export async function saveReportAction(auditId: string) {
  const user = await requireUser();
  const completeCount = await prisma.auditWorkflowResponse.count({
    where: { auditId, isCompleted: true },
  });
  if (completeCount < WORKFLOW_AREAS.length) {
    throw new Error("Complete all six workflow areas before finalizing the report.");
  }
  const audit = await prisma.audit.findUnique({ where: { id: auditId }, include: { client: true } });
  if (!audit) throw new Error("Audit not found");
  await prisma.report.create({
    data: {
      auditId,
      reportTitle: `${audit.client.companyName} Advisor Operations Audit`,
      reportStatus: "Generated",
      generatedAt: new Date(),
      generatedBy: user.id,
      reportSummary: audit.executiveSummary || "Advisor operations audit report generated.",
    },
  });
  await prisma.audit.update({ where: { id: auditId }, data: { auditStatus: "Report Generated" } });
  revalidatePath(`/audits/${auditId}/report`);
}

export async function createSalesNoteAction(formData: FormData) {
  const user = await requireUser();
  const parsed = salesNoteSchema.safeParse(clean(Object.fromEntries(formData)));
  if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Invalid note");
  await prisma.salesNote.create({
    data: {
      ...parsed.data,
      auditId: parsed.data.auditId || null,
      followUpDate: parsed.data.followUpDate ? new Date(parsed.data.followUpDate) : null,
      createdBy: user.id,
    },
  });
  revalidatePath("/sales-notes");
}

export async function updateSettingAction(formData: FormData) {
  await requireAdmin();
  const parsed = settingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Invalid setting");
  await prisma.setting.upsert({
    where: { key: parsed.data.key },
    update: { value: parsed.data.value },
    create: parsed.data,
  });
  revalidatePath("/settings");
}

export async function createUserAction(formData: FormData) {
  await requireAdmin();
  const parsed = userSchema.safeParse(clean(Object.fromEntries(formData)));
  if (!parsed.success) throw new Error(parsed.error.errors[0]?.message ?? "Invalid user");
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      role: parsed.data.role,
      status: parsed.data.status,
    },
  });
  revalidatePath("/users");
}
