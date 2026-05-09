-- Add productSeries field to SiteConfig
-- Safe migration: adds nullable JSON column with default empty array
ALTER TABLE "SiteConfig" ADD COLUMN "productSeries" JSONB NOT NULL DEFAULT '[]';
