# SEO 优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-step. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为海创元AI教育官网实施全方位 SEO 优化，包括基础 SEO 设置、技术 SEO 优化和内容策略的技术实现，提升搜索引擎排名和用户体验。

**Architecture:** 采用三层 SEO 架构：爬虫优化层（robots.txt、sitemap.xml）、内容发现层（Meta 标签、Open Graph、结构化数据）、性能优化层（ISR、图片优化、Core Web Vitals）。

**Tech Stack:** Next.js 16 (App Router), React 19, Prisma 7.6, PostgreSQL, TypeScript 5, Tailwind CSS 4

---

## 📋 Phase 1: 基础 SEO 设置（1-2周）

### Task 1: 数据库 Schema 扩展

**Files:**
- Modify: `prisma/schema.prisma:40-48` (NewsArticle model)
- Modify: `prisma/schema.prisma:61-80` (SchoolCase model)
- Modify: `prisma/schema.prisma:121-139` (SiteConfig model)
- Test: 验证迁移文件

- [ ] **Step 1: 添加 NewsArticle SEO 字段**

在 `prisma/schema.prisma` 的 NewsArticle 模型中添加 SEO 字段：

```prisma
model NewsArticle {
  id             String   @id @default(cuid())
  title          String
  excerpt        String
  content        String
  category       String
  date           DateTime
  image          String?
  published      Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  featured       Boolean  @default(false)
  showOnHomepage Boolean  @default(true)
  slug           String   @unique
  views          Int      @default(0)

  // 新增 SEO 字段
  seoTitle        String?   // 自定义 SEO 标题
  seoDescription  String?   // 自定义 SEO 描述
  seoKeywords     String?   // 自定义 SEO 关键词
  ogImage         String?   // Open Graph 分享图片

  @@index([date, published])
  @@index([featured, date])
  @@index([showOnHomepage])
}
```

- [ ] **Step 2: 添加 SchoolCase SEO 字段**

在 `prisma/schema.prisma` 的 SchoolCase 模型中添加 SEO 字段：

```prisma
model SchoolCase {
  id          String   @id @default(cuid())
  name        String
  region      String
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  abbr        String   @default("")
  color       String   @default("from-[#1A3C8A] to-[#2B6CB0]")
  coverImage  String?
  grade       String   @default("[]")
  partnership String   @default("")
  results     String   @default("")
  schoolLogo  String?

  // 新增 SEO 字段
  slug            String?   @unique  // URL 友好的标识符
  seoTitle        String?   // 自定义 SEO 标题
  seoDescription  String?   // 自定义 SEO 描述
  featuredImage   String?   // 特色图片（用于分享）

  @@index([order])
}
```

- [ ] **Step 3: 添加 SiteConfig SEO 配置字段**

在 `prisma/schema.prisma` 的 SiteConfig 模型中添加 SEO 配置：

```prisma
model SiteConfig {
  id               String   @id @default(cuid())
  companyName      String
  shortName        String
  address          String
  icp              String
  copyright        String
  friendlyLinks    Json
  socialLinks      Json
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  email            String?
  mapLat           String?
  mapLng           String?
  phone            String?
  wechatOfficialQr String?
  wechatServiceQr  String?
  hrEmail          String?

  // 新增 SEO 配置
  googleAnalyticsId   String?   // Google Analytics ID
  baiduAnalyticsId    String?   // 百度统计 ID
  googleVerifyCode    String?   // Google Search Console 验证码
  baiduVerifyCode     String?   // 百度站长工具验证码
  defaultOgImage      String?   // 默认分享图片
  twitterHandle       String?   // Twitter 账号
}
```

- [ ] **Step 4: 生成并应用数据库迁移**

运行以下命令生成迁移文件：

```bash
npm run prisma:migrate
```

在交互式提示中输入迁移名称：`add-seo-fields`

预期输出：
```
✔ Generated Prisma Client
✔ The following migration has been created and applied from new schema changes:

migrations/
  └─ 20260404xxxxxx_add_seo_fields/
      └─ migration.sql
```

- [ ] **Step 5: 验证迁移**

