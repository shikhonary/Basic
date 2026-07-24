-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "group" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicClassSubject" (
    "id" TEXT NOT NULL,
    "academicClassId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicClassSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subject_level_idx" ON "Subject"("level");

-- CreateIndex
CREATE INDEX "Subject_position_idx" ON "Subject"("position");

-- CreateIndex
CREATE INDEX "Subject_group_idx" ON "Subject"("group");

-- CreateIndex
CREATE INDEX "AcademicClassSubject_academicClassId_idx" ON "AcademicClassSubject"("academicClassId");

-- CreateIndex
CREATE INDEX "AcademicClassSubject_subjectId_idx" ON "AcademicClassSubject"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicClassSubject_academicClassId_subjectId_key" ON "AcademicClassSubject"("academicClassId", "subjectId");

-- CreateIndex
CREATE INDEX "Chapter_subjectId_idx" ON "Chapter"("subjectId");

-- AddForeignKey
ALTER TABLE "AcademicClassSubject" ADD CONSTRAINT "AcademicClassSubject_academicClassId_fkey" FOREIGN KEY ("academicClassId") REFERENCES "academic_class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicClassSubject" ADD CONSTRAINT "AcademicClassSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
