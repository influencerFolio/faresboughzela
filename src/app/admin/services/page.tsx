import { ServicesEditor } from "@/components/admin/ServicesEditor";
import { getAllServicesAdmin } from "@/lib/repositories/content";

export default async function AdminServicesPage() {
  const items = await getAllServicesAdmin();
  return <ServicesEditor items={items} />;
}
