import { loadJoin, loadSite } from "@/lib/data";
import JoinPageClient from "@/components/JoinPageClient";

// Force dynamic rendering - this page fetches data from the database at request time
export const dynamic = 'force-dynamic';

export default async function JoinPage() {
  const [joinData, siteData] = await Promise.all([
    loadJoin(),
    loadSite().catch(() => ({ hrEmail: null })), // 失败时使用默认值
  ]);

  return <JoinPageClient data={joinData} hrEmail={siteData.hrEmail} />;
}
