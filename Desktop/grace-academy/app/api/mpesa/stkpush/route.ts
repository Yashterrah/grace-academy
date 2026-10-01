import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, isFirebaseAdminConfigured } from "@/firebase/admin";
import { initiateStkPush, isMpesaConfigured } from "@/lib/mpesa";
import { FIRESTORE_COLLECTIONS, SITE } from "@/lib/constants";
import { generateReference } from "@/lib/utils";

const bodySchema = z.object({
  bookingReference: z.string().trim().min(3),
  phone: z.string().trim().min(9),
});

export async function POST(request: Request) {
  if (!isMpesaConfigured) {
    return NextResponse.json(
      { error: "M-Pesa STK Push isn't set up yet. Please use the manual payment upload instead." },
      { status: 503 }
    );
  }
  if (!isFirebaseAdminConfigured || !adminDb) {
    return NextResponse.json(
      { error: "The server database connection isn't configured yet." },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 422 });
  }
  const { bookingReference, phone } = parsed.data;

  const bookingSnap = await adminDb
    .collection(FIRESTORE_COLLECTIONS.bookings)
    .where("reference", "==", bookingReference)
    .limit(1)
    .get();

  if (bookingSnap.empty) {
    return NextResponse.json(
      { error: "We couldn't find that booking reference. Please check it and try again." },
      { status: 404 }
    );
  }

  const booking = bookingSnap.docs[0]!.data();
  const paymentReference = generateReference("PAY");

  try {
    const stk = await initiateStkPush({
      phone,
      amount: booking.fee,
      accountReference: bookingReference,
      transactionDesc: `${SITE.shortName} Fees`,
    });

    const paymentDoc = await adminDb.collection(FIRESTORE_COLLECTIONS.payments).add({
      bookingReference,
      studentName: booking.studentName,
      amount: booking.fee,
      method: "stk_push",
      phone,
      checkoutRequestId: stk.checkoutRequestId,
      status: "pending",
      reference: paymentReference,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      paymentId: paymentDoc.id,
      paymentReference,
      checkoutRequestId: stk.checkoutRequestId,
      message: "Check your phone and enter your M-Pesa PIN to complete the payment.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not start the payment prompt." },
      { status: 500 }
    );
  }
}
