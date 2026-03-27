import { loadData } from "@/lib/data";
import NewsClient from "./NewsClient";
import type { NewsArticle } from "./NewsClient";

interface NewsData {
  articles: NewsArticle[];
}

export default async function NewsPage() {
  const newsData = await loadData<NewsData>("news");

  return <NewsClient articles={newsData.articles} />;
}