检查数据库字段是否正确添加：

```bash
npm run prisma:studio
```

在 Prisma Studio 中验证：
- NewsArticle 表有 seoTitle, seoDescription, seoKeywords, ogImage 字段
- SchoolCase 表有 slug, seoTitle, seoDescription, featuredImage 字段
- SiteConfig 表有 6 个新 SEO 配置字段

- [ ] **Step 6: 提交数据库变更**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: 添加 SEO 优化相关数据库字段

- NewsArticle: 添加 seoTitle, seoDescription, seoKeywords, ogImage
- SchoolCase: 添加 slug, seoTitle, seoDescription, featuredImage
- SiteConfig: 添加 Google Analytics、百度统计、验证码等配置

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 2: 创建 SEO 工具函数和类型定义

**Files:**
- Create: `src/types/seo.ts`
- Create: `src/lib/seo-utils.ts`
- Test: 手动测试工具函数

- [ ] **Step 1: 创建 SEO 类型定义**

创建 `src/types/seo.ts` 文件：

```typescript
// SEO 相关类型定义

export interface OpenGraphProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  siteName?: string;
  locale?: string;
}

export interface TwitterCardProps {
  card?: 'summary' | 'summary_large_image';
  title: string;
  description: string;
  image?: string;
}

export interface JsonLdProps {
  type: 'Organization' | 'Article' | 'BreadcrumbList';
  data: Record<string, any>;
}

export interface MetaProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  openGraph?: OpenGraphProps;
  twitterCard?: TwitterCardProps;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}
```

- [ ] **Step 2: 创建 SEO 工具函数**

创建 `src/lib/seo-utils.ts` 文件：

```typescript
import { Metadata } from 'next';
import { URL } from 'url';

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
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article';
  };
  twitterCard?: {
    image?: string;
  };
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
export function generateBreadcrumb(items: Array<{ name: string; href: string }>) {
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
```

- [ ] **Step 3: 验证工具函数**

在 TypeScript 编译器中验证类型正确：

```bash
npx tsc --noEmit
```

预期输出：无错误

- [ ] **Step 4: 提交 SEO 工具代码**

```bash
git add src/types/seo.ts src/lib/seo-utils.ts
git commit -m "feat: 添加 SEO 工具函数和类型定义

- 添加 OpenGraph, TwitterCard, JsonLd 类型
- 实现 generateMetaProps, generateNewsMeta, generateCaseMeta 函数
- 实现面包屑导航生成函数

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 3: 创建 robots.txt

**Files:**
- Create: `src/app/robots.txt/route.ts`
- Test: 访问 /robots.txt 验证内容

- [ ] **Step 1: 创建 robots.txt 路由处理器**

创建 `src/app/robots.txt/route.ts` 文件：

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: 'https://aieducenter.com/sitemap.xml',
  };
}
```

- [ ] **Step 2: 测试 robots.txt**

启动开发服务器：

```bash
npm run dev
```

访问：http://localhost:3000/robots.txt

预期输出：
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://aieducenter.com/sitemap.xml
```

- [ ] **Step 3: 提交 robots.txt**

```bash
git add src/app/robots.txt
git commit -m "feat: 添加 robots.txt

配置爬虫规则，禁止爬取 admin 和 api 路径

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 4: 创建 sitemap.xml 生成器

**Files:**
- Create: `src/lib/sitemap-generator.ts`
- Create: `src/app/sitemap.xml/route.ts`
- Test: 访问 /sitemap.xml 验证结构

- [ ] **Step 1: 创建 sitemap 生成工具**

创建 `src/lib/sitemap-generator.ts` 文件：

```typescript
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
```

- [ ] **Step 2: 创建 sitemap.xml 路由处理器**

创建 `src/app/sitemap.xml/route.ts` 文件：

```typescript
import { MetadataRoute } from 'next';
import { generateSitemap } from '@/lib/sitemap-generator';

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return generateSitemap();
}
```

- [ ] **Step 3: 测试 sitemap.xml**

访问：http://localhost:3000/sitemap.xml

