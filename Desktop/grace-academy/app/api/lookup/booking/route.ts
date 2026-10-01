import { NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/constants";

/**
 * GET /api/lookup/booking?ref=BOOK-9K2P1
 *
 * Used by the Payment page to auto-fill the student name and fee amount
 * from a booking reference, and to get the authoritative fee for display
 * before an STK Push is triggered. See app/api/lookup/student for why this
 * goes through Admin SDK rather than a client-side read.
 */
export async function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get("ref")?.trim();
  if (!ref) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  if (!isFirebaseAdminConfigured || !adminDb) {
    return NextResponse.json({ found: false });
  }

  const snap = await adminDb
    .collection(FIRESTORE_COLLECTIONS.bookings)
    .where("reference", "==", ref)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({ found: false });
  }

  const data = snap.docs[0]!.data();
  return NextResponse.json({
    found: true,
    studentName: data.studentName,
    program: data.program ?? "school",
    gradeLabel: data.gradeLabel,
    fee: data.fee,
  });
}
