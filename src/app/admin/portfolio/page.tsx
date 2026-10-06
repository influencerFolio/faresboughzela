import { PortfolioEditor } from "@/components/admin/PortfolioEditor";
import { getAllPortfolioAdmin } from "@/lib/repositories/content";

export default async function AdminPortfolioPage() {
  const items = await getAllPortfolioAdmin();
  return <PortfolioEditor items={items} />;
}
