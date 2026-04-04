import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { NewsDetailClient } from '@/components/NewsDetailClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { RelatedNews } from '@/components/RelatedContent';

export const revalidate = 3600; // 每小时重新生成

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.newsArticle.findUnique({
    where: { slug },
  });

  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const keywords = article.seoKeywords
    ? `${article.category},AI教育,海创元,${article.seoKeywords}`
    : `${article.category},AI教育,海创元`;
  const ogImage = article.ogImage || article.image || undefined;

  return {
    title: `${title} - 海创元AI教育`,
    description,
    keywords,
    openGraph: {
      title: `${title} - 海创元AI教育`,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: 'article',
      publishedTime: article.date.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: ['海创元AI教育'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - 海创元AI教育`,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
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

  const jsonLdData = {
    headline: article.title,
    image: article.image,
    datePublished: article.date.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: '海创元AI教育',
    },
    publisher: {
      '@type': 'Organization',
      name: '海创元AI教育',
      logo: {
        '@type': 'ImageObject',
        url: 'https://aieducenter.com/logo.png',
      },
    },
    description: article.excerpt,
  };

  const breadcrumbItems = [
    { name: '首页', href: '/' },
    { name: '新闻资讯', href: '/news' },
    { name: article.title, href: `/news/${article.slug}` },
  ];

  return (
    <>
      <JsonLd type="Article" data={jsonLdData} />
      <div className="min-h-screen bg-[#F5F7FA] py-12">
        <div className="px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
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
          <RelatedNews currentSlug={article.slug} category={article.category} />
        </div>
      </div>
    </>
  );
}
