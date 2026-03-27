import { loadData } from "@/lib/data";
import JoinPageClient from "@/components/JoinPageClient";

export default async function JoinPage() {
  const data = await loadData("join");

  return <JoinPageClient data={data} />;
}
