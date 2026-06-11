import { updateSettingAction } from "@/app/actions/app";
import { SectionCard, PageHeader, SubmitButton } from "@/components/ui";
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
          <SectionCard key={setting.id} title={setting.key.replaceAll("_", " ")} description="Administrative configuration value.">
            <form action={updateSettingAction} className="space-y-3">
              <input type="hidden" name="key" value={setting.key} />
              <label className="block text-sm font-medium text-slate-700">Value<input name="value" required defaultValue={setting.value} className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
              <SubmitButton>Save</SubmitButton>
            </form>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
