/*
  Warnings:

  - You are about to drop the column `transactionId` on the `Payout` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('PENDING', 'SUCCESS', 'DENIED');

-- AlterTable
ALTER TABLE "Payout" DROP COLUMN "transactionId";
