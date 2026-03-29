/*
  Warnings:

  - You are about to drop the `Partner` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "email" TEXT,
ADD COLUMN     "mapLat" TEXT,
ADD COLUMN     "mapLng" TEXT,
ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "Partner";
