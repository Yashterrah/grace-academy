import { NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/firebase/admin";
import { FIRESTORE_COLLECTIONS } from "@/lib/constants";
import { sendPaymentReceivedEmail } from "@/lib/email";

interface CallbackItem {
  Name: string;
  Value?: string | number;
}

/**
 * POST /api/mpesa/callback
 *
 * Safaricom calls this URL directly (no user session, no auth header) once
 * the customer approves or cancels the STK Push prompt. Set this exact URL
 * as MPESA_CALLBACK_URL in your env vars, e.g.:
 *   https://yoursite.vercel.app/api/mpesa/callback
 *
 * It must always respond 200 with { ResultCode: 0 }, or Safaricom will
 * retry the callback repeatedly.
 */
export async function POST(request: Request) {
  const ack = NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });

  if (!isFirebaseAdminConfigured || !adminDb) {
    console.error("M-Pesa callback received but Firebase Admin isn't configured.");
    return ack;
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return ack;
  }

  const callback = body?.Body?.stkCallback;
  if (!callback) return ack;

  const checkoutRequestId = callback.CheckoutRequestID as string | undefined;
  if (!checkoutRequestId) return ack;

  const paymentsRef = adminDb.collection(FIRESTORE_COLLECTIONS.payments);
  const snap = await paymentsRef.where("checkoutRequestId", "==", checkoutRequestId).limit(1).get();
  if (snap.empty) {
    console.error("M-Pesa callback: no payment found for", checkoutRequestId);
    return ack;
  }
  const paymentDoc = snap.docs[0]!;
  const payment = paymentDoc.data();

  const resultCode = callback.ResultCode as number;

  if (resultCode === 0) {
    const items: CallbackItem[] = callback.CallbackMetadata?.Item ?? [];
    const get = (name: string) => items.find((i) => i.Name === name)?.Value;

    await paymentDoc.ref.update({
      status: "confirmed",
      mpesaReceiptNumber: get("MpesaReceiptNumber") ?? null,
      amount: get("Amount") ?? payment.amount,
      confirmedAt: new Date().toISOString(),
    });

    // Also mark the linked booking confirmed so the admin portal reflects
    // payment status without a manual cross-check.
    const bookingSnap = await adminDb
      .collection(FIRESTORE_COLLECTIONS.bookings)
      .where("reference", "==", payment.bookingReference)
      .limit(1)
      .get();
    if (!bookingSnap.empty) {
      await bookingSnap.docs[0]!.ref.update({ status: "confirmed" });
    }

    // Let Grace know. Never allow an email problem to fail the webhook reply,
    // or Safaricom will keep retrying the callback.
    try {
      await sendPaymentReceivedEmail({
        studentName: String(payment.studentName ?? "Student"),
        bookingReference: String(payment.bookingReference ?? ""),
        amount: Number(get("Amount") ?? payment.amount ?? 0),
        method: "stk_push",
        paymentReference: String(payment.reference ?? ""),
      });
    } catch (err) {
      console.error("Payment confirmation email failed:", err);
    }
  } else {
    // ResultCode 1032 = user cancelled, 1037 = timeout, etc.
    await paymentDoc.ref.update({
      status: "rejected",
      mpesaMessage: callback.ResultDesc ?? "Payment was not completed.",
    });
  }

  return ack;
}
