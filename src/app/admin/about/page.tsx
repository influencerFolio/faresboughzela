import { AboutSettingsForm } from "@/components/admin/AboutSettingsForm";
import { getAboutSettings } from "@/lib/repositories/content";

export default async function AdminAboutPage() {
  const data = await getAboutSettings();
  return <AboutSettingsForm initial={data} />;
}