预期输出：完整的 XML 格式 sitemap，包含所有页面

- [ ] **Step 4: 验证 XML 格式**

使用在线验证工具验证 sitemap 格式：
- https://www.xml-sitemaps.com/validate-xml-sitemap.html

预期：验证通过，无格式错误

- [ ] **Step 5: 提交 sitemap 代码**

```bash
git add src/lib/sitemap-generator.ts src/app/sitemap.xml
git commit -m "feat: 添加动态 sitemap.xml 生成

- 自动生成所有公开页面的 sitemap
- 包含静态页面、服务、生态、新闻、案例
- 设置合理的 priority 和 changeFrequency

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 5: 创建结构化数据组件

**Files:**
- Create: `src/components/seo/JsonLd.tsx`
- Create: `src/components/seo/OpenGraph.tsx`
- Create: `src/components/seo/TwitterCard.tsx`
- Test: 验证组件渲染正确

- [ ] **Step 1: 创建 SEO 组件目录**

```bash
mkdir -p src/components/seo
```

- [ ] **Step 2: 创建 JsonLd 组件**

创建 `src/components/seo/JsonLd.tsx` 文件：

```typescript
import { JsonLdProps } from '@/types/seo';

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

- [ ] **Step 3: 创建 OpenGraph 组件**

创建 `src/components/seo/OpenGraph.tsx` 文件：

```typescript
import { OpenGraphProps } from '@/types/seo';

export function OpenGraph({
  title,
  description,
  image,
  url,
  type = 'website',
  siteName = '海创元AI教育',
  locale = 'zh_CN',
}: OpenGraphProps) {
  return (
    <>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
    </>
  );
}
```

- [ ] **Step 4: 创建 TwitterCard 组件**

创建 `src/components/seo/TwitterCard.tsx` 文件：

```typescript
import { TwitterCardProps } from '@/types/seo';

export function TwitterCard({
  card = 'summary_large_image',
  title,
  description,
  image,
}: TwitterCardProps) {
  return (
    <>
      <meta name="twitter:card" content={card} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </>
  );
}
```

- [ ] **Step 5: 验证组件导出**

确保组件正确导出：

```bash
grep -r "export.*JsonLd\|export.*OpenGraph\|export.*TwitterCard" src/components/seo/
```

预期输出：显示三个组件的导出语句

- [ ] **Step 6: 提交 SEO 组件**

