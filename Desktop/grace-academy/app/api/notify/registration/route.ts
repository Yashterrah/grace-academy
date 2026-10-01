import { NextResponse } from "next/server";
import { z } from "zod";
import { sendNewRegistrationEmail } from "@/lib/email";

const schema = z.object({
  studentName: z.string(),
  program: z.string(),
  grade: z.string().optional(),
  parentName: z.string(),
  parentPhone: z.string(),
  county: z.string(),
  reference: z.string(),
});

/**
 * POST /api/notify/registration
 * Fired by RegistrationForm after a successful Firestore write.
 * Sends Grace an email with the new student's details.
 * Never blocks the user-facing success state — errors here are logged
 * server-side only, so a broken email config doesn't break registration.
 */
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
    await sendNewRegistrationEmail(parsed.data);
  } catch (err) {
    // Log but don't fail — a broken email config should never affect students
    console.error("Registration email failed:", err);
  }

  return NextResponse.json({ ok: true });
}
