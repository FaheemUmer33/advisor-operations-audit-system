"use client";

import { saveReportAction } from "@/app/actions/app";

export function ReportButtons({ auditId }: { auditId: string }) {
  return (
    <div className="no-print flex gap-2">
      <button onClick={() => window.print()} className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white">Print</button>
      <form action={saveReportAction.bind(null, auditId)}>
        <button className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white">Save Report</button>
      </form>
    </div>
  );
}
