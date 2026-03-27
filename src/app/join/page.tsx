import { loadData } from "@/lib/data";
import JoinPageClient from "@/components/JoinPageClient";

// Force dynamic rendering - this page fetches data from the database at request time
export const dynamic = 'force-dynamic';

export default async function JoinPage() {
  const data = await loadData("join");

  return <JoinPageClient data={data} />;
}
