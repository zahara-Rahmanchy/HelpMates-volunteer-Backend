/*
  Warnings:

  - A unique constraint covering the columns `[volunteerApplicationId]` on the table `Payout` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payout_volunteerApplicationId_key" ON "Payout"("volunteerApplicationId");
