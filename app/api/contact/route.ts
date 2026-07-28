import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { createContactMessage } from "@/firebase/firestore";

/**
 * POST /api/contact
 *
 * The contact form is the one flow routed through a server Route Handler
 * (rather than writing to Firestore directly from the client, as the
 * registration/booking/payment forms do) so that:
 *  - the payload is re-validated server-side with the same Zod schema
 *  - a honeypot field can catch basic bots before touching the database
 *  - it's the natural place to plug in rate limiting or email
 *    notifications later without changing the client component.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Simple honeypot: a hidden field real users never fill in.
  if (typeof body === "object" && body !== null && "company" in body) {
    const honeypot = (body as { company?: unknown }).company;
    if (typeof honeypot === "string" && honeypot.trim().length > 0) {
      // Pretend success so bots don't learn the field was detected.
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
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong." },
      { status: 500 }
    );
  }
}
