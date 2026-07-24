-- CreateTable
CREATE TABLE "Mcq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "options" TEXT[],
    "statements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "type" TEXT NOT NULL,
    "isMath" BOOLEAN NOT NULL DEFAULT false,
    "reference" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "explanation" TEXT,
    "questionUrl" TEXT,
    "context" TEXT,
    "contextUrl" TEXT,
    "subjectId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mcq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mcq_chapterId_idx" ON "Mcq"("chapterId");

-- CreateIndex
CREATE INDEX "Mcq_chapterId_type_idx" ON "Mcq"("chapterId", "type");

-- CreateIndex
CREATE INDEX "Mcq_isMath_idx" ON "Mcq"("isMath");

-- CreateIndex
CREATE INDEX "Mcq_subjectId_chapterId_idx" ON "Mcq"("subjectId", "chapterId");

-- CreateIndex
CREATE INDEX "Mcq_subjectId_idx" ON "Mcq"("subjectId");

-- CreateIndex
CREATE INDEX "Mcq_subjectId_type_idx" ON "Mcq"("subjectId", "type");

-- CreateIndex
CREATE INDEX "Mcq_type_idx" ON "Mcq"("type");

-- AddForeignKey
ALTER TABLE "Mcq" ADD CONSTRAINT "Mcq_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mcq" ADD CONSTRAINT "Mcq_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
