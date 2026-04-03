import { Metadata } from 'next';
import { URL } from 'url';
import { OpenGraphProps, TwitterCardProps, BreadcrumbItem } from '@/types/seo';

/**
 * 生成完整的页面 URL
 */
export function getFullUrl(path: string): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return new URL(path, process.env.NEXT_PUBLIC_SITE_URL).toString();
  }
  // 开发环境回退
  return `http://localhost:3000${path}`;
}

/**
 * 生成 Meta 标签
 */
export function generateMetaProps({
  title,
  description,
  keywords,
  canonical,
  openGraph,
  twitterCard,
}: {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  openGraph?: Partial<OpenGraphProps>;
  twitterCard?: Partial<TwitterCardProps>;
}): Metadata {
  const fullTitle = `${title} - 海创元AI教育`;
  const canonicalUrl = canonical || getFullUrl(canonical || '');

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: openGraph?.title || fullTitle,
      description: openGraph?.description || description,
      images: openGraph?.image ? [{ url: openGraph.image }] : undefined,
      type: openGraph?.type || 'website',
      siteName: '海创元AI教育',
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
      images: twitterCard?.image ? [twitterCard.image] : undefined,
    },
  };

  return metadata;
}

/**
 * 生成新闻文章 Meta 标签
 */
export function generateNewsMeta(article: {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  image?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  ogImage?: string | null;
}): Metadata {
  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const keywords = article.seoKeywords
    ? `${article.category},AI教育,海创元,${article.seoKeywords}`
    : `${article.category},AI教育,海创元`;

  const canonicalUrl = getFullUrl(`/news/${article.slug}`);
  const ogImage = article.ogImage || article.image || undefined;

  return generateMetaProps({
    title,
    description,
    keywords,
    canonical: canonicalUrl,
    openGraph: {
      title,
      description,
      image: ogImage,
      type: 'article',
    },
    twitterCard: {
      image: ogImage,
    },
  });
}

/**
 * 生成学校案例 Meta 标签
 */
export function generateCaseMeta(caseItem: {
  name: string;
  region: string;
  slug: string;
  grade?: string;
  partnership?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  featuredImage?: string | null;
}): Metadata {
  const title = caseItem.seoTitle || `${caseItem.name} AI教育合作案例`;
  const description = caseItem.seoDescription ||
    `${caseItem.name}与海创元在${caseItem.grade?.replace(/["\[\]]/g, '') || '多学段'}的AI教育合作成果与经验分享`;

  const canonicalUrl = getFullUrl(`/cases/${caseItem.slug}`);
  const ogImage = caseItem.featuredImage || undefined;

  return generateMetaProps({
    title,
    description,
    keywords: `${caseItem.name},${caseItem.region},AI教育案例`,
    canonical: canonicalUrl,
    openGraph: {
      title,
      description,
      image: ogImage,
    },
    twitterCard: {
      image: ogImage,
    },
  });
}

/**
 * 生成面包屑导航数据
 */
export function generateBreadcrumb(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getFullUrl(item.href),
    })),
  };
}
