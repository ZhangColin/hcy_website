import { loadData } from "@/lib/data";
import AboutPageClient from "@/components/AboutPageClient";

export default async function AboutPage() {
  const data = await loadData("about");

  return <AboutPageClient data={data} />;
}
