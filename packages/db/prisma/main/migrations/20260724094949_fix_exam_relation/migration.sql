/*
  Warnings:

  - You are about to drop the `exam_academic_class` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `academicClassId` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "exam_academic_class" DROP CONSTRAINT "exam_academic_class_academicClassId_fkey";

-- DropForeignKey
ALTER TABLE "exam_academic_class" DROP CONSTRAINT "exam_academic_class_examId_fkey";

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "academicClassId" TEXT NOT NULL;

-- DropTable
DROP TABLE "exam_academic_class";

-- CreateIndex
CREATE INDEX "Exam_academicClassId_idx" ON "Exam"("academicClassId");

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_academicClassId_fkey" FOREIGN KEY ("academicClassId") REFERENCES "academic_class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