```bash
git add src/components/seo
git commit -m "feat: 添加 SEO 组件

- JsonLd: 结构化数据组件
- OpenGraph: Open Graph 标签组件
- TwitterCard: Twitter Card 标签组件

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 6: 优化全局 layout 和首页

**Files:**
- Modify: `src/app/layout.tsx:7-16`
- Modify: `src/app/page.tsx:4-6`
- Test: 验证 metadata 正确渲染

- [ ] **Step 1: 优化根 layout metadata**

修改 `src/app/layout.tsx` 的 metadata：

```typescript
export const metadata: Metadata = {
  title: '海创元AI教育 - AI教育全链赋能生态运营商 | 海淀国投集团',
  description:
    '北京海创元人工智能教育科技有限公司，海淀国投集团全资企业。提供AI课程入校、AI师资培训与认证、AI研学、政企AI赋能培训、OPC生态等八大业务线服务。',
  keywords:
    '海创元,AI教育,人工智能教育,AI课程入校,师资培训,AI研学,政企培训,OPC生态,海淀国投',
  icons: {
    icon: '/logo-light-32.png',
  },
  openGraph: {
    siteName: '海创元AI教育',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};
```

- [ ] **Step 2: 为首页添加 ISR 重新验证**

修改 `src/app/page.tsx`，添加 revalidate：

```typescript
export const revalidate = 1800; // 每30分钟重新生成

// Force dynamic rendering - this page fetches data from the database at request time
export const dynamic = 'force-dynamic';
```

- [ ] **Step 3: 测试首页 metadata**

启动开发服务器，访问 http://localhost:3000

使用浏览器开发者工具检查 `<head>` 标签：
- 应该有 og:site_name, og:locale, twitter:card 等标签

- [ ] **Step 4: 提交 layout 和首页优化**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "feat: 优化全局 layout 和首页 SEO

- 增强 title 和 description
- 添加 Open Graph 和 Twitter Card 配置
- 为首页添加 ISR 重新验证

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 7: 优化新闻页面 SEO

**Files:**
- Modify: `src/app/news/page.tsx`
- Modify: `src/app/news/[slug]/page.tsx:7-19`
- Test: 验证新闻页面 metadata

- [ ] **Step 1: 优化新闻列表页 metadata**

读取 `src/app/news/page.tsx`，检查是否有 metadata 导出，如果没有则添加：

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '新闻动态 - 海创元AI教育',
  description: '了解海创元AI教育最新动态、行业资讯、活动信息，把握人工智能教育发展趋势。',
  keywords: '海创元新闻,AI教育动态,人工智能教育资讯,AI课程新闻',
  openGraph: {
    title: '新闻动态 - 海创元AI教育',
    description: '了解海创元AI教育最新动态、行业资讯、活动信息',
  },
};
```

同时在文件顶部添加 ISR：

```typescript
export const revalidate = 3600; // 每小时重新生成
```

- [ ] **Step 2: 优化新闻详情页 metadata**

修改 `src/app/news/[slug]/page.tsx` 的 generateMetadata 函数：

```typescript
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
```

- [ ] **Step 3: 为新闻详情页添加结构化数据**

在 `src/app/news/[slug]/page.tsx` 的 return 之前添加 JsonLd 组件：

```typescript
import { JsonLd } from '@/components/seo/JsonLd';

// 在 return 之前
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

// 在 JSX 中添加
return (
  <>
    <JsonLd type="Article" data={jsonLdData} />
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      {/* 现有内容 */}
    </div>
  </>
);
```

- [ ] **Step 4: 测试新闻页面 SEO**

访问一个新闻详情页，检查：
1. 页面标题格式：`[文章标题] - 海创元AI教育`
2. meta description 使用 seoDescription 或 excerpt
3. Open Graph 标签正确
4. 结构化数据存在

- [ ] **Step 5: 提交新闻页面 SEO 优化**

```bash
git add src/app/news
git commit -m "feat: 优化新闻页面 SEO

- 新闻列表页：添加 metadata 和 ISR
- 新闻详情页：使用 SEO 字段生成 metadata
- 新闻详情页：添加 Article 结构化数据

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 8: 优化案例和服务页面 SEO

**Files:**
- Modify: `src/app/cases/page.tsx`
- Modify: `src/app/services/page.tsx`
- Create: `src/app/cases/[slug]/page.tsx`
- Test: 验证案例和服务页面 metadata

- [ ] **Step 1: 优化案例列表页 metadata**

在 `src/app/cases/page.tsx` 文件顶部添加：

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '学校案例 - 海创元AI教育',
  description: '海创元AI教育合作院校案例展示，涵盖小学、初中、高中全学段，服务北京、上海、浙江等地区130+所学校。',
  keywords: '海创元案例,AI教育学校案例,AI课程入校案例,人工智能教育合作',
  openGraph: {
    title: '学校案例 - 海创元AI教育',
    description: '海创元AI教育合作院校案例展示，服务130+所学校',
  },
};

export const revalidate = 86400; // 每天重新生成
```

- [ ] **Step 2: 创建案例详情页**

创建 `src/app/cases/[slug]/page.tsx` 文件：

```typescript
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { generateCaseMeta } from '@/lib/seo-utils';
import { JsonLd } from '@/components/seo/JsonLd';

export const revalidate = 86400; // 每天重新生成

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseItem = await prisma.schoolCase.findUnique({
    where: { slug },
  });

  if (!caseItem) return {};

  return generateCaseMeta({
    name: caseItem.name,
    region: caseItem.region,
    slug: caseItem.slug!,
    grade: caseItem.grade,
    partnership: caseItem.partnership,
    seoTitle: caseItem.seoTitle,
    seoDescription: caseItem.seoDescription,
    featuredImage: caseItem.featuredImage,
  });
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseItem = await prisma.schoolCase.findUnique({
    where: { slug },
  });

  if (!caseItem) {
    notFound();
  }

  const jsonLdData = {
    headline: `${caseItem.name} AI教育合作案例`,
    description: caseItem.partnership,
    image: caseItem.featuredImage || caseItem.coverImage,
  };

  return (
    <>
      <JsonLd type="Article" data={jsonLdData} />
      <div className="min-h-screen bg-[#F5F7FA] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">{caseItem.name}</h1>
          <p className="text-gray-600 mb-4">地区：{caseItem.region}</p>
          {caseItem.partnership && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">合作内容</h2>
              <p className="text-gray-700">{caseItem.partnership}</p>
            </div>
          )}
          {caseItem.results && (
            <div>
              <h2 className="text-xl font-semibold mb-2">合作成果</h2>
              <p className="text-gray-700">{caseItem.results}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 3: 优化服务列表页 metadata**

在 `src/app/services/page.tsx` 文件顶部添加：

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '服务体系 - 海创元AI教育',
  description: '海创元AI教育提供AI课程入校、AI师资培训、AI研学、政企培训等全方位服务，赋能人工智能教育生态。',
  keywords: '海创元服务,AI课程入校,AI师资培训,AI研学,政企AI培训',
  openGraph: {
    title: '服务体系 - 海创元AI教育',
    description: '全方位AI教育服务体系',
  },
};

export const revalidate = 86400; // 每天重新生成
```

- [ ] **Step 4: 优化服务子页面 metadata**

为每个服务页面添加 metadata。以 `src/app/services/ai-curriculum/page.tsx` 为例：

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI课程入校 - 海创元AI教育',
  description: '1+N综合解决方案，覆盖小/初/高全学段，5年课堂实践打磨，累计服务130+所院校。',
  keywords: 'AI课程入校,人工智能课程,AI教学体系,中小学AI教育',
  openGraph: {
    title: 'AI课程入校 - 海创元AI教育',
    description: '1+N综合解决方案，覆盖全学段',
  },
};

