-- CreateTable
CREATE TABLE "exam_academic_class" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "academicClassId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_academic_class_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exam_academic_class_examId_idx" ON "exam_academic_class"("examId");

-- CreateIndex
CREATE INDEX "exam_academic_class_academicClassId_idx" ON "exam_academic_class"("academicClassId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_academic_class_examId_academicClassId_key" ON "exam_academic_class"("examId", "academicClassId");

-- AddForeignKey
ALTER TABLE "exam_academic_class" ADD CONSTRAINT "exam_academic_class_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_academic_class" ADD CONSTRAINT "exam_academic_class_academicClassId_fkey" FOREIGN KEY ("academicClassId") REFERENCES "academic_class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
