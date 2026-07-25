-- CreateTable
CREATE TABLE IF NOT EXISTS "exam_group" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'MODEL_TEST',
    "calculationType" TEXT NOT NULL DEFAULT 'SUM',
    "bestOfNCount" INTEGER,
    "totalMarks" DOUBLE PRECISION,
    "passMarks" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "academicClassId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "exam_group_item" (
    "id" TEXT NOT NULL,
    "examGroupId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "weightage" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_group_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "exam_group_result" (
    "id" TEXT NOT NULL,
    "examGroupId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "totalObtainedMarks" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalMaxMarks" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gpa" DOUBLE PRECISION,
    "grade" TEXT,
    "meritPosition" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PASSED',
    "examsAttempted" INTEGER NOT NULL DEFAULT 0,
    "totalExamsInGroup" INTEGER NOT NULL DEFAULT 0,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_group_result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "exam_group_title_idx" ON "exam_group"("title");
CREATE INDEX IF NOT EXISTS "exam_group_type_idx" ON "exam_group"("type");
CREATE INDEX IF NOT EXISTS "exam_group_academicClassId_idx" ON "exam_group"("academicClassId");
CREATE INDEX IF NOT EXISTS "exam_group_isPublished_idx" ON "exam_group"("isPublished");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "exam_group_item_examGroupId_idx" ON "exam_group_item"("examGroupId");
CREATE INDEX IF NOT EXISTS "exam_group_item_examId_idx" ON "exam_group_item"("examId");
CREATE INDEX IF NOT EXISTS "exam_group_item_examGroupId_position_idx" ON "exam_group_item"("examGroupId", "position");
CREATE UNIQUE INDEX IF NOT EXISTS "exam_group_item_examGroupId_examId_key" ON "exam_group_item"("examGroupId", "examId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "exam_group_result_examGroupId_idx" ON "exam_group_result"("examGroupId");
CREATE INDEX IF NOT EXISTS "exam_group_result_studentId_idx" ON "exam_group_result"("studentId");
CREATE INDEX IF NOT EXISTS "exam_group_result_examGroupId_meritPosition_idx" ON "exam_group_result"("examGroupId", "meritPosition");
CREATE INDEX IF NOT EXISTS "exam_group_result_examGroupId_percentage_idx" ON "exam_group_result"("examGroupId", "percentage");
CREATE UNIQUE INDEX IF NOT EXISTS "exam_group_result_examGroupId_studentId_key" ON "exam_group_result"("examGroupId", "studentId");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exam_group_academicClassId_fkey') THEN
        ALTER TABLE "exam_group" ADD CONSTRAINT "exam_group_academicClassId_fkey" FOREIGN KEY ("academicClassId") REFERENCES "academic_class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exam_group_item_examGroupId_fkey') THEN
        ALTER TABLE "exam_group_item" ADD CONSTRAINT "exam_group_item_examGroupId_fkey" FOREIGN KEY ("examGroupId") REFERENCES "exam_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exam_group_item_examId_fkey') THEN
        ALTER TABLE "exam_group_item" ADD CONSTRAINT "exam_group_item_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exam_group_result_examGroupId_fkey') THEN
        ALTER TABLE "exam_group_result" ADD CONSTRAINT "exam_group_result_examGroupId_fkey" FOREIGN KEY ("examGroupId") REFERENCES "exam_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exam_group_result_studentId_fkey') THEN
        ALTER TABLE "exam_group_result" ADD CONSTRAINT "exam_group_result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
