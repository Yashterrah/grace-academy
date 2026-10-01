/**
 * lib/email.ts
 *
 * Email notifications via Resend (https://resend.com).
 * Free tier: 100 emails/day, no credit card required.
 *
 * Setup:
 *   1. Sign up at resend.com
 *   2. Go to API Keys → Create API Key → copy it
 *   3. Add to .env.local: RESEND_API_KEY=re_xxxxxxxxxxxx
 *   4. Also add: NOTIFICATION_EMAIL=cbc.grace76@gmail.com
 *   5. Add both to Vercel environment variables
 *
 * Note: Resend requires a verified domain to send FROM. On the free plan
 * you can use onboarding@resend.dev as the sender while testing, and
 * switch to gracemuigaimusicacademy.com once the domain is verified.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL =
  process.env.NOTIFICATION_FROM_EMAIL ?? "Grace Muigai Music Academy <onboarding@resend.dev>";
const TO_EMAIL =
  process.env.NOTIFICATION_EMAIL ?? "cbc.grace76@gmail.com";

/** Escape user-supplied text before placing it inside an HTML email. */
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const isEmailConfigured = Boolean(RESEND_API_KEY);

interface SendEmailParams {
  subject: string;
  html: string;
  to?: string;
}

async function sendEmail({ subject, html, to = TO_EMAIL }: SendEmailParams) {
  if (!isEmailConfigured) {
    console.warn("Email notifications not configured — set RESEND_API_KEY in your env vars.");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    console.error("Failed to send email:", err);
  }
}

// ─── Email templates ──────────────────────────────────────────────────────

export async function sendNewRegistrationEmail(data: {
  studentName: string;
  program: string;
  grade?: string;
  parentName: string;
  parentPhone: string;
  county: string;
  reference: string;
}) {
  await sendEmail({
    subject: `📝 New Registration — ${data.studentName} (${data.program === "adult" ? "Adult Classes" : data.grade ?? "School"})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #0B4F4A; padding: 20px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #FAF7F1; font-size: 20px; margin: 0;">New Student Registration</h1>
          <p style="color: rgba(250,247,241,0.7); font-size: 14px; margin: 4px 0 0;">Grace Muigai Music Academy</p>
        </div>
        <div style="background: white; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; width: 140px;">Student</td>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a;">${esc(data.studentName)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Program</td>
              <td style="padding: 10px 0; color: #0f172a;">${data.program === "adult" ? "Adult Music Classes" : `School — ${data.grade ?? ""}`}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Parent / Guardian</td>
              <td style="padding: 10px 0; color: #0f172a;">${esc(data.parentName)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Phone</td>
              <td style="padding: 10px 0; color: #0f172a;">${esc(data.parentPhone)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">County</td>
              <td style="padding: 10px 0; color: #0f172a;">${esc(data.county)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b;">Reference</td>
              <td style="padding: 10px 0; font-family: monospace; font-weight: 700; color: #0B4F4A;">${esc(data.reference)}</td>
            </tr>
          </table>
          <a href="https://tutor-grace.vercel.app/admin/students"
            style="display: inline-block; margin-top: 20px; background: #0B4F4A; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
            View in Admin Portal →
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 16px;">
          Grace Muigai Music Academy · Automated notification
        </p>
      </div>
    `,
  });
}

export async function sendPaymentReceivedEmail(data: {
  studentName: string;
  bookingReference: string;
  amount: number;
  method: string;
  paymentReference: string;
}) {
  await sendEmail({
    subject:
      data.method === "stk_push"
        ? `✅ Payment Confirmed — ${data.studentName} (KSh ${data.amount.toLocaleString("en-KE")})`
        : `💰 Payment Received — ${data.studentName} (KSh ${data.amount.toLocaleString("en-KE")})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #0B4F4A; padding: 20px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #FAF7F1; font-size: 20px; margin: 0;">${data.method === "stk_push" ? "Payment Confirmed via M-Pesa" : "Payment Received — Action Required"}</h1>
          <p style="color: rgba(250,247,241,0.7); font-size: 14px; margin: 4px 0 0;">${data.method === "stk_push" ? "Confirmed automatically by M-Pesa. No action needed." : "Please review and confirm or reject this payment"}</p>
        </div>
        <div style="background: white; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; width: 160px;">Student</td>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a;">${esc(data.studentName)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Amount</td>
              <td style="padding: 10px 0; font-size: 18px; font-weight: 700; color: #0B4F4A;">KSh ${data.amount.toLocaleString("en-KE")}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Method</td>
              <td style="padding: 10px 0; color: #0f172a;">${data.method === "stk_push" ? "M-Pesa STK Push" : "Manual Screenshot Upload"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Booking Ref</td>
              <td style="padding: 10px 0; font-family: monospace; color: #0f172a;">${esc(data.bookingReference)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b;">Payment Ref</td>
              <td style="padding: 10px 0; font-family: monospace; font-weight: 700; color: #0B4F4A;">${esc(data.paymentReference)}</td>
            </tr>
          </table>
          <a href="https://tutor-grace.vercel.app/admin/payments"
            style="display: inline-block; margin-top: 20px; background: #0B4F4A; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
            Review Payment →
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 16px;">
          Grace Muigai Music Academy · Automated notification
        </p>
      </div>
    `,
  });
}

export async function sendContactMessageEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  await sendEmail({
    subject: `📬 New Contact Message — ${data.subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #0B4F4A; padding: 20px 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #FAF7F1; font-size: 20px; margin: 0;">New Contact Message</h1>
        </div>
        <div style="background: white; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
          <p style="color: #64748b; font-size: 13px; margin: 0 0 4px;">From</p>
          <p style="font-weight: 600; color: #0f172a; margin: 0 0 16px;">${esc(data.name)} · ${esc(data.email)}${data.phone ? ` · ${esc(data.phone)}` : ""}</p>
          <p style="color: #64748b; font-size: 13px; margin: 0 0 4px;">Subject</p>
          <p style="font-weight: 600; color: #0f172a; margin: 0 0 16px;">${esc(data.subject)}</p>
          <p style="color: #64748b; font-size: 13px; margin: 0 0 4px;">Message</p>
          <p style="color: #0f172a; margin: 0; line-height: 1.6; background: #f8fafc; padding: 12px; border-radius: 8px;">${esc(data.message)}</p>
          <a href="https://tutor-grace.vercel.app/admin/messages"
            style="display: inline-block; margin-top: 20px; background: #0B4F4A; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
            View in Admin Portal →
          </a>
        </div>
      </div>
    `,
  });
}
