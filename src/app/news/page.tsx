import { loadData } from "@/lib/data";
import NewsClient from "./NewsClient";
import type { NewsArticle } from "./NewsClient";
import { Metadata } from 'next';

interface NewsData {
  articles: NewsArticle[];
}

export const revalidate = 3600; // 每小时重新生成

export const metadata: Metadata = {
  title: '新闻动态 - 海创元AI教育',
  description: '了解海创元AI教育最新动态、行业资讯、活动信息，把握人工智能教育发展趋势。',
  keywords: '海创元新闻,AI教育动态,人工智能教育资讯,AI课程新闻',
  openGraph: {
    title: '新闻动态 - 海创元AI教育',
    description: '了解海创元AI教育最新动态、行业资讯、活动信息',
  },
};

export default async function NewsPage() {
  const newsData = await loadData<NewsData>("news");

  return <NewsClient articles={newsData.articles} />;
}
