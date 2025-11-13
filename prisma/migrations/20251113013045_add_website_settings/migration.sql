-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "showFooter" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showHeader" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "showFooter" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showHeader" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "website_settings" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "logo" TEXT,
    "logoAlt" TEXT,
    "headerHtml" TEXT,
    "navigationMenu" JSONB,
    "footerHtml" TEXT,
    "footerText" TEXT,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "website_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "website_settings_domain_key" ON "website_settings"("domain");
