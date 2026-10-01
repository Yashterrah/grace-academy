import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely, resolving conflicts (last one wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "2026-08-07" -> "7 August" (Nairobi time). Returns "" for an invalid date. */
export function formatStartLabel(iso: string): string {
  const d = new Date(`${iso}T09:00:00+03:00`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-KE", { day: "numeric", month: "long", timeZone: "Africa/Nairobi" });
}

/** Format a number as Kenyan Shillings, e.g. 2500 -> "KSh 2,500" */
export function formatKes(amount: number): string {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

/** Format an ISO date string into a readable label, e.g. "7 August 2026" */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Generate a short, human-friendly reference code, e.g. GMMA-7F3K2 */
export function generateReference(prefix = "GMMA"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${code}`;
}

/** Slugify a string for URLs / ids */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Basic file-size guard used before uploading to Firebase Storage */
export function isFileSizeValid(file: File, maxSizeMb = 5): boolean {
  return file.size <= maxSizeMb * 1024 * 1024;
}

export function isImageFile(file: File): boolean {
  return ["image/jpeg", "image/png", "image/webp", "image/heic"].includes(
    file.type
  );
}

/**
 * Firestore's addDoc() throws "Unsupported field value: undefined" if any
 * key on the object is explicitly `undefined` (e.g. an empty optional form
 * field like `notes: undefined`). Every write helper in firebase/firestore.ts
 * runs its payload through this first so optional/blank fields are dropped
 * entirely instead of being sent as `undefined`.
 */
export function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const result = {} as T;
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}
