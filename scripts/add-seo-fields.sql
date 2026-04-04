-- SEO 优化数据库字段添加脚本
-- 执行日期：2026-04-04
-- 说明：为 NewsArticle、SchoolCase、SiteConfig 表添加 SEO 相关字段
--
-- 执行方式：
-- 1. 连接到您的 PostgreSQL 数据库
-- 2. 运行此脚本：psql -U your_user -d your_database -f scripts/add-seo-fields.sql
-- 3. 或者复制 SQL 语句在数据库客户端中执行

-- ============================================
-- 1. 为 NewsArticle 表添加 SEO 字段
-- ============================================
ALTER TABLE "NewsArticle"
  ADD COLUMN IF NOT EXISTS "seoTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "seoDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "seoKeywords" TEXT,
  ADD COLUMN IF NOT EXISTS "ogImage" TEXT;

COMMENT ON COLUMN "NewsArticle"."seoTitle" IS '自定义 SEO 标题';
COMMENT ON COLUMN "NewsArticle"."seoDescription" IS '自定义 SEO 描述';
COMMENT ON COLUMN "NewsArticle"."seoKeywords" IS '自定义 SEO 关键词';
COMMENT ON COLUMN "NewsArticle"."ogImage" IS 'Open Graph 分享图片';

-- ============================================
-- 2. 为 SchoolCase 表添加 SEO 字段
-- ============================================
ALTER TABLE "SchoolCase"
  ADD COLUMN IF NOT EXISTS "slug" TEXT,
  ADD COLUMN IF NOT EXISTS "seoTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "seoDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "featuredImage" TEXT;

-- 创建唯一索引（如果尚未存在）
CREATE UNIQUE INDEX IF NOT EXISTS "SchoolCase_slug_key" ON "SchoolCase"("slug");

COMMENT ON COLUMN "SchoolCase"."slug" IS 'URL 友好的标识符';
COMMENT ON COLUMN "SchoolCase"."seoTitle" IS '自定义 SEO 标题';
COMMENT ON COLUMN "SchoolCase"."seoDescription" IS '自定义 SEO 描述';
COMMENT ON COLUMN "SchoolCase"."featuredImage" IS '特色图片（用于分享）';

-- ============================================
-- 3. 为 SiteConfig 表添加 SEO 配置字段
-- ============================================
ALTER TABLE "SiteConfig"
  ADD COLUMN IF NOT EXISTS "googleAnalyticsId" TEXT,
  ADD COLUMN IF NOT EXISTS "baiduAnalyticsId" TEXT,
  ADD COLUMN IF NOT EXISTS "googleVerifyCode" TEXT,
  ADD COLUMN IF NOT EXISTS "baiduVerifyCode" TEXT,
  ADD COLUMN IF NOT EXISTS "defaultOgImage" TEXT,
  ADD COLUMN IF NOT EXISTS "twitterHandle" TEXT;

COMMENT ON COLUMN "SiteConfig"."googleAnalyticsId" IS 'Google Analytics ID';
COMMENT ON COLUMN "SiteConfig"."baiduAnalyticsId" IS '百度统计 ID';
COMMENT ON COLUMN "SiteConfig"."googleVerifyCode" IS 'Google Search Console 验证码';
COMMENT ON COLUMN "SiteConfig"."baiduVerifyCode" IS '百度站长工具验证码';
COMMENT ON COLUMN "SiteConfig"."defaultOgImage" IS '默认分享图片';
COMMENT ON COLUMN "SiteConfig"."twitterHandle" IS 'Twitter 账号';

-- ============================================
-- 执行完成提示
-- ============================================
DO $$
BEGIN
  -- 验证字段是否添加成功
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'NewsArticle' AND column_name = 'seoTitle'
  ) THEN
    RAISE NOTICE '✅ NewsArticle SEO 字段添加成功';
  ELSE
    RAISE NOTICE '❌ NewsArticle SEO 字段添加失败';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'SchoolCase' AND column_name = 'slug'
  ) THEN
    RAISE NOTICE '✅ SchoolCase SEO 字段添加成功';
  ELSE
    RAISE NOTICE '❌ SchoolCase SEO 字段添加失败';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'SiteConfig' AND column_name = 'googleAnalyticsId'
  ) THEN
    RAISE NOTICE '✅ SiteConfig SEO 配置字段添加成功';
  ELSE
    RAISE NOTICE '❌ SiteConfig SEO 配置字段添加失败';
  END IF;
END $$;
