-- CreateEnum
CREATE TYPE "ImpactType" AS ENUM ('ONE_TIME', 'ONGOING');

-- CreateEnum
CREATE TYPE "ContributionType" AS ENUM ('DONATION', 'SPONSORSHIP', 'VOLUNTEER_WORK', 'EVENT_PROGRAM', 'IN_KIND_SUPPORT');

-- CreateTable
CREATE TABLE "business_impact_records" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "causeId" TEXT,
    "organization" TEXT,
    "impactType" "ImpactType" NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "isPresent" BOOLEAN NOT NULL DEFAULT false,
    "contributionType" "ContributionType",
    "amount" DECIMAL(65,30),
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_impact_records_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "business_impact_records" ADD CONSTRAINT "business_impact_records_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_impact_records" ADD CONSTRAINT "business_impact_records_causeId_fkey" FOREIGN KEY ("causeId") REFERENCES "causes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
