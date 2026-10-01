import { NextResponse } from "next/server";
import { z } from "zod";
import { sendPaymentReceivedEmail } from "@/lib/email";

const schema = z.object({
  studentName: z.string(),
  bookingReference: z.string(),
  amount: z.number(),
  method: z.string(),
  paymentReference: z.string(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  try {
    await sendPaymentReceivedEmail(parsed.data);
  } catch (err) {
    console.error("Payment email failed:", err);
  }

  return NextResponse.json({ ok: true });
}
