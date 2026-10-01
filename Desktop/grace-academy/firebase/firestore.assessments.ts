/**
 * firebase/firestore.assessments.ts
 *
 * Paste these functions into your existing firebase/firestore.ts file.
 * Also add these imports at the top of firestore.ts if not already present:
 *   import { addDoc, collection, getDocs, query, where, orderBy,
 *            updateDoc, doc, serverTimestamp } from "firebase/firestore";
 *
 * Add to FIRESTORE_COLLECTIONS in lib/constants.ts:
 *   assessments: "assessments",
 *   holidayExams: "holidayExams",
 */

import type { LessonAssessment, HolidayExam } from "@/types/assessment.types";

// ── Lesson Assessments ─────────────────────────────────────────────────────

export async function createLessonAssessment(data: Omit<LessonAssessment, "id">) {
  const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
  const { db, isFirebaseConfigured } = await import("./config");
  if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
  return addDoc(
    collection(db, "assessments"),
    { ...data, createdAt: new Date().toISOString(), _server: serverTimestamp() }
  );
}

export async function getAssessmentsForStudent(
  studentId: string
): Promise<(LessonAssessment & { id: string })[]> {
  const { collection, getDocs, query, where, orderBy } = await import("firebase/firestore");
  const { db, isFirebaseConfigured } = await import("./config");
  if (!isFirebaseConfigured || !db) return [];
  const q = query(
    collection(db, "assessments"),
    where("studentId", "==", studentId),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<LessonAssessment, "id">),
  }));
}

export async function listAllAssessments(): Promise<(LessonAssessment & { id: string })[]> {
  const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
  const { db, isFirebaseConfigured } = await import("./config");
  if (!isFirebaseConfigured || !db) return [];
  const snap = await getDocs(
    query(collection(db, "assessments"), orderBy("date", "desc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<LessonAssessment, "id">),
  }));
}

export async function updateAssessment(
  id: string,
  updates: Partial<LessonAssessment>
) {
  const { updateDoc, doc } = await import("firebase/firestore");
  const { db, isFirebaseConfigured } = await import("./config");
  if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
  await updateDoc(doc(db, "assessments", id), {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function shareAssessmentWithParent(id: string) {
  return updateAssessment(id, { sharedWithParent: true });
}

// ── Holiday Exams ──────────────────────────────────────────────────────────

export async function createHolidayExam(data: Omit<HolidayExam, "id">) {
  const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
  const { db, isFirebaseConfigured } = await import("./config");
  if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
  return addDoc(
    collection(db, "holidayExams"),
    { ...data, createdAt: new Date().toISOString(), _server: serverTimestamp() }
  );
}

export async function getExamsForStudent(
  studentId: string
): Promise<(HolidayExam & { id: string })[]> {
  const { collection, getDocs, query, where, orderBy } = await import("firebase/firestore");
  const { db, isFirebaseConfigured } = await import("./config");
  if (!isFirebaseConfigured || !db) return [];
  const q = query(
    collection(db, "holidayExams"),
    where("studentId", "==", studentId),
    orderBy("examDate", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<HolidayExam, "id">),
  }));
}

export async function listAllHolidayExams(): Promise<(HolidayExam & { id: string })[]> {
  const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
  const { db, isFirebaseConfigured } = await import("./config");
  if (!isFirebaseConfigured || !db) return [];
  const snap = await getDocs(
    query(collection(db, "holidayExams"), orderBy("examDate", "desc"))
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<HolidayExam, "id">),
  }));
}

export async function updateHolidayExam(
  id: string,
  updates: Partial<HolidayExam>
) {
  const { updateDoc, doc } = await import("firebase/firestore");
  const { db, isFirebaseConfigured } = await import("./config");
  if (!isFirebaseConfigured || !db) throw new Error("Firebase not configured.");
  await updateDoc(doc(db, "holidayExams", id), updates);
}

export async function markExamCertificateIssued(id: string) {
  return updateHolidayExam(id, { certificateIssued: true });
}
