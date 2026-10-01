import { NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/constants";

/**
 * GET /api/mpesa/status?paymentId=xyz
 *
 * The payment page polls this every couple of seconds after triggering an
 * STK Push, watching for the callback route to flip the status from
 * "pending" to "confirmed"/"rejected". Goes through Admin SDK (like the
 * lookup routes) since payments aren't publicly readable via the client SDK.
 */
export async function GET(request: Request) {
  const paymentId = new URL(request.url).searchParams.get("paymentId");
  if (!paymentId) {
    return NextResponse.json({ error: "Missing paymentId." }, { status: 400 });
  }
  if (!isFirebaseAdminConfigured || !adminDb) {
    return NextResponse.json({ status: "pending" });
  }

  const snap = await adminDb.collection(FIRESTORE_COLLECTIONS.payments).doc(paymentId).get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  }

  const data = snap.data()!;
  return NextResponse.json({
    status: data.status,
    mpesaReceiptNumber: data.mpesaReceiptNumber ?? null,
    mpesaMessage: data.mpesaMessage ?? null,
  });
}
