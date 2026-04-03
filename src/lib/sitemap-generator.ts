import { MetadataRoute } from 'next';
import { prisma } from './prisma';

/**
 * 生成 sitemap.xml
 */
export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aieducenter.com';
  const sitemap: MetadataRoute.Sitemap = [];

  // 静态页面
  const staticPages = [
    { url: '', changeFrequency: 'daily', priority: 1 },
    { url: '/about', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/news', changeFrequency: 'hourly', priority: 0.9 },
    { url: '/cases', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/services', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/ecosystem', changeFrequency: 'weekly', priority: 0.7 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.6 },
    { url: '/join', changeFrequency: 'monthly', priority: 0.5 },
  ];

  staticPages.forEach((page) => {
    sitemap.push({
      url: `${baseUrl}${page.url}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency as any,
      priority: page.priority,
    });
  });

  // 服务页面
  const servicePages = [
    'ai-curriculum',
    'teacher-training',
    'ai-research-study',
    'ecosystem-alliance',
  ];

  servicePages.forEach((service) => {
    sitemap.push({
      url: `${baseUrl}/services/${service}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // 生态板块页面
  const ecosystemPages = [
    'enterprise-training',
    'opc',
    'smart-services',
    'asset-revitalization',
  ];

  ecosystemPages.forEach((page) => {
    sitemap.push({
      url: `${baseUrl}/ecosystem/${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  });

  // 新闻文章
  const newsArticles = await prisma.newsArticle.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  newsArticles.forEach((article) => {
    sitemap.push({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // 学校案例（如果有 slug）
  const schoolCases = await prisma.schoolCase.findMany({
    where: { slug: { not: null } },
    select: { slug: true, updatedAt: true },
  });

  schoolCases.forEach((caseItem) => {
    if (caseItem.slug) {
      sitemap.push({
        url: `${baseUrl}/cases/${caseItem.slug}`,
        lastModified: caseItem.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  });

  return sitemap;
}
