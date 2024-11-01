-- CreateEnum
CREATE TYPE "Category" AS ENUM ('TECHNOLOGY', 'LIFESTYLE', 'EDUCATION', 'ENTERTAINMENT', 'HEALTH', 'OTHER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('READER', 'AUTHOR');

-- CreateTable
CREATE TABLE "blogs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "mainImage" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "mainContent" TEXT NOT NULL,
    "paraOneImage" TEXT,
    "paraOneDescription" TEXT,
    "paraOneTitle" TEXT,
    "paraTwoImage" TEXT,
    "paraTwoDescription" TEXT,
    "paraTwoTitle" TEXT,
    "paraThreeImage" TEXT,
    "paraThreeDescription" TEXT,
    "paraThreeTitle" TEXT,
    "category" "Category" NOT NULL,
    "createdById" INTEGER NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorAvatar" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "education" TEXT,
    "role" "Role" NOT NULL DEFAULT 'READER',
    "password" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
