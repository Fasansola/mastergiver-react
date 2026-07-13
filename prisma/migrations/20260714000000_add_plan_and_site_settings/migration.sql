-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- AlterTable: add plan column to businesses
ALTER TABLE "businesses" ADD COLUMN "plan" "Plan" NOT NULL DEFAULT 'FREE';

-- CreateTable: site_settings singleton for feature flags
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "paymentRequired" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- Seed the singleton row so admins can toggle it without a manual INSERT
INSERT INTO "site_settings" ("id", "paymentRequired", "updatedAt")
VALUES ('singleton', false, NOW())
ON CONFLICT ("id") DO NOTHING;
