import { loadData } from "@/lib/data";
import AboutPageClient from "@/components/AboutPageClient";

// Force dynamic rendering - this page fetches data from the database at request time
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const data = await loadData("about");

  return <AboutPageClient data={data} />;
}
