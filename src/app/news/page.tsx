import { loadData } from "@/lib/data";
import NewsClient from "./NewsClient";
import type { NewsArticle } from "./NewsClient";

interface NewsData {
  articles: NewsArticle[];
}

// Force dynamic rendering - this page fetches data from the database at request time
export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const newsData = await loadData<NewsData>("news");

  return <NewsClient articles={newsData.articles} />;
}
