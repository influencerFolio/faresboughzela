import { InboxAdmin } from "@/components/admin/InboxAdmin";
import { getMessagesAdmin, getRegistrationsAdmin } from "@/lib/repositories/content";

export default async function AdminInboxPage() {
  const [messages, registrations] = await Promise.all([
    getMessagesAdmin(),
    getRegistrationsAdmin(),
  ]);
  return <InboxAdmin messages={messages} registrations={registrations} />;
}
