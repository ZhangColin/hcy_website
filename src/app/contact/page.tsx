import { loadData } from "@/lib/data";
import ContactPageClient from "@/components/ContactPageClient";

// Force dynamic rendering - this page fetches data from the database at request time
export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const [contactData, siteData] = await Promise.all([
    loadData("contact"),
    loadData("site")
  ]);

  return <ContactPageClient contactData={contactData} siteData={siteData} />;
}
