import { updateSettingAction } from "@/app/actions/app";
import { Card, PageHeader, SubmitButton } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await prisma.setting.findMany({ orderBy: { key: "asc" } });
  return (
    <>
      <PageHeader title="Settings" description="Admin configuration for calculations and report branding." />
      <div className="grid gap-4 md:grid-cols-2">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <form action={updateSettingAction} className="space-y-3">
              <input type="hidden" name="key" value={setting.key} />
              <label className="block text-sm font-medium text-slate-700">{setting.key}<input name="value" required defaultValue={setting.value} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" /></label>
              <SubmitButton>Save</SubmitButton>
            </form>
          </Card>
        ))}
      </div>
    </>
  );
}
