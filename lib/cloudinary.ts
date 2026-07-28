/**
 * lib/cloudinary.ts
 *
 * Free alternative to Firebase Storage for image uploads (payment proof
 * screenshots, and later gallery/resource images if you want).
 *
 * Firebase Storage now requires the Blaze (pay-as-you-go) billing plan to
 * even enable it — Firestore itself stays free on Spark. To avoid needing a
 * card at all, file uploads go to Cloudinary's free tier instead
 * (25GB storage + 25GB bandwidth/month, no billing required), and only the
 * resulting URL is saved in Firestore.
 *
 * Setup (see README "Cloudinary setup" section):
 *   1. Create a free account at cloudinary.com
 *   2. Copy your "Cloud name" from the dashboard
 *   3. Settings → Upload → Add upload preset → set Signing Mode to
 *      "Unsigned" → copy the preset name
 *   4. Add both values to .env.local (see .env.example)
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * `folder` groups files in the Cloudinary media library, e.g.
 * `payment-proofs/BOOK-9K2P1`.
 */
export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      "Image uploads aren't connected yet. Add your Cloudinary credentials to .env.local (see .env.example) and restart the app."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET!);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.error?.message ?? "Upload failed. Please check your connection and try again."
    );
  }

  const data = await response.json();
  return { url: data.secure_url as string, publicId: data.public_id as string };
}
