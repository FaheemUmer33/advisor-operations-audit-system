export const CLIENT_STATUSES = [
  "New Lead",
  "Audit Scheduled",
  "Audit In Progress",
  "Audit Completed",
  "Proposal Sent",
  "Won",
  "Lost",
  "Nurture",
];

export const AUDIT_STATUSES = [
  "Draft",
  "In Progress",
  "Review",
  "Completed",
  "Report Generated",
];

export const SALES_STATUSES = [
  "Not Contacted",
  "Contacted",
  "Discovery Booked",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
  "Nurture",
];

export const USER_ROLES = ["admin", "consultant", "sales", "client_viewer"];

export const WORKFLOW_AREAS = [
  {
    name: "Client Reporting",
    description: "Recurring client report preparation and delivery.",
  },
  {
    name: "Compliance Documentation",
    description: "Compliance file preparation, archiving, and review support.",
  },
  {
    name: "Prospect Follow-Up",
    description: "Lead follow-up, reminders, and nurture workflows.",
  },
  {
    name: "Meeting Preparation",
    description: "Agenda, account review, and briefing pack preparation.",
  },
  {
    name: "CRM Maintenance",
    description: "CRM updates, cleanup, activity logging, and data hygiene.",
  },
  {
    name: "Client Onboarding",
    description: "New client intake, document collection, and setup.",
  },
];
