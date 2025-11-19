/*
  Warnings:

  - You are about to drop the `seo_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "website_settings" ADD COLUMN     "customCss" TEXT,
ADD COLUMN     "customJs" TEXT,
ADD COLUMN     "facebookPixel" TEXT,
ADD COLUMN     "footerCode" TEXT,
ADD COLUMN     "googleAnalytics" TEXT,
ADD COLUMN     "googleTagManager" TEXT,
ADD COLUMN     "headerCode" TEXT,
ADD COLUMN     "homePageId" TEXT,
ADD COLUMN     "homePageType" TEXT,
ADD COLUMN     "logoHeight" INTEGER,
ADD COLUMN     "logoWidth" INTEGER,
ADD COLUMN     "manifestJson" JSONB,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "organizationSchema" JSONB,
ADD COLUMN     "robotsTxt" TEXT,
ADD COLUMN     "siteDescription" TEXT,
ADD COLUMN     "siteFavicon" TEXT,
ADD COLUMN     "siteKeywords" TEXT,
ADD COLUMN     "siteName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "siteOgImage" TEXT,
ADD COLUMN     "themeColor" TEXT DEFAULT '#ffffff',
ADD COLUMN     "titleTemplate" TEXT,
ADD COLUMN     "twitterHandle" TEXT,
ADD COLUMN     "websiteSchema" JSONB;

-- DropTable
DROP TABLE "seo_settings";
