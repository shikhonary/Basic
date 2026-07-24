-- CreateTable
CREATE TABLE "academic_class" (
    "id" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_class_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "academic_class_nameEn_idx" ON "academic_class"("nameEn");

-- CreateIndex
CREATE INDEX "academic_class_position_idx" ON "academic_class"("position");

-- CreateIndex
CREATE INDEX "academic_class_level_idx" ON "academic_class"("level");
