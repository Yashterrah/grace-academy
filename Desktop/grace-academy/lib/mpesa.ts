/**
 * lib/mpesa.ts
 *
 * Safaricom Daraja API integration for M-Pesa STK Push ("Lipa na M-Pesa").
 * Triggers a payment prompt directly on the parent's phone instead of
 * requiring a manual screenshot upload.
 *
 * SERVER-ONLY — imports here use MPESA_* env vars with no NEXT_PUBLIC_
 * prefix, so this file must only ever be imported from Route Handlers
 * (app/api/mpesa/*), never from a "use client" component.
 *
 * Setup:
 *   1. Register at https://developer.safaricom.co.ke
 *   2. Create an app → copy the Consumer Key and Consumer Secret
 *   3. For the Till Number (Buy Goods) associated with your account, get
 *      the Shortcode + Passkey from Safaricom (sandbox values are public,
 *      see Daraja docs; production values come from your Till application)
 *   4. Add all values to .env.local / Vercel env vars (see .env.example)
 *   5. Test in sandbox first (MPESA_ENV=sandbox) before going live
 *      (MPESA_ENV=production), which requires Safaricom Go-Live approval.
 */

const MPESA_ENV = process.env.MPESA_ENV === "production" ? "production" : "sandbox";
const BASE_URL =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const SHORTCODE = process.env.MPESA_SHORTCODE; // Till Number
const PASSKEY = process.env.MPESA_PASSKEY;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL; // e.g. https://yoursite.vercel.app/api/mpesa/callback

/**
 * Safaricom's shared sandbox test shortcode (174379) is a Paybill and only
 * accepts "CustomerPayBillOnline" — even though your real Till Number in
 * production needs "CustomerBuyGoodsOnline". This defaults correctly for
 * each environment, but can be overridden via MPESA_TRANSACTION_TYPE if
 * Safaricom ever issues you a sandbox Till instead of the shared Paybill.
 */
const TRANSACTION_TYPE =
  process.env.MPESA_TRANSACTION_TYPE ||
  (MPESA_ENV === "production" ? "CustomerBuyGoodsOnline" : "CustomerPayBillOnline");

export const isMpesaConfigured = Boolean(
  CONSUMER_KEY && CONSUMER_SECRET && SHORTCODE && PASSKEY && CALLBACK_URL
);

function assertConfigured() {
  if (!isMpesaConfigured) {
    throw new Error(
      "M-Pesa STK Push isn't configured yet. Add MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_PASSKEY and MPESA_CALLBACK_URL to your environment variables."
    );
  }
}

/** Format "YYYYMMDDHHmmss" as required by Daraja for the password + timestamp. */
function daraTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

/** Normalize any Kenyan phone format to Daraja's required 2547XXXXXXXX / 2541XXXXXXXX. */
export function normalizeMpesaPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") || digits.startsWith("1")) return `254${digits}`;
  return digits;
}

async function getAccessToken(): Promise<string> {
  assertConfigured();
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Could not authenticate with M-Pesa. Please try again shortly.");
  }
  const data = await res.json();
  return data.access_token as string;
}

interface StkPushParams {
  phone: string;
  amount: number;
  accountReference: string; // shown on the STK prompt, e.g. booking reference
  transactionDesc: string;
}

interface StkPushResult {
  merchantRequestId: string;
  checkoutRequestId: string;
  responseDescription: string;
}

/**
 * Initiates an STK Push ("Lipa na M-Pesa") prompt on the customer's phone.
 * TransactionType is environment-aware — see TRANSACTION_TYPE above.
 */
export async function initiateStkPush({
  phone,
  amount,
  accountReference,
  transactionDesc,
}: StkPushParams): Promise<StkPushResult> {
  assertConfigured();
  const token = await getAccessToken();
  const timestamp = daraTimestamp();
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");
  const normalizedPhone = normalizeMpesaPhone(phone);

  const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: TRANSACTION_TYPE,
      Amount: Math.round(amount),
      PartyA: normalizedPhone,
      PartyB: SHORTCODE,
      PhoneNumber: normalizedPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: accountReference.slice(0, 12),
      TransactionDesc: transactionDesc.slice(0, 13),
    }),
  });

  const data = await res.json();

  if (!res.ok || data.ResponseCode !== "0") {
    throw new Error(
      data.errorMessage || data.ResponseDescription || "Could not start the M-Pesa payment prompt."
    );
  }

  return {
    merchantRequestId: data.MerchantRequestID,
    checkoutRequestId: data.CheckoutRequestID,
    responseDescription: data.ResponseDescription,
  };
}
