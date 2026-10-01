import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
import { FIRESTORE_COLLECTIONS, TERM } from "@/lib/constants";
import { SEED_BLOG_POSTS } from "@/lib/seed-data";
import { stripUndefined } from "@/lib/utils";
import type {
  BlogPost,
  Booking,
  BookingStatus,
  ContactMessage,
  GalleryItem,
  Payment,
  PaymentStatus,
  Resource,
  SiteSettings,
  Student,
  Testimonial,
} from "@/types";

export type { SiteSettings, BlogPost };

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

// ============================================================
// Students
// ============================================================

export async function createStudent(data: Student) {
  assertConfigured();
  const ref = collection(db!, FIRESTORE_COLLECTIONS.students);
  // stripUndefined drops empty optional fields (e.g. blank "notes") instead
  // of sending `undefined`, which Firestore's addDoc() rejects outright.
  return addDoc(
    ref,
    stripUndefined({
      ...data,
      createdAt: new Date().toISOString(),
      _server: serverTimestamp(),
    })
  );
}

export async function getStudentByReference(
  reference: string
): Promise<(Student & { id: string }) | null> {
  if (!isFirebaseConfigured || !db) return null;
  const ref = collection(db, FIRESTORE_COLLECTIONS.students);
  const q = query(ref, where("reference", "==", reference), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0]!;
  return { id: d.id, ...(d.data() as Omit<Student, "id">) };
}

/** Admin: list every student, newest first. */
export async function listStudents(): Promise<(Student & { id: string })[]> {
  if (!isFirebaseConfigured || !db) return [];
  const ref = collection(db, FIRESTORE_COLLECTIONS.students);
  const snap = await getDocs(query(ref, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Student, "id">) }));
}

// ============================================================
// Bookings
// ============================================================

export async function createBooking(data: Booking) {
  assertConfigured();
  const ref = collection(db!, FIRESTORE_COLLECTIONS.bookings);
  return addDoc(
    ref,
    stripUndefined({
      ...data,
      createdAt: new Date().toISOString(),
      _server: serverTimestamp(),
    })
  );
}

export async function getBookingByReference(
  reference: string
): Promise<(Booking & { id: string }) | null> {
  if (!isFirebaseConfigured || !db) return null;
  const ref = collection(db, FIRESTORE_COLLECTIONS.bookings);
  const q = query(ref, where("reference", "==", reference), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0]!;
  return { id: d.id, ...(d.data() as Omit<Booking, "id">) };
}

/** Admin: list every booking, newest first. */
export async function listBookings(): Promise<(Booking & { id: string })[]> {
  if (!isFirebaseConfigured || !db) return [];
  const ref = collection(db, FIRESTORE_COLLECTIONS.bookings);
  const snap = await getDocs(query(ref, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Booking, "id">) }));
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  assertConfigured();
  await updateDoc(doc(db!, FIRESTORE_COLLECTIONS.bookings, id), { status });
}

// ============================================================
// Payments
// ============================================================

export async function createPayment(data: Payment) {
  assertConfigured();
  const ref = collection(db!, FIRESTORE_COLLECTIONS.payments);
  return addDoc(
    ref,
    stripUndefined({
      ...data,
      createdAt: new Date().toISOString(),
      _server: serverTimestamp(),
    })
  );
}

export async function getPaymentByReference(
  reference: string
): Promise<(Payment & { id: string }) | null> {
  if (!isFirebaseConfigured || !db) return null;
  const ref = collection(db, FIRESTORE_COLLECTIONS.payments);
  const q = query(ref, where("reference", "==", reference), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0]!;
  return { id: d.id, ...(d.data() as Omit<Payment, "id">) };
}

/** Admin: list every payment, newest first. */
export async function listPayments(): Promise<(Payment & { id: string })[]> {
  if (!isFirebaseConfigured || !db) return [];
  const ref = collection(db, FIRESTORE_COLLECTIONS.payments);
  const snap = await getDocs(query(ref, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Payment, "id">) }));
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus,
  extra?: Partial<Payment>
) {
  assertConfigured();
  await updateDoc(doc(db!, FIRESTORE_COLLECTIONS.payments, id), stripUndefined({ status, ...extra }));
}

// ============================================================
// Contact messages
// ============================================================

export async function createContactMessage(data: ContactMessage) {
  assertConfigured();
  const ref = collection(db!, FIRESTORE_COLLECTIONS.contactMessages);
  return addDoc(
    ref,
    stripUndefined({
      ...data,
      status: "new",
      createdAt: new Date().toISOString(),
      _server: serverTimestamp(),
    })
  );
}

/** Admin: list every contact message, newest first. */
export async function listContactMessages(): Promise<(ContactMessage & { id: string })[]> {
  if (!isFirebaseConfigured || !db) return [];
  const ref = collection(db, FIRESTORE_COLLECTIONS.contactMessages);
  const snap = await getDocs(query(ref, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactMessage, "id">) }));
}

export async function updateContactMessageStatus(
  id: string,
  status: ContactMessage["status"]
) {
  assertConfigured();
  await updateDoc(doc(db!, FIRESTORE_COLLECTIONS.contactMessages, id), { status });
}

// ============================================================
// Testimonials
// ============================================================

export async function getApprovedTestimonials(max = 12): Promise<Testimonial[]> {
  if (!isFirebaseConfigured || !db) return [];
  const ref = collection(db, FIRESTORE_COLLECTIONS.testimonials);
  const q = query(ref, where("approved", "==", true), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, "id">) }));
}

/** Admin: list every testimonial (approved or not), newest first. */
export async function listAllTestimonials(): Promise<(Testimonial & { id: string })[]> {
  if (!isFirebaseConfigured || !db) return [];
  const ref = collection(db, FIRESTORE_COLLECTIONS.testimonials);
  const snap = await getDocs(query(ref, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, "id">) }));
}

