-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN "repliedAt" TIMESTAMP(3),
ADD COLUMN "replyNotes" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN "wechatOfficialQr" TEXT,
ADD COLUMN "wechatServiceQr" TEXT;
