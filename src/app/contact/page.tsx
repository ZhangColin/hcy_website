import { loadData } from "@/lib/data";
import ContactPageClient from "@/components/ContactPageClient";

export default async function ContactPage() {
  const data = await loadData("contact");

  return <ContactPageClient data={data} />;
}