export async function createTestimonial(data: Omit<Testimonial, "id" | "createdAt">) {
  assertConfigured();
  const ref = collection(db!, FIRESTORE_COLLECTIONS.testimonials);
  return addDoc(ref, stripUndefined({ ...data, createdAt: new Date().toISOString() }));
}

export async function setTestimonialApproved(id: string, approved: boolean) {
  assertConfigured();
  await updateDoc(doc(db!, FIRESTORE_COLLECTIONS.testimonials, id), { approved });
}

export async function deleteTestimonial(id: string) {
  assertConfigured();
  await deleteDoc(doc(db!, FIRESTORE_COLLECTIONS.testimonials, id));
}

// ============================================================
// Gallery
// ============================================================

export async function getGalleryItems(max = 24): Promise<GalleryItem[]> {
  if (!isFirebaseConfigured || !db) return [];
  const ref = collection(db, FIRESTORE_COLLECTIONS.gallery);
  const q = query(ref, orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, "id">) }));
}

export async function createGalleryItem(data: Omit<GalleryItem, "id" | "createdAt">) {
  assertConfigured();
  const ref = collection(db!, FIRESTORE_COLLECTIONS.gallery);
  return addDoc(ref, stripUndefined({ ...data, createdAt: new Date().toISOString() }));
}

export async function deleteGalleryItem(id: string) {
  assertConfigured();
  await deleteDoc(doc(db!, FIRESTORE_COLLECTIONS.gallery, id));
}

// ============================================================
// Resources
// ============================================================

export async function getResources(max = 50): Promise<Resource[]> {
  if (!isFirebaseConfigured || !db) return [];
  const ref = collection(db, FIRESTORE_COLLECTIONS.resources);
  const q = query(ref, orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Resource, "id">) }));
}

export async function createResource(data: Omit<Resource, "id" | "createdAt">) {
  assertConfigured();
  const ref = collection(db!, FIRESTORE_COLLECTIONS.resources);
  return addDoc(ref, stripUndefined({ ...data, createdAt: new Date().toISOString() }));
}

export async function deleteResource(id: string) {
  assertConfigured();
  await deleteDoc(doc(db!, FIRESTORE_COLLECTIONS.resources, id));
}

// ============================================================
// Generic single-doc read (used by the admin dashboard + STK push status)
// ============================================================

export async function getDocById<T>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> {
  if (!isFirebaseConfigured || !db) return null;
  const snap = await getDoc(doc(db, collectionName, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as T) };
}


// ============================================================
// Student progress notes (admin-only)
// ============================================================

export async function updateStudentNotes(id: string, progressNotes: string) {
  assertConfigured();
  await updateDoc(doc(db!, FIRESTORE_COLLECTIONS.students, id), { progressNotes });
}

// ============================================================
// Site settings (term start date, enrollment switch, announcement)
// Stored as a single document: settings/site
// ============================================================

const DEFAULT_SETTINGS: SiteSettings = {
  onlineClassesStart: TERM.onlineClassesStart,
  enrollmentOpen: true,
  announcement: "",
};

/**
 * Never throws: if Firebase isn't configured, the document doesn't exist, or
 * the read fails, the site falls back to sensible defaults so a settings
 * problem can never take a public page down.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isFirebaseConfigured || !db) return DEFAULT_SETTINGS;
  try {
    const snap = await getDoc(doc(db, FIRESTORE_COLLECTIONS.settings, "site"));
    if (!snap.exists()) return DEFAULT_SETTINGS;
    const data = snap.data() as Partial<SiteSettings>;
    return {
      onlineClassesStart: data.onlineClassesStart || DEFAULT_SETTINGS.onlineClassesStart,
      enrollmentOpen: data.enrollmentOpen ?? true,
      announcement: data.announcement ?? "",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSiteSettings(settings: SiteSettings) {
  assertConfigured();
  await setDoc(
    doc(db!, FIRESTORE_COLLECTIONS.settings, "site"),
    stripUndefined({ ...settings }),
    { merge: true }
  );
}

// ============================================================
// Blog
// Public reads only ever ask for published posts (matches the security
// rule). Sorting happens in JS so no composite index is required.
// ============================================================

function sortByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/** publishedOnly=true is the public view; false (admin) includes drafts. */
export async function listBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  if (!isFirebaseConfigured || !db) return publishedOnly ? SEED_BLOG_POSTS : [];
  try {
    const ref = collection(db, FIRESTORE_COLLECTIONS.blog);
    const q = publishedOnly ? query(ref, where("published", "==", true)) : query(ref);
    const snap = await getDocs(q);
    const posts = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BlogPost, "id">) }));
    if (posts.length === 0) return publishedOnly ? SEED_BLOG_POSTS : [];
    return sortByDateDesc(posts);
  } catch {
    return publishedOnly ? SEED_BLOG_POSTS : [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const fallback = SEED_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  if (!isFirebaseConfigured || !db) return fallback;
  try {
    const ref = collection(db, FIRESTORE_COLLECTIONS.blog);
    const q = query(ref, where("slug", "==", slug), where("published", "==", true), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return fallback;
    const d = snap.docs[0]!;
    return { id: d.id, ...(d.data() as Omit<BlogPost, "id">) };
  } catch {
    return fallback;
  }
}

export async function createBlogPost(
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
) {
  assertConfigured();
  const now = new Date().toISOString();
  return addDoc(
    collection(db!, FIRESTORE_COLLECTIONS.blog),
    stripUndefined({ ...data, createdAt: now, updatedAt: now })
  );
}
