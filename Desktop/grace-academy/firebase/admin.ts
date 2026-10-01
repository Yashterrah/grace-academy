import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * firebase/admin.ts
 *
 * Server-only Firebase Admin SDK — bypasses Firestore security rules
 * entirely, so it must NEVER be imported from a "use client" component or
 * anything that ships to the browser. It's used by:
 *   - app/api/mpesa/stkpush/route.ts (reads the true booking fee server-side,
 *     rather than trusting a client-supplied amount)
 *   - app/api/mpesa/callback/route.ts (Safaricom's webhook — writes payment
 *     confirmation with no authenticated user in the request)
 *
 * Requires three env vars (see .env.example):
 *   FIREBASE_ADMIN_PROJECT_ID
 *   FIREBASE_ADMIN_CLIENT_EMAIL
 *   FIREBASE_ADMIN_PRIVATE_KEY
 * Generate these from Firebase Console → Project settings → Service accounts
 * → Generate new private key.
 */

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
// Private keys are stored in env vars with literal "\n" sequences — restore real newlines.
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const isFirebaseAdminConfigured = Boolean(projectId && clientEmail && privateKey);

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

if (isFirebaseAdminConfigured) {
  const existing = getApps()[0];
  adminApp =
    existing ??
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  adminDb = getFirestore(adminApp);
}

export { adminApp, adminDb };
