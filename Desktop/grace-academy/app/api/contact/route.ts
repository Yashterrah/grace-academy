import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { createContactMessage } from "@/firebase/firestore";
import { sendContactMessageEmail } from "@/lib/email";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot check
  if (typeof body === "object" && body !== null && "company" in body) {
    const honeypot = (body as { company?: unknown }).company;
    if (typeof honeypot === "string" && honeypot.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form for errors.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    await createContactMessage({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      subject: parsed.data.subject,
      message: parsed.data.message,
      status: "new",
      createdAt: new Date().toISOString(),
    });

    // Fire email notification (non-blocking — never fails the user request)
    sendContactMessageEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      subject: parsed.data.subject,
      message: parsed.data.message,
    }).catch((err) => console.error("Contact email failed:", err));

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong." },
      { status: 500 }
    );
  }
}
