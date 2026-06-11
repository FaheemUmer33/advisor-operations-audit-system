-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Client_assignedOwnerId_fkey" FOREIGN KEY ("assignedOwnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "auditName" TEXT NOT NULL,
    "auditStatus" TEXT NOT NULL,
    "assignedAuditorId" TEXT,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "totalPriorityScore" REAL NOT NULL DEFAULT 0,
    "totalMonthlyHoursLost" REAL NOT NULL DEFAULT 0,
    "totalEstimatedMonthlySavings" REAL NOT NULL DEFAULT 0,
    "totalEstimatedAnnualSavings" REAL NOT NULL DEFAULT 0,
    "recommendedStartingPoint" TEXT,
    "executiveSummary" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Audit_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Audit_assignedAuditorId_fkey" FOREIGN KEY ("assignedAuditorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkflowArea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuditWorkflowResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditId" TEXT NOT NULL,
    "workflowAreaId" TEXT NOT NULL,
    "currentProcess" TEXT,
    "toolsUsed" TEXT,
    "manualSteps" TEXT,
    "bottlenecks" TEXT,
    "taskVolumeMonthly" REAL NOT NULL DEFAULT 0,
    "timePerTaskMinutes" REAL NOT NULL DEFAULT 0,
    "peopleInvolved" INTEGER NOT NULL DEFAULT 1,
    "hourlyCost" REAL,
    "errorRatePercentage" REAL NOT NULL DEFAULT 0,
    "reworkFrequency" TEXT,
    "complianceRiskNotes" TEXT,
    "clientExperienceImpact" TEXT,
    "automationOpportunityNotes" TEXT,
    "consultantNotes" TEXT,
    "monthlyHoursLost" REAL NOT NULL DEFAULT 0,
    "estimatedHoursSavedMonthly" REAL NOT NULL DEFAULT 0,
    "estimatedMonthlySavings" REAL NOT NULL DEFAULT 0,
    "estimatedAnnualSavings" REAL NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AuditWorkflowResponse_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AuditWorkflowResponse_workflowAreaId_fkey" FOREIGN KEY ("workflowAreaId") REFERENCES "WorkflowArea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditId" TEXT NOT NULL,
    "workflowAreaId" TEXT NOT NULL,
    "timeDrainScore" INTEGER NOT NULL DEFAULT 1,
    "revenueImpactScore" INTEGER NOT NULL DEFAULT 1,
    "complianceRiskScore" INTEGER NOT NULL DEFAULT 1,
    "clientExperienceScore" INTEGER NOT NULL DEFAULT 1,
    "automationPotentialScore" INTEGER NOT NULL DEFAULT 1,
    "implementationComplexityScore" INTEGER NOT NULL DEFAULT 1,
    "roiTimelineScore" INTEGER NOT NULL DEFAULT 1,
    "priorityScore" REAL NOT NULL DEFAULT 0,
    "priorityLevel" TEXT NOT NULL DEFAULT 'Minimal Priority',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AuditScore_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AuditScore_workflowAreaId_fkey" FOREIGN KEY ("workflowAreaId") REFERENCES "WorkflowArea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditId" TEXT NOT NULL,
    "workflowAreaId" TEXT NOT NULL,
    "problemSummary" TEXT NOT NULL,
    "recommendationTitle" TEXT NOT NULL,
    "recommendationDescription" TEXT NOT NULL,
    "suggestedSolution" TEXT NOT NULL,
    "expectedHoursSavedMonthly" REAL NOT NULL DEFAULT 0,
    "expectedMonthlySavings" REAL NOT NULL DEFAULT 0,
    "expectedAnnualSavings" REAL NOT NULL DEFAULT 0,
    "roiTimelineMonths" INTEGER NOT NULL DEFAULT 3,
    "implementationComplexity" TEXT NOT NULL,
    "suggestedPhase" TEXT NOT NULL,
    "estimatedPriceRange" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Recommendation_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Recommendation_workflowAreaId_fkey" FOREIGN KEY ("workflowAreaId") REFERENCES "WorkflowArea" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditId" TEXT NOT NULL,
    "reportTitle" TEXT NOT NULL,
    "reportStatus" TEXT NOT NULL,
    "generatedAt" DATETIME,
    "generatedBy" TEXT,
    "reportSummary" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Report_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Report_generatedBy_fkey" FOREIGN KEY ("generatedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SalesNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "auditId" TEXT,
    "note" TEXT NOT NULL,
    "followUpDate" DATETIME,
    "salesStatus" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SalesNote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SalesNote_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "Audit" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SalesNote_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
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
