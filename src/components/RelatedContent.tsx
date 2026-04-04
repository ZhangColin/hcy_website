'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface RelatedNewsProps {
  currentSlug: string;
  category?: string;
  limit?: number;
}

interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  date: Date;
  category: string;
}

export function RelatedNews({ currentSlug, category, limit = 3 }: RelatedNewsProps) {
  const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedNews() {
      try {
        const params = new URLSearchParams({
          currentSlug,
          limit: limit.toString(),
          ...(category && { category }),
        });

        const response = await fetch(`/api/news/related?${params}`);
        const data = await response.json();
        setRelatedNews(data);
      } catch (error) {
        console.error('Failed to fetch related news:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRelatedNews();
  }, [currentSlug, category, limit]);

  if (isLoading || relatedNews.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold mb-6">相关阅读</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {relatedNews.map((news) => (
          <Link key={news.slug} href={`/news/${news.slug}`} className="group block">
            {news.image && (
              <div className="relative w-full h-48">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <div className="p-4">
              <span className="text-sm text-blue-600">{news.category}</span>
              <h4 className="font-semibold mt-2 group-hover:text-blue-600">{news.title}</h4>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{news.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
