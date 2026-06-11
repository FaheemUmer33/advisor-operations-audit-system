-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "website" TEXT,
    "firmType" TEXT,
    "assetsUnderManagement" TEXT,
    "numberOfAdvisors" INTEGER,
    "numberOfSupportStaff" INTEGER,
    "crmUsed" TEXT,
    "complianceTools" TEXT,
    "reportingTools" TEXT,
    "custodianPlatforms" TEXT,
    "contactPersonName" TEXT NOT NULL,
    "contactPersonEmail" TEXT NOT NULL,
    "contactPersonPhone" TEXT,
    "contactPersonLinkedin" TEXT,
    "currentAutomationMaturity" TEXT,
    "mainPainPoints" TEXT,
    "growthGoals" TEXT,
    "status" TEXT NOT NULL,
    "assignedOwnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "auditName" TEXT NOT NULL,
    "auditStatus" TEXT NOT NULL,
    "assignedAuditorId" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "totalPriorityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalMonthlyHoursLost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEstimatedMonthlySavings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEstimatedAnnualSavings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recommendedStartingPoint" TEXT,
    "executiveSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditWorkflowResponse" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "workflowAreaId" TEXT NOT NULL,
    "currentProcess" TEXT,
    "toolsUsed" TEXT,
    "manualSteps" TEXT,
    "bottlenecks" TEXT,
    "taskVolumeMonthly" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "timePerTaskMinutes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "peopleInvolved" INTEGER NOT NULL DEFAULT 1,
    "hourlyCost" DOUBLE PRECISION,
    "errorRatePercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reworkFrequency" TEXT,
    "complianceRiskNotes" TEXT,
    "clientExperienceImpact" TEXT,
    "automationOpportunityNotes" TEXT,
    "consultantNotes" TEXT,
    "monthlyHoursLost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimatedHoursSavedMonthly" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimatedMonthlySavings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimatedAnnualSavings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditWorkflowResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditScore" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "workflowAreaId" TEXT NOT NULL,
    "timeDrainScore" INTEGER NOT NULL DEFAULT 1,
    "revenueImpactScore" INTEGER NOT NULL DEFAULT 1,
    "complianceRiskScore" INTEGER NOT NULL DEFAULT 1,
    "clientExperienceScore" INTEGER NOT NULL DEFAULT 1,
    "automationPotentialScore" INTEGER NOT NULL DEFAULT 1,
    "implementationComplexityScore" INTEGER NOT NULL DEFAULT 1,
    "roiTimelineScore" INTEGER NOT NULL DEFAULT 1,
    "priorityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priorityLevel" TEXT NOT NULL DEFAULT 'Minimal Priority',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "workflowAreaId" TEXT NOT NULL,
    "problemSummary" TEXT NOT NULL,
    "recommendationTitle" TEXT NOT NULL,
    "recommendationDescription" TEXT NOT NULL,
    "suggestedSolution" TEXT NOT NULL,
    "expectedHoursSavedMonthly" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedMonthlySavings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expectedAnnualSavings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "roiTimelineMonths" INTEGER NOT NULL DEFAULT 3,
    "implementationComplexity" TEXT NOT NULL,
    "suggestedPhase" TEXT NOT NULL,
    "estimatedPriceRange" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "reportTitle" TEXT NOT NULL,
    "reportStatus" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3),
    "generatedBy" TEXT,
    "reportSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesNote" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "auditId" TEXT,
    "note" TEXT NOT NULL,
    "followUpDate" TIMESTAMP(3),
    "salesStatus" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowArea_name_key" ON "WorkflowArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AuditWorkflowResponse_auditId_workflowAreaId_key" ON "AuditWorkflowResponse"("auditId", "workflowAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "AuditScore_auditId_workflowAreaId_key" ON "AuditScore"("auditId", "workflowAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "Recommendation_auditId_workflowAreaId_key" ON "Recommendation"("auditId", "workflowAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_assignedOwnerId_fkey" FOREIGN KEY ("assignedOwnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_assignedAuditorId_fkey" FOREIGN KEY ("assignedAuditorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditWorkflowResponse" ADD CONSTRAINT "AuditWorkflowResponse_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditWorkflowResponse" ADD CONSTRAINT "AuditWorkflowResponse_workflowAreaId_fkey" FOREIGN KEY ("workflowAreaId") REFERENCES "WorkflowArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditScore" ADD CONSTRAINT "AuditScore_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditScore" ADD CONSTRAINT "AuditScore_workflowAreaId_fkey" FOREIGN KEY ("workflowAreaId") REFERENCES "WorkflowArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_workflowAreaId_fkey" FOREIGN KEY ("workflowAreaId") REFERENCES "WorkflowArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_generatedBy_fkey" FOREIGN KEY ("generatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesNote" ADD CONSTRAINT "SalesNote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesNote" ADD CONSTRAINT "SalesNote_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesNote" ADD CONSTRAINT "SalesNote_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
