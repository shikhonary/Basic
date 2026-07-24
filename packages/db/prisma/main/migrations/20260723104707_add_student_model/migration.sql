-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "session" TEXT,
    "studentId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "fName" TEXT,
    "mName" TEXT,
    "gender" TEXT,
    "dob" TIMESTAMP(3),
    "nationality" TEXT,
    "religion" TEXT,
    "imageUrl" TEXT,
    "section" TEXT,
    "shift" TEXT,
    "group" TEXT,
    "roll" INTEGER,
    "fPhone" TEXT,
    "mPhone" TEXT NOT NULL,
    "presentAddress" TEXT,
    "permanentAddress" TEXT,
    "academicClassId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_academicClassId_fkey" FOREIGN KEY ("academicClassId") REFERENCES "academic_class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
