-- CreateEnum
CREATE TYPE "CalculatorMode" AS ENUM ('STANDARD', 'SCIENTIFIC', 'CONVERTER');

-- CreateTable
CREATE TABLE "calculation_history" (
    "id" TEXT NOT NULL,
    "mode" "CalculatorMode" NOT NULL,
    "expression" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculation_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_conversions" (
    "id" TEXT NOT NULL,
    "label" TEXT,
    "category" TEXT NOT NULL,
    "fromUnit" TEXT NOT NULL,
    "toUnit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_conversions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "calculation_history_createdAt_idx" ON "calculation_history"("createdAt" DESC);
