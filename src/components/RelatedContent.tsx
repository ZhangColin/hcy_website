import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

interface RelatedNewsProps {
  currentSlug: string;
  category?: string;
  limit?: number;
}

export async function RelatedNews({ currentSlug, category, limit = 3 }: RelatedNewsProps) {
  const relatedNews = await prisma.newsArticle.findMany({
    where: {
      published: true,
      slug: { not: currentSlug },
      ...(category && { category }),
    },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      image: true,
      date: true,
      category: true,
    },
    orderBy: { date: 'desc' },
    take: limit,
  });

  if (relatedNews.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold mb-6">相关阅读</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {relatedNews.map((news) => (
          <Link key={news.slug} href={`/news/${news.slug}`} className="group">
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
