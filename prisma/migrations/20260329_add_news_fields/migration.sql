-- Add news fields
-- Date: 2026-03-29

-- Add new columns to NewsArticle
ALTER TABLE "NewsArticle" ADD COLUMN "slug" TEXT;
ALTER TABLE "NewsArticle" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE "NewsArticle" ADD COLUMN "showOnHomepage" BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE "NewsArticle" ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;

-- Add unique constraint on slug
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_slug_key" UNIQUE ("slug");

-- Add indexes
CREATE INDEX "NewsArticle_featured_date_idx" ON "NewsArticle"("featured", "date");
CREATE INDEX "NewsArticle_showOnHomepage_idx" ON "NewsArticle"("showOnHomepage");
