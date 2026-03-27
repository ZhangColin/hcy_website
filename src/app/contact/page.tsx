import { loadData } from "@/lib/data";
import ContactPageClient from "@/components/ContactPageClient";

// Force dynamic rendering - this page fetches data from the database at request time
export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const data = await loadData("contact");

  return <ContactPageClient data={data} />;
}
