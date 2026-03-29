import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { NewsDetailClient } from '@/components/NewsDetailClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await prisma.newsArticle.findUnique({
    where: { slug: params.slug },
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
  params: { slug: string };
}) {
  const article = await prisma.newsArticle.findUnique({
    where: { slug: params.slug },
  });

  if (!article || !article.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <div className="px-4 sm:px-6 lg:px-8">
        <NewsDetailClient
          article={{
            ...article,
            date: article.date.toISOString().slice(0, 10),
          }}
        />
      </div>
    </div>
  );
}
