"use client";

import { saveReportAction } from "@/app/actions/app";
import { Button } from "@/components/ui";

export function ReportButtons({ auditId }: { auditId: string }) {
  return (
    <div className="no-print flex gap-2">
      <Button onClick={() => window.print()} variant="secondary">Print</Button>
      <form action={saveReportAction.bind(null, auditId)}>
        <Button type="submit">Save Report</Button>
      </form>
    </div>
  );
}
