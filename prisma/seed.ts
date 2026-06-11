import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { WORKFLOW_AREAS } from "../lib/constants";
import { computeWorkflowUpdate, recalculateAuditTotals } from "../lib/audit";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@smartlogics.com" },
    update: { passwordHash, role: "admin", status: "Active" },
    create: {
      fullName: "Smart Logics Admin",
      email: "admin@smartlogics.com",
      passwordHash,
      role: "admin",
      status: "Active",
    },
  });

  for (let index = 0; index < WORKFLOW_AREAS.length; index += 1) {
    const area = WORKFLOW_AREAS[index];
    await prisma.workflowArea.upsert({
      where: { name: area.name },
      update: { ...area, displayOrder: index + 1, isActive: true },
      create: { ...area, displayOrder: index + 1, isActive: true },
    });
  }

  await Promise.all(
    [
      ["default_hourly_cost", "75"],
      ["default_automation_saving_percentage", "0.60"],
      ["company_name", "Smart Logics"],
      ["report_footer_text", "Prepared by Smart Logics"],
    ].map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  const client = await prisma.client.upsert({
    where: { id: "sample-client" },
    update: {},
    create: {
      id: "sample-client",
      companyName: "Example Wealth Advisory",
      website: "https://examplewealth.com",
      firmType: "Independent RIA",
      assetsUnderManagement: "$500M",
      numberOfAdvisors: 8,
      numberOfSupportStaff: 12,
      crmUsed: "Salesforce",
      complianceTools: "Manual PDF forms and shared drive",
      reportingTools: "Excel, PDF reports, custodian portal",
      custodianPlatforms: "Schwab, Fidelity",
      contactPersonName: "John Smith",
      contactPersonEmail: "john@examplewealth.com",
      contactPersonPhone: "555-0100",
      contactPersonLinkedin: "https://linkedin.com/in/johnsmith",
      currentAutomationMaturity: "Early workflow automation, mostly manual review.",
      mainPainPoints: "Manual reporting, duplicated CRM entry, slow onboarding.",
      growthGoals: "Scale advisor capacity without increasing support headcount.",
      status: "Audit In Progress",
      assignedOwnerId: admin.id,
    },
  });

  const audit = await prisma.audit.upsert({
    where: { id: "sample-audit" },
    update: {},
    create: {
      id: "sample-audit",
      clientId: client.id,
      auditName: "Operations Automation Audit",
      auditStatus: "In Progress",
      assignedAuditorId: admin.id,
      startedAt: new Date(),
      executiveSummary:
        "Example Wealth Advisory has meaningful automation potential across reporting, onboarding, CRM hygiene, and compliance preparation.",
    },
  });

  const areas = await prisma.workflowArea.findMany({ orderBy: { displayOrder: "asc" } });
  for (let index = 0; index < areas.length; index += 1) {
    const area = areas[index];
    const taskVolumeMonthly = [80, 45, 120, 60, 220, 30][index] ?? 40;
    const timePerTaskMinutes = [25, 35, 12, 45, 8, 90][index] ?? 20;
    const scoreInput = {
      timeDrainScore: [5, 4, 4, 5, 3, 5][index] ?? 3,
      revenueImpactScore: [4, 3, 5, 4, 3, 5][index] ?? 3,
      complianceRiskScore: [3, 5, 2, 2, 3, 4][index] ?? 3,
      clientExperienceScore: [4, 3, 4, 4, 2, 5][index] ?? 3,
      automationPotentialScore: [5, 4, 5, 4, 4, 5][index] ?? 3,
      implementationComplexityScore: [3, 3, 2, 3, 2, 4][index] ?? 3,
      roiTimelineScore: [5, 4, 5, 4, 4, 4][index] ?? 3,
    };
    const { metrics, priorityScore, priorityLevel } = computeWorkflowUpdate({
      taskVolumeMonthly,
      timePerTaskMinutes,
      hourlyCost: 75,
      ...scoreInput,
    });

    await prisma.auditWorkflowResponse.upsert({
      where: { auditId_workflowAreaId: { auditId: audit.id, workflowAreaId: area.id } },
      update: {},
      create: {
        auditId: audit.id,
        workflowAreaId: area.id,
        currentProcess: `${area.name} is handled through a mix of CRM tasks, spreadsheets, shared folders, and manual review.`,
        toolsUsed: "Salesforce, Excel, shared drive, email",
        manualSteps: "Collect data, reconcile records, draft outputs, request review, send final version.",
        bottlenecks: `Manual handoffs slow down ${area.name.toLowerCase()} and create follow-up risk.`,
        taskVolumeMonthly,
        timePerTaskMinutes,
        peopleInvolved: 3,
        hourlyCost: 75,
        errorRatePercentage: 8,
        reworkFrequency: "Weekly",
        complianceRiskNotes: "Version control and incomplete documentation increase review effort.",
        clientExperienceImpact: "Delays reduce responsiveness and consistency.",
        automationOpportunityNotes: "Standardize intake, reminders, document generation, and exception handling.",
        consultantNotes: "Good candidate for phased automation.",
        ...metrics,
        isCompleted: true,
      },
    });

    await prisma.auditScore.upsert({
      where: { auditId_workflowAreaId: { auditId: audit.id, workflowAreaId: area.id } },
      update: {},
      create: {
        auditId: audit.id,
        workflowAreaId: area.id,
        ...scoreInput,
        priorityScore,
        priorityLevel,
      },
    });
  }

  await recalculateAuditTotals(audit.id);

  await prisma.salesNote.upsert({
    where: { id: "sample-sales-note" },
    update: {},
    create: {
      id: "sample-sales-note",
      clientId: client.id,
      auditId: audit.id,
      note: "Discuss Phase 1 automation proposal after report review.",
      followUpDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      salesStatus: "Discovery Booked",
      createdBy: admin.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
