/*
  Warnings:

  - You are about to drop the column `Stipend` on the `opportunities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "opportunities" DROP COLUMN "Stipend",
ADD COLUMN     "stipend" DECIMAL(65,30) NOT NULL DEFAULT 0;
