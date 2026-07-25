-- AlterTable
ALTER TABLE "exam_subject" ADD COLUMN IF NOT EXISTS "mcqIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
