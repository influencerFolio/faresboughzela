import { GeneralSettingsForm } from "@/components/admin/GeneralSettingsForm";
import { getGeneralSettings } from "@/lib/repositories/content";

export default async function AdminSettingsPage() {
  const data = await getGeneralSettings();
  return <GeneralSettingsForm initial={data} />;
}
