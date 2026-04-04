import { NewsEditorClient } from '@/components/NewsEditorClient';
import { ToastProvider } from '@/components/Toast';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await prisma.newsArticle.findUnique({
    where: { id },
  });

  if (!article) {
    return <div>文章不存在</div>;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 p-6">
        <NewsEditorClient
          article={{
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            date: article.date.toISOString().slice(0, 10),
            image: article.image || undefined,
            featured: article.featured,
            showOnHomepage: article.showOnHomepage,
            published: article.published,
            views: article.views,
            seoTitle: article.seoTitle || undefined,
            seoDescription: article.seoDescription || undefined,
            seoKeywords: article.seoKeywords || undefined,
            ogImage: article.ogImage || undefined,
          }}
        />
      </div>
    </ToastProvider>
  );
}
