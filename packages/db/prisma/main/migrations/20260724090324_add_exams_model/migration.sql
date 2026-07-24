-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "totalMcq" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "hasSuffle" BOOLEAN NOT NULL DEFAULT false,
    "hasRandom" BOOLEAN NOT NULL DEFAULT false,
    "hasNegativeMark" BOOLEAN NOT NULL DEFAULT false,
    "negativeMark" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAttempt" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "answers" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "wrongAnswers" INTEGER NOT NULL DEFAULT 0,
    "skippedQuestions" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "duration" INTEGER DEFAULT 0,
    "lastActivityAt" TIMESTAMP(3),
    "totalQuestions" INTEGER NOT NULL,
    "answeredCount" INTEGER NOT NULL DEFAULT 0,
    "flaggedQuestions" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "submissionType" TEXT,
    "enableAiFeature" BOOLEAN NOT NULL DEFAULT false,
    "hasNegativeMark" BOOLEAN NOT NULL DEFAULT false,
    "negativeMark" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hasShuffle" BOOLEAN NOT NULL DEFAULT false,
    "hasRandom" BOOLEAN NOT NULL DEFAULT false,
    "tabSwitches" INTEGER NOT NULL DEFAULT 0,
    "tabSwitchTimes" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[],
    "warnings" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "feedbackStatus" TEXT NOT NULL DEFAULT 'Pending',
    "reviewNotes" TEXT,
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerHistory" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "mcqId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "selectedOption" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeSpent" INTEGER,
    "previousAnswer" TEXT,
    "isChanged" BOOLEAN NOT NULL DEFAULT false,
    "changeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnswerHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_subject" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Exam_title_idx" ON "Exam"("title");

-- CreateIndex
CREATE INDEX "Exam_status_idx" ON "Exam"("status");

-- CreateIndex
CREATE INDEX "Exam_createdAt_idx" ON "Exam"("createdAt");

-- CreateIndex
CREATE INDEX "Exam_status_createdAt_idx" ON "Exam"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ExamAttempt_studentId_idx" ON "ExamAttempt"("studentId");

-- CreateIndex
CREATE INDEX "ExamAttempt_examId_idx" ON "ExamAttempt"("examId");

-- CreateIndex
CREATE INDEX "ExamAttempt_status_idx" ON "ExamAttempt"("status");

-- CreateIndex
CREATE INDEX "ExamAttempt_score_idx" ON "ExamAttempt"("score");

-- CreateIndex
CREATE INDEX "ExamAttempt_createdAt_idx" ON "ExamAttempt"("createdAt");

-- CreateIndex
CREATE INDEX "ExamAttempt_studentId_examId_idx" ON "ExamAttempt"("studentId", "examId");

-- CreateIndex
CREATE INDEX "ExamAttempt_studentId_status_idx" ON "ExamAttempt"("studentId", "status");

-- CreateIndex
CREATE INDEX "ExamAttempt_studentId_createdAt_idx" ON "ExamAttempt"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "ExamAttempt_examId_status_idx" ON "ExamAttempt"("examId", "status");

-- CreateIndex
CREATE INDEX "ExamAttempt_status_createdAt_idx" ON "ExamAttempt"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ExamAttempt_studentId_score_idx" ON "ExamAttempt"("studentId", "score");

-- CreateIndex
CREATE INDEX "ExamAttempt_lastActivityAt_idx" ON "ExamAttempt"("lastActivityAt");

-- CreateIndex
CREATE INDEX "ExamAttempt_submissionType_idx" ON "ExamAttempt"("submissionType");

-- CreateIndex
CREATE INDEX "ExamAttempt_bestStreak_idx" ON "ExamAttempt"("bestStreak");

-- CreateIndex
CREATE INDEX "AnswerHistory_attemptId_idx" ON "AnswerHistory"("attemptId");

-- CreateIndex
CREATE INDEX "AnswerHistory_mcqId_idx" ON "AnswerHistory"("mcqId");

-- CreateIndex
CREATE INDEX "AnswerHistory_attemptId_questionNumber_idx" ON "AnswerHistory"("attemptId", "questionNumber");

-- CreateIndex
CREATE INDEX "AnswerHistory_answeredAt_idx" ON "AnswerHistory"("answeredAt");

-- CreateIndex
CREATE INDEX "AnswerHistory_isCorrect_idx" ON "AnswerHistory"("isCorrect");

-- CreateIndex
CREATE INDEX "exam_subject_examId_idx" ON "exam_subject"("examId");

-- CreateIndex
CREATE INDEX "exam_subject_subjectId_idx" ON "exam_subject"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_subject_examId_subjectId_key" ON "exam_subject"("examId", "subjectId");

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerHistory" ADD CONSTRAINT "AnswerHistory_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ExamAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerHistory" ADD CONSTRAINT "AnswerHistory_mcqId_fkey" FOREIGN KEY ("mcqId") REFERENCES "Mcq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_subject" ADD CONSTRAINT "exam_subject_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_subject" ADD CONSTRAINT "exam_subject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
