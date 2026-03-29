import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { NewsDetailClient } from '@/components/NewsDetailClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.newsArticle.findUnique({
    where: { slug },
  });

  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.newsArticle.findUnique({
    where: { slug },
  });

  if (!article || !article.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <div className="px-4 sm:px-6 lg:px-8">
        <NewsDetailClient
          article={{
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            date: article.date.toISOString().slice(0, 10),
            image: article.image || undefined,
            views: article.views,
          }}
        />
      </div>
    </div>
  );
}
