/*
  Warnings:

  - You are about to drop the `Opportunity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "volunteerApplications" DROP CONSTRAINT "volunteerApplications_opportunityId_fkey";

-- DropTable
DROP TABLE "Opportunity";

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "image" TEXT[],
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "skillsRequired" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "duration" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "OpportunityStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opportunities_id_key" ON "opportunities"("id");

-- AddForeignKey
ALTER TABLE "volunteerApplications" ADD CONSTRAINT "volunteerApplications_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
