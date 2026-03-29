import { NewsEditorClient } from '@/components/NewsEditorClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EditNewsPage({
  params,
}: {
  params: { id: string };
}) {
  const article = await prisma.newsArticle.findUnique({
    where: { id: params.id },
  });

  if (!article) {
    return <div>文章不存在</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <NewsEditorClient
        article={{
          ...article,
          date: article.date.toISOString().slice(0, 10),
        }}
      />
    </div>
  );
}
