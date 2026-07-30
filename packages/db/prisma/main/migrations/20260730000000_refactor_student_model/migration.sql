-- =============================================================================
-- Refactor Student model: drop legacy fields, add phone / institute / isOfflineStudent
-- =============================================================================

-- Step 1: Add new columns with temporary defaults so existing rows satisfy NOT NULL
ALTER TABLE "Student"
  ADD COLUMN "phone"            TEXT    NOT NULL DEFAULT '',
  ADD COLUMN "institute"        TEXT    NOT NULL DEFAULT '',
  ADD COLUMN "isOfflineStudent" BOOLEAN NOT NULL DEFAULT false;

-- Step 2: Populate phone from mPhone (best available source)
UPDATE "Student"
SET "phone" = "mPhone"
WHERE "mPhone" IS NOT NULL AND "mPhone" <> '';

-- Step 3: Mark all existing students as offline (per user instruction)
UPDATE "Student" SET "isOfflineStudent" = true;

-- Step 4: Drop old columns
ALTER TABLE "Student"
  DROP COLUMN IF EXISTS "session",
  DROP COLUMN IF EXISTS "studentId",
  DROP COLUMN IF EXISTS "nameBn",
  DROP COLUMN IF EXISTS "fName",
  DROP COLUMN IF EXISTS "mName",
  DROP COLUMN IF EXISTS "gender",
  DROP COLUMN IF EXISTS "dob",
  DROP COLUMN IF EXISTS "nationality",
  DROP COLUMN IF EXISTS "religion",
  DROP COLUMN IF EXISTS "imageUrl",
  DROP COLUMN IF EXISTS "section",
  DROP COLUMN IF EXISTS "shift",
  DROP COLUMN IF EXISTS "group",
  DROP COLUMN IF EXISTS "fPhone",
  DROP COLUMN IF EXISTS "mPhone",
  DROP COLUMN IF EXISTS "presentAddress",
  DROP COLUMN IF EXISTS "permanentAddress";

-- Step 5: Drop the studentId index (column no longer exists)
DROP INDEX IF EXISTS "Student_studentId_idx";

-- Step 6: Strip the temporary column defaults so the app must supply values going forward
ALTER TABLE "Student"
  ALTER COLUMN "phone"     DROP DEFAULT,
  ALTER COLUMN "institute" DROP DEFAULT;
