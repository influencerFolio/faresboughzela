import { HomepageSettingsForm } from "@/components/admin/HomepageSettingsForm";
import { getHomepageSettings } from "@/lib/repositories/content";

export default async function AdminHomepagePage() {
  const data = await getHomepageSettings();
  return <HomepageSettingsForm initial={data} />;
}
