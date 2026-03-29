-- Fix competition honor level: "全球" should be "国际"
-- Date: 2026-03-29
UPDATE "CompetitionHonor" SET level = '国际' WHERE level = '全球';
