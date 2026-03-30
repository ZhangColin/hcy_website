-- Migration: Refactor SchoolCase and CompetitionHonor tables
-- SchoolCase: Add grade, abbr, partnership, results, color, coverImage, schoolLogo
-- CompetitionHonor: Add achievements, image

-- ============================================
-- SchoolCase table changes
-- ============================================
ALTER TABLE "SchoolCase" ADD COLUMN "grade" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "SchoolCase" ADD COLUMN "abbr" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SchoolCase" ADD COLUMN "partnership" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SchoolCase" ADD COLUMN "results" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SchoolCase" ADD COLUMN "color" TEXT NOT NULL DEFAULT 'from-[#1A3C8A] to-[#2B6CB0]';
ALTER TABLE "SchoolCase" ADD COLUMN "coverImage" TEXT;
ALTER TABLE "SchoolCase" ADD COLUMN "schoolLogo" TEXT;

-- Drop old columns (run separately after verifying)
-- ALTER TABLE "SchoolCase" DROP COLUMN "type";
-- ALTER TABLE "SchoolCase" DROP COLUMN "stage";
-- ALTER TABLE "SchoolCase" DROP COLUMN "summary";

-- ============================================
-- CompetitionHonor table changes
-- ============================================
ALTER TABLE "CompetitionHonor" ADD COLUMN "achievements" TEXT NOT NULL DEFAULT '';
ALTER TABLE "CompetitionHonor" ADD COLUMN "image" TEXT;
