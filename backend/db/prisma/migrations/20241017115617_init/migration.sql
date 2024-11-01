/*
  Warnings:

  - The `paraOneImage` column on the `blogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paraTwoImage` column on the `blogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paraThreeImage` column on the `blogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `mainImage` on the `blogs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `authorAvatar` on the `blogs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "mainImage",
ADD COLUMN     "mainImage" JSONB NOT NULL,
DROP COLUMN "paraOneImage",
ADD COLUMN     "paraOneImage" JSONB,
DROP COLUMN "paraTwoImage",
ADD COLUMN     "paraTwoImage" JSONB,
DROP COLUMN "paraThreeImage",
ADD COLUMN     "paraThreeImage" JSONB,
DROP COLUMN "authorAvatar",
ADD COLUMN     "authorAvatar" JSONB NOT NULL;
