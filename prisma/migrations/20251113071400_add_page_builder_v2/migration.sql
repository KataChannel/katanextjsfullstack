-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "blocksV2" JSONB,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "menus" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "block_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "elements" JSONB NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "block_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "block_templates_v2" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "category" TEXT NOT NULL,
    "block" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "block_templates_v2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "menus_order_idx" ON "menus"("order");

-- CreateIndex
CREATE INDEX "menus_published_idx" ON "menus"("published");

-- CreateIndex
CREATE INDEX "menus_parentId_idx" ON "menus"("parentId");

-- CreateIndex
CREATE INDEX "block_templates_category_idx" ON "block_templates"("category");

-- CreateIndex
CREATE INDEX "block_templates_published_idx" ON "block_templates"("published");

-- CreateIndex
CREATE INDEX "block_templates_authorId_idx" ON "block_templates"("authorId");

-- CreateIndex
CREATE INDEX "block_templates_v2_category_idx" ON "block_templates_v2"("category");

-- CreateIndex
CREATE INDEX "block_templates_v2_published_idx" ON "block_templates_v2"("published");

-- CreateIndex
CREATE INDEX "block_templates_v2_authorId_idx" ON "block_templates_v2"("authorId");

-- CreateIndex
CREATE INDEX "block_templates_v2_tags_idx" ON "block_templates_v2"("tags");

-- CreateIndex
CREATE INDEX "pages_version_idx" ON "pages"("version");

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "block_templates" ADD CONSTRAINT "block_templates_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "block_templates_v2" ADD CONSTRAINT "block_templates_v2_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
