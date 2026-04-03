-- AlterTable: Add SEO fields to NewsArticle
ALTER TABLE "NewsArticle" ADD COLUMN "seoTitle" TEXT,
ADD COLUMN "seoDescription" TEXT,
ADD COLUMN "seoKeywords" TEXT,
ADD COLUMN "ogImage" TEXT;

-- AlterTable: Add SEO fields to SchoolCase
ALTER TABLE "SchoolCase" ADD COLUMN "slug" TEXT,
ADD COLUMN "seoTitle" TEXT,
ADD COLUMN "seoDescription" TEXT,
ADD COLUMN "featuredImage" TEXT;

-- CreateIndex: Add unique constraint on SchoolCase.slug
CREATE UNIQUE INDEX "SchoolCase_slug_key" ON "SchoolCase"("slug");

-- AlterTable: Add SEO configuration to SiteConfig
ALTER TABLE "SiteConfig" ADD COLUMN "googleAnalyticsId" TEXT,
ADD COLUMN "baiduAnalyticsId" TEXT,
ADD COLUMN "googleVerifyCode" TEXT,
ADD COLUMN "baiduVerifyCode" TEXT,
ADD COLUMN "defaultOgImage" TEXT,
ADD COLUMN "twitterHandle" TEXT;
