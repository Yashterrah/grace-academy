/**
 * NOTE: Not currently used by the app — PaymentUploadForm uses
 * lib/cloudinary.ts instead, since Firebase Storage requires the paid
 * Blaze plan. This file is kept in case you upgrade to Blaze later and
 * want to switch payment-proof uploads back to Firebase Storage.
 */
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, isFirebaseConfigured } from "./config";
import { slugify } from "@/lib/utils";

function assertConfigured() {
  if (!isFirebaseConfigured || !storage) {
    throw new Error(
      "File storage isn't connected yet. Please add your Firebase credentials to .env.local (see .env.example) and restart the app."
    );
  }
}

/**
 * Upload a payment confirmation screenshot to Firebase Storage under
 * /payment-proofs/{bookingReference}/{timestamp}-{filename}
 * Returns the public download URL to store on the Payment document.
 */
export async function uploadPaymentProof(
  file: File,
  bookingReference: string
): Promise<{ url: string; path: string }> {
  assertConfigured();
  const safeName = slugify(file.name.replace(/\.[^/.]+$/, ""));
  const ext = file.name.split(".").pop();
  const path = `payment-proofs/${bookingReference}/${Date.now()}-${safeName}.${ext}`;
  const fileRef = ref(storage!, path);
  const snapshot = await uploadBytes(fileRef, file, { contentType: file.type });
  const url = await getDownloadURL(snapshot.ref);
  return { url, path };
}

/**
 * Generic image uploader reused for future admin-side gallery uploads.
 */
export async function uploadImage(
  file: File,
  folder: "gallery" | "resources"
): Promise<{ url: string; path: string }> {
  assertConfigured();
  const safeName = slugify(file.name.replace(/\.[^/.]+$/, ""));
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${safeName}.${ext}`;
  const fileRef = ref(storage!, path);
  const snapshot = await uploadBytes(fileRef, file, { contentType: file.type });
  const url = await getDownloadURL(snapshot.ref);
  return { url, path };
}
