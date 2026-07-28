import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
import { FIRESTORE_COLLECTIONS } from "@/lib/constants";
import type {
  Booking,
  ContactMessage,
  GalleryItem,
  Payment,
  Resource,
  Student,
  Testimonial,
} from "@/types";

/**
 * All write helpers throw a friendly error when Firebase isn't configured
 * yet (e.g. during local dev before .env.local is filled in), so forms can
 * surface a clear message instead of a cryptic SDK error.
 */
function assertConfigured() {
  if (!isFirebaseConfigured || !db) {
    throw new Error(
      "The academy's database isn't connected yet. Please add your Firebase credentials to .env.local (see .env.example) and restart the app."
    );
  }
}

// ---------- Students ----------
export async function createStudent(data: Student) {
  assertConfigured();
  const ref = collection(db!, FIRESTORE_COLLECTIONS.students);
  return addDoc(ref, { ...data, createdAt: new Date().toISOString(), _server: serverTimestamp() });
}

// ---------- Bookings ----------
export async function createBooking(data: Booking) {
  assertConfigured();
  const ref = collection(db!, FIRESTORE_COLLECTIONS.bookings);
  return addDoc(ref, { ...data, createdAt: new Date().toISOString(), _server: serverTimestamp() });
}

// ---------- Payments ----------
export async function createPayment(data: Payment) {
  assertConfigured();
  const ref = collection(db!, FIRESTORE_COLLECTIONS.payments);
  return addDoc(ref, { ...data, createdAt: new Date().toISOString(), _server: serverTimestamp() });
}

// ---------- Contact messages ----------
export async function createContactMessage(data: ContactMessage) {
  assertConfigured();
  const ref = collection(db!, FIRESTORE_COLLECTIONS.contactMessages);
  return addDoc(ref, {
    ...data,
    status: "new",
    createdAt: new Date().toISOString(),
    _server: serverTimestamp(),
  });
}

// ---------- Testimonials (read: approved only) ----------
export async function getApprovedTestimonials(max = 12): Promise<Testimonial[]> {
  if (!isFirebaseConfigured || !db) return [];
  const ref = collection(db, FIRESTORE_COLLECTIONS.testimonials);
  const q = query(ref, where("approved", "==", true), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, "id">) }));
}

// ---------- Gallery ----------
export async function getGalleryItems(max = 24): Promise<GalleryItem[]> {
  if (!isFirebaseConfigured || !db) return [];
  const ref = collection(db, FIRESTORE_COLLECTIONS.gallery);
  const q = query(ref, orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, "id">) }));
}

// ---------- Resources ----------
export async function getResources(max = 50): Promise<Resource[]> {
  if (!isFirebaseConfigured || !db) return [];
  const ref = collection(db, FIRESTORE_COLLECTIONS.resources);
  const q = query(ref, orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Resource, "id">) }));
}
