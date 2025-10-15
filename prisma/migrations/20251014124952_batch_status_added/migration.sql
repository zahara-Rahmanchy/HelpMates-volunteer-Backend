-- AlterEnum
ALTER TYPE "BatchStatus" ADD VALUE 'PROCESSING';

-- AlterEnum
ALTER TYPE "PayoutStatus" ADD VALUE 'BLOCKED';

-- AlterTable
ALTER TABLE "Payout" ADD COLUMN     "batchStatus" "BatchStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "transactionId" TEXT;