export const revalidate = 86400; // 每天重新生成
```

对其他服务页面重复类似操作：
- `src/app/services/teacher-training/page.tsx`
- `src/app/services/ai-research-study/page.tsx`
- `src/app/services/ecosystem-alliance/page.tsx`

- [ ] **Step 5: 提交案例和服务页面 SEO**

```bash
git add src/app/cases src/app/services
git commit -m "feat: 优化案例和服务页面 SEO

- 案例列表页：添加 metadata
- 案例详情页：创建新页面，支持 slug 路由
- 服务页面：添加 metadata 和 ISR

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 9: 添加全局 Organization 结构化数据

**Files:**
- Modify: `src/app/layout.tsx:18-33`
- Test: 验证结构化数据在首页

- [ ] **Step 1: 在根 layout 添加 Organization JsonLd**

修改 `src/app/layout.tsx`，导入 JsonLd 组件并在 body 中添加：

```typescript
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  // ... 现有 metadata
};

const organizationData = {
  name: '北京海创元人工智能教育科技有限公司',
  alternateName: '海创元AI教育',
  url: 'https://aieducenter.com',
  logo: 'https://aieducenter.com/logo.png',
  description: 'AI教育全链赋能生态运营商',
  parentOrganization: {
    '@type': 'Organization',
    name: '海淀国投集团',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: '北京',
    addressCountry: 'CN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: '+86-xxx-xxxx-xxxx',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <head>
        <JsonLd type="Organization" data={organizationData} />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: 测试 Organization 结构化数据**

访问 http://localhost:3000，使用 Google Rich Results Test 验证：
https://search.google.com/test/rich-results

预期：Organization 结构化数据验证通过

- [ ] **Step 3: 提交全局结构化数据**

```bash
git add src/app/layout.tsx
git commit -m "feat: 添加全局 Organization 结构化数据

在根 layout 添加企业信息 Schema.org 标记

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 10: 添加网站验证码支持

**Files:**
- Modify: `src/app/layout.tsx`（添加 meta 验证标签）
- Test: 验证 meta 标签存在

