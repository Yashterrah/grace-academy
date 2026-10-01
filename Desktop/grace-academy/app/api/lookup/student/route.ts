import { NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/constants";

/**
 * GET /api/lookup/student?ref=GMMA-7F3K2
 *
 * Used by the Booking form to auto-fill a student's name/program/grade from
 * their registration reference. Runs through Firebase Admin (server-only,
 * bypasses security rules) rather than a client-side Firestore read, since
 * the `students` collection intentionally isn't publicly readable — it
 * holds contact details for minors. Only a few non-sensitive fields are
 * returned here, never phone/email/county/notes.
 */
export async function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get("ref")?.trim();
  if (!ref) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  if (!isFirebaseAdminConfigured || !adminDb) {
    // Non-fatal: the calling form treats "not found" as a soft failure and
    // still lets the person fill the booking in manually.
    return NextResponse.json({ found: false });
  }

  const snap = await adminDb
    .collection(FIRESTORE_COLLECTIONS.students)
    .where("reference", "==", ref)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({ found: false });
  }

  const data = snap.docs[0]!.data();
  return NextResponse.json({
    found: true,
    fullName: data.fullName,
    program: data.program ?? "school",
    grade: data.grade ?? null,
  });
}
