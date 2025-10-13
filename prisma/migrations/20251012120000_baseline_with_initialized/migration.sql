-- AlterEnum
-- This migration acknowledges that INITIALIZED was manually added
ALTER TYPE "PayoutStatus" ADD VALUE IF NOT EXISTS 'INITIALIZED';