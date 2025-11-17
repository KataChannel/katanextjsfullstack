-- CreateEnum
CREATE TYPE "MenuPosition" AS ENUM ('HEADER', 'FOOTER', 'ADMIN', 'SIDEBAR');

-- AlterTable
ALTER TABLE "menus" ADD COLUMN     "position" "MenuPosition" NOT NULL DEFAULT 'HEADER';

-- CreateIndex
CREATE INDEX "menus_position_idx" ON "menus"("position");
