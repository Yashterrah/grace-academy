/**
 * TYPES TO ADD to types/index.ts
 *
 * Paste these interfaces into your existing types/index.ts file,
 * after the existing Payment interface.
 */

// ── Lesson Assessment ──────────────────────────────────────────────────────
// Grace records a score (1-10) + notes after each lesson.
// She can later mark it as "shared", making it visible to the parent/student
// via a future parent-facing page (not yet built — groundwork is here).

export interface LessonAssessment {
  id?: string;
  studentId: string;
  studentName: string;
  studentReference: string;
  grade: string;
  lessonNumber: number;          // 1, 2, 3 … within the current holiday
  holiday: string;               // e.g. "Holiday 1, 2026" / "Term 1, 2027"
  date: string;                  // ISO date of the lesson
  score: number;                 // 1–10
  topic: string;                 // what was covered, e.g. "Set piece bars 1-16"
  strengths: string;             // what the student did well
  areasToImprove: string;        // what to work on next
  sharedWithParent: boolean;     // Grace can flip this when ready
  createdAt: string;
  updatedAt: string;
}

// ── Holiday / Term Exam ────────────────────────────────────────────────────
// End-of-holiday exam record. Grace records the result; certificate is
// auto-generated when status is "passed".

export type ExamResult = "pending" | "passed" | "failed";

export interface HolidayExam {
  id?: string;
  studentId: string;
  studentName: string;
  studentReference: string;
  grade: string;
  holiday: string;               // e.g. "Holiday 1, 2026"
  examDate: string;              // ISO date
  totalScore: number;            // e.g. 78 (out of 100)
  passMark: number;              // e.g. 50
  result: ExamResult;
  notes: string;                 // Grace's notes on the exam
  certificateIssued: boolean;
  sharedWithParent: boolean;
  createdAt: string;
}