- [ ] **Step 1: 在根 layout 添加验证码 meta 标签**

修改 `src/app/layout.tsx` 的 metadata，添加验证码配置：

```typescript
export const metadata: Metadata = {
  title: '海创元AI教育 - AI教育全链赋能生态运营商 | 海淀国投集团',
  description: '...',
  keywords: '...',
  icons: {
    icon: '/logo-light-32.png',
  },
  verification: {
    google: process.env.GOOGLE_VERIFY_CODE,
    baidu: process.env.BAIDU_VERIFY_CODE,
  },
  openGraph: {
    siteName: '海创元AI教育',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};
```

- [ ] **Step 2: 更新 .env.example**

在项目根目录的 `.env.example` 中添加：

```env
# SEO 验证码
GOOGLE_VERIFY_CODE=your_google_verify_code
BAIDU_VERIFY_CODE=your_baidu_verify_code

# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_BAIDU_ANALYTICS_ID=your_baidu_analytics_id

# Site URL
NEXT_PUBLIC_SITE_URL=https://aieducenter.com
```

- [ ] **Step 3: 提交验证码支持**

```bash
git add src/app/layout.tsx .env.example
git commit -m "feat: 添加搜索引擎验证码支持

支持 Google Search Console 和百度站长工具验证

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## 📋 Phase 2: 技术 SEO 优化（2-4周）

### Task 11: 实现面包屑导航组件

**Files:**
- Create: `src/components/seo/Breadcrumb.tsx`
- Modify: `src/app/news/[slug]/page.tsx`
- Modify: `src/app/cases/[slug]/page.tsx`
- Test: 验证面包屑显示正确

- [ ] **Step 1: 创建面包屑组件**

创建 `src/components/seo/Breadcrumb.tsx` 文件：

```typescript
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbItem } from '@/types/seo';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="面包屑导航">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
          {index === items.length - 1 ? (
            <span className="font-medium text-gray-900">{item.name}</span>
          ) : (
            <Link href={item.href} className="hover:text-blue-600 transition-colors">
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: 在新闻详情页添加面包屑**

修改 `src/app/news/[slug]/page.tsx`：

```typescript
import { Breadcrumb } from '@/components/seo/Breadcrumb';
import { generateBreadcrumb } from '@/lib/seo-utils';

// 在页面组件中
const breadcrumbItems = generateBreadcrumb([
  { name: '首页', href: '/' },
  { name: '新闻动态', href: '/news' },
  { name: article.title, href: `/news/${article.slug}` },
]);

return (
  <>
    <JsonLd type="BreadcrumbList" data={breadcrumbItems} />
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <div className="px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[
          { name: '首页', href: '/' },
          { name: '新闻动态', href: '/news' },
          { name: article.title, href: `/news/${article.slug}` },
        ]} />
        {/* 现有内容 */}
      </div>
    </div>
  </>
);
```

- [ ] **Step 3: 在案例详情页添加面包屑**

修改 `src/app/cases/[slug]/page.tsx`：

```typescript
import { Breadcrumb } from '@/components/seo/Breadcrumb';

// 在页面组件中
return (
  <>
    <JsonLd type="Article" data={jsonLdData} />
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb items={[
          { name: '首页', href: '/' },
          { name: '学校案例', href: '/cases' },
          { name: caseItem.name, href: `/cases/${caseItem.slug}` },
        ]} />
        {/* 现有内容 */}
      </div>
    </div>
  </>
);
```

- [ ] **Step 4: 提交面包屑组件**

```bash
git add src/components/seo/Breadcrumb.tsx src/app/news/[slug]/page.tsx src/app/cases/[slug]/page.tsx
git commit -m "feat: 添加面包屑导航组件

- 创建 Breadcrumb 组件
- 在新闻和案例详情页添加面包屑
- 添加 BreadcrumbList 结构化数据

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 12: 实现相关内容推荐组件

**Files:**
- Create: `src/components/RelatedContent.tsx`
- Modify: `src/app/news/[slug]/page.tsx`
- Test: 验证相关内容显示

- [ ] **Step 1: 创建相关内容推荐组件**

创建 `src/components/RelatedContent.tsx` 文件：

```typescript
'use client';

import Link from 'next/link';
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

  if (relatedNews.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold mb-6">相关阅读</h3>
      <div className="grid gap-6 md:grid-cols-3">
        {relatedNews.map((news) => (
          <Link
            key={news.slug}
            href={`/news/${news.slug}`}
            className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            {news.image && (
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <div className="p-4">
              <span className="text-sm text-blue-600">{news.category}</span>
              <h4 className="font-semibold mt-2 group-hover:text-blue-600 transition-colors">
                {news.title}
              </h4>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{news.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 在新闻详情页添加相关推荐**

修改 `src/app/news/[slug]/page.tsx`，在内容底部添加：

```typescript
import { RelatedNews } from '@/components/RelatedContent';

// 在 NewsDetailClient 后面添加
return (
  <>
    <JsonLd type="Article" data={jsonLdData} />
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <div className="px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[...]} />
        <NewsDetailClient article={...} />
        <RelatedNews currentSlug={article.slug} category={article.category} />
      </div>
    </div>
  </>
);
```

- [ ] **Step 3: 提交相关内容推荐**

```bash
git add src/components/RelatedContent.tsx src/app/news/[slug]/page.tsx
git commit -m "feat: 添加相关内容推荐组件

- 创建 RelatedNews 组件
- 在新闻详情页显示同分类相关文章

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task 13: 图片优化实现

**Files:**
- Modify: 所有使用 `<img>` 标签的组件
- Test: 验证图片加载性能

- [ ] **Step 1: 检查现有图片使用**

查找所有使用 img 标签的文件：

```bash
grep -r "<img" src/components --include="*.tsx" | head -20
```

- [ ] **Step 2: 替换为 Next.js Image 组件**

对于找到的每个 img 标签，替换为 Next.js Image 组件。示例：

```typescript
// 之前
<img src={article.image} alt={article.title} className="w-full" />

// 之后
import Image from 'next/image';
<Image
  src={article.image}
  alt={article.title}
  width={800}
  height={600}
  className="w-full"
  loading="lazy"
/>
```

- [ ] **Step 3: 配置图片域名**

确保 `next.config.ts` 已配置远程图片域名：

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.website.aieducenter.com',
      },
    ],
  },
};
```

- [ ] **Step 4: 添加图片尺寸占位**

为所有图片添加 width 和 height 或使用 fill 模式：

```typescript
// 带尺寸
<Image
  src={article.image}
  alt={article.title}
  width={1200}
  height={630}
  className="w-full"
/>

// 或使用 fill 模式
<div className="relative w-full aspect-video">
  <Image
    src={article.image}
    alt={article.title}
    fill
    className="object-cover"
  />
</div>
```

- [ ] **Step 5: 提交图片优化**

```bash
git add src/components next.config.ts
git commit -m "feat: 优化图片加载

- 使用 Next.js Image 组件
- 添加懒加载
- 配置远程图片域名
- 优化图片尺寸占位

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## 📋 Phase 3: 监控和分析集成（可选）

### Task 14: 集成 Google Analytics

**Files:**
- Create: `src/components/Analytics.tsx`
- Modify: `src/app/layout.tsx`
- Test: 验证 GA 事件追踪

- [ ] **Step 1: 创建 Google Analytics 组件**

创建 `src/components/Analytics.tsx` 文件：

```typescript
'use client';

import { GoogleAnalytics } from '@next/third-parties/google';

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
```

- [ ] **Step 2: 安装依赖**

```bash
npm install @next/third-parties
```

- [ ] **Step 3: 在 layout 中添加 Analytics**

修改 `src/app/layout.tsx`：

```typescript
import { Analytics } from '@/components/Analytics';

// 在 body 中
<Analytics />
```

- [ ] **Step 4: 提交 Analytics 集成**

```bash
git add src/components/Analytics.tsx src/app/layout.tsx package.json
git commit -m "feat: 集成 Google Analytics

添加页面浏览量追踪

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## ✅ 验证和测试

### Task 15: SEO 综合验证

**Files:**
- Test: 所有页面
- Tools: Google Rich Results Test, PageSpeed Insights

- [ ] **Step 1: 验证所有页面 Meta 标签**

手动检查所有主要页面：
- 首页、新闻列表、新闻详情、案例列表、案例详情、服务页面

使用浏览器开发者工具验证每个页面都有：
- title
- meta description
- meta keywords
- og:title, og:description, og:image
- twitter:card, twitter:title, twitter:description

- [ ] **Step 2: 验证结构化数据**

使用 Google Rich Results Test 验证：
https://search.google.com/test/rich-results

测试 URL：
- 首页：应显示 Organization
- 新闻详情：应显示 Article
- 所有页面：应显示 BreadcrumbList

- [ ] **Step 3: 验证 robots.txt 和 sitemap.xml**

访问：
- http://localhost:3000/robots.txt
- http://localhost:3000/sitemap.xml

验证格式正确。

- [ ] **Step 4: 运行 Lighthouse 审计**

对首页和新闻详情页运行 Lighthouse：
```bash
npx lighthouse http://localhost:3000 --view
npx lighthouse http://localhost:3000/news/xxx --view
```

目标分数：
- SEO: > 90
- Performance: > 80
- Accessibility: > 90

- [ ] **Step 5: 提交验证脚本**

创建 `scripts/seo-check.sh`：

```bash
#!/bin/bash

echo "检查 robots.txt"
curl -s http://localhost:3000/robots.txt | head -10

echo "\n检查 sitemap.xml"
curl -s http://localhost:3000/sitemap.xml | head -20

echo "\nSEO 验证完成"
```

```bash
git add scripts/seo-check.sh
git commit -m "feat: 添加 SEO 验证脚本

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## 📝 实施注意事项

### 开发原则

1. **TDD（测试驱动开发）**
   - 每个功能先写测试（如果适用）
   - 运行测试确保失败
   - 实现最小功能使测试通过
   - 重构和优化

2. **频繁提交**
   - 每个 Task 完成后立即 commit
   - Commit message 清晰描述改动
   - 使用 Co-Authored-By 标签

3. **YAGNI（You Aren't Gonna Need It）**
   - 只实现当前需要的功能
   - 不添加未来可能需要的功能
   - 保持代码简洁

4. **DRY（Don't Repeat Yourself）**
   - 复用工具函数
   - 提取公共逻辑
   - 避免代码重复

### 故障排查

如果遇到问题：

1. **数据库迁移失败**
   ```bash
   # 回滚迁移
   npx prisma migrate resolve --rolled-back [migration_name]
   ```

2. **类型错误**
   ```bash
   # 重新生成 Prisma Client
   npm run prisma:generate
   ```

3. **图片加载失败**
   - 检查 next.config.ts 中的 remotePatterns
   - 验证图片 URL 可访问

4. **sitemap.xml 生成失败**
   - 检查数据库连接
   - 验证 Prisma 查询语法

### 性能监控

使用以下工具监控 SEO 效果：

- **Google Search Console**: 监控索引状态和搜索表现
- **Google Analytics**: 监控流量和用户行为
- **百度统计**: 监控国内搜索引擎流量
- **Lighthouse**: 定期运行性能审计

---

## 🎯 成功标准

完成所有任务后，应该达到：

- ✅ 所有页面都有完整的 Meta 标签
- ✅ robots.txt 和 sitemap.xml 正确配置
- ✅ 所有页面都有 Open Graph 和 Twitter Card 标签
- ✅ 首页有 Organization 结构化数据
- ✅ 新闻文章有 Article 结构化数据
- ✅ 所有页面都有 BreadcrumbList 结构化数据
- ✅ Core Web Vitals 达到"良好"级别
- ✅ Lighthouse SEO 分数 > 90
- ✅ 图片使用 Next.js Image 组件优化
- ✅ 主要页面实现了 ISR

---

**文档版本**: 1.0
**创建日期**: 2026-04-04
**预计完成时间**: 4-6周
