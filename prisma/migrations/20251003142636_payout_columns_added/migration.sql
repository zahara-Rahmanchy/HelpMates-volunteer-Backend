/*
  Warnings:

  - You are about to drop the column `batchId` on the `Payout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payout" DROP COLUMN "batchId",
ADD COLUMN     "payoutbatchId" TEXT,
ADD COLUMN     "senderbatchId" TEXT;
